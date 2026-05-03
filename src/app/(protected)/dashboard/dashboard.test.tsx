import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";
import DashboardPage from "./page";
import { vi } from "vitest";

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

// Mock Supabase and fetchPlanDetail
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user" } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: { id: "test-plan-id" } })),
            })),
          })),
        })),
      })),
    })),
  })),
}));

vi.mock("@/utils/fetch-plan-detail", () => ({
  fetchPlanDetail: vi.fn(() => Promise.resolve({
    plan: {
      id: "test-plan-id",
      title: "Test Plan",
      target_major: "Computer Science",
      plan_data: { semesters: [] },
      chat_history: [],
    },
    transcript: null,
  })),
}));

vi.mock("../plan/[id]/plan-detail-client", () => ({
  default: ({
    plan,
    chatDefaultOpen,
  }: {
    plan: { title: string };
    chatDefaultOpen?: boolean;
  }) => (
    <div data-testid="plan-detail-client">
      <h1>{plan.title}</h1>
      <span data-testid="chat-default-open">{String(chatDefaultOpen)}</span>
    </div>
  ),
}));

describe("Dashboard Empty State", () => {
  it("renders the heading", () => {
    render(<EmptyState />);
    expect(screen.getByRole("heading", { name: /no plans yet/i })).toBeInTheDocument();
  });

  it("renders descriptive text about creating a transfer plan", () => {
    render(<EmptyState />);
    expect(screen.getByText(/transfer plan/i)).toBeInTheDocument();
  });

  it("renders a CTA link to /plan/new", () => {
    render(<EmptyState />);
    const ctaLink = screen.getByRole("link", { name: /create your first plan/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.getAttribute("href")).toBe("/plan/new");
  });

  it("renders an icon in the empty state", () => {
    render(<EmptyState />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("DashboardPage", () => {
  it("renders PlanDetailClient when plan exists", async () => {
    const component = await DashboardPage();
    render(component);
    expect(screen.getByTestId("plan-detail-client")).toBeInTheDocument();
    expect(screen.getByText("Test Plan")).toBeInTheDocument();
    expect(screen.getByTestId("chat-default-open")).toHaveTextContent("false");
  });
});
