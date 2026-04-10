import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseCard from "@/components/course-card";
import type { PlanCourse } from "@/types/plan";

describe("CourseCard", () => {
  const baseCourse: PlanCourse = {
    code: "CS 1",
    title: "Introduction to Computer Science I",
    units: 4,
  };

  it("renders course code", () => {
    render(<CourseCard course={baseCourse} />);
    expect(screen.getByTestId("course-code")).toHaveTextContent("CS 1");
  });

  it("renders course title", () => {
    render(<CourseCard course={baseCourse} />);
    expect(screen.getByTestId("course-title")).toHaveTextContent(
      "Introduction to Computer Science I"
    );
  });

  it("renders course units", () => {
    render(<CourseCard course={baseCourse} />);
    expect(screen.getByTestId("course-units")).toHaveTextContent("4 units");
  });

  it("renders singular unit when units is 1", () => {
    render(<CourseCard course={{ ...baseCourse, units: 1 }} />);
    expect(screen.getByTestId("course-units")).toHaveTextContent("1 unit");
  });

  it("renders transfer equivalency when provided", () => {
    const course: PlanCourse = {
      ...baseCourse,
      transferEquivalency: "UCLA CS 31",
    };
    render(<CourseCard course={course} />);
    expect(screen.getByTestId("course-equivalency")).toHaveTextContent(
      "Transfer to: UCLA CS 31"
    );
  });

  it("does not render transfer equivalency when not provided", () => {
    render(<CourseCard course={baseCourse} />);
    expect(screen.queryByTestId("course-equivalency")).not.toBeInTheDocument();
  });

  it("renders prerequisites when provided", () => {
    const course: PlanCourse = {
      ...baseCourse,
      prerequisites: ["MATH 1", "ENGL 1"],
    };
    render(<CourseCard course={course} />);
    expect(screen.getByTestId("course-prerequisites")).toHaveTextContent(
      "Prerequisites: MATH 1, ENGL 1"
    );
  });

  it("does not render prerequisites when not provided", () => {
    render(<CourseCard course={baseCourse} />);
    expect(screen.queryByTestId("course-prerequisites")).not.toBeInTheDocument();
  });

  it("renders notes when provided", () => {
    const course: PlanCourse = {
      ...baseCourse,
      notes: "Offered Fall and Spring only",
    };
    render(<CourseCard course={course} />);
    expect(screen.getByText("Offered Fall and Spring only")).toBeInTheDocument();
  });

  it("does not render notes when not provided", () => {
    const { container } = render(<CourseCard course={baseCourse} />);
    // The notes paragraph shouldn't exist
    expect(container.textContent).not.toContain("Offered Fall and Spring only");
  });
});
