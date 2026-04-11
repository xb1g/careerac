import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlanPersistence } from "@/hooks/use-plan-persistence";

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => {
    throw new Error("Supabase client not available in tests");
  },
}));

vi.mock("@/utils/plan-institutions", () => ({
  resolveInstitutionIds: vi.fn(),
}));

describe("usePlanPersistence", () => {
  it("initializes with null planId and no loading/error state", () => {
    const { result } = renderHook(() => usePlanPersistence());

    expect(result.current.planId).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("exposes savePlan and loadPlan functions", () => {
    const { result } = renderHook(() => usePlanPersistence());

    expect(typeof result.current.savePlan).toBe("function");
    expect(typeof result.current.loadPlan).toBe("function");
    expect(typeof result.current.setPlanId).toBe("function");
  });

  it("sets planId when called", async () => {
    const { result } = renderHook(() => usePlanPersistence());

    await act(async () => {
      result.current.setPlanId("test-plan-id");
    });

    expect(result.current.planId).toBe("test-plan-id");
  });
});
