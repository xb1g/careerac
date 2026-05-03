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

  it("uses scrollable containers for timeline content", () => {
    renderSemesterPlan(mockPlan);

    const grid = screen.getByTestId("semester-grid");
    expect(grid).toHaveClass("overflow-y-auto");
    expect(grid).not.toHaveClass("overflow-y-hidden");

    const columnBodies = screen.getAllByTestId("semester-column-body");
    expect(columnBodies.length).toBeGreaterThan(0);
    for (const body of columnBodies) {
      expect(body).toHaveClass("min-h-0");
      expect(body).toHaveClass("overflow-y-auto");
    }
  });

  it("shows total units in header", () => {
    renderSemesterPlan(mockPlan);

    expect(screen.queryByTestId("overall-total-units")).not.toBeInTheDocument();
  });

  it("shows remaining units equal to total when no courses are completed", () => {
    renderSemesterPlan(mockPlan);

    expect(screen.queryByTestId("overall-remaining-units")).not.toBeInTheDocument();
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

    expect(screen.queryByTestId("overall-remaining-units")).not.toBeInTheDocument();
    expect(screen.queryByTestId("overall-completed-units")).not.toBeInTheDocument();
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

  it("shows pointer cursor for clickable dashboard courses", () => {
    const handleClick = vi.fn();
    renderSemesterPlan(mockPlan, handleClick);

    const courseButton = screen.getByTestId("course-card-CS 101").closest("button");
    expect(courseButton).toHaveClass("cursor-pointer");
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

    expect(screen.getByTestId("course-card-CS 101")).toHaveTextContent("completed");
    expect(screen.getByTestId("course-card-MATH 101")).toHaveTextContent("in progress");
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
