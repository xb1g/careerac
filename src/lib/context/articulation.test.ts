import { beforeEach, describe, expect, it, vi } from "vitest";

import { getArticulationContext } from "@/lib/context/articulation";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

function createResolvedChain<T>(resolvedValue: { data: T; error: unknown | null }) {
  // Mirror the project's Supabase query style: chainable methods plus await support.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: any = {
    select: () => chain,
    eq: () => chain,
    in: () => chain,
    limit: () => chain,
    order: () => chain,
    returns: () => chain,
    then: (onfulfilled: (value: typeof resolvedValue) => unknown, onrejected: (reason: unknown) => unknown) =>
      Promise.resolve(resolvedValue).then(onfulfilled, onrejected),
  };

  return chain;
}

describe("getArticulationContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes the full available major list so unsupported-major replies stay accurate", async () => {
    const { createClient } = await import("@/utils/supabase/server");

    const from = vi.fn((table: string) => {
      switch (table) {
        case "articulation_agreements":
          return createResolvedChain({
            data: [
              {
                id: "agreement-1",
                cc_course_id: "cc-course-1",
                university_course_id: "uni-course-1",
                cc_institution_id: "cc-1",
                university_institution_id: "uni-1",
                major: "Computer Science",
                effective_year: 2024,
                notes: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
            ],
            error: null,
          });
        case "courses":
          return createResolvedChain({
            data: [
              {
                id: "cc-course-1",
                institution_id: "cc-1",
                code: "CS 1",
                title: "Intro to CS",
                units: 4,
                description: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
              {
                id: "uni-course-1",
                institution_id: "uni-1",
                code: "CS 31",
                title: "Intro to Programming",
                units: 4,
                description: null,
                created_at: "2026-01-01T00:00:00.000Z",
              },
            ],
            error: null,
          });
        case "institutions":
          return createResolvedChain({
            data: [
              {
                id: "cc-1",
                name: "Santa Monica College",
                abbreviation: "SMC",
                type: "cc",
                state: "CA",
                city: "Santa Monica",
                created_at: "2026-01-01T00:00:00.000Z",
              },
              {
                id: "uni-1",
                name: "UCLA",
                abbreviation: "UCLA",
                type: "university",
                state: "CA",
                city: "Los Angeles",
                created_at: "2026-01-01T00:00:00.000Z",
              },
            ],
            error: null,
          });
        case "majors":
          return createResolvedChain({
            data: [
              { name: "Biology" },
              { name: "Business Administration" },
              { name: "Computer Science" },
            ],
            error: null,
          });
        default:
          throw new Error(`Unexpected table: ${table}`);
      }
    });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({ from });

    const result = await getArticulationContext({
      ccInstitutionId: "cc-1",
      targetInstitutionId: "uni-1",
      targetMajor: "Psychology",
    });

    expect(result.availableMajors).toEqual([
      "Biology",
      "Business Administration",
      "Computer Science",
    ]);
    expect(result.context).toContain("Available majors in CareerAC");
    expect(result.context).toContain(
      "Biology, Business Administration, Computer Science",
    );
  });
});
