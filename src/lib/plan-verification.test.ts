import { describe, expect, it } from "vitest";

import { sanitizePlanWithArticulation } from "@/lib/plan-verification";
import type { TransferPlan } from "@/types/plan";

describe("sanitizePlanWithArticulation", () => {
  it("drops unverifiable courses and rewrites kept courses to canonical articulation data", () => {
    const plan: TransferPlan = {
      ccName: "De Anza College",
      targetUniversity: "UCLA",
      targetMajor: "Computer Science",
      coveredSchools: [
        {
          name: "UCLA",
          institutionId: null,
          fitScore: 90,
          articulatedUnits: 12,
          totalRequiredUnits: 60,
        },
        {
          name: "UC Berkeley",
          institutionId: null,
          fitScore: 84,
          articulatedUnits: 10,
          totalRequiredUnits: 60,
        },
      ],
      semesters: [
        {
          number: 1,
          label: "Fall 2026",
          totalUnits: 11,
          courses: [
            {
              code: "cs1a",
              title: "Made Up Intro Title",
              units: 99,
            },
            {
              code: "NOTREAL 9",
              title: "Imaginary Course",
              units: 3,
            },
          ],
        },
      ],
      totalUnits: 11,
    };

    const sanitized = sanitizePlanWithArticulation(plan, {
      targets: [
        { id: "ucla-id", label: "UCLA", abbreviation: "UCLA" },
        { id: "ucb-id", label: "UC Berkeley", abbreviation: "UCB" },
      ],
      coursesByCode: new Map([
        [
          "cs1a",
          [
            {
              targetId: "ucla-id",
              ccCourse: {
                id: "cc-1",
                institution_id: "cc-id",
                code: "CS 1A",
                title: "Introduction to Programming",
                units: 4,
                description: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
              universityCourse: {
                id: "ucla-course",
                institution_id: "ucla-id",
                code: "CS 31",
                title: "Intro to CS",
                units: 4,
                description: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
            },
            {
              targetId: "ucb-id",
              ccCourse: {
                id: "cc-1",
                institution_id: "cc-id",
                code: "CS 1A",
                title: "Introduction to Programming",
                units: 4,
                description: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
              universityCourse: {
                id: "ucb-course",
                institution_id: "ucb-id",
                code: "COMPSCI 61A",
                title: "Structure and Interpretation",
                units: 4,
                description: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
            },
          ],
        ],
      ]),
    });

    expect(sanitized.semesters).toHaveLength(1);
    expect(sanitized.semesters[0].courses).toHaveLength(1);
    expect(sanitized.semesters[0].courses[0]).toEqual(
      expect.objectContaining({
        code: "CS 1A",
        title: "Introduction to Programming",
        units: 4,
        transferEquivalency: "UCLA CS 31 / UCB COMPSCI 61A",
      }),
    );
    expect(sanitized.totalUnits).toBe(4);
  });
});
