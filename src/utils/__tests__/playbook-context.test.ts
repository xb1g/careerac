import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getVerifiedPlaybooksContext } from "@/utils/playbook-context";

// Mock the Supabase server client
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

/**
 * Creates a mock Supabase query chain that properly supports chaining
 * and awaiting. All chain methods return the same object, and the object
 * is thenable (has a real `then` method) so it can be awaited.
 */
function createMockChain(resolvedValue: { data: unknown[] | null; error: unknown | null }) {
  const eqCalls: Array<{ field: string; value: string }> = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: any = {
    select: () => chain,
    eq: (field: string, value: string) => {
      eqCalls.push({ field, value });
      return chain;
    },
    order: () => chain,
    limit: () => chain,
    returns: () => chain,
    then: (onfulfilled: (v: typeof resolvedValue) => unknown, onrejected: (e: unknown) => unknown) => {
      return Promise.resolve(resolvedValue).then(onfulfilled, onrejected);
    },
  };

  return { chain, eqCalls };
}

describe("getVerifiedPlaybooksContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty string when no verified playbooks exist", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain } = createMockChain({ data: [], error: null });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    const result = await getVerifiedPlaybooksContext();

    expect(result).toBe("");
  });

  it("returns empty string when database query errors", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain } = createMockChain({ data: null, error: { message: "DB error" } });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    const result = await getVerifiedPlaybooksContext();

    expect(result).toBe("");
  });

  it("only includes playbooks with verification_status=verified AND outcome=transferred", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain, eqCalls } = createMockChain({
      data: [
        {
          id: "1",
          target_major: "Computer Science",
          transfer_year: 2024,
          outcome: "transferred",
          verification_status: "verified",
          playbook_data: {
            semesters: [{ number: 1, courses: [{ course_code: "CS 1", title: "Intro to CS", units: 4 }] }],
            failure_events: [],
          },
          cc_institution: { id: "cc1", name: "Santa Monica College", abbreviation: "SMC" },
          target_institution: { id: "u1", name: "UCLA", abbreviation: "UCLA" },
        },
      ],
      error: null,
    });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    await getVerifiedPlaybooksContext("cc1", "u1", "Computer Science");

    // Verify the mandatory verified+transferred filters are always applied
    expect(eqCalls).toContainEqual({ field: "verification_status", value: "verified" });
    expect(eqCalls).toContainEqual({ field: "outcome", value: "transferred" });
  });

  it("filters by CC, target institution, and major when provided", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain, eqCalls } = createMockChain({ data: [], error: null });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    await getVerifiedPlaybooksContext("smc-id", "ucla-id", "Computer Science");

    expect(eqCalls).toContainEqual({ field: "cc_institution_id", value: "smc-id" });
    expect(eqCalls).toContainEqual({ field: "target_institution_id", value: "ucla-id" });
    expect(eqCalls).toContainEqual({ field: "target_major", value: "Computer Science" });
    // Also includes the verified + transferred filters
    expect(eqCalls).toContainEqual({ field: "verification_status", value: "verified" });
    expect(eqCalls).toContainEqual({ field: "outcome", value: "transferred" });
  });

  it("does NOT apply institution/major filters when not provided", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain, eqCalls } = createMockChain({ data: [], error: null });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    // Call with no filters - should only get verified+transferred
    await getVerifiedPlaybooksContext();

    // Should only have the two mandatory filters
    expect(eqCalls).toHaveLength(2);
    expect(eqCalls).toContainEqual({ field: "verification_status", value: "verified" });
    expect(eqCalls).toContainEqual({ field: "outcome", value: "transferred" });
  });

  it("formats verified playbook data with courses into readable context", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain } = createMockChain({
      data: [
        {
          id: "pb-1",
          target_major: "Computer Science",
          transfer_year: 2024,
          outcome: "transferred",
          verification_status: "verified",
          playbook_data: {
            semesters: [
              {
                number: 1,
                courses: [
                  { course_code: "CS 1", title: "Intro to CS", units: 4 },
                  { course_code: "MATH 1", title: "Calculus I", units: 4 },
                ],
              },
            ],
            failure_events: [],
          },
          cc_institution: { id: "cc1", name: "Santa Monica College", abbreviation: "SMC" },
          target_institution: { id: "u1", name: "UCLA", abbreviation: "UCLA" },
        },
      ],
      error: null,
    });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    const result = await getVerifiedPlaybooksContext("cc1", "u1", "Computer Science");

    expect(result).toContain("COMMUNITY PLAYBOOKS");
    expect(result).toContain("SMC");
    expect(result).toContain("UCLA");
    expect(result).toContain("Computer Science");
    expect(result).toContain("CS 1");
    expect(result).toContain("MATH 1");
    expect(result).toContain("transferred 2024");
  });

  it("includes failure events in playbook context when present", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain } = createMockChain({
      data: [
        {
          id: "pb-2",
          target_major: "Business",
          transfer_year: 2023,
          outcome: "transferred",
          verification_status: "verified",
          playbook_data: {
            semesters: [
              { number: 1, courses: [{ course_code: "BUS 1", title: "Intro to Business", units: 3 }] },
            ],
            failure_events: [
              { course_code: "MATH 1", failure_type: "failed", resolution: "Retook in summer", lessons_learned: "Study groups help" },
            ],
          },
          cc_institution: { id: "cc2", name: "De Anza College", abbreviation: "DA" },
          target_institution: { id: "u2", name: "SJSU", abbreviation: "SJSU" },
        },
      ],
      error: null,
    });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    const result = await getVerifiedPlaybooksContext();

    expect(result).toContain("Challenges overcome");
    expect(result).toContain("MATH 1");
    expect(result).toContain("failed");
    expect(result).toContain("Retook in summer");
  });

  it("does NOT include unverified playbooks in the query filters", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain, eqCalls } = createMockChain({ data: [], error: null });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    await getVerifiedPlaybooksContext("cc1", "u1", "CS");

    // Verify that we NEVER filter for unverified statuses
    expect(eqCalls.some((f) => f.value === "in_progress")).toBe(false);
    expect(eqCalls.some((f) => f.value === "pending")).toBe(false);
    expect(eqCalls.some((f) => f.value === "changed_direction")).toBe(false);
    expect(eqCalls.some((f) => f.value === "rejected")).toBe(false);
  });

  it("uses fallback names when institution abbreviations are missing", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const { chain } = createMockChain({
      data: [
        {
          id: "pb-3",
          target_major: "Engineering",
          transfer_year: 2025,
          outcome: "transferred",
          verification_status: "verified",
          playbook_data: { semesters: [], failure_events: [] },
          cc_institution: { id: "cc3", name: "Long Beach City College", abbreviation: null },
          target_institution: { id: "u3", name: "UC Irvine", abbreviation: null },
        },
      ],
      error: null,
    });

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: vi.fn().mockReturnValue(chain),
    });

    const result = await getVerifiedPlaybooksContext();

    expect(result).toContain("Long Beach City College");
    expect(result).toContain("UC Irvine");
  });

  it("returns empty string when function throws", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    (createClient as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Connection failed"));

    const result = await getVerifiedPlaybooksContext();

    expect(result).toBe("");
  });

  it("limits results to 10 playbooks", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    let limitCalled = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chain: any = {
      select: () => chain,
      eq: () => chain,
      order: () => chain,
      limit: (n: number) => {
        limitCalled = true;
        expect(n).toBe(10);
        return chain;
      },
      returns: () => chain,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (onfulfilled: (v: any) => unknown) => {
        return Promise.resolve({ data: [] as never[], error: null }).then(onfulfilled);
      },
    };

    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
      from: () => chain,
    });

    await getVerifiedPlaybooksContext();

    expect(limitCalled).toBe(true);
  });
});
