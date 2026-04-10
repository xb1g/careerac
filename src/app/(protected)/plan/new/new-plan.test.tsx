import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NewPlanPage from "./page";

// Mock the Chat component
vi.mock("@/components/chat", () => ({
  default: vi.fn(() => (
    <div data-testid="chat-component">
      <p data-testid="welcome-message">Hi! I&apos;m CareerAC, your transfer planning assistant.</p>
    </div>
  )),
}));

// Mock the SemesterPlan component
vi.mock("@/components/semester-plan", () => ({
  default: vi.fn(() => (
    <div data-testid="semester-plan">
      <p>Plan rendered</p>
    </div>
  )),
}));

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
});
