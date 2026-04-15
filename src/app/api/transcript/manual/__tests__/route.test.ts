import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}));

function buildJsonRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/transcript/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/transcript/manual", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-abc-123" } },
      error: null,
    });

    mockSingle.mockResolvedValue({ data: { id: "transcript-manual-xyz" }, error: null });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
  });

  it("creates a completed manual transcript record", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      buildJsonRequest({
        parsed_data: {
          institution: "De Anza College",
          courses: [{ code: "CS 1", title: "Intro", units: 4, grade: "A", status: "completed", semester: "Fall 2024" }],
          totalUnitsCompleted: 4,
          totalUnitsInProgress: 0,
        },
        parse_status: "completed",
        parse_method: "manual",
        file_name: "Manual transcript entry",
        institution: "De Anza College",
      })
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("transcript-manual-xyz");
    expect(mockInsert).toHaveBeenCalledTimes(1);

    const insertArg = mockInsert.mock.calls[0]?.[0];
    expect(insertArg.parse_method).toBe("manual");
    expect(insertArg.parse_status).toBe("completed");
    expect(insertArg.file_name).toBe("Manual transcript entry");
    expect(insertArg.parsed_data).toMatchObject({ institution: "De Anza College" });
  });
});
