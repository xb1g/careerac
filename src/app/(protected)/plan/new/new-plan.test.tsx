import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import NewPlanPage from "./page";

// Mock next/navigation for useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

// Mock the Chat component with callbacks for testing
vi.mock("@/components/chat", () => ({
  default: vi.fn(function MockChat({ onPlanGenerated, onSavePlan }: {
    onPlanGenerated?: (plan: unknown) => void;
    onSavePlan?: (plan: unknown, messages: unknown[]) => void;
  }) {
    return (
      <div data-testid="chat-component">
        <p data-testid="welcome-message">Hi! I&apos;m CareerAC, your transfer planning assistant.</p>
        <button
          data-testid="mock-generate-plan"
          onClick={() => {
            const mockPlan = {
              ccName: "Test CC",
              targetUniversity: "Test University",
              targetMajor: "Computer Science",
              semesters: [{ courses: [] }],
              totalUnits: 0,
            };
            onPlanGenerated?.(mockPlan);
            onSavePlan?.(mockPlan, [{ id: "1", role: "user", parts: [] }]);
          }}
        >
          Generate Plan
        </button>
        <button
          data-testid="mock-generate-second-plan"
          onClick={() => {
            const mockPlan = {
              ccName: "Another CC",
              targetUniversity: "Another University",
              targetMajor: "Mathematics",
              semesters: [{ courses: [] }],
              totalUnits: 0,
            };
            onPlanGenerated?.(mockPlan);
            onSavePlan?.(mockPlan, [{ id: "2", role: "user", parts: [] }]);
          }}
        >
          Generate Second Plan
        </button>
      </div>
    );
  }),
}));

// Mock the SemesterPlan component
vi.mock("@/components/semester-plan", () => ({
  default: vi.fn(() => (
    <div data-testid="semester-plan">
      <p>Plan rendered</p>
    </div>
  )),
}));

// Track fetch calls for save verification
const fetchCalls: Array<{ url: string; options: RequestInit }> = [];

beforeEach(() => {
  vi.clearAllMocks();
  fetchCalls.length = 0;
  global.fetch = vi.fn(async (url: string | URL | Request, options?: RequestInit) => {
    fetchCalls.push({ url: url.toString(), options: options || {} });
    return {
      ok: true,
      status: 201,
      json: async () => ({ id: "plan-id-" + (fetchCalls.length) }),
    } as Response;
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("NewPlanPage", () => {
  it("renders the page with chat panel and plan display area", () => {
    render(<NewPlanPage />);

    expect(screen.getByText("Create a New Plan")).toBeInTheDocument();
    expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    // Plan area shows empty state initially
    expect(screen.getByText("Your plan will appear here")).toBeInTheDocument();
  });

  it("shows the chat component with welcome message", () => {
    render(<NewPlanPage />);

    const welcomeEl = screen.getByTestId("welcome-message");
    expect(welcomeEl).toBeInTheDocument();
  });

  it("has a split layout with chat panel on left and plan display on right", () => {
    render(<NewPlanPage />);

    expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    const planArea = screen.getByText("Your plan will appear here").closest("div");
    expect(planArea).toBeInTheDocument();
  });

  it("shows empty state when no plan has been generated", () => {
    render(<NewPlanPage />);

    expect(screen.getByText("Your plan will appear here")).toBeInTheDocument();
    expect(
      screen.getByText(/Tell the AI your community college, target school, and major/)
    ).toBeInTheDocument();
  });

  it("saves first plan when generated", async () => {
    vi.useFakeTimers();
    render(<NewPlanPage />);

    // Generate first plan
    await act(async () => {
      fireEvent.click(screen.getByTestId("mock-generate-plan"));
      // Advance past the 800ms debounce
      await act(async () => {
        vi.advanceTimersByTime(800);
        // Wait for the async save operation
        await Promise.resolve();
        await Promise.resolve();
      });
    });

    // Verify fetch was called to save the plan
    const saveCalls = fetchCalls.filter(call => call.options?.method === "POST");
    expect(saveCalls.length).toBeGreaterThanOrEqual(1);

    // Verify the first save call has correct data
    const firstSaveBody = JSON.parse(saveCalls[0]?.options?.body as string || "{}");
    expect(firstSaveBody.title).toContain("Test CC");
    expect(firstSaveBody.target_major).toBe("Computer Science");
  });

  it("allows saving a second plan after the first one is saved (remount scenario)", async () => {
    vi.useFakeTimers();

    // First render: generate and save first plan
    const { unmount } = render(<NewPlanPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("mock-generate-plan"));
      await act(async () => {
        vi.advanceTimersByTime(800);
        await Promise.resolve();
        await Promise.resolve();
      });
    });

    const firstSaveCalls = fetchCalls.filter(call => call.options?.method === "POST");
    expect(firstSaveCalls.length).toBeGreaterThanOrEqual(1);

    // Simulate navigating away and back (component unmount + remount)
    // This is what happens when user goes Dashboard -> New Plan
    unmount();
    fetchCalls.length = 0;

    render(<NewPlanPage />);

    // Generate second plan on the fresh component
    await act(async () => {
      fireEvent.click(screen.getByTestId("mock-generate-second-plan"));
      await act(async () => {
        vi.advanceTimersByTime(800);
        await Promise.resolve();
        await Promise.resolve();
      });
    });

    // Verify second plan was saved to API
    const secondSaveCalls = fetchCalls.filter(call => call.options?.method === "POST");
    expect(secondSaveCalls.length).toBeGreaterThanOrEqual(1);

    // Verify the second save has DIFFERENT data (proves it's a new plan, not a duplicate)
    const secondSaveBody = JSON.parse(secondSaveCalls[0]?.options?.body as string || "{}");
    expect(secondSaveBody.title).toContain("Another CC");
    expect(secondSaveBody.target_major).toBe("Mathematics");
  });
});
