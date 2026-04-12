import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

type ArticulationRow = Database["public"]["Tables"]["articulation_agreements"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];
type PrerequisiteRow = Database["public"]["Tables"]["prerequisites"]["Row"];

/**
 * Fetches articulation data for the user's path (CC + target school + major).
 * Returns formatted text that can be included in the system prompt.
 */
async function getArticulationContext(): Promise<string> {
  try {
    const supabase = await createClient();

    // Fetch all articulation agreements without nested joins to avoid FK hint issues
    const { data: agreements, error } = await supabase
      .from("articulation_agreements")
      .select("id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, notes")
      .limit(200)
      .returns<ArticulationRow[]>();

    if (error || !agreements) {
      console.error("Error fetching articulation data:", error);
      return "Articulation data is currently unavailable.";
    }

    // Collect unique IDs to fetch related data
    const ccCourseIds = [...new Set(agreements.map(a => a.cc_course_id).filter(Boolean))];
    const uniCourseIds = [...new Set(agreements.map(a => a.university_course_id).filter(Boolean))];
    const ccInstIds = [...new Set(agreements.map(a => a.cc_institution_id).filter(Boolean))];
    const uniInstIds = [...new Set(agreements.map(a => a.university_institution_id).filter(Boolean))];

    // Fetch courses and institutions in parallel
    const ccCoursesResult = ccCourseIds.length > 0
      ? await supabase.from("courses").select("id, code, title, units").in("id", ccCourseIds).returns<CourseRow[]>()
      : { data: [] as CourseRow[] };
    const uniCoursesResult = uniCourseIds.length > 0
      ? await supabase.from("courses").select("id, code, title, units").in("id", uniCourseIds).returns<CourseRow[]>()
      : { data: [] as CourseRow[] };
    const ccInstsResult = ccInstIds.length > 0
      ? await supabase.from("institutions").select("id, name, abbreviation").in("id", ccInstIds).returns<InstitutionRow[]>()
      : { data: [] as InstitutionRow[] };
    const uniInstsResult = uniInstIds.length > 0
      ? await supabase.from("institutions").select("id, name, abbreviation").in("id", uniInstIds).returns<InstitutionRow[]>()
      : { data: [] as InstitutionRow[] };

    // Build lookup maps
    const courseMap = new Map<string, CourseRow>();
    for (const c of [...(ccCoursesResult.data || []), ...(uniCoursesResult.data || [])]) {
      courseMap.set(c.id, c);
    }
    const instMap = new Map<string, InstitutionRow>();
    for (const i of [...(ccInstsResult.data || []), ...(uniInstsResult.data || [])]) {
      instMap.set(i.id, i);
    }

    // Format articulation data into a readable string
    const formatted = agreements.map((a) => {
      const ccCourse = courseMap.get(a.cc_course_id);
      const uniCourse = courseMap.get(a.university_course_id);
      const ccInst = instMap.get(a.cc_institution_id);
      const uniInst = instMap.get(a.university_institution_id);

      if (!ccCourse || !uniCourse || !ccInst || !uniInst) return null;

      return `- ${ccInst.abbreviation || ccInst.name}: ${ccCourse.code} (${ccCourse.title}, ${ccCourse.units} units) → ${uniInst.abbreviation || uniInst.name}: ${uniCourse.code} (${uniCourse.title}, ${uniCourse.units} units) [${a.major || "General"}]`;
    }).filter(Boolean).join("\n");

    return formatted || "No articulation agreements found in the database.";
  } catch {
    return "Articulation data is currently unavailable.";
  }
}

/**
 * Fetches prerequisite relationships for relevant courses.
 */
async function getPrerequisiteContext(): Promise<string> {
  try {
    const supabase = await createClient();

    // Fetch prerequisites without nested joins to avoid FK hint issues
    const { data: prereqs, error } = await supabase
      .from("prerequisites")
      .select("course_id, prerequisite_course_id")
      .limit(100)
      .returns<PrerequisiteRow[]>();

    if (error || !prereqs) {
      console.error("Error fetching prerequisites:", error);
      return "";
    }

    // Collect unique course IDs
    const courseIds = [...new Set([
      ...prereqs.map(p => p.course_id).filter(Boolean),
      ...prereqs.map(p => p.prerequisite_course_id).filter(Boolean),
    ])];

    // Fetch course codes
    const { data: courses } = courseIds.length > 0
      ? await supabase.from("courses").select("id, code").in("id", courseIds).returns<{ id: string; code: string }[]>()
      : { data: [] };

    // Build lookup map
    const courseCodeMap = new Map<string, string>();
    for (const c of courses || []) {
      courseCodeMap.set(c.id, c.code);
    }

    const formatted = prereqs
      .map((p) => {
        const course = courseCodeMap.get(p.course_id);
        const prereq = courseCodeMap.get(p.prerequisite_course_id);

        if (!course || !prereq) return null;

        return `- ${course} requires ${prereq}`;
      })
      .filter(Boolean)
      .join("\n");

    return formatted || "";
  } catch {
    return "";
  }
}

