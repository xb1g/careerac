import { describe, it, expect } from "vitest";

/**
 * This module tests the mergeCourseStatusIntoPlanData function extracted from the
 * /plan/[id]/page.tsx server component. Since we can't directly test server components,
 * we extract the pure function and test it here.
 */

interface CourseInPlanData {
  code: string;
  title: string;
  units: number;
  status?: string;
  alternative_for?: string;
}

interface SemesterInPlanData {
  number: number;
  label: string;
  courses: CourseInPlanData[];
  totalUnits: number;
}

interface PlanDataShape {
  ccName?: string;
  targetUniversity?: string;
  targetMajor?: string;
  semesters?: SemesterInPlanData[];
  totalUnits?: number;
}

// Replicate the merge function from page.tsx for testing
function mergeCourseStatusIntoPlanData(
  planData: unknown,
  planCourses: Array<{ semester_number: number; status: string; alternative_for: string | null }>
): unknown {
  if (!planData || typeof planData !== "object") return planData;

  const data = planData as Record<string, unknown>;
  if (!Array.isArray(data.semesters)) return planData;

  const semesters = data.semesters as SemesterInPlanData[];

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

    let statusIndex = 0;
    for (const course of semester.courses) {
      if (statusIndex < statuses.length) {
        const pcStatus = statuses[statusIndex];
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

describe("mergeCourseStatusIntoPlanData", () => {
  const createPlanData = () => ({
    ccName: "SMC",
    targetUniversity: "UCLA",
    targetMajor: "CS",
    semesters: [
      {
        number: 1,
        label: "Fall 2024",
        courses: [
          { code: "CS 1", title: "Intro to CS", units: 4, status: "planned" },
          { code: "MATH 1", title: "Calculus I", units: 4, status: "planned" },
        ],
        totalUnits: 8,
      },
      {
        number: 2,
        label: "Spring 2025",
        courses: [
          { code: "CS 2", title: "Intro to CS II", units: 4, status: "planned" },
        ],
        totalUnits: 4,
      },
    ],
    totalUnits: 12,
  });

  it("merges failed status from plan_courses into plan_data", () => {
    const planData = createPlanData();
    const planCourses = [
      { semester_number: 1, status: "failed", alternative_for: null },
      { semester_number: 1, status: "planned", alternative_for: null },
      { semester_number: 2, status: "planned", alternative_for: null },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    const semesters = (planData as PlanDataShape).semesters as SemesterInPlanData[];
    expect(semesters[0].courses[0].status).toBe("failed");
    // Second course should remain planned
    expect(semesters[0].courses[1].status).toBe("planned");
  });

  it("does not overwrite existing non-planned status in plan_data", () => {
    const planData = createPlanData();
    // Set status in plan_data first (simulating successful save)
    const semesters = (planData as PlanDataShape).semesters as SemesterInPlanData[];
    semesters[0].courses[0].status = "completed";

    const planCourses = [
      { semester_number: 1, status: "failed", alternative_for: null },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    // Should keep the completed status from plan_data
    const updatedSemesters = (planData as PlanDataShape).semesters as SemesterInPlanData[];
    expect(updatedSemesters[0].courses[0].status).toBe("completed");
  });

  it("merges alternative_for from plan_courses", () => {
    const planData = createPlanData();
    // Add an alternative course
    const semesters = (planData as PlanDataShape).semesters as SemesterInPlanData[];
    semesters[1].courses.push({
      code: "CS 2A",
      title: "Intro to Programming",
      units: 4,
      status: "planned",
    });

    const planCourses = [
      { semester_number: 1, status: "planned", alternative_for: null },
      { semester_number: 1, status: "planned", alternative_for: null },
      { semester_number: 2, status: "planned", alternative_for: null },
      { semester_number: 2, status: "planned", alternative_for: "course-123" },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    const updatedSemesters = (planData as PlanDataShape).semesters as SemesterInPlanData[];
    const alternative = updatedSemesters[1].courses.find((c: CourseInPlanData) => c.code === "CS 2A");
    expect(alternative?.alternative_for).toBe("course-123");
  });

  it("handles empty plan_courses array", () => {
    const planData = createPlanData();
    const result = mergeCourseStatusIntoPlanData(planData, []);

    // Plan data should be unchanged
    const resultData = result as PlanDataShape;
    const semesters = resultData.semesters as SemesterInPlanData[];
    expect(semesters[0].courses[0].status).toBe("planned");
  });

  it("handles null plan_data", () => {
    const result = mergeCourseStatusIntoPlanData(null, []);
    expect(result).toBeNull();
  });

  it("handles plan_data without semesters", () => {
    const planData = { ccName: "SMC" };
    const result = mergeCourseStatusIntoPlanData(planData, []);

    expect(result).toEqual(planData);
  });

  it("handles multiple failures in same semester", () => {
    const planData = createPlanData();
    const planCourses = [
      { semester_number: 1, status: "failed", alternative_for: null },
      { semester_number: 1, status: "cancelled", alternative_for: null },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    const resultData = planData as PlanDataShape;
    const semesters = resultData.semesters as SemesterInPlanData[];
    expect(semesters[0].courses[0].status).toBe("failed");
    expect(semesters[0].courses[1].status).toBe("cancelled");
  });

  it("only applies non-planned statuses from plan_courses", () => {
    const planData = createPlanData();
    const planCourses = [
      { semester_number: 1, status: "planned", alternative_for: null },
      { semester_number: 1, status: "planned", alternative_for: null },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    // Should remain planned (no change)
    const resultData = planData as PlanDataShape;
    const semesters = resultData.semesters as SemesterInPlanData[];
    expect(semesters[0].courses[0].status).toBe("planned");
  });

  it("handles waitlisted status correctly", () => {
    const planData = createPlanData();
    const planCourses = [
      { semester_number: 1, status: "waitlisted", alternative_for: null },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    const resultData = planData as PlanDataShape;
    const semesters = resultData.semesters as SemesterInPlanData[];
    expect(semesters[0].courses[0].status).toBe("waitlisted");
  });

  it("preserves plan_data structure after merge", () => {
    const planData = createPlanData();
    const planCourses = [
      { semester_number: 1, status: "failed", alternative_for: null },
    ];

    mergeCourseStatusIntoPlanData(planData, planCourses);

    // Verify structure is intact
    expect(planData).toHaveProperty("ccName", "SMC");
    expect(planData).toHaveProperty("targetUniversity", "UCLA");
    expect(planData).toHaveProperty("targetMajor", "CS");
    const resultData = planData as PlanDataShape;
    expect(resultData.semesters).toHaveLength(2);
    expect(resultData.totalUnits).toBe(12);
  });
});
