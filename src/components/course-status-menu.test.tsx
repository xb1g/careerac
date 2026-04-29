import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseStatusMenu, { COURSE_STATUS_OPTIONS } from "./course-status-menu";

describe("CourseStatusMenu", () => {
  const defaultProps = {
    currentStatus: "planned" as const,
    onSelect: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
  };

  it("renders all 6 status options", () => {
    render(<CourseStatusMenu {...defaultProps} />);
    expect(screen.getByTestId("course-status-menu")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-planned")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-completed")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-in_progress")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-cancelled")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-waitlisted")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-failed")).toBeInTheDocument();
  });

  it("highlights the currently selected status", () => {
    render(<CourseStatusMenu {...defaultProps} currentStatus="completed" />);
    expect(screen.getByTestId("status-option-completed")).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelect and onClose when a status is selected", () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();
    render(<CourseStatusMenu {...defaultProps} onSelect={handleSelect} onClose={handleClose} />);
    fireEvent.click(screen.getByTestId("status-option-completed"));
    expect(handleSelect).toHaveBeenCalledWith("completed");
    expect(handleClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    render(<CourseStatusMenu {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("course-status-menu")).not.toBeInTheDocument();
  });
});

describe("COURSE_STATUS_OPTIONS", () => {
  it("has 6 status options", () => {
    expect(COURSE_STATUS_OPTIONS).toHaveLength(6);
  });

  it("includes all required statuses", () => {
    const values = COURSE_STATUS_OPTIONS.map((opt) => opt.value);
    expect(values).toContain("planned");
    expect(values).toContain("completed");
    expect(values).toContain("in_progress");
    expect(values).toContain("cancelled");
    expect(values).toContain("waitlisted");
    expect(values).toContain("failed");
  });
});