/**
 * Fetches all CC courses from articulation data for alternative suggestions.
 */
async function getAvailableCCCourses(): Promise<Array<{ code: string; title: string; units: number }>> {
  try {
    const supabase = await createClient();

    const { data: agreements } = await supabase
      .from("articulation_agreements")
      .select("cc_course_id")
      .limit(500)
      .returns<ArticulationRow[]>();

    if (!agreements || agreements.length === 0) return [];

    const ccCourseIds = [...new Set(agreements.map(a => a.cc_course_id).filter(Boolean))];

    const { data: courses } = await supabase
      .from("courses")
      .select("code, title, units")
      .in("id", ccCourseIds)
      .returns<CourseRow[]>();

    return (courses || []).map(c => ({ code: c.code, title: c.title, units: c.units }));
  } catch {
    return [];
  }
}

/**
 * Finds courses that depend on the given course code as a prerequisite.
 */
async function findDependentsInPlan(
  failedCourseCode: string,
  planData: Record<string, unknown> | null
): Promise<Array<{ code: string; title: string; semesterNumber: number }>> {
  if (!planData || !("semesters" in planData) || !Array.isArray(planData.semesters)) return [];

  const semesters = planData.semesters as Array<{
    number: number;
    courses: Array<{ code: string; title: string; prerequisites?: string[]; status?: string }>;
  }>;

  const dependents: Array<{ code: string; title: string; semesterNumber: number }> = [];

  for (const semester of semesters) {
    for (const course of semester.courses) {
      // Skip the failed course itself
      if (course.code === failedCourseCode) continue;
      // Only consider courses that are still planned (not completed/failed/cancelled)
      if (course.status === "completed" || course.status === "failed" || course.status === "cancelled") continue;

      if (course.prerequisites?.includes(failedCourseCode)) {
        dependents.push({
          code: course.code,
          title: course.title,
          semesterNumber: semester.number,
        });
      }
    }
  }

  return dependents;
}

/**
 * Finds completed courses in the plan.
 */
function findCompletedCourses(planData: Record<string, unknown> | null): Array<{ code: string; title: string }> {
  if (!planData || !("semesters" in planData) || !Array.isArray(planData.semesters)) return [];

  const semesters = planData.semesters as Array<{
    courses: Array<{ code: string; title: string; status?: string }>;
  }>;

  const completed: Array<{ code: string; title: string }> = [];

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (course.status === "completed") {
        completed.push({ code: course.code, title: course.title });
      }
    }
  }

  return completed;
}

interface RecoveryContext {
  failedCourseCode: string;
  failedCourseTitle: string;
  status: "failed" | "cancelled" | "waitlisted";
  planData: Record<string, unknown> | null;
}

/**
 * Builds a recovery-specific system prompt section.
 */
function buildRecoveryPrompt(recovery: RecoveryContext, availableCourses: Array<{ code: string; title: string; units: number }>, dependents: Array<{ code: string; title: string; semesterNumber: number }>, completedCourses: Array<{ code: string; title: string }>): string {
  const { failedCourseCode, failedCourseTitle, status, planData } = recovery;

  const statusContext = status === "waitlisted"
    ? `The student has marked "${failedCourseCode} (${failedCourseTitle})" as WAITLISTED. This means they may or may not get into the course — there's uncertainty.`
    : status === "cancelled"
    ? `The student has marked "${failedCourseCode} (${failedCourseTitle})" as CANCELLED by the institution.`
    : `The student has marked "${failedCourseCode} (${failedCourseTitle})" as FAILED.`;

  const dependentList = dependents.length > 0
    ? `Courses in the plan that depend on ${failedCourseCode}: ${dependents.map(d => `${d.code} (${d.title}) in semester ${d.semesterNumber}`).join(", ")}.`
    : `No other courses in the current plan depend on ${failedCourseCode}.`;

  const completedList = completedCourses.length > 0
    ? `Completed courses (do NOT suggest retaking these): ${completedCourses.map(c => c.code).join(", ")}.`
    : "No completed courses yet.";

  const availableList = availableCourses.length > 0
    ? `Available CC courses for alternatives: ${availableCourses.map(c => `${c.code} (${c.title}, ${c.units} units)`).join("; ")}.`
    : "No articulation data available for alternative suggestions.";

  const isWaitlisted = status === "waitlisted";

  return `
## RECOVERY ANALYSIS REQUEST
${statusContext}

### DOWNSTREAM IMPACT
${dependentList}

### COMPLETED COURSES
${completedList}

### AVAILABLE COURSES FOR ALTERNATIVES
${availableList}

### CURRENT PLAN STRUCTURE
${planData ? JSON.stringify(planData, null, 2) : "No plan data available."}

### YOUR RESPONSE
${isWaitlisted
    ? `Since this course is WAITLISTED (not confirmed failed), respond with:
1. Acknowledge the uncertainty — they might still get into the course
2. Identify the downstream impact if they don't get in
3. Suggest backup plan alternatives from the available courses, with course code, title, units, transfer equivalency, and reasoning
4. Recommend a "watch-and-wait" approach with a timeline
5. If no alternatives exist, clearly say "No alternative courses found" and suggest consulting a counselor

Format alternative suggestions as: **{code}** — {title} ({units} units) — {transfer equivalency}. Reasoning: {reasoning}`
    : `Since this course has ${status === "failed" ? "failed" : "been cancelled"}, respond with:
1. Name the specific course that failed/was cancelled
2. List ALL dependent courses from the downstream impact section above
3. Suggest alternative courses from the available courses list. For each alternative include: course code, title, units, transfer equivalency, and reasoning for why it's a good substitute
4. Only suggest courses whose prerequisites are already satisfied by the student's completed courses or earlier planned courses
5. Do NOT suggest retaking any completed courses
6. If no alternatives exist, clearly say "No alternative courses found" and recommend the student consult with an academic counselor

Format alternative suggestions as: **{code}** — {title} ({units} units) — {transfer equivalency}. Reasoning: {reasoning}`
}`;
}

