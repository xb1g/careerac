import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import SemesterPlan from "./semester-plan";
import { TransferPlan, ParsedPlan } from "@/types/plan";

const mockPlan: TransferPlan = {
  ccName: "Santa Monica College",
  targetUniversity: "UCLA",
  targetMajor: "Computer Science",
  totalUnits: 21,
  semesters: [
    {
      number: 1,
      label: "Fall 2024",
      totalUnits: 10,
      courses: [
        { code: "CS 101", title: "Intro to CS", units: 3 },
        { code: "MATH 101", title: "Calculus I", units: 4 },
        { code: "ENG 101", title: "English Composition", units: 3 },
      ],
    },
    {
      number: 2,
      label: "Spring 2025",
      totalUnits: 11,
      courses: [
        { code: "CS 102", title: "Data Structures", units: 4 },
        { code: "MATH 102", title: "Calculus II", units: 4 },
        { code: "PHYS 101", title: "Physics I", units: 3 },
      ],
    },
  ],
};

function renderSemesterPlan(plan: ParsedPlan, onCourseClick?: Mock) {
  return render(
    <SemesterPlan
      plan={plan}
      onCourseClick={onCourseClick as never}
    />
  );
}

describe("SemesterPlan", () => {
  it("renders the semester grid with courses", () => {
    renderSemesterPlan(mockPlan);

    expect(screen.getByTestId("semester-grid")).toBeInTheDocument();
    // Use getAllByTestId since there are multiple courses
    const courseCodes = screen.getAllByTestId("course-code");
    expect(courseCodes).toHaveLength(6);
    expect(courseCodes[0]).toHaveTextContent("CS 101");
  });

  it("shows total units in header", () => {
    renderSemesterPlan(mockPlan);

    expect(screen.getByTestId("overall-total-units")).toHaveTextContent("21 total");
  });

  it("shows remaining units equal to total when no courses are completed", () => {
    renderSemesterPlan(mockPlan);

    expect(screen.getByTestId("overall-remaining-units")).toHaveTextContent("21");
  });

  it("decreases remaining units when a course is marked as completed", () => {
    const planWithCompleted: TransferPlan = {
      ...mockPlan,
      semesters: mockPlan.semesters.map((semester) => ({
        ...semester,
        courses: semester.courses.map((course) =>
          course.code === "CS 101" ? { ...course, status: "completed" as const } : course
        ),
      })),
    };

    renderSemesterPlan(planWithCompleted);

    // CS 101 is 3 units, so remaining should be 21 - 3 = 18
    expect(screen.getByTestId("overall-remaining-units")).toHaveTextContent("18");
    expect(screen.getByTestId("overall-completed-units")).toHaveTextContent("3 completed");
  });

  it("shows semester units excluding completed courses", () => {
    const planWithCompleted: TransferPlan = {
      ...mockPlan,
      semesters: mockPlan.semesters.map((semester) => ({
        ...semester,
        courses: semester.courses.map((course) =>
          course.code === "CS 101" ? { ...course, status: "completed" as const } : course
        ),
      })),
    };

    renderSemesterPlan(planWithCompleted);

    // Fall 2024: CS 101 (3 units, completed) + MATH 101 (4) + ENG 101 (3) = 7 remaining
    const semesterUnits = screen.getAllByTestId("semester-units");
    expect(semesterUnits[0]).toHaveTextContent("7 units remaining");
  });

  it("does not show completed units when nothing is completed", () => {
    renderSemesterPlan(mockPlan);

    expect(screen.queryByTestId("overall-completed-units")).not.toBeInTheDocument();
  });

  it("calls onCourseClick when a course is clicked", () => {
    const handleClick = vi.fn();
    renderSemesterPlan(mockPlan, handleClick);

    const courseCard = screen.getByTestId("course-card-CS 101");
    courseCard.click();

    expect(handleClick).toHaveBeenCalled();
  });

  it("renders courses with their status badges", () => {
    const planWithStatuses: TransferPlan = {
      ...mockPlan,
      semesters: mockPlan.semesters.map((semester) => ({
        ...semester,
        courses: semester.courses.map((course) => {
          if (course.code === "CS 101") return { ...course, status: "completed" as const };
          if (course.code === "MATH 101") return { ...course, status: "in_progress" as const };
          return course;
        }),
      })),
    };

    renderSemesterPlan(planWithStatuses);

    const badges = screen.getAllByTestId("course-status-badge");
    expect(badges).toHaveLength(2);
  });
});

describe("SemesterPlan with NoDataResponse", () => {
  it("renders no data message for no-data responses", () => {
    const noDataPlan: ParsedPlan = {
      isNoData: true,
      message: "No articulation data found for this combination.",
    };

    renderSemesterPlan(noDataPlan);

    expect(screen.getByTestId("no-data-message")).toBeInTheDocument();
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
    expect(screen.getByText("No articulation data found for this combination.")).toBeInTheDocument();
  });
});
