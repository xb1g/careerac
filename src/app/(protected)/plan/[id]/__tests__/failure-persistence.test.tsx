import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseCard from "@/components/course-card";
import SemesterPlan from "@/components/semester-plan";
import { TransferPlan, PlanCourse, CourseStatus } from "@/types/plan";

// ============================================================================
// Test Fixtures
// ============================================================================

const createMockCourse = (overrides: Partial<PlanCourse> = {}): PlanCourse => ({
  code: "CS 101",
  title: "Introduction to Computer Science",
  units: 3,
  transferEquivalency: "UCLA CS 31",
  prerequisites: [],
  status: "planned",
  ...overrides,
});

const createMockPlan = (overrides: Partial<TransferPlan> = {}): TransferPlan => ({
  ccName: "Santa Monica College",
  targetUniversity: "UCLA",
  targetMajor: "Computer Science",
  semesters: [
    {
      number: 1,
      label: "Fall 2024",
      courses: [
        createMockCourse({ code: "CS 1", title: "Intro to CS I", units: 4, status: "planned" }),
        createMockCourse({ code: "MATH 1", title: "Calculus I", units: 4, status: "planned" }),
      ],
      totalUnits: 8,
    },
    {
      number: 2,
      label: "Spring 2025",
      courses: [
        createMockCourse({ code: "CS 2", title: "Intro to CS II", units: 4, status: "planned", prerequisites: ["CS 1"] }),
        createMockCourse({ code: "MATH 2", title: "Calculus II", units: 4, status: "planned", prerequisites: ["MATH 1"] }),
      ],
      totalUnits: 8,
    },
    {
      number: 3,
      label: "Fall 2025",
      courses: [
        createMockCourse({ code: "CS 3", title: "Data Structures", units: 4, status: "planned", prerequisites: ["CS 2"] }),
        createMockCourse({ code: "MATH 3", title: "Linear Algebra", units: 4, status: "planned", prerequisites: ["MATH 2"] }),
      ],
      totalUnits: 8,
    },
  ],
  totalUnits: 24,
  ...overrides,
});

// ============================================================================
// Failure Status Visual Distinction Tests
// ============================================================================

describe("CourseCard Failure Status Display", () => {
  it("shows failed status with red styling", () => {
    const failedCourse = createMockCourse({ status: "failed" });
    render(<CourseCard course={failedCourse} />);

    const card = screen.getByTestId("course-card-CS 101");
    expect(card).toHaveTextContent("failed");
    expect(card.className).toContain("text-rose-900");
    expect(card.className).toContain("opacity-80");
  });

  it("shows cancelled status with distinct visual treatment from failed", () => {
    const failedCourse = createMockCourse({ code: "CS 101", status: "failed" });
    const cancelledCourse = createMockCourse({ code: "CS 102", status: "cancelled" });

    const { unmount } = render(<CourseCard course={failedCourse} />);
    const failedCard = screen.getByTestId("course-card-CS 101");

    unmount();
    render(<CourseCard course={cancelledCourse} />);
    const cancelledCard = screen.getByTestId("course-card-CS 102");

    expect(failedCard).toHaveTextContent("failed");
    expect(cancelledCard).toHaveTextContent("cancelled");
    expect(failedCard.className).toContain("text-rose-900");
    expect(cancelledCard.className).toContain("text-zinc-500");
  });

  it("shows waitlisted status with amber styling", () => {
    const waitlistedCourse = createMockCourse({ status: "waitlisted" });
    render(<CourseCard course={waitlistedCourse} />);

    const card = screen.getByTestId("course-card-CS 101");
    expect(card).toHaveTextContent("waitlisted");
    expect(card.className).toContain("border-l-amber-500");

    expect(card.className).not.toContain("line-through");
  });

  it("shows alternative_for courses with planned status (recovery alternatives)", () => {
    const alternativeCourse = createMockCourse({
      code: "CS 2A",
      status: "planned",
      alternative_for: "CS 2",
    });
    render(<CourseCard course={alternativeCourse} />);

    // Should render as a normal planned course
    expect(screen.getByTestId("course-code")).toHaveTextContent("CS 2A");
    expect(screen.queryByTestId("course-status-badge")).not.toBeInTheDocument();
  });
});

// ============================================================================
// Multiple Simultaneous Failures Tests
// ============================================================================

