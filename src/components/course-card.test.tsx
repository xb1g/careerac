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

    expect(screen.getByTestId("course-units")).toHaveTextContent("3 units");
  });

  it("renders transfer equivalency when present", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-equivalency")).toHaveTextContent("UCLA CS 31");
  });

  it("renders prerequisites when present", () => {
    renderCourseCard(mockCourse);

    expect(screen.getByTestId("course-prerequisites")).toHaveTextContent("MATH 101");
  });

  it("does not show status badge for planned courses", () => {
    renderCourseCard(mockCourse);

    expect(screen.queryByTestId("course-status-badge")).not.toBeInTheDocument();
  });

  it("shows completed status with green indicator and checkmark icon", () => {
    renderCourseCard({ ...mockCourse, status: "completed" });

    const badge = screen.getByTestId("course-status-badge");
    expect(badge).toHaveTextContent("completed");
    expect(badge).toHaveTextContent("✓");
  });

  it("shows in-progress status with blue indicator and half-circle icon", () => {
    renderCourseCard({ ...mockCourse, status: "in_progress" });

    const badge = screen.getByTestId("course-status-badge");
    expect(badge).toHaveTextContent("in progress");
    expect(badge).toHaveTextContent("◐");
  });

  it("shows cancelled status with strikethrough and X icon", () => {
    renderCourseCard({ ...mockCourse, status: "cancelled" });

    const badge = screen.getByTestId("course-status-badge");
    expect(badge).toHaveTextContent("cancelled");
    expect(badge).toHaveTextContent("✕");
  });

  it("shows failed status with strikethrough and X icon", () => {
    renderCourseCard({ ...mockCourse, status: "failed" });

    const badge = screen.getByTestId("course-status-badge");
    expect(badge).toHaveTextContent("failed");
    expect(badge).toHaveTextContent("✗");
  });

  it("shows waitlisted status with amber indicator and hourglass icon", () => {
    renderCourseCard({ ...mockCourse, status: "waitlisted" });

    const badge = screen.getByTestId("course-status-badge");
    expect(badge).toHaveTextContent("waitlisted");
    expect(badge).toHaveTextContent("⏳");
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
