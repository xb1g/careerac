import { describe, it, expect } from "vitest";
import {
  findDependentCourses,
  findCompletedCourses,
  arePrerequisitesSatisfied,
  findEarliestValidSemester,
  analyzeRecovery,
} from "../recovery-analysis";
import type { PlanSemester } from "@/types/plan";

const mockSemesters: PlanSemester[] = [
  {
    number: 1,
    label: "Fall 2024",
    courses: [
      { code: "CS 1", title: "Intro to CS I", units: 4, transferEquivalency: "UCLA CS 31", prerequisites: [], status: "completed" },
      { code: "MATH 1", title: "Calculus I", units: 4, transferEquivalency: "UCLA MATH 31A", prerequisites: [], status: "completed" },
    ],
    totalUnits: 8,
  },
  {
    number: 2,
    label: "Spring 2025",
    courses: [
      { code: "CS 2", title: "Intro to CS II", units: 4, transferEquivalency: "UCLA CS 32", prerequisites: ["CS 1"], status: "planned" },
      { code: "MATH 2", title: "Calculus II", units: 4, transferEquivalency: "UCLA MATH 31B", prerequisites: ["MATH 1"], status: "planned" },
    ],
    totalUnits: 8,
  },
  {
    number: 3,
    label: "Fall 2025",
    courses: [
      { code: "CS 3", title: "Data Structures", units: 4, transferEquivalency: "UCLA CS 33", prerequisites: ["CS 2"], status: "planned" },
      { code: "MATH 3", title: "Linear Algebra", units: 4, transferEquivalency: "UCLA MATH 33A", prerequisites: ["MATH 2"], status: "planned" },
    ],
    totalUnits: 8,
  },
];

describe("findDependentCourses", () => {
  it("finds courses that depend on a failed course", () => {
    const dependents = findDependentCourses("CS 1", mockSemesters);

    expect(dependents).toHaveLength(1);
    expect(dependents[0]).toEqual({
      code: "CS 2",
      title: "Intro to CS II",
      semesterNumber: 2,
      prerequisite: "CS 1",
    });
  });

  it("finds multiple dependent courses", () => {
    const dependents = findDependentCourses("CS 2", mockSemesters);

    expect(dependents).toHaveLength(1);
    expect(dependents[0]).toEqual({
      code: "CS 3",
      title: "Data Structures",
      semesterNumber: 3,
      prerequisite: "CS 2",
    });
  });

  it("returns empty array when no courses depend on the failed course", () => {
    const dependents = findDependentCourses("MATH 3", mockSemesters);
    expect(dependents).toHaveLength(0);
  });

  it("returns empty array for empty semesters", () => {
    const dependents = findDependentCourses("CS 1", []);
    expect(dependents).toHaveLength(0);
  });
});

describe("findCompletedCourses", () => {
  it("finds all completed courses", () => {
    const completed = findCompletedCourses(mockSemesters);

    expect(completed).toHaveLength(2);
    expect(completed.map(c => c.code)).toContain("CS 1");
    expect(completed.map(c => c.code)).toContain("MATH 1");
  });

  it("returns empty array when no courses are completed", () => {
    const plannedSemesters: PlanSemester[] = [
      {
        number: 1,
        label: "Fall 2024",
        courses: [
          { code: "CS 1", title: "Intro to CS", units: 4, status: "planned" },
        ],
        totalUnits: 4,
      },
    ];

    const completed = findCompletedCourses(plannedSemesters);
    expect(completed).toHaveLength(0);
  });
});