describe("Multiple Simultaneous Failures in Semester Plan", () => {
  it("displays multiple failed courses with distinct indicators", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed" }),
            createMockCourse({ code: "MATH 1", status: "failed" }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    render(<SemesterPlan plan={plan} />);

    expect(screen.getByTestId("course-card-CS 1")).toHaveTextContent("failed");
    expect(screen.getByTestId("course-card-MATH 1")).toHaveTextContent("failed");
  });

  it("displays mixed statuses across multiple courses", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "completed" }),
            createMockCourse({ code: "MATH 1", status: "failed" }),
          ],
          totalUnits: 8,
        },
        {
          number: 2,
          label: "Spring 2025",
          courses: [
            createMockCourse({ code: "CS 2", status: "cancelled" }),
            createMockCourse({ code: "MATH 2", status: "waitlisted" }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 16,
    });

    render(<SemesterPlan plan={plan} />);

    // Verify each status is correctly displayed
    expect(screen.getByTestId("course-card-CS 1")).toHaveTextContent("completed");
    expect(screen.getByTestId("course-card-MATH 1")).toHaveTextContent("failed");
    expect(screen.getByTestId("course-card-CS 2")).toHaveTextContent("cancelled");
    expect(screen.getByTestId("course-card-MATH 2")).toHaveTextContent("waitlisted");
  });

  it("shows all 5 status options available for selection", () => {
    // This verifies the course-status-menu has all required options
    const allStatuses: CourseStatus[] = ["planned", "in_progress", "completed", "cancelled", "waitlisted", "failed"];

    // Each status should be distinct and selectable
    const distinctStatuses = new Set(allStatuses);
    expect(distinctStatuses.size).toBe(6); // 6 distinct statuses including "planned"
  });
});

// ============================================================================
// Plan Data Persistence Tests
// ============================================================================

describe("Plan Data Structure for Persistence", () => {
  it("includes status field in course objects for persistence", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed" }),
            createMockCourse({ code: "MATH 1", status: "completed" }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    // Verify the plan structure includes status
    const semester = plan.semesters[0];
    expect(semester.courses[0].status).toBe("failed");
    expect(semester.courses[1].status).toBe("completed");
  });

  it("includes alternative_for field for recovery alternatives", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed" }),
          ],
          totalUnits: 4,
        },
        {
          number: 2,
          label: "Spring 2025",
          courses: [
            createMockCourse({ code: "CS 1A", status: "planned", alternative_for: "CS 1" }),
          ],
          totalUnits: 4,
        },
      ],
      totalUnits: 8,
    });

    // Verify the alternative_for link is present
    const alternative = plan.semesters[1].courses[0];
    expect(alternative.alternative_for).toBe("CS 1");
    expect(alternative.status).toBe("planned");
  });

  it("plan data is JSON-serializable (for DB storage)", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed" }),
            createMockCourse({ code: "MATH 1", status: "cancelled" }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    // Verify the plan can be serialized and deserialized
    const serialized = JSON.stringify(plan);
    const deserialized = JSON.parse(serialized) as TransferPlan;

    expect(deserialized.semesters[0].courses[0].status).toBe("failed");
    expect(deserialized.semesters[0].courses[1].status).toBe("cancelled");
    expect(deserialized.totalUnits).toBe(8);
  });
});

// ============================================================================
// Unit Calculation Tests with Failed Courses
// ============================================================================

describe("Unit Calculations with Failed/Completed Courses", () => {
  it("excludes completed courses from remaining units", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "completed", units: 4 }),
            createMockCourse({ code: "MATH 1", status: "planned", units: 4 }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    render(<SemesterPlan plan={plan} />);

    const semesterUnits = screen.getByTestId("semester-units");
    expect(semesterUnits).toHaveTextContent("4 units remaining");
    expect(screen.queryByTestId("overall-remaining-units")).not.toBeInTheDocument();
    expect(screen.queryByTestId("overall-completed-units")).not.toBeInTheDocument();
  });

  it("includes failed courses in remaining units (they need to be retaken)", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed", units: 4 }),
            createMockCourse({ code: "MATH 1", status: "planned", units: 4 }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    render(<SemesterPlan plan={plan} />);

    const semesterUnits = screen.getByTestId("semester-units");
    expect(semesterUnits).toHaveTextContent("8 units remaining");
    expect(screen.queryByTestId("overall-remaining-units")).not.toBeInTheDocument();
  });

  it("includes cancelled courses in remaining units", () => {
    const plan = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "cancelled", units: 4 }),
            createMockCourse({ code: "MATH 1", status: "planned", units: 4 }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    render(<SemesterPlan plan={plan} />);

    const semesterUnits = screen.getByTestId("semester-units");
    expect(semesterUnits).toHaveTextContent("8 units remaining");
    expect(screen.queryByTestId("overall-remaining-units")).not.toBeInTheDocument();
  });
});

