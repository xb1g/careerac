import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the Chat component so we don't hit useChat/transport layers.
// A stable nodeId lets us verify Chat stays mounted across open/close cycles.
vi.mock("./chat", () => ({
  __esModule: true,
  default: ({ welcomeMessage }: { welcomeMessage?: string }) => (
    <div data-testid="mock-chat" data-nodeid="stable">
      {welcomeMessage ?? "default-welcome"}
    </div>
  ),
}));

import ChatWidget from "./chat-widget";

describe("ChatWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders FAB visible and panel open by default", () => {
    render(<ChatWidget />);

    expect(screen.getByTestId("chat-widget-fab")).toBeInTheDocument();
    expect(screen.getByTestId("chat-widget-fab")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByTestId("chat-widget-panel")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });

  it("toggles aria-hidden on the panel when FAB is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatWidget defaultOpen={false} />);

    const panel = screen.getByTestId("chat-widget-panel");
    expect(panel).toHaveAttribute("aria-hidden", "true");

    await user.click(screen.getByTestId("chat-widget-fab"));
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  it("minimize button closes the panel", async () => {
    const user = userEvent.setup();
    render(<ChatWidget defaultOpen />);

    const panel = screen.getByTestId("chat-widget-panel");
    expect(panel).toHaveAttribute("aria-hidden", "false");

    await user.click(screen.getByTestId("chat-widget-minimize"));
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("opens at mount when defaultOpen is true", () => {
    render(<ChatWidget defaultOpen />);

    expect(screen.getByTestId("chat-widget-panel")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    expect(screen.getByTestId("chat-widget-fab")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes on Escape key when open", () => {
    render(<ChatWidget defaultOpen />);

    const panel = screen.getByTestId("chat-widget-panel");
    expect(panel).toHaveAttribute("aria-hidden", "false");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps <Chat> mounted across open/close cycles", async () => {
    const user = userEvent.setup();
    render(<ChatWidget defaultOpen />);

    const chatNodeWhenOpen = screen.getByTestId("mock-chat");
    expect(chatNodeWhenOpen).toBeInTheDocument();

    await user.click(screen.getByTestId("chat-widget-minimize"));
    const chatNodeWhenClosed = screen.getByTestId("mock-chat");
    expect(chatNodeWhenClosed).toBeInTheDocument();
    expect(chatNodeWhenClosed).toBe(chatNodeWhenOpen);

    await user.click(screen.getByTestId("chat-widget-fab"));
    const chatNodeReopened = screen.getByTestId("mock-chat");
    expect(chatNodeReopened).toBe(chatNodeWhenOpen);
  });

  it("forwards chat props to <Chat>", () => {
    render(
      <ChatWidget defaultOpen welcomeMessage="Hello widget consumer" />,
    );

    expect(screen.getByTestId("mock-chat")).toHaveTextContent(
      "Hello widget consumer",
    );
  });

  it("fires onOpenChange when toggled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ChatWidget defaultOpen={false} onOpenChange={onOpenChange} />);

    // First call on mount (open=false)
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await user.click(screen.getByTestId("chat-widget-fab"));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByTestId("chat-widget-minimize"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
