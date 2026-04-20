import { describe, it, expect, vi } from "vitest";
import { slugify, findUniversityBySlug } from "@/utils/slug";
import type { UniversityFit } from "@/types/plan";

function fit(name: string): UniversityFit {
  return {
    universityName: name,
    fitScore: 80,
    articulatedUnits: 0,
    totalRequiredUnits: 0,
    completedPrereqs: 0,
    totalPrereqs: 0,
    remainingSemesters: 0,
    plan: { ccName: "", targetUniversity: name, targetMajor: "", semesters: [], totalUnits: 0 },
    highlights: [],
  };
}

describe("slugify", () => {
  it("lowercases and hyphenates basic names", () => {
    expect(slugify("UC Berkeley")).toBe("uc-berkeley");
  });

  it("strips diacritics", () => {
    expect(slugify("San José State")).toBe("san-jose-state");
  });

  it("collapses punctuation and trims leading/trailing hyphens", () => {
    expect(slugify("  --UCLA!!  ")).toBe("ucla");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});

describe("findUniversityBySlug", () => {
  it("matches a university by its slugified name", () => {
    const list = [fit("UC Berkeley"), fit("UCLA")];
    expect(findUniversityBySlug(list, "ucla")).toBe(list[1]);
  });

  it("treats the input slug case-insensitively", () => {
    const list = [fit("UCLA")];
    expect(findUniversityBySlug(list, "UCLA")).toBe(list[0]);
  });

  it("returns null when no university matches", () => {
    expect(findUniversityBySlug([fit("UCLA")], "uc-berkeley")).toBeNull();
  });

  it("resolves collisions by returning the first match", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const list = [fit("UC Berkeley"), fit("UC Berkeley")];
    expect(findUniversityBySlug(list, "uc-berkeley")).toBe(list[0]);
    warn.mockRestore();
  });
});
