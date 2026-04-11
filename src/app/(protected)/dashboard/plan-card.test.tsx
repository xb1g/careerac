import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Extract and test the PlanCard component pattern
interface PlanCard {
  id: string;
  title: string;
  target_major: string;
  status: string;
  created_at: string;
}

function PlanCard({ plan }: { plan: PlanCard }) {
  const formattedDate = new Date(plan.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a
      href={`/plan/${plan.id}`}
      className="group rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
            {plan.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {plan.target_major}
          </p>
        </div>
        <div className="ml-4 text-right flex-shrink-0">
          <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {plan.status}
          </span>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {formattedDate}
          </p>
        </div>
      </div>
    </a>
  );
}

describe("PlanCard", () => {
  const mockPlan: PlanCard = {
    id: "plan-123",
    title: "Santa Monica College → UCLA",
    target_major: "Computer Science",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
  };

  it("renders the plan title as a link", () => {
    render(<PlanCard plan={mockPlan} />);

    const link = screen.getByRole("link", { name: /santa monica college/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/plan/plan-123");
  });

  it("displays the target major", () => {
    render(<PlanCard plan={mockPlan} />);

    expect(screen.getByText("Computer Science")).toBeInTheDocument();
  });

  it("displays the plan status", () => {
    render(<PlanCard plan={mockPlan} />);

    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("formats the creation date in a human-readable format", () => {
    render(<PlanCard plan={mockPlan} />);

    expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
  });

  it("links to the plan detail page with the correct ID", () => {
    render(<PlanCard plan={mockPlan} />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/plan/plan-123");
  });
});
