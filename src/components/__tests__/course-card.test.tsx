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
    expect(screen.getByTestId("course-units")).toHaveTextContent("4u");
  });

  it("renders singular unit", () => {
    render(<CourseCard course={{ ...baseCourse, units: 1 }} />);
    expect(screen.getByTestId("course-units")).toHaveTextContent("1u");
  });

  it("renders transfer equivalency when provided", () => {
    const course: PlanCourse = {
      ...baseCourse,
      transferEquivalency: "UCLA CS 31",
    };
    render(<CourseCard course={course} />);
    expect(screen.getByTestId("course-equivalency")).toHaveTextContent(
      "→ UCLA CS 31"
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
      "Prereq: MATH 1, ENGL 1"
    );
  });

  it("does not render prerequisites when not provided", () => {
    render(<CourseCard course={baseCourse} />);
    expect(screen.queryByTestId("course-prerequisites")).not.toBeInTheDocument();
  });

  describe("requiredBy pills", () => {
    it("renders school-name pills when requiredBy is a proper subset of covered schools", () => {
      const course: PlanCourse = { ...baseCourse, requiredBy: ["UCLA", "UCSD"] };
      render(<CourseCard course={course} coveredSchoolCount={3} />);
      const pills = screen.getByTestId("course-required-by-pills");
      expect(pills).toBeInTheDocument();
      expect(pills).toHaveTextContent("UCLA");
      expect(pills).toHaveTextContent("UCSD");
    });

    it("does not render pills when requiredBy covers every school", () => {
      const course: PlanCourse = { ...baseCourse, requiredBy: ["UCLA", "UC Berkeley", "UC San Diego"] };
      render(<CourseCard course={course} coveredSchoolCount={3} />);
      expect(screen.queryByTestId("course-required-by-pills")).not.toBeInTheDocument();
    });

    it("does not render pills when coveredSchoolCount <= 1", () => {
      const course: PlanCourse = { ...baseCourse, requiredBy: ["UCLA"] };
      render(<CourseCard course={course} coveredSchoolCount={1} />);
      expect(screen.queryByTestId("course-required-by-pills")).not.toBeInTheDocument();
    });

    it("does not render pills when requiredBy is omitted", () => {
      render(<CourseCard course={baseCourse} coveredSchoolCount={3} />);
      expect(screen.queryByTestId("course-required-by-pills")).not.toBeInTheDocument();
    });
  });
});
