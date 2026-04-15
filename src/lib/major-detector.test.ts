import { describe, expect, it } from "vitest";
import {
  detectMajorFromTranscript,
  type TranscriptCourse,
} from "@/lib/major-detector";

function buildCourse(
  overrides: Partial<TranscriptCourse> & Pick<TranscriptCourse, "code" | "title">
): TranscriptCourse {
  return {
    code: overrides.code,
    title: overrides.title,
    units: overrides.units ?? 4,
    grade: overrides.grade ?? "A",
    status: overrides.status ?? "completed",
  };
}

describe("major-detector", () => {
  it("detects a clear computer science sequence with high confidence", () => {
    const result = detectMajorFromTranscript([
      buildCourse({ code: "CS 101", title: "Introduction to Computer Programming" }),
      buildCourse({ code: "CS 201", title: "Software Design" }),
      buildCourse({ code: "MATH 1A", title: "Calculus I" }),
    ]);

    expect(result.detectedMajor).toBe("Computer Science");
    expect(result.family).toBe("computer_science");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    expect(result.reasoning).toContain("CS 101");
    expect(result.reasoning).toContain("CS 201");
    expect(result.reasoning).toContain("MATH 1A");
    expect(result.alternatives[0]?.major).toBe("Mathematics");
  });

  it("detects a biology path with chemistry support at high confidence", () => {
    const result = detectMajorFromTranscript([
      buildCourse({ code: "BIO 1", title: "Cell Biology" }),
      buildCourse({ code: "CHEM 1A", title: "Laboratory Methods for Life Sciences" }),
    ]);

    expect(result.detectedMajor).toBe("Biology");
    expect(result.family).toBe("biology");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    expect(result.reasoning).toContain("BIO 1");
    expect(result.reasoning).toContain("CHEM 1A");
  });

  it("returns low confidence for a single math course", () => {
    const result = detectMajorFromTranscript([
      buildCourse({ code: "MATH 1A", title: "Calculus I" }),
    ]);

    expect(result.detectedMajor).toBeNull();
    expect(result.family).toBeNull();
    expect(result.confidence).toBeLessThan(0.6);
    expect(result.alternatives[0]?.major).toBe("Mathematics");
  });

  it("returns low confidence for scattered gen-ed signals", () => {
    const result = detectMajorFromTranscript([
      buildCourse({ code: "ENG 1", title: "Composition and Writing" }),
      buildCourse({ code: "SOC 1", title: "Introduction to Society" }),
      buildCourse({ code: "PSY 1", title: "Behavior and Cognition" }),
    ]);

    expect(result.detectedMajor).toBeNull();
    expect(result.family).toBeNull();
    expect(result.confidence).toBeLessThan(0.6);
    expect(result.alternatives.map((alternative) => alternative.major)).toEqual(
      expect.arrayContaining(["English", "Sociology", "Psychology"])
    );
    expect(result.alternatives[0]?.confidence).toBeGreaterThanOrEqual(
      result.alternatives[1]?.confidence ?? 0
    );
  });

  it("returns a medium-confidence STEM guess with sorted alternatives", () => {
    const result = detectMajorFromTranscript([
      buildCourse({ code: "CS 1", title: "Computer Programming Software Algorithms" }),
      buildCourse({ code: "BIO 1", title: "Biology of Organisms" }),
    ]);

    expect(result.detectedMajor).toBe("Computer Science");
    expect(result.family).toBe("computer_science");
    expect(result.confidence).toBeGreaterThanOrEqual(0.6);
    expect(result.confidence).toBeLessThan(0.85);
    expect(result.alternatives[0]?.major).toBe("Biology");
    expect(result.alternatives[0]?.confidence).toBeGreaterThanOrEqual(
      result.alternatives[1]?.confidence ?? 0
    );
  });

  it("ignores in-progress and withdrawn courses", () => {
    const result = detectMajorFromTranscript([
      buildCourse({ code: "CS 1", title: "Computer Programming" }),
      buildCourse({ code: "CS 2", title: "Software Design" }),
      buildCourse({ code: "BIO 1", title: "Cell Biology", status: "withdrawn" }),
      buildCourse({ code: "CHEM 1A", title: "Organic Chemistry", status: "in_progress" }),
      buildCourse({ code: "MATH 1A", title: "Calculus I" }),
    ]);

    expect(result.detectedMajor).toBe("Computer Science");
    expect(result.family).toBe("computer_science");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("handles an empty transcript", () => {
    const result = detectMajorFromTranscript([]);

    expect(result.detectedMajor).toBeNull();
    expect(result.family).toBeNull();
    expect(result.confidence).toBe(0);
    expect(result.alternatives).toEqual([]);
  });
});
