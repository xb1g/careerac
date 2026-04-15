import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCard from "./course-card";
import { PlanCourse } from "@/types/plan";

const mockCourse: PlanCourse = {
  code: "CS 101",
  title: "Introduction to Computer Science",
  units: 3,
  transferEquivalency: "UCLA CS 31",
  prerequisites: ["MATH 101"],
};

function renderCourseCard(course: PlanCourse, onClick?: () => void) {
  return render(
    <CourseCard
      course={course}
      onClick={onClick ? () => onClick() : undefined}
    />
  );
}

describe("CourseCard", () => {
  it("renders course code and title", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-code")).toHaveTextContent("CS 101");
    expect(screen.getByTestId("course-title")).toHaveTextContent("Introduction to Computer Science");
  });

  it("renders course units", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-units")).toHaveTextContent("3 Units");
  });

  it("renders transfer equivalency when present", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-equivalency")).toHaveTextContent("UCLA CS 31");
  });

  it("renders prerequisites when present", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-prerequisites")).toHaveTextContent("MATH 101");
  });

  it("does not show status text for planned courses", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-card-CS 101")).not.toHaveTextContent(/completed|in progress|cancelled|failed|waitlisted/);
  });

  it("shows completed status text", () => {
    renderCourseCard({ ...mockCourse, status: "completed" });

    expect(screen.getByTestId("course-card-CS 101")).toHaveTextContent("completed");
  });

  it("shows in-progress status text", () => {
    renderCourseCard({ ...mockCourse, status: "in_progress" });

    expect(screen.getByTestId("course-card-CS 101")).toHaveTextContent("in progress");
  });

  it("shows cancelled status text", () => {
    renderCourseCard({ ...mockCourse, status: "cancelled" });

    expect(screen.getByTestId("course-card-CS 101")).toHaveTextContent("cancelled");
  });

  it("shows failed status text", () => {
    renderCourseCard({ ...mockCourse, status: "failed" });

    expect(screen.getByTestId("course-card-CS 101")).toHaveTextContent("failed");
  });

  it("shows waitlisted status text", () => {
    renderCourseCard({ ...mockCourse, status: "waitlisted" });

    expect(screen.getByTestId("course-card-CS 101")).toHaveTextContent("waitlisted");
  });

  it("is clickable when onClick is provided", () => {
    const handleClick = vi.fn();
    renderCourseCard(mockCourse, handleClick);

    const card = screen.getByTestId("course-card-CS 101");
    expect(card).toHaveAttribute("role", "button");
    expect(card).toHaveAttribute("tabindex", "0");

    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalled();
  });

  it("is not interactive when onClick is not provided", () => {
    renderCourseCard(mockCourse);

    const card = screen.getByTestId("course-card-CS 101");
    expect(card).toHaveAttribute("role", "article");
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("handles keyboard navigation when interactive", () => {
    const handleClick = vi.fn();
    renderCourseCard(mockCourse, handleClick);

    const card = screen.getByTestId("course-card-CS 101");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleClick).toHaveBeenCalled();
  });
});
