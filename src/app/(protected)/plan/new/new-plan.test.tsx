import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NewPlanPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn() }),
}));

vi.mock("@/components/chat", () => ({
  default: vi.fn(function MockChat() {
    return <div data-testid="chat-component">Chat</div>;
  }),
}));

vi.mock("@/components/semester-plan", () => ({
  default: vi.fn(() => <div data-testid="semester-plan">Plan rendered</div>),
}));

describe("NewPlanPage", () => {
  it("renders the upload step first", () => {
    render(<NewPlanPage />);

    expect(screen.getByText("Upload Your Transcript")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip This Step" })).toBeInTheDocument();
  });

  it("shows the config step after skipping upload", () => {
    render(<NewPlanPage />);

    fireEvent.click(screen.getByRole("button", { name: "Skip This Step" }));

    expect(screen.getByText("Plan Settings")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate Plan" })).toBeInTheDocument();
  });

  it("shows the chat step after configuration", () => {
    render(<NewPlanPage />);

    fireEvent.click(screen.getByRole("button", { name: "Skip This Step" }));
    fireEvent.change(screen.getByLabelText("Intended Major"), { target: { value: "Computer Science" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate Plan" }));

    expect(screen.getByTestId("chat-component")).toBeInTheDocument();
    expect(screen.getByText("Your plan will appear here")).toBeInTheDocument();
  });
});
