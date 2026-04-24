import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetUser,
  mockSingle,
  mockEq,
  mockSelect,
  mockFrom,
  mockFinalizeTranscriptProcessing,
  mockUpdateTranscriptRecord,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
  mockEq: vi.fn(),
  mockSelect: vi.fn(),
  mockFrom: vi.fn(),
  mockFinalizeTranscriptProcessing: vi.fn(),
  mockUpdateTranscriptRecord: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

vi.mock("@/lib/transcript-processing", () => ({
  finalizeTranscriptProcessing: mockFinalizeTranscriptProcessing,
  updateTranscriptRecord: mockUpdateTranscriptRecord,
}));

describe("POST /api/transcript/[id]/process", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    mockSingle.mockResolvedValue({
      data: {
        id: "transcript-1",
        user_id: "user-1",
        file_path: "user-1/file.pdf",
        parse_status: "pending",
      },
      error: null,
    });

    mockEq.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockFrom.mockReturnValue({ select: mockSelect });

    mockFinalizeTranscriptProcessing.mockResolvedValue({
      parsedData: {
        institution: "De Anza College",
        courses: [{ code: "MATH 1A", title: "Calculus", units: 5, grade: "A", status: "completed", semester: "Fall 2024" }],
        totalUnitsCompleted: 5,
        totalUnitsInProgress: 0,
      },
      parseStatus: "completed",
      parseError: null,
      parseMethod: "ai",
      sync: { created: 1, updated: 0 },
    });

    mockUpdateTranscriptRecord
      .mockResolvedValueOnce({ id: "transcript-1", parse_status: "parsing" })
      .mockResolvedValueOnce({ id: "transcript-1", parse_status: "completed" });
  });

  it("processes a pending transcript and returns the updated record", async () => {
    const { POST } = await import("../route");
    const response = await POST(new Request("http://localhost"), {
      params: Promise.resolve({ id: "transcript-1" }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe("transcript-1");
    expect(body.parse_status).toBe("completed");
    expect(body.sync).toEqual({ created: 1, updated: 0 });
    expect(mockFinalizeTranscriptProcessing).toHaveBeenCalledTimes(1);
    expect(mockUpdateTranscriptRecord).toHaveBeenCalledTimes(2);
  });
});
