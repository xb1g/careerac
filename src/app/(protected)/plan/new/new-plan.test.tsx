import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          universities: [
            { id: "ucla", name: "University of California, Los Angeles", abbreviation: "UCLA" },
            { id: "ucb", name: "University of California, Berkeley", abbreviation: "UC Berkeley" },
          ],
        }),
      })),
    );
  });

  it("renders the upload step first", () => {
    render(<NewPlanPage />);

    expect(screen.getByText("Upload Your Transcript")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip This Step" })).toBeInTheDocument();
  });

  it("uses a wrapping mobile step grid instead of horizontal scrolling", () => {
    render(<NewPlanPage />);

    const stepIndicator = screen.getByTestId("new-plan-step-indicator");
    expect(stepIndicator).toHaveClass("grid", "grid-cols-2", "sm:flex");
    expect(stepIndicator).not.toHaveClass("overflow-x-auto");
  });

  it("shows the config step after skipping upload", () => {
    render(<NewPlanPage />);

    fireEvent.click(screen.getByRole("button", { name: "Skip This Step" }));

    expect(screen.getByText("Plan Settings")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate Plan" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse Available Courses" })).toHaveAttribute("href", "/courses");
  });

  it("goes straight to plan generation for best-fit mode", () => {
    render(<NewPlanPage />);

    fireEvent.click(screen.getByRole("button", { name: "Skip This Step" }));
    fireEvent.change(screen.getByLabelText("Intended Major"), { target: { value: "Computer Science" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate Plan" }));

    expect(screen.getByTestId("chat-widget-panel")).toBeInTheDocument();
    expect(screen.queryByText("Compare Schools")).not.toBeInTheDocument();
  });

  it("opens school catalog selection when schools-in-mind mode is selected", async () => {
    render(<NewPlanPage />);

    fireEvent.click(screen.getByRole("button", { name: "Skip This Step" }));
    fireEvent.change(screen.getByLabelText("Intended Major"), { target: { value: "Computer Science" } });
    fireEvent.click(screen.getAllByRole("radio")[1]);
    fireEvent.change(screen.getByLabelText("Primary target school"), { target: { value: "UCLA" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate Plan" }));

    expect(screen.getByText("Compare Schools")).toBeInTheDocument();
    expect(await screen.findByText("University of California, Los Angeles")).toBeInTheDocument();
  });
});
