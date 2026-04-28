import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PreviousCoursesPanel from "@/components/previous-courses-panel";
import type { TranscriptCourse } from "@/types/transcript";

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

const completed = (code: string, title: string, units: number, grade: string, semester: string): TranscriptCourse => ({
  code, title, units, grade, status: "completed" as const, semester,
});

describe("PreviousCoursesPanel", () => {
  const baseProps = {
    transcriptId: "transcript-1",
    courses: [] as TranscriptCourse[],
    isCollapsed: false,
    onToggleCollapse: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", mockLocalStorage);
  });

  it("shows empty state when no courses", () => {
    render(<PreviousCoursesPanel {...baseProps} />);
    expect(screen.getByText(/No completed courses yet/i)).toBeInTheDocument();
  });

  it("groups courses by semester", () => {
    const courses = [
      completed("ENG 1A", "English Comp", 3, "A", "Fall 2024"),
      completed("MATH 1A", "Calculus I", 4, "B+", "Fall 2024"),
      completed("CS 1A", "Intro to CS", 4, "A-", "Spring 2025"),
    ];
    render(<PreviousCoursesPanel {...baseProps} courses={courses} />);
    expect(screen.getByText("Fall 2024")).toBeInTheDocument();
    expect(screen.getByText("Spring 2025")).toBeInTheDocument();
    expect(screen.getByText("ENG 1A")).toBeInTheDocument();
    expect(screen.getByText("CS 1A")).toBeInTheDocument();
  });

  it("uses Unknown Semester for courses without semester field", () => {
    const courses = [
      { code: "CHEM 1A", title: "Chemistry", units: 4, grade: "B", status: "completed" as const, semester: "" },
    ] as TranscriptCourse[];
    render(<PreviousCoursesPanel {...baseProps} courses={courses} />);
    expect(screen.getByText("Unknown Semester")).toBeInTheDocument();
  });

  it("calls onToggleCollapse when collapse button clicked", () => {
    render(<PreviousCoursesPanel {...baseProps} />);
    fireEvent.click(screen.getByLabelText("Collapse previous courses"));
    expect(baseProps.onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it("opens add course modal when Add Course button clicked", () => {
    render(<PreviousCoursesPanel {...baseProps} courses={[]} />);
    fireEvent.click(screen.getByText("Add Course"));
    expect(screen.getByLabelText("Add course")).toBeInTheDocument();
  });

  it("shows confirmation dialog when trash icon clicked", () => {
    const courses = [completed("MATH 1A", "Calculus", 4, "A", "Fall 2024")];
    const { container } = render(<PreviousCoursesPanel {...baseProps} courses={courses} />);
    const trashButton = screen.getByLabelText("Remove MATH 1A");
    fireEvent.click(trashButton);
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("filters courses by search query", async () => {
    const courses = [
      completed("ENG 1A", "English Composition", 3, "A", "Fall 2024"),
      completed("MATH 1A", "Calculus I", 4, "B+", "Fall 2024"),
    ];
    render(<PreviousCoursesPanel {...baseProps} courses={courses} />);
    const searchInput = screen.getByPlaceholderText("Search courses...");
    fireEvent.change(searchInput, { target: { value: "math" } });
    await new Promise(r => setTimeout(r, 400));
    expect(screen.getByText("MATH 1A")).toBeInTheDocument();
    expect(screen.queryByText("ENG 1A")).not.toBeInTheDocument();
  });

  it("shows empty state when search has no matches", async () => {
    const courses = [completed("ENG 1A", "English", 3, "A", "Fall 2024")];
    render(<PreviousCoursesPanel {...baseProps} courses={courses} />);
    const searchInput = screen.getByPlaceholderText("Search courses...");
    fireEvent.change(searchInput, { target: { value: "xyz" } });
    await new Promise(r => setTimeout(r, 400));
    expect(screen.getByText("No courses match your search")).toBeInTheDocument();
  });

  it("displays GPA in header when courses exist", () => {
    const courses = [
      completed("ENG 1A", "English", 3, "A", "Fall 2024"),
      completed("MATH 1A", "Calculus", 4, "B+", "Fall 2024"),
    ];
    render(<PreviousCoursesPanel {...baseProps} courses={courses} />);
    expect(screen.getByText(/GPA:/)).toBeInTheDocument();
  });
});
