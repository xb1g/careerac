import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetUser,
  mockSingle,
  mockEq,
  mockSelect,
  mockFrom,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockSingle: vi.fn(),
  mockEq: vi.fn(),
  mockSelect: vi.fn(),
  mockFrom: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

describe("GET /api/plans/generate-auto/[id]", () => {
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
        status: "completed",
        plan_id: "plan-1",
        error_message: null,
      },
      error: null,
    });

    mockEq.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  it("returns the current job status", async () => {
    const { GET } = await import("../route");
    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "job-1" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "job-1",
      status: "completed",
      planId: "plan-1",
      error: null,
    });
  });
});
