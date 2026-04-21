import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetUser,
  mockGenerate,
  mockResolveInstitutionIdsByName,
  mockSavePlanRecord,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGenerate: vi.fn(),
  mockResolveInstitutionIdsByName: vi.fn(),
  mockSavePlanRecord: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          neq: vi.fn(() => ({
            returns: vi.fn(async () => ({ data: [], error: null })),
          })),
        })),
      })),
    })),
  })),
}));

vi.mock("@/lib/plan-pipeline", () => ({
  PlanGenerationPipeline: {
    generate: mockGenerate,
  },
}));

vi.mock("@/lib/plan-service", () => ({
  resolveInstitutionIdsByName: mockResolveInstitutionIdsByName,
  savePlanRecord: mockSavePlanRecord,
}));

function buildRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/plans/generate-auto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const transcriptData = {
  institution: "De Anza College",
  courses: [
    {
      code: "MATH 1A",
      title: "Calculus",
      units: 5,
      grade: "A",
      status: "completed" as const,
      semester: "Fall 2025",
    },
  ],
  totalUnitsCompleted: 5,
  totalUnitsInProgress: 0,
};

const parsedPlan = {
  ccName: "De Anza College",
  targetUniversity: "UCLA",
  targetMajor: "Computer Science",
  semesters: [
    {
      number: 1,
      label: "Fall 2026",
      courses: [
        { code: "CS 1A", title: "Intro to Programming", units: 4 },
      ],
      totalUnits: 4,
    },
  ],
  totalUnits: 4,
};

describe("POST /api/plans/generate-auto", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    mockResolveInstitutionIdsByName.mockResolvedValue({
      ccInstitutionId: "cc-1",
      targetInstitutionId: "uni-1",
    });

    mockGenerate.mockResolvedValue({
      rawText: "```json\n{\"targetUniversity\":\"UCLA\"}\n```",
      parsedPlan,
    });

    mockSavePlanRecord.mockResolvedValue({ id: "plan-123" });
  });

  it("returns a saved auto-generated plan with synthetic chat history", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({
        transcriptId: "transcript-1",
        transcriptData,
        detectedMajor: "Computer Science",
        targetSchool: "UCLA",
      }),
    );

    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.planId).toBe("plan-123");
    expect(body.plan).toEqual(parsedPlan);
    expect(body.detectedMajor).toBe("Computer Science");
    expect(body.chatHistory).toHaveLength(3);
    expect(body.chatHistory[0]).toMatchObject({ role: "assistant" });
    expect(body.chatHistory[0].parts[0].text).toContain("De Anza College");
    expect(body.chatHistory[1]).toMatchObject({ role: "user" });
    expect(body.chatHistory[2]).toMatchObject({ role: "assistant" });

    expect(mockGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "user" }),
        ]),
        planContext: {
          ccInstitutionId: "cc-1",
          targetInstitutionId: "uni-1",
          targetMajor: "Computer Science",
        },
      }),
      expect.objectContaining({
        transcriptData,
        maxCreditsPerSemester: 15,
        hasTargetSchool: true,
        startTerm: expect.any(String),
      }),
    );

    expect(mockSavePlanRecord).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: "user-123",
        targetMajor: "Computer Science",
        targetInstitutionId: "uni-1",
        transcriptId: "transcript-1",
        maxCreditsPerSemester: 15,
      }),
    );
  });

  it("uses best-fit mode when targetSchool is null", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({
        transcriptData,
        detectedMajor: "Computer Science",
        targetSchool: null,
      }),
    );

    expect(response.status).toBe(201);
    expect(mockGenerate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        maxCreditsPerSemester: 15,
        hasTargetSchool: false,
      }),
    );
    expect(mockSavePlanRecord).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        hasTargetSchool: false,
        targetInstitutionId: null,
      }),
    );
  });

  it("returns UNAUTHORIZED when no session exists", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({ transcriptData, detectedMajor: "Computer Science" }),
    );

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

  it("returns INVALID_INPUT when transcriptData is missing", async () => {
    const { POST } = await import("../route");
    const response = await POST(buildRequest({ detectedMajor: "Computer Science" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "INVALID_INPUT",
        message: expect.stringMatching(/transcriptData/i),
        retryable: false,
        fallback: "manual_chat",
      },
    });
  });

  it("returns MAJOR_REQUIRED when detectedMajor is blank", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({ transcriptData, detectedMajor: "   " }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "MAJOR_REQUIRED",
        message: expect.stringMatching(/major/i),
        retryable: false,
        fallback: "manual_chat",
      },
    });
  });

  it("returns AI_UPSTREAM_ERROR when generation throws", async () => {
    mockGenerate.mockRejectedValue(new Error("MiniMax API error: 503 - unavailable"));

    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({ transcriptData, detectedMajor: "Computer Science" }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "AI_UPSTREAM_ERROR",
        message: expect.stringMatching(/AI/i),
        retryable: true,
        fallback: "retry",
      },
    });
  });

  it("returns PLAN_PARSE_FAILED when the AI response cannot be parsed into a savable plan", async () => {
    mockGenerate.mockResolvedValue({
      rawText: "No valid plan",
      parsedPlan: { isNoData: true, message: "No data" },
    });

    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({ transcriptData, detectedMajor: "Computer Science" }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "PLAN_PARSE_FAILED",
        message: expect.stringMatching(/parse|saveable/i),
        retryable: true,
        fallback: "retry",
      },
    });
  });

  it("returns PLAN_SAVE_FAILED when persistence fails", async () => {
    mockSavePlanRecord.mockRejectedValue(new Error("database offline"));

    const { POST } = await import("../route");
    const response = await POST(
      buildRequest({ transcriptData, detectedMajor: "Computer Science" }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "PLAN_SAVE_FAILED",
        message: expect.stringMatching(/save/i),
        retryable: true,
        fallback: "retry",
      },
    });
  });
});
