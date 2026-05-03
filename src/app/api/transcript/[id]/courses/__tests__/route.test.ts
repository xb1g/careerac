import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSupabaseFrom = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      }),
    },
    from: mockSupabaseFrom,
  })),
}));

function buildRequest(body: Record<string, unknown>, method = "PATCH"): Request {
  return new Request("http://localhost/api/transcript/test-id/courses", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Helper to create a persistent mock chain for eq() calls
// Each eq() call needs to return an object with eq and single, persistently
function createPersistentEqChain(singleFn: () => unknown) {
  const mock = vi.fn().mockImplementation(() => ({
    eq: mock,
    single: singleFn(),
  }));
  return mock;
}

describe("PATCH /api/transcript/[id]/courses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success cases", () => {
    it("adds a single course", async () => {
      const existingCourses = [
        { code: "MATH 1A", title: "Calculus I", units: 5, grade: "A", status: "completed" as const, semester: "Fall 2024" },
      ];

      const fetchSingle = vi.fn().mockResolvedValue({
        data: { id: "transcript-1", user_id: "user-1", parsed_data: { courses: existingCourses } },
        error: null,
      });
      const updateSingle = vi.fn().mockResolvedValue({
        data: {
          id: "transcript-1",
          parsed_data: {
            courses: [
              ...existingCourses,
              { code: "CS 1", title: "Intro to CS", units: 4, grade: "B+", status: "completed" as const, semester: "Spring 2025" },
            ],
          },
        },
        error: null,
      });

      // Create persistent eq chains
      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const updateEq = createPersistentEqChain(() => updateSingle);

      // Select returns an object with eq
      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });
      const updateSelect = vi.fn().mockReturnValue({ eq: updateEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: updateSelect,
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({
        add: [{ code: "CS 1", title: "Intro to CS", units: 4, grade: "B+", status: "completed", semester: "Spring 2025" }],
      }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.courses).toHaveLength(2);
      expect(body.courses[1].code).toBe("CS 1");
    });

    it("removes a single course", async () => {
      const existingCourses = [
        { code: "MATH 1A", title: "Calculus I", units: 5, grade: "A", status: "completed" as const, semester: "Fall 2024" },
        { code: "CS 1", title: "Intro to CS", units: 4, grade: "B+", status: "completed" as const, semester: "Spring 2025" },
      ];

      const fetchSingle = vi.fn().mockResolvedValue({
        data: { id: "transcript-1", user_id: "user-1", parsed_data: { courses: existingCourses } },
        error: null,
      });
      const updateSingle = vi.fn().mockResolvedValue({
        data: {
          id: "transcript-1",
          parsed_data: { courses: [existingCourses[0]] },
        },
        error: null,
      });

      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const updateEq = createPersistentEqChain(() => updateSingle);

      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });
      const updateSelect = vi.fn().mockReturnValue({ eq: updateEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: updateSelect,
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({ remove: ["CS 1"] }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.courses).toHaveLength(1);
      expect(body.courses[0].code).toBe("MATH 1A");
    });

    it("adds and removes courses in same request", async () => {
      const existingCourses = [
        { code: "MATH 1A", title: "Calculus I", units: 5, grade: "A", status: "completed" as const, semester: "Fall 2024" },
        { code: "CS 1", title: "Intro to CS", units: 4, grade: "B+", status: "completed" as const, semester: "Spring 2025" },
      ];

      const fetchSingle = vi.fn().mockResolvedValue({
        data: { id: "transcript-1", user_id: "user-1", parsed_data: { courses: existingCourses } },
        error: null,
      });
      const updateSingle = vi.fn().mockResolvedValue({
        data: {
          id: "transcript-1",
          parsed_data: {
            courses: [
              { code: "MATH 1A", title: "Calculus I", units: 5, grade: "A", status: "completed" as const, semester: "Fall 2024" },
              { code: "PHYS 4A", title: "Physics I", units: 5, grade: "A-", status: "completed" as const, semester: "Spring 2025" },
            ],
          },
        },
        error: null,
      });

      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const updateEq = createPersistentEqChain(() => updateSingle);

      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });
      const updateSelect = vi.fn().mockReturnValue({ eq: updateEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: updateSelect,
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({
        add: [{ code: "PHYS 4A", title: "Physics I", units: 5, grade: "A-", status: "completed", semester: "Spring 2025" }],
        remove: ["CS 1"],
      }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.courses).toHaveLength(2);
      expect(body.courses.find((c: { code: string }) => c.code === "CS 1")).toBeUndefined();
      expect(body.courses.find((c: { code: string }) => c.code === "PHYS 4A")).toBeDefined();
    });
  });

  describe("auth cases", () => {
    it("returns 401 for unauthenticated request", async () => {
      const { createClient } = await import("@/utils/supabase/server");
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: new Error("Not authenticated"),
          }),
        },
        from: vi.fn(),
      } as never);

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({ add: [] }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("returns 404 for other user transcript (RLS)", async () => {
      const fetchSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      });

      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: vi.fn(),
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({ add: [] }), { params: Promise.resolve({ id: "transcript-other-user" }) });

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error).toBe("Transcript not found");
    });
  });

  describe("validation cases", () => {
    it("returns 400 for invalid course code format", async () => {
      const fetchSingle = vi.fn().mockResolvedValue({
        data: { id: "transcript-1", user_id: "user-1", parsed_data: { courses: [] } },
        error: null,
      });

      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: vi.fn(),
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({
        add: [{ code: "C", title: "Test", units: 3, grade: "A", status: "completed" }],
      }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("2-10 characters");
    });

    it("returns 400 for units <= 0", async () => {
      const fetchSingle = vi.fn().mockResolvedValue({
        data: { id: "transcript-1", user_id: "user-1", parsed_data: { courses: [] } },
        error: null,
      });

      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: vi.fn(),
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({
        add: [{ code: "CS 1", title: "Test", units: 0, grade: "A", status: "completed" }],
      }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("Units must be a number greater than 0");
    });

    it("returns 400 for unknown grade", async () => {
      const fetchSingle = vi.fn().mockResolvedValue({
        data: { id: "transcript-1", user_id: "user-1", parsed_data: { courses: [] } },
        error: null,
      });

      const fetchEq = createPersistentEqChain(() => fetchSingle);
      const fetchSelect = vi.fn().mockReturnValue({ eq: fetchEq });

      mockSupabaseFrom.mockReturnValue({
        select: fetchSelect,
        update: vi.fn(),
      });

      const { PATCH } = await import("../route");
      const response = await PATCH(buildRequest({
        add: [{ code: "CS 1", title: "Test", units: 3, grade: "Z", status: "completed" }],
      }), { params: Promise.resolve({ id: "transcript-1" }) });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("Grade must be one of");
    });
  });
});
