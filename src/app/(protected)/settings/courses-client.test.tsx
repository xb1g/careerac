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
  it("keeps compact course actions visible on mobile and hover-gated only on desktop", () => {
    render(<CoursesClient initialCourses={[course]} />);

    const deleteButton = screen.getByRole("button", { name: "Delete MATH 1A" });
    const actionBar = deleteButton.parentElement;

    expect(actionBar).toHaveClass("opacity-100", "lg:opacity-0", "lg:group-hover:opacity-100");
    expect(actionBar).not.toHaveClass("sm:opacity-0");
    expect(deleteButton).toHaveClass("h-10", "w-10", "touch-manipulation", "cursor-pointer");
    expect(deleteButton).not.toHaveTextContent("Delete");
  });
});
