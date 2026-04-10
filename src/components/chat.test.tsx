import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chat from "./chat";

// Mock the useChat hook
const mockUseChat = vi.fn();
vi.mock("@ai-sdk/react", () => ({
  useChat: (...args: unknown[]) => mockUseChat(...args),
}));

describe("Chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      clearError: vi.fn(),
    });
  });

  it("renders with a welcome message", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "",
          parts: [{ type: "text", text: "Hello! How can I help?" }],
        },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      clearError: vi.fn(),
    });

    render(<Chat welcomeMessage="Hello! How can I help?" />);

    expect(screen.getByText("Hello! How can I help?")).toBeInTheDocument();
  });

  it("renders input field and send button", () => {
    render(<Chat />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    render(<Chat />);

    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("disables send button when input is whitespace-only", async () => {
    const user = userEvent.setup();
    render(<Chat />);

    const input = screen.getByRole("textbox");
    await user.type(input, "   ");

    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when input has text", async () => {
    const user = userEvent.setup();
    render(<Chat />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).not.toBeDisabled();
  });

  it("shows loading indicator when streaming", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "streaming",
      error: undefined,
      clearError: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("shows loading indicator when submitted", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "submitted",
      error: undefined,
      clearError: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("disables input while streaming", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "streaming",
      error: undefined,
      clearError: vi.fn(),
    });

    render(<Chat />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("shows rate limit error message for 429 errors", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      error: new Error("429 Too Many Requests"),
      clearError: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("Rate limited, try again in a moment")).toBeInTheDocument();
  });

  it("shows server error message for 500 errors", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      error: new Error("500 Internal Server Error"),
      clearError: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("AI temporarily unavailable")).toBeInTheDocument();
  });

  it("shows server error message for 503 errors", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      error: new Error("503 Service Unavailable"),
      clearError: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("AI temporarily unavailable")).toBeInTheDocument();
  });

  it("renders user and assistant messages with different styles", () => {
    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "user",
          content: "",
          parts: [{ type: "text", text: "Hello" }],
        },
        {
          id: "2",
          role: "assistant",
          content: "",
          parts: [{ type: "text", text: "Hi there!" }],
        },
      ],
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      clearError: vi.fn(),
    });

    render(<Chat />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });
});
