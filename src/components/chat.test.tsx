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

  describe("Auto-save functionality", () => {
    const mockPlanJson = JSON.stringify({
      ccName: "Santa Monica College",
      targetUniversity: "UCLA",
      targetMajor: "Computer Science",
      semesters: [
        {
          number: 1,
          label: "Fall 2024",
          courses: [
            {
              code: "CS 1",
              title: "Introduction to Computer Science",
              units: 4,
              transferEquivalency: "UCLA CS 31",
              prerequisites: [],
              notes: "",
            },
          ],
        },
      ],
      totalUnits: 60,
    });

    it("calls onSavePlan when a complete plan is detected after streaming finishes", () => {
      const onSavePlan = vi.fn();
      const onPlanGenerated = vi.fn();

      mockUseChat.mockReturnValue({
        messages: [
          {
            id: "welcome",
            role: "assistant",
            parts: [{ type: "text", text: "Welcome!" }],
          },
          {
            id: "user-1",
            role: "user",
            parts: [{ type: "text", text: "Help me plan" }],
          },
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: `Here is your plan:\n\`\`\`json\n${mockPlanJson}\n\`\`\`` }],
          },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        error: undefined,
        clearError: vi.fn(),
      });

      render(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      expect(onPlanGenerated).toHaveBeenCalledTimes(1);
      expect(onPlanGenerated).toHaveBeenCalledWith(expect.objectContaining({
        ccName: "Santa Monica College",
        targetUniversity: "UCLA",
        targetMajor: "Computer Science",
      }));

      expect(onSavePlan).toHaveBeenCalledTimes(1);
      expect(onSavePlan).toHaveBeenCalledWith(
        expect.objectContaining({ ccName: "Santa Monica College" }),
        expect.arrayContaining([
          expect.objectContaining({ id: "welcome" }),
          expect.objectContaining({ id: "user-1" }),
          expect.objectContaining({ id: "assistant-1" }),
        ]),
      );
    });

    it("does NOT call onSavePlan while streaming is in progress", () => {
      const onSavePlan = vi.fn();
      const onPlanGenerated = vi.fn();

      // Simulate mid-streaming state with partial plan
      mockUseChat.mockReturnValue({
        messages: [
          {
            id: "welcome",
            role: "assistant",
            parts: [{ type: "text", text: "Welcome!" }],
          },
          {
            id: "user-1",
            role: "user",
            parts: [{ type: "text", text: "Help me plan" }],
          },
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: `Here is your plan:\n\`\`\`json\n${mockPlanJson}` }],
          },
        ],
        sendMessage: vi.fn(),
        status: "streaming",
        error: undefined,
        clearError: vi.fn(),
      });

      render(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      expect(onPlanGenerated).not.toHaveBeenCalled();
      expect(onSavePlan).not.toHaveBeenCalled();
    });

    it("does NOT call onSavePlan while status is submitted (waiting for AI)", () => {
      const onSavePlan = vi.fn();
      const onPlanGenerated = vi.fn();

      mockUseChat.mockReturnValue({
        messages: [
          {
            id: "welcome",
            role: "assistant",
            parts: [{ type: "text", text: "Welcome!" }],
          },
          {
            id: "user-1",
            role: "user",
            parts: [{ type: "text", text: "Help me plan" }],
          },
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: `Here is your plan:\n\`\`\`json\n${mockPlanJson}\n\`\`\`` }],
          },
        ],
        sendMessage: vi.fn(),
        status: "submitted",
        error: undefined,
        clearError: vi.fn(),
      });

      render(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      expect(onPlanGenerated).not.toHaveBeenCalled();
      expect(onSavePlan).not.toHaveBeenCalled();
    });

    it("calls onPlanGenerated for no-data responses (but savePlan skips them)", () => {
      const onSavePlan = vi.fn();
      const onPlanGenerated = vi.fn();

      mockUseChat.mockReturnValue({
        messages: [
          {
            id: "welcome",
            role: "assistant",
            parts: [{ type: "text", text: "Welcome!" }],
          },
          {
            id: "user-1",
            role: "user",
            parts: [{ type: "text", text: "Help me plan" }],
          },
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "Sorry, I don't have data for that path." }],
          },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        error: undefined,
        clearError: vi.fn(),
      });

      render(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      // onPlanGenerated IS called so the UI can show the no-data message
      expect(onPlanGenerated).toHaveBeenCalledTimes(1);
      expect(onPlanGenerated).toHaveBeenCalledWith(
        expect.objectContaining({ isNoData: true }),
      );

      // onSavePlan IS called but the page's savePlan function checks isNoData and returns null
      expect(onSavePlan).toHaveBeenCalledTimes(1);
      expect(onSavePlan).toHaveBeenCalledWith(
        expect.objectContaining({ isNoData: true }),
        expect.any(Array),
      );
    });

    it("does NOT call onSavePlan twice for the same plan message", () => {
      const onSavePlan = vi.fn();
      const onPlanGenerated = vi.fn();

      mockUseChat.mockReturnValue({
        messages: [
          {
            id: "welcome",
            role: "assistant",
            parts: [{ type: "text", text: "Welcome!" }],
          },
          {
            id: "user-1",
            role: "user",
            parts: [{ type: "text", text: "Help me plan" }],
          },
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: `Here is your plan:\n\`\`\`json\n${mockPlanJson}\n\`\`\`` }],
          },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        error: undefined,
        clearError: vi.fn(),
      });

      const { rerender } = render(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      // Rerender with the same messages to simulate React re-render
      rerender(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      // Should only be called once - the first time the plan was detected
      expect(onSavePlan).toHaveBeenCalledTimes(1);
      expect(onPlanGenerated).toHaveBeenCalledTimes(1);
    });

    it("calls onSavePlan when modifying an existing plan (follow-up message)", () => {
      const onSavePlan = vi.fn();
      const onPlanGenerated = vi.fn();

      // Simulate a follow-up conversation where a plan already exists
      mockUseChat.mockReturnValue({
        messages: [
          {
            id: "welcome",
            role: "assistant",
            parts: [{ type: "text", text: "Welcome!" }],
          },
          {
            id: "user-1",
            role: "user",
            parts: [{ type: "text", text: "Help me plan" }],
          },
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: `Here is your plan:\n\`\`\`json\n${mockPlanJson}\n\`\`\`` }],
          },
          {
            id: "user-2",
            role: "user",
            parts: [{ type: "text", text: "Move CS 1 to semester 2" }],
          },
          {
            id: "assistant-2",
            role: "assistant",
            parts: [{ type: "text", text: "Here is your updated plan:\n\`\`\`json\n" + JSON.stringify({
              ccName: "Santa Monica College",
              targetUniversity: "UCLA",
              targetMajor: "Computer Science",
              semesters: [
                {
                  number: 1,
                  label: "Fall 2024",
                  courses: [],
                },
                {
                  number: 2,
                  label: "Spring 2025",
                  courses: [
                    {
                      code: "CS 1",
                      title: "Introduction to Computer Science",
                      units: 4,
                      transferEquivalency: "UCLA CS 31",
                      prerequisites: [],
                      notes: "",
                    },
                  ],
                },
              ],
              totalUnits: 60,
            }) + "\n\`\`\`" }],
          },
        ],
        sendMessage: vi.fn(),
        status: "ready",
        error: undefined,
        clearError: vi.fn(),
      });

      render(<Chat onSavePlan={onSavePlan} onPlanGenerated={onPlanGenerated} />);

      // Should save the updated plan
      expect(onPlanGenerated).toHaveBeenCalledTimes(1);
      expect(onSavePlan).toHaveBeenCalledTimes(1);
    });
  });
});
