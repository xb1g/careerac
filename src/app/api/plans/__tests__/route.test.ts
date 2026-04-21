import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { mockGetUser, mockSavePlanRecord } = vi.hoisted(() => ({
    mockGetUser: vi.fn(),
    mockSavePlanRecord: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
    createClient: vi.fn(async () => ({
        auth: {
            getUser: mockGetUser,
        },
    })),
}));

vi.mock("@/lib/plan-service", () => ({
    savePlanRecord: mockSavePlanRecord,
}));

function buildRequest(body: Record<string, unknown>): NextRequest {
    return new Request("http://localhost/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }) as unknown as NextRequest;
}

describe("POST /api/plans", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetUser.mockResolvedValue({
            data: { user: { id: "user-1" } },
            error: null,
        });
        mockSavePlanRecord.mockResolvedValue({ id: "plan-1" });
    });

    it("rejects more than 20 comparison targets", async () => {
        const { POST } = await import("../route");

        const comparisonTargets = Array.from({ length: 21 }, (_, index) => ({
            institution_id: `id-${index + 1}`,
            name: `School ${index + 1}`,
            priority_order: index + 1,
        }));

        const response = await POST(
            buildRequest({
                title: "My Plan",
                target_major: "Computer Science",
                comparison_targets: comparisonTargets,
            }),
        );

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: expect.stringMatching(/up to 20/i),
        });
        expect(mockSavePlanRecord).not.toHaveBeenCalled();
    });

    it("saves plans with 20 or fewer comparison targets", async () => {
        const { POST } = await import("../route");

        const comparisonTargets = Array.from({ length: 20 }, (_, index) => ({
            institution_id: `id-${index + 1}`,
            name: `School ${index + 1}`,
            priority_order: index + 1,
        }));

        const response = await POST(
            buildRequest({
                title: "My Plan",
                target_major: "Computer Science",
                comparison_targets: comparisonTargets,
            }),
        );

        expect(response.status).toBe(201);
        expect(mockSavePlanRecord).toHaveBeenCalledOnce();
    });
});
