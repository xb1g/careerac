import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckpointTimeline from "./checkpoint-timeline";

const mockCheckpoints = [
  { id: "cp-1", action_label: "Changed CS101 to failed", created_at: new Date(Date.now() - 60000).toISOString() },
  { id: "cp-2", action_label: "AI updated plan", created_at: new Date(Date.now() - 3600000).toISOString() },
];

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock confirm
global.confirm = vi.fn(() => true);

describe("CheckpointTimeline", () => {
  const onRestore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCheckpoints),
    });
  });

  it("renders toggle button", () => {
    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    expect(screen.getByTestId("checkpoint-toggle")).toBeInTheDocument();
  });

  it("does not show panel initially", () => {
    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    expect(screen.queryByTestId("checkpoint-panel")).not.toBeInTheDocument();
  });

  it("opens panel and fetches checkpoints on toggle click", async () => {
    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    fireEvent.click(screen.getByTestId("checkpoint-toggle"));

    await waitFor(() => {
      expect(screen.getByTestId("checkpoint-panel")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/plan/plan-1/checkpoints");

    await waitFor(() => {
      expect(screen.getByText("Changed CS101 to failed")).toBeInTheDocument();
      expect(screen.getByText("AI updated plan")).toBeInTheDocument();
    });
  });

  it("shows empty state when no checkpoints", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    fireEvent.click(screen.getByTestId("checkpoint-toggle"));

    await waitFor(() => {
      expect(screen.getByText("No history yet. Changes will appear here.")).toBeInTheDocument();
    });
  });

  it("calls restore endpoint and onRestore when undo is clicked", async () => {
    const restoredPlanData = { semesters: [], totalUnits: 0 };
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCheckpoints) }) // fetch checkpoints
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ plan_data: restoredPlanData }) }) // restore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }); // re-fetch checkpoints

    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    fireEvent.click(screen.getByTestId("checkpoint-toggle"));

    await waitFor(() => {
      expect(screen.getByText("Changed CS101 to failed")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("restore-cp-1"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/plan/plan-1/checkpoints/cp-1/restore", {
        method: "POST",
      });
      expect(onRestore).toHaveBeenCalledWith(restoredPlanData);
    });
  });

  it("shows relative time for checkpoints", async () => {
    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    fireEvent.click(screen.getByTestId("checkpoint-toggle"));

    await waitFor(() => {
      expect(screen.getByText("1m ago")).toBeInTheDocument();
      expect(screen.getByText("1h ago")).toBeInTheDocument();
    });
  });

  it("closes panel when close button is clicked", async () => {
    render(<CheckpointTimeline planId="plan-1" onRestore={onRestore} />);
    fireEvent.click(screen.getByTestId("checkpoint-toggle"));

    await waitFor(() => {
      expect(screen.getByTestId("checkpoint-panel")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Close history"));

    expect(screen.queryByTestId("checkpoint-panel")).not.toBeInTheDocument();
  });
});
