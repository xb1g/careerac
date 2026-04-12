import { PlanCourse, PlanSemester, CourseStatus } from "@/types/plan";

/**
 * Represents a recovery analysis result for a failed/cancelled/waitlisted course.
 */
export interface RecoveryAnalysis {
  failedCourse: {
    code: string;
    title: string;
    semesterNumber: number;
    status: CourseStatus;
  };
  dependentCourses: {
    code: string;
    title: string;
    semesterNumber: number;
    prerequisite: string;
  }[];
  alternatives: AlternativeCourse[];
  noAlternatives: boolean;
  completedCourses: {
    code: string;
    title: string;
    semesterNumber: number;
  }[];
}

/**
 * Represents an alternative course suggestion.
 */
export interface AlternativeCourse {
  code: string;
  title: string;
  units: number;
  transferEquivalency: string;
  reasoning: string;
  prerequisitesSatisfied: boolean;
  missingPrerequisites: string[];
}

/**
 * Finds all courses that depend on the given course as a prerequisite.
 */
export function findDependentCourses(
  failedCourseCode: string,
  semesters: PlanSemester[]
): { code: string; title: string; semesterNumber: number; prerequisite: string }[] {
  const dependents: { code: string; title: string; semesterNumber: number; prerequisite: string }[] = [];

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (course.prerequisites?.includes(failedCourseCode)) {
        dependents.push({
          code: course.code,
          title: course.title,
          semesterNumber: semester.number,
          prerequisite: failedCourseCode,
        });
      }
    }
  }

  return dependents;
}

/**
 * Finds all completed courses in the plan.
 */
export function findCompletedCourses(
  semesters: PlanSemester[]
): { code: string; title: string; semesterNumber: number }[] {
  const completed: { code: string; title: string; semesterNumber: number }[] = [];

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (course.status === "completed") {
        completed.push({
          code: course.code,
          title: course.title,
          semesterNumber: semester.number,
        });
      }
    }
  }

  return completed;
}

/**
 * Checks if all prerequisites for a course are satisfied.
 * A prerequisite is satisfied if:
 * 1. It appears in an earlier semester in the plan, OR
 * 2. It is marked as completed
 */
export function arePrerequisitesSatisfied(
  course: { prerequisites?: string[] },
  semesters: PlanSemester[],
  targetSemesterNumber: number,
  completedCourseCodes: Set<string>
): { satisfied: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { satisfied: true, missing: [] };
  }

  // Get all course codes from earlier semesters
  const earlierCourses = new Set<string>();
  for (const semester of semesters) {
    if (semester.number < targetSemesterNumber) {
      for (const c of semester.courses) {
        // Consider it available if it's planned, in_progress, or completed
        if (c.status !== "failed" && c.status !== "cancelled") {
          earlierCourses.add(c.code);
        }
      }
    }
  }

  for (const prereq of course.prerequisites) {
    const isInEarlierSemester = earlierCourses.has(prereq);
    const isCompleted = completedCourseCodes.has(prereq);

    if (!isInEarlierSemester && !isCompleted) {
      missing.push(prereq);
    }
  }

  return { satisfied: missing.length === 0, missing };
}

/**
 * Finds the earliest valid semester where a course can be placed
 * without violating prerequisite ordering.
 */
export function findEarliestValidSemester(
  prerequisites: string[] | undefined,
  semesters: PlanSemester[],
  failedSemesterNumber: number,
  completedCourseCodes: Set<string>
): number {
  if (!prerequisites || prerequisites.length === 0) {
    return failedSemesterNumber;
  }

  // Find the latest semester among prerequisites
  let latestPrereqSemester = 0;

  for (const semester of semesters) {
    for (const course of semester.courses) {
      if (prerequisites.includes(course.code)) {
        // If prereq is completed, it doesn't constrain placement
        if (completedCourseCodes.has(course.code)) continue;
        // Otherwise, the course must be in a later semester
        if (semester.number > latestPrereqSemester) {
          latestPrereqSemester = semester.number;
        }
      }
    }
  }

  // The course must be in a semester AFTER its latest prerequisite
  // But also not earlier than the failed course's semester
  return Math.max(latestPrereqSemester + 1, failedSemesterNumber);
}

/**
 * Performs a full recovery analysis for a failed/cancelled/waitlisted course.
 */
export function analyzeRecovery(
  failedCourse: PlanCourse,
  semesterNumber: number,
  semesters: PlanSemester[],
  availableAlternatives?: { code: string; title: string; units: number; transferEquivalency: string; prerequisites?: string[] }[]
): RecoveryAnalysis {
  const dependents = findDependentCourses(failedCourse.code, semesters);
  const completedCourses = findCompletedCourses(semesters);
  const completedCourseCodes = new Set(completedCourses.map(c => c.code));

  const alternatives: AlternativeCourse[] = [];
  let noAlternatives = true;

  if (availableAlternatives && availableAlternatives.length > 0) {
    for (const alt of availableAlternatives) {
      const { satisfied, missing } = arePrerequisitesSatisfied(
        alt,
        semesters,
        semesterNumber,
        completedCourseCodes
      );

      // Only include alternatives that don't suggest re-taking completed courses
      const isCompletedCourse = completedCourseCodes.has(alt.code);
      if (isCompletedCourse) continue;

      alternatives.push({
        code: alt.code,
        title: alt.title,
        units: alt.units,
        transferEquivalency: alt.transferEquivalency || "N/A",
        reasoning: satisfied
          ? `This course satisfies the same requirements as ${failedCourse.code} and all its prerequisites are met in your current plan.`
          : `This course could substitute for ${failedCourse.code}, but prerequisites (${missing.join(", ")}) need to be addressed.`,
        prerequisitesSatisfied: satisfied,
        missingPrerequisites: missing,
      });
    }

    noAlternatives = alternatives.length === 0;
  }

  return {
    failedCourse: {
      code: failedCourse.code,
      title: failedCourse.title,
      semesterNumber,
      status: failedCourse.status || "failed",
    },
    dependentCourses: dependents,
    alternatives,
    noAlternatives,
    completedCourses,
  };
}
