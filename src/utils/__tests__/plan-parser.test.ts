import { describe, it, expect } from "vitest";
import { parsePlanFromAIResponse, generateSystemPrompt } from "@/utils/plan-parser";

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
  });

  describe("generateSystemPrompt", () => {
    it("includes articulation data when provided", () => {
      const prompt = generateSystemPrompt({
        articulationData: "SMC CS 1 -> UCLA CS 31",
      });

      expect(prompt).toContain("AVAILABLE ARTICULATION DATA");
      expect(prompt).toContain("SMC CS 1 -> UCLA CS 31");
    });

    it("includes prerequisite info when provided", () => {
      const prompt = generateSystemPrompt({
        prerequisiteInfo: "CS 2 requires CS 1",
      });

      expect(prompt).toContain("PREREQUISITE RELATIONSHIPS");
      expect(prompt).toContain("CS 2 requires CS 1");
    });

    it("includes playbook insights when provided", () => {
      const prompt = generateSystemPrompt({
        playbookInsights: "Students typically take CS 1 first",
      });

      expect(prompt).toContain("VERIFIED PLAYBOOK INSIGHTS");
      expect(prompt).toContain("Students typically take CS 1 first");
    });

    it("includes existing plan when provided", () => {
      const prompt = generateSystemPrompt({
        existingPlan: "Current plan: Semester 1 has CS 1",
      });

      expect(prompt).toContain("CURRENT PLAN");
      expect(prompt).toContain("Current plan: Semester 1 has CS 1");
    });

    it("includes all guardrails", () => {
      const prompt = generateSystemPrompt({});

      expect(prompt).toContain("STAY ON TOPIC");
      expect(prompt).toContain("DON'T FABRICATE");
      expect(prompt).toContain("ADMIT WHEN NO DATA");
      expect(prompt).toContain("PREREQUISITE ORDERING");
    });

    it("includes output format instructions", () => {
      const prompt = generateSystemPrompt({});

      expect(prompt).toContain("OUTPUT FORMAT");
      expect(prompt).toContain("ccName");
      expect(prompt).toContain("semesters");
      expect(prompt).toContain("isNoData");
    });
  });
});
