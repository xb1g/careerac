/**
 * Merge plan_courses status into plan_data to ensure persistence.
 * This handles the case where plan_data wasn't saved with status updates
 * but plan_courses has the authoritative status.
 *
 * Since plan_courses doesn't have course_code, we match by semester_number
 * and apply status to courses that don't already have a non-planned status.
 */
export function mergeCourseStatusIntoPlanData(
  planData: unknown,
  planCourses: Array<{ semester_number: number; status: string; alternative_for: string | null }>
): unknown {
  if (!planData || typeof planData !== "object") return planData;

  const data = planData as Record<string, unknown>;
  if (!Array.isArray(data.semesters)) return planData;

  const semesters = data.semesters as Array<{
    number: number;
    courses: Array<{
      code: string;
      title: string;
      status?: string;
      alternative_for?: string;
    }>;
  }>;

  // Group plan_courses by semester_number
  const coursesBySemester = new Map<number, Array<{ status: string; alternative_for: string | null }>>();
  for (const pc of planCourses) {
    if (!coursesBySemester.has(pc.semester_number)) {
      coursesBySemester.set(pc.semester_number, []);
    }
    coursesBySemester.get(pc.semester_number)!.push({ status: pc.status, alternative_for: pc.alternative_for });
  }

  // Merge statuses: apply plan_courses status to courses that don't have a non-planned status
  for (const semester of semesters) {
    const statuses = coursesBySemester.get(semester.number);
    if (!statuses) continue;

    // For each course in the semester, check if it needs a status update
    // Match by position (plan_courses are ordered by created_at)
    let statusIndex = 0;
    for (const course of semester.courses) {
      if (statusIndex < statuses.length) {
        const pcStatus = statuses[statusIndex];
        // Only update if course doesn't have a meaningful status
        if (!course.status || course.status === "planned") {
          if (pcStatus.status !== "planned") {
            course.status = pcStatus.status;
          }
          if (pcStatus.alternative_for && !course.alternative_for) {
            course.alternative_for = pcStatus.alternative_for;
          }
        }
        statusIndex++;
      }
    }
  }

  return planData;
}
