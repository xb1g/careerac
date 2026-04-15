/**
 * Recovery context building.
 * Extracts dependents, completed courses, and available alternatives
 * from the current plan and articulation data, then formats a recovery prompt.
 */

import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";
import type { RecoveryContext } from "@/lib/plan-pipeline";
import { getVerifiedPlaybooksContext } from "@/utils/playbook-context";

type ArticulationRow =
  Database["public"]["Tables"]["articulation_agreements"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function getAvailableCCCourses(): Promise<
  Array<{ code: string; title: string; units: number }>
> {
  try {
    const supabase = await createClient();
    const { data: agreements } = await supabase
      .from("articulation_agreements")
      .select("cc_course_id")
      .limit(500)
      .returns<ArticulationRow[]>();

    if (!agreements || agreements.length === 0) return [];

    const ccCourseIds = [
      ...new Set(agreements.map((a) => a.cc_course_id).filter(Boolean)),
    ];

    const { data: courses } = await supabase
      .from("courses")
      .select("code, title, units")
      .in("id", ccCourseIds)
      .returns<CourseRow[]>();

    return (courses || []).map((c) => ({
      code: c.code,
      title: c.title,
      units: c.units,
    }));
  } catch {
    return [];
  }
}

function findDependentsInPlan(
  failedCourseCode: string,
  planData: Record<string, unknown> | null,
): Array<{ code: string; title: string; semesterNumber: number }> {
  if (
    !planData ||
    !("semesters" in planData) ||
    !Array.isArray(planData.semesters)
  )
    return [];

  const semesters = planData.semesters as Array<{
    number: number;
    courses: Array<{
      code: string;
      title: string;
      prerequisites?: string[];
      status?: string;
    }>;
  }>;

  const dependents: Array<{
    code: string;
    title: string;
    semesterNumber: number;
  }> = [];

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (course.code === failedCourseCode) continue;
      if (
        course.status === "completed" ||
        course.status === "failed" ||
        course.status === "cancelled"
      )
        continue;
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

function findCompletedCourses(
  planData: Record<string, unknown> | null,
): Array<{ code: string; title: string }> {
  if (
    !planData ||
    !("semesters" in planData) ||
    !Array.isArray(planData.semesters)
  )
    return [];

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

function buildRecoveryPrompt(
  recovery: RecoveryContext,
  availableCourses: Array<{ code: string; title: string; units: number }>,
  dependents: Array<{ code: string; title: string; semesterNumber: number }>,
  completedCourses: Array<{ code: string; title: string }>,
): string {
  const { failedCourseCode, failedCourseTitle, status, planData } = recovery;

  const statusContext =
    status === "waitlisted"
      ? `The student has marked "${failedCourseCode} (${failedCourseTitle})" as WAITLISTED. This means they may or may not get into the course — there's uncertainty.`
      : status === "cancelled"
        ? `The student has marked "${failedCourseCode} (${failedCourseTitle})" as CANCELLED by the institution.`
        : `The student has marked "${failedCourseCode} (${failedCourseTitle})" as FAILED.`;

  const dependentList =
    dependents.length > 0
      ? `Courses in the plan that depend on ${failedCourseCode}: ${dependents.map((d) => `${d.code} (${d.title}) in semester ${d.semesterNumber}`).join(", ")}.`
      : `No other courses in the current plan depend on ${failedCourseCode}.`;

  const completedList =
    completedCourses.length > 0
      ? `Completed courses (do NOT suggest retaking these): ${completedCourses.map((c) => c.code).join(", ")}.`
      : "No completed courses yet.";

  const availableList =
    availableCourses.length > 0
      ? `Available CC courses for alternatives: ${availableCourses.map((c) => `${c.code} (${c.title}, ${c.units} units)`).join("; ")}.`
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
${
  isWaitlisted
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

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

/**
 * Builds recovery context by fetching dependents, completed courses,
 * and available alternatives, then formatting the recovery prompt.
 * Also ensures playbook context is included (dedup with existing).
 */
export async function buildRecoveryContext(
  recovery: RecoveryContext,
  existingPlaybookContext: string,
): Promise<string> {
  const [availableCourses, dependents, completedCourses] = await Promise.all([
    getAvailableCCCourses(),
    Promise.resolve(findDependentsInPlan(recovery.failedCourseCode, recovery.planData)),
    Promise.resolve(findCompletedCourses(recovery.planData)),
  ]);

  let prompt = buildRecoveryPrompt(
    recovery,
    availableCourses,
    dependents,
    completedCourses,
  );

  // Deduplicate: only fetch playbooks for recovery if not already provided
  if (!existingPlaybookContext) {
    const playbookContext = await getVerifiedPlaybooksContext();
    if (playbookContext) {
      prompt += playbookContext;
    }
  }

  return prompt;
}
