import { render, screen } from "@testing-library/react";
import CoursesClient from "./courses-client";

const course = {
  id: "course-1",
  course_code: "MATH 1A",
  course_title: "Calculus",
  units: 4,
  grade: "A",
  term: "Fall 2025",
  status: "completed" as const,
  notes: null,
};

describe("CoursesClient", () => {
  it("renders a larger labeled delete control for mobile course cards", () => {
    render(<CoursesClient initialCourses={[course]} />);

    const deleteButton = screen.getByRole("button", { name: "Delete MATH 1A" });

    expect(deleteButton).toHaveClass("h-11", "touch-manipulation", "cursor-pointer", "bg-red-50");
    expect(deleteButton).toHaveTextContent("Delete");
  });
});
