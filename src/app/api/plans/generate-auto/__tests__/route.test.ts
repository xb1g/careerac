import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetUser,
  mockCreatePlanGenerationJob,
  mockNormalizeAutoPlanRequest,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockCreatePlanGenerationJob: vi.fn(),
  mockNormalizeAutoPlanRequest: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
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
    createPlanGenerationJob: mockCreatePlanGenerationJob,
    normalizeAutoPlanRequest: mockNormalizeAutoPlanRequest,
  };
});

function buildRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/plans/generate-auto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/plans/generate-auto", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    mockNormalizeAutoPlanRequest.mockReturnValue({
      transcriptId: "transcript-1",
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

    mockCreatePlanGenerationJob.mockResolvedValue({
      id: "job-123",
      status: "pending",
    });
  });

  it("returns a new pending plan generation job", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({
        transcriptId: "transcript-1",
        transcriptData: {
          institution: "De Anza College",
          courses: [],
          totalUnitsCompleted: 0,
          totalUnitsInProgress: 0,
        },
        detectedMajor: "Computer Science",
      }),
    );

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual({
      jobId: "job-123",
      status: "pending",
    });

    expect(mockNormalizeAutoPlanRequest).toHaveBeenCalledTimes(1);
    expect(mockCreatePlanGenerationJob).toHaveBeenCalledWith(
      expect.anything(),
      "user-123",
      expect.objectContaining({
        detectedMajor: "Computer Science",
      }),
    );
  });

  it("returns UNAUTHORIZED when no session exists", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { POST } = await import("../route");
    const response = await POST(buildRequest({ detectedMajor: "Computer Science" }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: expect.stringMatching(/sign in/i),
        retryable: false,
        fallback: "manual_chat",
      },
    });
  });
});
