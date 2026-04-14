import { UIMessage } from "ai";
import { createClient } from "@/utils/supabase/server";
import { getVerifiedPlaybooksContext } from "@/utils/playbook-context";
import type { Database } from "@/types/database";
import type { TranscriptData } from "@/types/transcript";

type ArticulationRow = Database["public"]["Tables"]["articulation_agreements"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];
type PrerequisiteRow = Database["public"]["Tables"]["prerequisites"]["Row"];

interface PlanContext {
  ccInstitutionId?: string;
  targetInstitutionId?: string;
  targetMajor?: string;
}

interface ArticulationContextResult {
  context: string;
  exactMatchCount: number;
  institutionMatchCount: number;
}

function normalizeMajor(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isMajorMatch(agreementMajor: string | null, targetMajor?: string): boolean {
  if (!targetMajor) return true;
  if (!agreementMajor) return false;

  const normalizedAgreementMajor = normalizeMajor(agreementMajor);
  const normalizedTargetMajor = normalizeMajor(targetMajor);

  if (!normalizedAgreementMajor || !normalizedTargetMajor) return false;
  if (normalizedAgreementMajor.includes(normalizedTargetMajor) || normalizedTargetMajor.includes(normalizedAgreementMajor)) {
    return true;
  }

  const agreementTokens = new Set(normalizedAgreementMajor.split(" ").filter((t) => t.length > 2));
  const targetTokens = new Set(normalizedTargetMajor.split(" ").filter((t) => t.length > 2));

  let overlap = 0;
  for (const token of agreementTokens) {
    if (targetTokens.has(token)) {
      overlap += 1;
    }
  }

  const requiredOverlap = Math.min(2, targetTokens.size);
  return overlap >= requiredOverlap && overlap > 0;
}

/**
 * Fetches articulation data for the user's path (CC + target school + major).
 * Returns formatted text that can be included in the system prompt.
 */
async function getArticulationContext(
  planContext?: PlanContext,
  hasTargetSchool = true,
): Promise<ArticulationContextResult> {
  try {
    const supabase = await createClient();

    // Scope articulation agreements to the student's context when available.
    let query = supabase
      .from("articulation_agreements")
      .select("id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, notes")
      .limit(1500)
      .returns<ArticulationRow[]>();

    if (planContext?.ccInstitutionId) {
      query = query.eq("cc_institution_id", planContext.ccInstitutionId);
    }

    if (hasTargetSchool !== false && planContext?.targetInstitutionId) {
      query = query.eq("university_institution_id", planContext.targetInstitutionId);
    }

    const { data: scopedAgreements, error } = await query;

    if (error || !scopedAgreements) {
      console.error("Error fetching articulation data:", error);
      return {
        context: "Articulation data is currently unavailable.",
        exactMatchCount: 0,
        institutionMatchCount: 0,
      };
    }

    const institutionMatchCount = scopedAgreements.length;
    const exactMajorMatches = scopedAgreements.filter((agreement) =>
      isMajorMatch(agreement.major, planContext?.targetMajor),
    );
    const exactMatchCount = exactMajorMatches.length;
    const agreementsForPrompt = exactMatchCount > 0 ? exactMajorMatches : scopedAgreements;

    // Collect unique IDs to fetch related data
    const ccCourseIds = [...new Set(agreementsForPrompt.map((a) => a.cc_course_id).filter(Boolean))];
    const uniCourseIds = [...new Set(agreementsForPrompt.map((a) => a.university_course_id).filter(Boolean))];
    const ccInstIds = [...new Set(agreementsForPrompt.map((a) => a.cc_institution_id).filter(Boolean))];
    const uniInstIds = [...new Set(agreementsForPrompt.map((a) => a.university_institution_id).filter(Boolean))];

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
    const formatted = agreementsForPrompt.map((a) => {
      const ccCourse = courseMap.get(a.cc_course_id);
      const uniCourse = courseMap.get(a.university_course_id);
      const ccInst = instMap.get(a.cc_institution_id);
      const uniInst = instMap.get(a.university_institution_id);

      if (!ccCourse || !uniCourse || !ccInst || !uniInst) return null;

      return `- ${ccInst.abbreviation || ccInst.name}: ${ccCourse.code} (${ccCourse.title}, ${ccCourse.units} units) → ${uniInst.abbreviation || uniInst.name}: ${uniCourse.code} (${uniCourse.title}, ${uniCourse.units} units) [${a.major || "General"}]`;
    }).filter(Boolean).join("\n");

    const contextPrefix = [
      `Exact path major matches: ${exactMatchCount}`,
      `Institution-scoped matches: ${institutionMatchCount}`,
    ].join("\n");

    return {
      context: `${contextPrefix}\n\n${formatted || "No articulation agreements found for the current filters."}`,
      exactMatchCount,
      institutionMatchCount,
    };
  } catch {
    return {
      context: "Articulation data is currently unavailable.",
      exactMatchCount: 0,
      institutionMatchCount: 0,
    };
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

// Helper function to convert UIMessages to OpenAI format
function convertToOpenAIMessages(messages: UIMessage[]): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  return messages.map((msg) => {
    // Extract text content from parts
    let content = "";
    if (Array.isArray(msg.parts)) {
      content = msg.parts
        .filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .join("");
    }

    return {
      role: msg.role as "system" | "user" | "assistant",
      content,
    };
  });
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      recoveryContext,
      planContext,
      transcriptData,
      maxCreditsPerSemester,
      hasTargetSchool,
    }: {
      messages: UIMessage[];
      recoveryContext?: RecoveryContext;
      planContext?: PlanContext;
      transcriptData?: TranscriptData;
      maxCreditsPerSemester?: number;
      hasTargetSchool?: boolean;
    } = await req.json();

    // Fetch articulation data, prerequisites, and verified playbooks in parallel
    const [articulationResult, prerequisiteData, verifiedPlaybooksContext] = await Promise.all([
      getArticulationContext(planContext, hasTargetSchool !== false),
      getPrerequisiteContext(),
      getVerifiedPlaybooksContext(
        planContext?.ccInstitutionId,
        planContext?.targetInstitutionId,
        planContext?.targetMajor,
      ),
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
3. **Admit when no data (strict)**: You may output isNoData=true ONLY when both values are 0:
  - Exact path major matches
  - Institution-scoped matches

If Institution-scoped matches is greater than 0, you MUST generate a best-effort plan from the provided articulation courses and clearly mark limitations in course notes.

If no data condition is met, output:
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

${articulationResult.context}

## PREREQUISITE RELATIONSHIPS
${prerequisiteData || "No prerequisite data is currently available. Use your knowledge of typical course sequences."}

## RESPONDING TO FOLLOW-UP MESSAGES
If the user already has a plan and asks to modify it (e.g., "Move MATH 101 to semester 2"), regenerate the full plan JSON with the requested changes while maintaining prerequisite ordering.`;

    // Add verified playbook context if available
    if (verifiedPlaybooksContext) {
      baseSystemPrompt += verifiedPlaybooksContext;
    }

    // Add transcript context if available
    if (transcriptData && transcriptData.courses.length > 0) {
      const completedCoursesList = transcriptData.courses
        .filter((c) => c.status === "completed")
        .map((c) => `- ${c.code}: ${c.title} (${c.units} units, Grade: ${c.grade})`)
        .join("\n");
      const inProgressList = transcriptData.courses
        .filter((c) => c.status === "in_progress")
        .map((c) => `- ${c.code}: ${c.title} (${c.units} units)`)
        .join("\n");

      baseSystemPrompt += `

## STUDENT TRANSCRIPT
The student has uploaded their transcript from ${transcriptData.institution}.

COMPLETED COURSES:
${completedCoursesList || "None"}

IN-PROGRESS COURSES:
${inProgressList || "None"}

Total completed units: ${transcriptData.totalUnitsCompleted}${transcriptData.gpa !== undefined ? ` | GPA: ${transcriptData.gpa}` : ""}

IMPORTANT: Do NOT include any completed courses in the generated plan. Only schedule remaining required courses that the student still needs to take. In-progress courses should only be included if they might need to be retaken.`;
    }

    // Add max credits enforcement
    if (maxCreditsPerSemester) {
      baseSystemPrompt += `

## MAX CREDITS PER SEMESTER: ${maxCreditsPerSemester} units
This is a STRICT limit. Every semester in the plan MUST have ${maxCreditsPerSemester} or fewer total units. No exceptions. If you cannot fit all required courses within this limit, add more semesters rather than exceeding the limit. NEVER generate a semester that exceeds ${maxCreditsPerSemester} units.`;
    }

    // Add multi-university mode if no target school
    if (hasTargetSchool === false) {
      baseSystemPrompt += `

## MULTI-UNIVERSITY ANALYSIS MODE
The student does NOT have a specific target school. Analyze the articulation data and generate plans for MULTIPLE universities that match their CC and major.

You MUST output a JSON code block with this structure instead of the standard plan format:

\`\`\`json
{
  "isMultiUniversity": true,
  "studentCC": "Community College Name",
  "major": "Student's Major",
  "maxCreditsPerSemester": ${maxCreditsPerSemester || 15},
  "transcriptSummary": {
    "completedCourses": 10,
    "totalUnits": 32,
    "gpa": 3.45
  },
  "universities": [
    {
      "universityName": "University Name",
      "fitScore": 85,
      "articulatedUnits": 40,
      "totalRequiredUnits": 60,
      "completedPrereqs": 8,
      "totalPrereqs": 10,
      "remainingSemesters": 3,
      "plan": {
        "ccName": "...",
        "targetUniversity": "...",
        "targetMajor": "...",
        "semesters": [...],
        "totalUnits": 60
      },
      "highlights": ["85% of lower-div major requirements completed", "All math prerequisites satisfied"]
    }
  ]
}
\`\`\`

RANKING: Sort universities by fitScore (highest first). Calculate fitScore as:
- 40% weight: percentage of required courses already completed or articulated
- 30% weight: percentage of prerequisites already satisfied
- 20% weight: fewer remaining semesters = higher score
- 10% weight: GPA competitiveness for the program

Each university's plan must respect the max credits per semester limit. Include only universities where articulation data exists.`;
    }

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

      // Also add playbook context to recovery if not already added
      if (!verifiedPlaybooksContext) {
        const playbookContext = await getVerifiedPlaybooksContext();
        if (playbookContext) {
          baseSystemPrompt += playbookContext;
        }
      }
    }

    const openaiMessages = convertToOpenAIMessages(messages);

    // Convert OpenAI format messages to Anthropic format
    const anthropicMessages = openaiMessages
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: [{ type: "text" as const, text: msg.content }],
      }));

    const token = process.env.MINIMAX_API_KEY ?? process.env.FIREWORKS_API_KEY ?? "YOUR_API_KEY";

    const headers = {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
    };

    const body = {
      "model": "MiniMax-M2.5",
      "system": baseSystemPrompt,
      "messages": anthropicMessages,
      "max_tokens": 8192,
      "temperature": 0.6,
      "top_p": 0.95,
      "stream": true,
    };

    const minimaxResponse = await fetch("https://api.minimax.io/anthropic/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      console.error("MiniMax API error:", minimaxResponse.status, errorText);
      return Response.json(
        { error: "AI service error" },
        { status: minimaxResponse.status }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = minimaxResponse.body?.getReader();

        if (!reader) {
          controller.error(new Error("No response body"));
          return;
        }

        const messageId = `msg-${Date.now()}`;
        let started = false;
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value);
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  // Anthropic format uses delta.type and delta.text
                  const delta = parsed.delta;
                  let content = "";

                  if (delta) {
                    if (delta.type === "text_delta" && delta.text) {
                      content = delta.text;
                    } else if (delta.type === "thinking_delta" && delta.thinking) {
                      // Skip thinking content for now
                      continue;
                    }
                  }

                  if (!started) {
                    started = true;
                    const startEvent = {
                      id: messageId,
                      type: "assistant_message",
                      role: "assistant",
                      content: [],
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(startEvent)}\n`));
                  }

                  if (content) {
                    const textEvent = {
                      type: "text",
                      text: content,
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(textEvent)}\n`));
                  }
                } catch {
                  // SSE chunks may be incomplete, ignore parse errors
                }
              }
            }
          }

          const finishEvent = {
            type: "finish",
            finishReason: "stop",
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finishEvent)}\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
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