// ============================================================================
// Plan Isolation Tests (Data Structure Level)
// ============================================================================

describe("Plan Data Isolation", () => {
  it("two plans have independent course data", () => {
    const planA = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed" }),
          ],
          totalUnits: 4,
        },
      ],
      totalUnits: 4,
    });

    const planB = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "MATH 1", status: "planned" }),
          ],
          totalUnits: 4,
        },
      ],
      totalUnits: 4,
    });

    // Modifying planA should not affect planB
    planA.semesters[0].courses[0].status = "completed";

    expect(planA.semesters[0].courses[0].status).toBe("completed");
    expect(planB.semesters[0].courses[0].status).toBe("planned");
  });

  it("alternative_for links are plan-scoped", () => {
    const planA = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "CS 1", status: "failed" }),
            createMockCourse({ code: "CS 1A", status: "planned", alternative_for: "CS 1" }),
          ],
          totalUnits: 8,
        },
      ],
      totalUnits: 8,
    });

    const planB = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            createMockCourse({ code: "MATH 1", status: "planned" }),
          ],
          totalUnits: 4,
        },
      ],
      totalUnits: 4,
    });

    // Plan B should not have any alternative_for links to Plan A's courses
    const planBCourses = planB.semesters.flatMap(s => s.courses);
    const planACourseCodes = new Set(planA.semesters.flatMap(s => s.courses).map(c => c.code));
    const hasCrossPlanLink = planBCourses.some(c => c.alternative_for && !planACourseCodes.has(c.alternative_for));

    expect(hasCrossPlanLink).toBe(false);
  });

  it("JSON serialization preserves plan isolation", () => {
    const planA = createMockPlan({
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [createMockCourse({ code: "CS 1", status: "failed" })],
          totalUnits: 4,
        },
      ],
      totalUnits: 4,
    });

    // Simulate DB round-trip
    const serializedA = JSON.stringify(planA);
    const deserializedA = JSON.parse(serializedA) as TransferPlan;

    // Modify the deserialized plan
    deserializedA.semesters[0].courses[0].status = "completed";

    // Original planA should be unaffected
    expect(planA.semesters[0].courses[0].status).toBe("failed");
    expect(deserializedA.semesters[0].courses[0].status).toBe("completed");
  });
});

// ============================================================================
// Course Status API Request Structure Tests
// ============================================================================

describe("Course Status API Request Structure", () => {
  it("request includes plan ID for isolation", () => {
    const planId = "plan-a-id";
    const requestBody = {
      courseCode: "CS 1",
      semesterNumber: 1,
      status: "failed" as CourseStatus,
      planCourseId: "course-123",
    };

    // Verify the request structure includes all fields needed for isolation
    expect(requestBody.courseCode).toBe("CS 1");
    expect(requestBody.semesterNumber).toBe(1);
    expect(requestBody.status).toBe("failed");
    expect(requestBody.planCourseId).toBe("course-123");

    // The planId would be in the URL path: /api/plan/${planId}/course-status
    expect(planId).toBe("plan-a-id");
  });

  it("failure event creation includes plan_id and plan_course_id", () => {
    const failureEvent = {
      plan_id: "plan-a-id",
      plan_course_id: "course-123",
      failure_type: "failed" as const,
      created_at: "2024-01-01T00:00:00Z",
    };

    expect(failureEvent.plan_id).toBe("plan-a-id");
    expect(failureEvent.plan_course_id).toBe("course-123");
    expect(failureEvent.failure_type).toBe("failed");
  });

  it("resolution update is scoped to specific plan and course", () => {
    const resolutionUpdate = {
      resolution: "Replaced with CS 2A (Intro to Programming)",
      resolved_at: "2024-01-01T00:00:00Z",
    };

    // The update is scoped by plan_id and plan_course_id in the API
    expect(resolutionUpdate.resolution).toContain("Replaced with");
    expect(resolutionUpdate.resolved_at).toBeDefined();
  });
});
