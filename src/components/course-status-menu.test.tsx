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

  it("renders all 5 status options", () => {
    render(<CourseStatusMenu {...defaultProps} />);

    const menu = screen.getByTestId("course-status-menu");
    expect(menu).toBeInTheDocument();

    // Check all 5 options are present
    expect(screen.getByTestId("status-option-completed")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-in_progress")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-cancelled")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-waitlisted")).toBeInTheDocument();
    expect(screen.getByTestId("status-option-failed")).toBeInTheDocument();
  });

  it("shows labels for all status options", () => {
    render(<CourseStatusMenu {...defaultProps} />);

    expect(screen.getByTestId("status-label-completed")).toHaveTextContent("Completed");
    expect(screen.getByTestId("status-label-in_progress")).toHaveTextContent("In Progress");
    expect(screen.getByTestId("status-label-cancelled")).toHaveTextContent("Cancelled");
    expect(screen.getByTestId("status-label-waitlisted")).toHaveTextContent("Waitlisted");
    expect(screen.getByTestId("status-label-failed")).toHaveTextContent("Failed");
  });

  it("shows unique icons for each status (non-color cues)", () => {
    render(<CourseStatusMenu {...defaultProps} />);

    const icons = COURSE_STATUS_OPTIONS.map((option) => option.icon);
    const uniqueIcons = new Set(icons);

    // All icons should be unique
    expect(uniqueIcons.size).toBe(icons.length);
  });

  it("highlights the currently selected status", () => {
    render(<CourseStatusMenu {...defaultProps} currentStatus="completed" />);

    const completedButton = screen.getByTestId("status-option-completed");
    expect(completedButton).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSelect and onClose when a status is selected", () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    render(
      <CourseStatusMenu
        {...defaultProps}
        onSelect={handleSelect}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByTestId("status-option-completed"));

    expect(handleSelect).toHaveBeenCalledWith("completed");
    expect(handleClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    render(<CourseStatusMenu {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("course-status-menu")).not.toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();

    render(<CourseStatusMenu {...defaultProps} onClose={handleClose} />);

    // Find the backdrop button
    const backdrop = screen.getByRole("button", { name: "Close status menu" });
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalled();
  });

  it("renders with dialog role for accessibility", () => {
    render(<CourseStatusMenu {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Course status menu");
  });
});

describe("COURSE_STATUS_OPTIONS", () => {
  it("has exactly 5 status options", () => {
    expect(COURSE_STATUS_OPTIONS).toHaveLength(5);
  });

  it("includes all required statuses", () => {
    const values = COURSE_STATUS_OPTIONS.map((opt) => opt.value);

    expect(values).toContain("completed");
    expect(values).toContain("in_progress");
    expect(values).toContain("cancelled");
    expect(values).toContain("waitlisted");
    expect(values).toContain("failed");
  });

  it("has distinct colors for each status", () => {
    const colors = COURSE_STATUS_OPTIONS.map((opt) => opt.color);
    const uniqueColors = new Set(colors);

    // All colors should be unique
    expect(uniqueColors.size).toBe(colors.length);
  });

  it("has descriptions for each status", () => {
    COURSE_STATUS_OPTIONS.forEach((option) => {
      expect(option.description).toBeTruthy();
      expect(option.description.length).toBeGreaterThan(0);
    });
  });
});
