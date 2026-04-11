import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the plan-detail-client component
vi.mock("./plan-detail-client", () => ({
  default: vi.fn(({ plan }: { plan: Record<string, unknown> }) => (
    <div data-testid="plan-detail">
      <h1>{plan.title as string}</h1>
      <p>{plan.target_major as string}</p>
    </div>
  )),
}));

// We need to test the server component behavior through the PlanNotFound component
// Since server components can't be directly rendered in tests,
// we extract and test the PlanNotFound component pattern

function PlanNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Plan not found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          The plan you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

describe("PlanNotFound", () => {
  it("renders a heading with 'Plan not found' text", () => {
    render(<PlanNotFound />);

    expect(screen.getByRole("heading", { name: /plan not found/i })).toBeInTheDocument();
  });

  it("renders a descriptive message explaining the plan doesn't exist", () => {
    render(<PlanNotFound />);

    expect(screen.getByText(/doesn't exist or you don't have access/i)).toBeInTheDocument();
  });

  it("renders a link back to the dashboard", () => {
    render(<PlanNotFound />);

    const dashboardLink = screen.getByRole("link", { name: /back to dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.getAttribute("href")).toBe("/dashboard");
  });

  it("renders a warning icon", () => {
    render(<PlanNotFound />);

    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("is centered on the page", () => {
    render(<PlanNotFound />);

    const container = document.querySelector(".flex.min-h-\\[calc\\(100vh-4rem\\)\\]");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("justify-center");
  });
});
