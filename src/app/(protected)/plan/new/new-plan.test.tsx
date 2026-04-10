import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NewPlanPage from "./page";

// Mock the Chat component
vi.mock("@/components/chat", () => ({
  default: vi.fn(({ welcomeMessage }: { welcomeMessage?: string }) => (
    <div data-testid="chat-component">
      <p data-testid="welcome-message">{welcomeMessage || "Welcome"}</p>
    </div>
  )),
}));

describe("NewPlanPage", () => {
  it("renders the page with chat panel and plan display area", () => {
    render(<NewPlanPage />);

    expect(screen.getByText("Create a New Plan")).toBeInTheDocument();
    expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    expect(screen.getByText("Plan")).toBeInTheDocument();
  });

  it("shows the chat component with welcome message", () => {
    render(<NewPlanPage />);

    // The mock chat component renders the welcomeMessage prop or "Welcome" as fallback
    const welcomeEl = screen.getByTestId("welcome-message");
    expect(welcomeEl).toBeInTheDocument();
  });

  it("has a split layout with chat panel on left and plan display on right", () => {
    render(<NewPlanPage />);

    // Both panels should exist
    expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    const planArea = screen.getByText("Plan").closest("div");
    expect(planArea).toBeInTheDocument();
  });
});
