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
    expect(screen.getByTestId("course-units")).toHaveTextContent("4 Units");
  });

  it("renders singular unit when units is 1", () => {
    render(<CourseCard course={{ ...baseCourse, units: 1 }} />);
    expect(screen.getByTestId("course-units")).toHaveTextContent("1 Unit");
  });

  it("renders transfer equivalency when provided", () => {
    const course: PlanCourse = {
      ...baseCourse,
      transferEquivalency: "UCLA CS 31",
    };
    render(<CourseCard course={course} />);
    expect(screen.getByTestId("course-equivalency")).toHaveTextContent(
      "Transfers as: UCLA CS 31"
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
      "Prereqs: MATH 1, ENGL 1"
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

  describe("requiredBy asterisk", () => {
    it("renders an asterisk when requiredBy is a proper subset of covered schools", () => {
      const course: PlanCourse = { ...baseCourse, requiredBy: ["UCLA"] };
      render(<CourseCard course={course} coveredSchoolCount={3} />);
      const asterisk = screen.getByTestId("course-required-by-asterisk");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveAttribute("title", expect.stringContaining("UCLA"));
    });

    it("does not render an asterisk when requiredBy covers every school", () => {
      const course: PlanCourse = { ...baseCourse, requiredBy: ["UCLA", "UC Berkeley", "UC San Diego"] };
      render(<CourseCard course={course} coveredSchoolCount={3} />);
      expect(screen.queryByTestId("course-required-by-asterisk")).not.toBeInTheDocument();
    });

    it("does not render an asterisk when coveredSchoolCount <= 1", () => {
      const course: PlanCourse = { ...baseCourse, requiredBy: ["UCLA"] };
      render(<CourseCard course={course} coveredSchoolCount={1} />);
      expect(screen.queryByTestId("course-required-by-asterisk")).not.toBeInTheDocument();
    });

    it("does not render an asterisk when requiredBy is omitted", () => {
      render(<CourseCard course={baseCourse} coveredSchoolCount={3} />);
      expect(screen.queryByTestId("course-required-by-asterisk")).not.toBeInTheDocument();
    });
  });
});