export async function POST(req: Request) {
  try {
    const { messages, recoveryContext }: { messages: UIMessage[]; recoveryContext?: RecoveryContext } = await req.json();

    // Fetch articulation data and prerequisites for context
    const [articulationData, prerequisiteData] = await Promise.all([
      getArticulationContext(),
      getPrerequisiteContext(),
    ]);

    let baseSystemPrompt = `You are CareerAC, an AI transfer planning assistant for California community college students.

## YOUR ROLE
Help students plan their transfer from community college to 4-year universities by generating semester-by-semester transfer plans.

## OUTPUT FORMAT
When generating a transfer plan, you MUST output a JSON code block with this exact structure:

\`\`\`json
{
  "ccName": "Community College Name",
  "targetUniversity": "Target University Name",
  "targetMajor": "Target Major",
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2024",
      "courses": [
        {
          "code": "CS 1",
          "title": "Introduction to Computer Science I",
          "units": 4,
          "transferEquivalency": "UCLA CS 31",
          "prerequisites": [],
          "notes": ""
        }
      ]
    }
  ],
  "totalUnits": 60
}
\`\`\`

## GUARDRAILS
1. **Stay on topic**: Only discuss transfer planning, articulation, and course planning.
2. **Don't fabricate courses**: ONLY use courses from the articulation data provided below. If a course doesn't exist in the data, don't invent it.
3. **Admit when no data**: If no articulation data matches the student's CC + target school + major combination, output:
\`\`\`json
{
  "isNoData": true,
  "noDataMessage": "No articulation data found for your specific path. We currently have data for select California community colleges transferring to UC and CSU schools. Please verify course requirements with your academic counselor, or try a different school/major combination."
}
\`\`\`
4. **Prerequisite ordering**: NEVER schedule a course before its prerequisites. If CS 2 requires CS 1, then CS 1 must appear in an earlier semester than CS 2.
5. **Include all fields**: Every course must have code, title, and units. Include transfer equivalency when available.

## AVAILABLE ARTICULATION DATA
The following are the articulation agreements in our database. Use ONLY these courses when generating plans:

${articulationData}

## PREREQUISITE RELATIONSHIPS
${prerequisiteData || "No prerequisite data is currently available. Use your knowledge of typical course sequences."}

## RESPONDING TO FOLLOW-UP MESSAGES
If the user already has a plan and asks to modify it (e.g., "Move MATH 101 to semester 2"), regenerate the full plan JSON with the requested changes while maintaining prerequisite ordering.`;

    // If this is a recovery request, fetch additional context and append recovery prompt
    if (recoveryContext) {
      const [availableCourses, dependents, completedCourses] = await Promise.all([
        getAvailableCCCourses(),
        findDependentsInPlan(recoveryContext.failedCourseCode, recoveryContext.planData),
        findCompletedCourses(recoveryContext.planData),
      ]);

      const recoveryPrompt = buildRecoveryPrompt(
        recoveryContext,
        availableCourses,
        dependents,
        completedCourses,
      );

      baseSystemPrompt += recoveryPrompt;
    }

    const result = streamText({
      model: openrouter("google/gemma-4-31b-it:free"),
      messages: await convertToModelMessages(messages),
      system: baseSystemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    
    if (error instanceof Error && error.message?.includes("429")) {
      return Response.json(
        { error: "Rate limited, try again in a moment" },
        { status: 429 }
      );
    }
    
    return Response.json(
      { error: "AI temporarily unavailable" },
      { status: 500 }
    );
  }
}