describe("arePrerequisitesSatisfied", () => {
  it("returns satisfied when no prerequisites", () => {
    const result = arePrerequisitesSatisfied(
      { prerequisites: [] },
      mockSemesters,
      2,
      new Set(["CS 1"])
    );

    expect(result.satisfied).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it("returns satisfied when prerequisite is in earlier semester", () => {
    const result = arePrerequisitesSatisfied(
      { prerequisites: ["CS 1"] },
      mockSemesters,
      2,
      new Set()
    );

    expect(result.satisfied).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it("returns satisfied when prerequisite is completed", () => {
    const result = arePrerequisitesSatisfied(
      { prerequisites: ["CS 1"] },
      mockSemesters,
      1,
      new Set(["CS 1"])
    );

    expect(result.satisfied).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it("returns missing when prerequisite is not satisfied", () => {
    const result = arePrerequisitesSatisfied(
      { prerequisites: ["CS 2"] },
      mockSemesters,
      2,
      new Set()
    );

    expect(result.satisfied).toBe(false);
    expect(result.missing).toContain("CS 2");
  });

  it("returns multiple missing prerequisites", () => {
    const result = arePrerequisitesSatisfied(
      { prerequisites: ["CS 2", "MATH 3"] },
      mockSemesters,
      2,
      new Set()
    );

    expect(result.satisfied).toBe(false);
    expect(result.missing).toHaveLength(2);
    expect(result.missing).toContain("CS 2");
    expect(result.missing).toContain("MATH 3");
  });
});

describe("findEarliestValidSemester", () => {
  it("returns the failed semester when no prerequisites", () => {
    const semester = findEarliestValidSemester(
      undefined,
      mockSemesters,
      2,
      new Set()
    );

    expect(semester).toBe(2);
  });

  it("returns semester after the latest prerequisite", () => {
    const semester = findEarliestValidSemester(
      ["CS 1"],
      mockSemesters,
      2,
      new Set()
    );

    // CS 1 is in semester 1, so alternative can go in semester 2
    expect(semester).toBe(2);
  });

  it("respects completed courses (no constraint)", () => {
    const semester = findEarliestValidSemester(
      ["CS 1"],
      mockSemesters,
      1,
      new Set(["CS 1"])
    );

    // Since CS 1 is completed, the alternative can go in semester 1
    expect(semester).toBe(1);
  });
});

describe("analyzeRecovery", () => {
  it("returns full recovery analysis with dependents and alternatives", () => {
    const failedCourse = mockSemesters[1].courses[0]; // CS 2

    const analysis = analyzeRecovery(
      { ...failedCourse, status: "failed" },
      2,
      mockSemesters,
      [
        { code: "CS 2A", title: "Intro to Programming", units: 4, transferEquivalency: "UCLA COM SCI 35A", prerequisites: ["CS 1"] },
        { code: "CS 2B", title: "Object-Oriented Programming", units: 4, transferEquivalency: "UCLA COM SCI 35B", prerequisites: ["CS 1"] },
      ]
    );

    expect(analysis.failedCourse.code).toBe("CS 2");
    expect(analysis.failedCourse.status).toBe("failed");
    expect(analysis.dependentCourses).toHaveLength(1);
    expect(analysis.dependentCourses[0].code).toBe("CS 3");
    expect(analysis.alternatives.length).toBeGreaterThan(0);
    expect(analysis.noAlternatives).toBe(false);
  });

  it("returns noAlternatives when no alternatives provided", () => {
    const failedCourse = mockSemesters[1].courses[0];

    const analysis = analyzeRecovery(
      { ...failedCourse, status: "cancelled" },
      2,
      mockSemesters,
      []
    );

    expect(analysis.noAlternatives).toBe(true);
    expect(analysis.alternatives).toHaveLength(0);
  });

  it("excludes completed courses from alternatives", () => {
    const failedCourse = mockSemesters[1].courses[0];

    const analysis = analyzeRecovery(
      { ...failedCourse, status: "failed" },
      2,
      mockSemesters,
      [
        { code: "CS 1", title: "Intro to CS I", units: 4, transferEquivalency: "UCLA CS 31", prerequisites: [] },
        { code: "CS 2A", title: "Intro to Programming", units: 4, transferEquivalency: "UCLA COM SCI 35A", prerequisites: ["CS 1"] },
      ]
    );

    // CS 1 is completed, should be excluded
    const codes = analysis.alternatives.map(a => a.code);
    expect(codes).not.toContain("CS 1");
    expect(codes).toContain("CS 2A");
  });

  it("marks alternatives with unsatisfied prerequisites", () => {
    const failedCourse = mockSemesters[0].courses[0]; // CS 1 (completed)

    // Simulate CS 1 failing even though it's marked as completed for testing
    const semestersWithoutCS1 = mockSemesters.map(s => ({
      ...s,
      courses: s.courses.filter(c => c.code !== "CS 1"),
    }));

    const analysis = analyzeRecovery(
      { ...failedCourse, status: "failed" },
      1,
      semestersWithoutCS1,
      [
        { code: "CS 2A", title: "Intro to Programming", units: 4, transferEquivalency: "UCLA COM SCI 35A", prerequisites: ["MATH 1"] },
        { code: "CS 99", title: "Advanced CS", units: 4, transferEquivalency: "UCLA CS 100", prerequisites: ["CS 999"] },
      ]
    );

    const cs2a = analysis.alternatives.find(a => a.code === "CS 2A");
    expect(cs2a).toBeDefined();
    expect(cs2a?.prerequisitesSatisfied).toBe(true); // MATH 1 is in semester 1

    const cs99 = analysis.alternatives.find(a => a.code === "CS 99");
    expect(cs99).toBeDefined();
    expect(cs99?.prerequisitesSatisfied).toBe(false); // CS 999 doesn't exist
  });

  it("handles waitlisted status correctly", () => {
    const failedCourse = mockSemesters[1].courses[0];

    const analysis = analyzeRecovery(
      { ...failedCourse, status: "waitlisted" },
      2,
      mockSemesters,
      []
    );

    expect(analysis.failedCourse.status).toBe("waitlisted");
  });
});
