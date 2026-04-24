import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetUser,
  mockSingle,
  mockEq,
  mockSelect,
  mockUpdate,
  mockFrom,
  mockNormalizeAutoPlanRequest,
  mockRunPlanGenerationJob,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
  mockEq: vi.fn(),
  mockSelect: vi.fn(),
  mockUpdate: vi.fn(),
  mockFrom: vi.fn(),
  mockNormalizeAutoPlanRequest: vi.fn(),
  mockRunPlanGenerationJob: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

vi.mock("@/lib/auto-plan-generation-job", () => {
  class MockAutoPlanGenerationError extends Error {
    details: unknown;
    status: number;

    constructor(details: unknown, status: number) {
      super((details as { message?: string })?.message ?? "error");
      this.details = details;
      this.status = status;
    }
  }

  return {
    AutoPlanGenerationError: MockAutoPlanGenerationError,
    normalizeAutoPlanRequest: mockNormalizeAutoPlanRequest,
    normalizeJobError: vi.fn((message: string) => ({
      code: "AI_UPSTREAM_ERROR",
      message,
      retryable: true,
      fallback: "retry",
    })),
    runPlanGenerationJob: mockRunPlanGenerationJob,
  };
});

describe("POST /api/plans/generate-auto/[id]/process", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    mockSingle.mockResolvedValue({
      data: {
        id: "job-1",
        user_id: "user-1",
        status: "pending",
        request_payload: { detectedMajor: "Computer Science" },
      },
      error: null,
    });

    mockEq.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
    });

    mockNormalizeAutoPlanRequest.mockReturnValue({
      transcriptData: {
        institution: "De Anza College",
        courses: [],
        totalUnitsCompleted: 0,
        totalUnitsInProgress: 0,
      },
      detectedMajor: "Computer Science",
      targetSchool: null,
      maxCreditsPerSemester: 15,
    });

    mockRunPlanGenerationJob.mockResolvedValue({
      planId: "plan-1",
      plan: { targetUniversity: "UCLA" },
      detectedMajor: "Computer Science",
      chatHistory: [],
    });
  });

  it("marks the job completed after plan generation succeeds", async () => {
    const { POST } = await import("../route");
    const response = await POST(new Request("http://localhost"), {
      params: Promise.resolve({ id: "job-1" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "job-1",
      status: "completed",
      planId: "plan-1",
      error: null,
    });

    expect(mockNormalizeAutoPlanRequest).toHaveBeenCalledTimes(1);
    expect(mockRunPlanGenerationJob).toHaveBeenCalledWith(
      expect.anything(),
      "user-1",
      expect.objectContaining({ detectedMajor: "Computer Science" }),
    );
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
