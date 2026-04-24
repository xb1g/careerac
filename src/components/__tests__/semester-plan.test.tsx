import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SemesterPlan from "@/components/semester-plan";
import type { ParsedPlan } from "@/types/plan";

const mockTransferPlan: ParsedPlan = {
  ccName: "Santa Monica College",
  targetUniversity: "UCLA",
  targetMajor: "Computer Science",
  semesters: [
    {
      number: 1,
      label: "Fall 2024",
      courses: [
        {
          code: "CS 1",
          title: "Introduction to Computer Science I",
          units: 4,
          transferEquivalency: "UCLA CS 31",
        },
        {
          code: "MATH 1",
          title: "Calculus I",
          units: 5,
          transferEquivalency: "UCLA MATH 31A",
        },
      ],
      totalUnits: 9,
    },
    {
      number: 2,
      label: "Spring 2025",
      courses: [
        {
          code: "CS 2",
          title: "Data Structures",
          units: 4,
          transferEquivalency: "UCLA CS 32",
          prerequisites: ["CS 1"],
        },
      ],
      totalUnits: 4,
    },
  ],
  totalUnits: 13,
};

const mockNoDataPlan: ParsedPlan = {
  isNoData: true,
  message: "No articulation data found for this path. Please try a different combination.",
};

const mockMultiSchoolPlan: ParsedPlan = {
  ccName: "Santa Monica College",
  targetUniversity: "UCLA",
  targetMajor: "Computer Science",
  coveredSchools: [
    { name: "UCLA", institutionId: null, fitScore: 90, articulatedUnits: 40, totalRequiredUnits: 60 },
    { name: "UC Berkeley", institutionId: null, fitScore: 82, articulatedUnits: 38, totalRequiredUnits: 60 },
    { name: "UC San Diego", institutionId: null, fitScore: 75, articulatedUnits: 34, totalRequiredUnits: 60 },
  ],
  semesters: [
    {
      number: 1,
      label: "Fall 2026",
      courses: [
        { code: "CS 1", title: "Intro to CS", units: 4 },
        { code: "CS 17", title: "Discrete", units: 3, requiredBy: ["UCLA"] },
      ],
      totalUnits: 7,
    },
  ],
  totalUnits: 7,
};

describe("SemesterPlan", () => {
  describe("transfer plan rendering", () => {
    it("displays overall total units", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      expect(screen.queryByTestId("overall-total-units")).not.toBeInTheDocument();
    });

    it("renders semester grid with all semesters", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      expect(screen.getByTestId("semester-grid")).toBeInTheDocument();
      const semesterLabels = screen.getAllByTestId("semester-label");
      expect(semesterLabels).toHaveLength(2);
      expect(semesterLabels[0]).toHaveTextContent("Fall 2024");
      expect(semesterLabels[1]).toHaveTextContent("Spring 2025");
    });

    it("renders a right-edge overflow fade overlay", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);
      expect(screen.getByTestId("semester-grid-overflow-fade")).toBeInTheDocument();
    });

    it("displays per-semester unit totals", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      const semesterUnits = screen.getAllByTestId("semester-units");
    expect(semesterUnits[0]).toHaveTextContent("9 units remaining");
    expect(semesterUnits[1]).toHaveTextContent("4 units remaining");
    });

    it("renders course cards with code, title, units", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      const courseCodes = screen.getAllByTestId("course-code");
      expect(courseCodes.some((el) => el.textContent === "CS 1")).toBe(true);
      expect(courseCodes.some((el) => el.textContent === "MATH 1")).toBe(true);
      expect(courseCodes.some((el) => el.textContent === "CS 2")).toBe(true);
      
      const courseTitles = screen.getAllByTestId("course-title");
      expect(courseTitles.some((el) => el.textContent?.includes("Introduction to Computer Science"))).toBe(true);
    });

    it("displays transfer equivalency when available", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      const equivalencies = screen.getAllByTestId("course-equivalency");
      expect(equivalencies.some((el) => el.textContent?.includes("UCLA CS 31"))).toBe(true);
    });

    it("displays prerequisites when available", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      const prereqElements = screen.getAllByTestId("course-prerequisites");
      expect(prereqElements.length).toBeGreaterThan(0);
    expect(prereqElements[0]).toHaveTextContent("Prereqs: CS 1");
    });
  });

  describe("no-data rendering", () => {
    it("shows no-data message when isNoData is true", () => {
      render(<SemesterPlan plan={mockNoDataPlan} />);

      expect(screen.getByTestId("no-data-message")).toBeInTheDocument();
      expect(screen.getByText("No Data Found")).toBeInTheDocument();
      expect(screen.getByText(/No articulation data found/)).toBeInTheDocument();
    });

    it("does not show semester grid for no-data response", () => {
      render(<SemesterPlan plan={mockNoDataPlan} />);

      expect(screen.queryByTestId("semester-grid")).not.toBeInTheDocument();
    });
  });

  describe("multi-school rendering", () => {
    it("does not show the asterisk legend when some courses are school-specific", () => {
      render(<SemesterPlan plan={mockMultiSchoolPlan} />);
      expect(screen.queryByTestId("asterisk-legend")).not.toBeInTheDocument();
    });

    it("renders an asterisk next to school-specific course codes", () => {
      render(<SemesterPlan plan={mockMultiSchoolPlan} />);
      expect(screen.getByTestId("course-required-by-asterisk")).toBeInTheDocument();
    });
  });

  describe("unit consistency", () => {
    it("semester total matches sum of course units", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      // Fall 2024: CS 1 (4) + MATH 1 (5) = 9
      const semesterUnits = screen.getAllByTestId("semester-units");
    expect(semesterUnits[0]).toHaveTextContent("9 units remaining");
    });

    it("overall total matches sum of semester totals", () => {
      render(<SemesterPlan plan={mockTransferPlan} />);

      expect(screen.queryByTestId("overall-total-units")).not.toBeInTheDocument();
    });
  });
});
