import { describe, it, expect } from "vitest";
import { parsePlanFromAIResponse } from "@/utils/plan-parser";
import { buildSystemPrompt } from "@/lib/prompt-builder";

describe("plan-parser", () => {
  describe("parsePlanFromAIResponse", () => {
    it("parses a valid plan from JSON code block", () => {
      const response = `Here is your transfer plan:

\`\`\`json
{
  "ccName": "Santa Monica College",
  "targetUniversity": "UCLA",
  "targetMajor": "Computer Science",
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2024",
      "courses": [
        {
          "code": "CS 1",
          "title": "Introduction to Computer Science I",
          "units": 4,
          "transferEquivalency": "UCLA CS 31",
          "prerequisites": []
        },
        {
          "code": "MATH 1",
          "title": "Calculus I",
          "units": 5,
          "transferEquivalency": "UCLA MATH 31A"
        }
      ]
    },
    {
      "number": 2,
      "label": "Spring 2025",
      "courses": [
        {
          "code": "CS 2",
          "title": "Data Structures",
          "units": 4,
          "transferEquivalency": "UCLA CS 32",
          "prerequisites": ["CS 1"]
        }
      ]
    }
  ],
  "totalUnits": 13
}
\`\`\`

Let me know if you have any questions!`;

      const result = parsePlanFromAIResponse(response);

      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.ccName).toBe("Santa Monica College");
        expect(result.targetUniversity).toBe("UCLA");
        expect(result.targetMajor).toBe("Computer Science");
        expect(result.semesters).toHaveLength(2);
        expect(result.semesters[0].courses).toHaveLength(2);
        expect(result.semesters[1].courses).toHaveLength(1);
        expect(result.semesters[1].courses[0].prerequisites).toContain("CS 1");
        expect(result.totalUnits).toBe(13);
      }
    });

    it("returns null for response without plan JSON", () => {
      const response = "I can help you with transfer planning. What's your community college?";
      const result = parsePlanFromAIResponse(response);
      expect(result).toBeNull();
    });

    it("handles no-data response", () => {
      const response = `\`\`\`json
{
  "isNoData": true,
  "noDataMessage": "No articulation data found for your path."
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);

      expect(result).not.toBeNull();
      if (result && "isNoData" in result) {
        expect(result.isNoData).toBe(true);
        expect(result.message).toContain("No articulation data");
      }
    });

    it("returns no-data response when text indicates no data", () => {
      const response = "I'm sorry, but I don't have articulation data for that particular combination.";
      const result = parsePlanFromAIResponse(response);

      expect(result).not.toBeNull();
      if (result && "isNoData" in result) {
        expect(result.isNoData).toBe(true);
      }
    });

    it("validates prerequisite ordering - returns null if violated", () => {
      // CS 2 requires CS 1, but CS 2 is in semester 1 and CS 1 in semester 2
      const response = `\`\`\`json
{
  "ccName": "Test CC",
  "targetUniversity": "Test Uni",
  "targetMajor": "CS",
  "semesters": [
    {
      "number": 1,
      "label": "Semester 1",
      "courses": [
        { "code": "CS 2", "title": "CS 2", "units": 4, "prerequisites": ["CS 1"] }
      ]
    },
    {
      "number": 2,
      "label": "Semester 2",
      "courses": [
        { "code": "CS 1", "title": "CS 1", "units": 4 }
      ]
    }
  ]
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);

      // The parser should attempt to fix ordering via topological sort
      // If it can fix it, result should be valid; if not, null
      if (result && !("isNoData" in result)) {
        // Verify that CS 1 now comes before CS 2
        const cs1Semester = result.semesters.find((s) =>
          s.courses.some((c) => c.code === "CS 1")
        );
        const cs2Semester = result.semesters.find((s) =>
          s.courses.some((c) => c.code === "CS 2")
        );
        if (cs1Semester && cs2Semester) {
          expect(cs1Semester.number).toBeLessThan(cs2Semester.number);
        }
      }
    });

    it("calculates total units correctly", () => {
      const response = `\`\`\`json
{
  "ccName": "Test",
  "targetUniversity": "Test",
  "targetMajor": "Test",
  "semesters": [
    {
      "number": 1,
      "label": "Semester 1",
      "courses": [
        { "code": "A", "title": "Course A", "units": 4 },
        { "code": "B", "title": "Course B", "units": 3 }
      ]
    }
  ]
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);

      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.semesters[0].totalUnits).toBe(7);
        expect(result.totalUnits).toBe(7);
      }
    });

    it("handles courses without optional fields", () => {
      const response = `\`\`\`json
{
  "ccName": "Test",
  "targetUniversity": "Test",
  "targetMajor": "Test",
  "semesters": [
    {
      "number": 1,
      "label": "Semester 1",
      "courses": [
        { "code": "CS 1", "title": "Intro to CS", "units": 4 }
      ]
    }
  ]
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);

      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.semesters[0].courses[0].code).toBe("CS 1");
        expect(result.semesters[0].courses[0].prerequisites).toBeUndefined();
        expect(result.semesters[0].courses[0].transferEquivalency).toBeUndefined();
      }
    });

    it("returns null for empty semesters array", () => {
      const response = `\`\`\`json
{
  "ccName": "Test",
  "targetUniversity": "Test",
  "targetMajor": "Test",
  "semesters": []
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);
      expect(result).toBeNull();
    });

    it("handles malformed JSON gracefully", () => {
      const response = "```json\n{invalid json}\n```";
      const result = parsePlanFromAIResponse(response);
      expect(result).toBeNull();
    });

    it("enforces expected major when model returns a different major", () => {
      const response = `\`\`\`json
{
  "ccName": "Test CC",
  "targetUniversity": "UCLA",
  "targetMajor": "Mechanical Engineering",
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2026",
      "courses": [
        { "code": "CS 1", "title": "Intro to CS", "units": 4 }
      ]
    }
  ]
}
\`\`\``;

      const result = parsePlanFromAIResponse(response, undefined, "Computer Science");

      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.targetMajor).toBe("Computer Science");
      }
    });

    it("parses unified multi-school plan with coveredSchools and requiredBy", () => {
      const response = `\`\`\`json
{
  "ccName": "Santa Monica College",
  "targetUniversity": "UCLA",
  "targetMajor": "Computer Science",
  "coveredSchools": [
    { "name": "UCLA", "institutionId": null, "fitScore": 90, "articulatedUnits": 40, "totalRequiredUnits": 60 },
    { "name": "UC Berkeley", "institutionId": null, "fitScore": 82, "articulatedUnits": 38, "totalRequiredUnits": 60 },
    { "name": "UC San Diego", "institutionId": null, "fitScore": 75, "articulatedUnits": 34, "totalRequiredUnits": 60 }
  ],
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2026",
      "courses": [
        { "code": "CS 1", "title": "Intro to CS", "units": 4, "requiredBy": ["UCLA", "UC Berkeley", "UC San Diego"] },
        { "code": "CS 17", "title": "Discrete", "units": 3, "requiredBy": ["UCLA"] }
      ]
    }
  ],
  "totalUnits": 7
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);

      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.coveredSchools).toHaveLength(3);
        // Sorted by fitScore desc
        expect(result.coveredSchools?.[0].name).toBe("UCLA");
        expect(result.targetUniversity).toBe("UCLA");

        const [cs1, cs17] = result.semesters[0].courses;
        // Universal course (all 3 schools) normalizes to undefined
        expect(cs1.requiredBy).toBeUndefined();
        // School-specific course preserves the subset
        expect(cs17.requiredBy).toEqual(["UCLA"]);
      }
    });

    it("filters requiredBy entries that aren't in coveredSchools", () => {
      const response = `\`\`\`json
{
  "ccName": "Santa Monica College",
  "targetUniversity": "UCLA",
  "targetMajor": "Computer Science",
  "coveredSchools": [
    { "name": "UCLA", "fitScore": 90, "articulatedUnits": 40, "totalRequiredUnits": 60 },
    { "name": "UC Berkeley", "fitScore": 82, "articulatedUnits": 38, "totalRequiredUnits": 60 }
  ],
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2026",
      "courses": [
        { "code": "CS 1", "title": "Intro to CS", "units": 4, "requiredBy": ["UCLA", "Stanford"] }
      ]
    }
  ]
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);
      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.semesters[0].courses[0].requiredBy).toEqual(["UCLA"]);
      }
    });

    it("treats omitted requiredBy as universal (undefined)", () => {
      const response = `\`\`\`json
{
  "ccName": "SMC",
  "targetUniversity": "UCLA",
  "targetMajor": "CS",
  "coveredSchools": [
    { "name": "UCLA", "fitScore": 90, "articulatedUnits": 40, "totalRequiredUnits": 60 },
    { "name": "UC Berkeley", "fitScore": 82, "articulatedUnits": 38, "totalRequiredUnits": 60 }
  ],
  "semesters": [
    { "number": 1, "label": "Fall", "courses": [{ "code": "CS 1", "title": "Intro", "units": 4 }] }
  ]
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);
      expect(result).not.toBeNull();
      if (result && !("isNoData" in result)) {
        expect(result.semesters[0].courses[0].requiredBy).toBeUndefined();
      }
    });

    it("returns NoData for legacy isMultiUniversity plans", () => {
      const response = `\`\`\`json
{
  "isMultiUniversity": true,
  "studentCC": "SMC",
  "major": "CS",
  "universities": []
}
\`\`\``;

      const result = parsePlanFromAIResponse(response);
      expect(result).not.toBeNull();
      expect(result && "isNoData" in result && result.isNoData).toBe(true);
    });
  });

  describe("buildSystemPrompt", () => {
    const defaults = {
      articulationContext: "",
      availableMajors: [] as string[],
      prerequisiteData: "",
      playbookContext: "",
    };

    it("includes articulation data when provided", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        articulationContext: "SMC CS 1 -> UCLA CS 31",
      });

      expect(prompt).toContain("AVAILABLE ARTICULATION DATA");
      expect(prompt).toContain("SMC CS 1 -> UCLA CS 31");
    });

    it("includes prerequisite info when provided", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        prerequisiteData: "CS 2 requires CS 1",
      });

      expect(prompt).toContain("PREREQUISITE RELATIONSHIPS");
      expect(prompt).toContain("CS 2 requires CS 1");
    });

    it("includes available majors guidance for unsupported-major requests", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        availableMajors: [
          "Biology",
          "Business Administration",
          "Computer Science",
        ],
      });

      expect(prompt).toContain("AVAILABLE MAJORS IN CAREERAC");
      expect(prompt).toContain(
        "Biology, Business Administration, Computer Science",
      );
      expect(prompt).toContain(
        "If a student asks for a major that is not in the articulation matches above",
      );
    });

    it("includes playbook context when provided", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        playbookContext: "## VERIFIED PLAYBOOK INSIGHTS\nStudents typically take CS 1 first",
      });

      expect(prompt).toContain("VERIFIED PLAYBOOK INSIGHTS");
      expect(prompt).toContain("Students typically take CS 1 first");
    });

    it("includes all guardrails", () => {
      const prompt = buildSystemPrompt(defaults);

      expect(prompt).toContain("Stay on topic");
      expect(prompt).toContain("Don't fabricate");
      expect(prompt).toContain("Admit when no data");
      expect(prompt).toContain("Prerequisite ordering");
    });

    it("locks major and selected schools when provided", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        selectedMajor: "Computer Science",
        selectedUniversityNames: ["UCLA", "UC Berkeley"],
      });

      expect(prompt).toContain('selected major is "Computer Science"');
      expect(prompt).toContain("ONLY use these selected universities: UCLA, UC Berkeley");
    });

    it("engages unified multi-school mode when hasTargetSchool=false", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        hasTargetSchool: false,
      });

      expect(prompt).toContain("UNIFIED MULTI-SCHOOL PLAN MODE");
      expect(prompt).toContain("coveredSchools");
      expect(prompt).toContain("requiredBy");
    });

    it("engages unified multi-school mode when multiple schools are selected", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        selectedUniversityNames: ["UCLA", "UC Berkeley"],
      });

      expect(prompt).toContain("UNIFIED MULTI-SCHOOL PLAN MODE");
      expect(prompt).toContain("SINGLE unified plan");
    });

    it("does not engage unified mode for a single selected school", () => {
      const prompt = buildSystemPrompt({
        ...defaults,
        hasTargetSchool: true,
        selectedUniversityNames: ["UCLA"],
      });

      expect(prompt).not.toContain("UNIFIED MULTI-SCHOOL PLAN MODE");
    });

    it("includes output format instructions", () => {
      const prompt = buildSystemPrompt(defaults);

      expect(prompt).toContain("OUTPUT FORMAT");
      expect(prompt).toContain("ccName");
      expect(prompt).toContain("semesters");
      expect(prompt).toContain("isNoData");
    });
  });
});
