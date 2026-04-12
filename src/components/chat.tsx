"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { ParsedPlan } from "@/types/plan";
import { parsePlanFromAIResponse } from "@/utils/plan-parser";
import RecoveryMessage, { RecoveryAlternative } from "./recovery-message";

export interface RecoveryContext {
  failedCourseCode: string;
  failedCourseTitle: string;
  status: "failed" | "cancelled" | "waitlisted";
  planData: Record<string, unknown> | null;
}

interface ChatProps {
  welcomeMessage?: string;
  className?: string;
  onPlanGenerated?: (plan: ParsedPlan) => void;
  /** Called with (plan, fullMessages) for auto-save */
  onSavePlan?: (plan: ParsedPlan, messages: unknown[]) => void;
  /** Initial chat messages to load (for existing plan editing) */
  initialMessages?: UIMessage[];
  /** Recovery context for triggering AI recovery conversation */
  recoveryContext?: RecoveryContext | null;
  /** Called when a recovery alternative is accepted */
  onAcceptAlternative?: (alternative: RecoveryAlternative, planId: string) => Promise<void>;
  /** The current plan ID for recovery acceptance */
  planId?: string | null;
}

export default function Chat({
  welcomeMessage = "Hi! I'm CareerAC, your transfer planning assistant. Tell me about your community college, where you want to transfer, and what you'd like to study. I'll help you build a personalized semester-by-semester plan.",
  className = "",
  onPlanGenerated,
  onSavePlan,
  initialMessages,
  recoveryContext,
  onAcceptAlternative,
  planId,
}: ChatProps) {
  const [input, setInput] = useState("");
  const lastProcessedMessageId = useRef<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const recoverySentRef = useRef<string | null>(null);

  const defaultMessages: UIMessage[] = [
    {
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: welcomeMessage }],
    } as unknown as UIMessage,
  ];

  const { messages, sendMessage, status, error, clearError } = useChat({
    messages: initialMessages && initialMessages.length > 0 ? initialMessages : defaultMessages,
  });

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  const isInputEmpty = input.trim().length === 0;

  // Send recovery system message when recovery context changes
  useEffect(() => {
    if (!recoveryContext || isLoading) return;

    // Create a unique key for this recovery to avoid duplicate messages
    const recoveryKey = `${recoveryContext.failedCourseCode}-${recoveryContext.status}-${recoveryContext.failedCourseTitle}`;
    if (recoverySentRef.current === recoveryKey) return;

    recoverySentRef.current = recoveryKey;

    // Send a system message to trigger recovery
    const statusLabel = recoveryContext.status === "waitlisted"
      ? "waitlisted"
      : recoveryContext.status === "cancelled"
      ? "cancelled"
      : "failed";

    sendMessage({
      text: `[SYSTEM: Recovery needed] The student has marked "${recoveryContext.failedCourseCode} (${recoveryContext.failedCourseTitle})" as ${statusLabel}. Please analyze the impact and suggest alternatives.`,
    });
  }, [recoveryContext, isLoading, sendMessage]);

  // Check the latest assistant message for a plan
  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop();

  useEffect(() => {
    if (!lastAssistantMessage || lastAssistantMessage.id === lastProcessedMessageId.current) return;

    // Only process plans when streaming is complete to avoid saving partial/incomplete data
    if (isLoading) return;

    const textParts = lastAssistantMessage.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { text: string }).text)
      .join("\n");

    if (!textParts) return;

    const parsed = parsePlanFromAIResponse(textParts);
    if (parsed) {
      lastProcessedMessageId.current = lastAssistantMessage.id;
      onPlanGenerated?.(parsed);
      // Auto-save the plan with full chat history
      onSavePlan?.(parsed, messages);
    } else if (messages.length > 2) {
      // Even if no plan parsed, save chat updates for existing plans
      const hasPlan = messages.some((m) => {
        if (m.role !== "assistant") return false;
        const parts = m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("\n");
        return parsePlanFromAIResponse(parts) !== null;
      });
      if (hasPlan) {
        // There's a plan in history - save the updated messages
        const existingPlan = messages
          .filter((m) => m.role === "assistant")
          .map((m) => m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("\n"))
          .map(parsePlanFromAIResponse)
          .find((p): p is ParsedPlan => p !== null && !("isNoData" in p && p.isNoData));

        if (existingPlan) {
          onSavePlan?.(existingPlan, messages);
        }
      }
    }
  }, [lastAssistantMessage, onPlanGenerated, onSavePlan, messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInputEmpty || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  const handleAcceptAlternative = useCallback(async (alternative: RecoveryAlternative) => {
    if (!planId || !onAcceptAlternative) return;
    setIsAccepting(true);
    try {
      await onAcceptAlternative(alternative, planId);
    } catch (err) {
      console.error("Failed to accept alternative:", err);
    } finally {
      setIsAccepting(false);
    }
  }, [planId, onAcceptAlternative]);

  // Parse recovery alternatives from the latest recovery message
  const parseRecoveryAlternatives = useCallback((text: string): {
    alternatives: RecoveryAlternative[];
    noAlternatives: boolean;
    dependentCourses: string[];
  } => {
    const alternatives: RecoveryAlternative[] = [];
    const dependentCourses: string[] = [];

    // Check for "no alternatives" message
    const hasNoAlternatives = /no alternative.*found/i.test(text) && /consult.*counselor|consult.*academic|no suitable/i.test(text);

    // Parse dependent courses
    // Look for lines that list affected courses
    const affectedMatch = text.match(/(?:affected|dependent).*?(?:courses?:?\s*)((?:\n|.)*?)(?=\n\n|💡|alternative|No alternative)/i);
    if (affectedMatch) {
      const lines = affectedMatch[1].split("\n").filter(l => l.trim());
      for (const line of lines) {
        const cleaned = line.replace(/^[\s•\-*]+\s*/, "").trim();
        if (cleaned) dependentCourses.push(cleaned);
      }
    }

    // Parse alternative suggestions: **CODE** — Title (units units) — Transfer
    const altPattern = /\*\*(\w[\w\s]+\d+\w*)\*\*\s*[—–-]\s*([^(]+?)\s*\((\d+)\s+units?\)\s*[—–-]\s*([^\n.]+)/g;
    let match;
    while ((match = altPattern.exec(text)) !== null) {
      // Get reasoning from text after the alternative
      const restOfText = text.substring(match.index + match[0].length);
      const reasoningMatch = restOfText.match(/^(?:Reasoning:?\s*)?([^*\n]{20,})/i);
      const reasoning = reasoningMatch
        ? reasoningMatch[1].trim()
        : `This course could substitute for the failed/cancelled course.`;

      alternatives.push({
        code: match[1].trim(),
        title: match[2].trim(),
        units: parseInt(match[3], 10),
        transferEquivalency: match[4].trim(),
        reasoning,
      });
    }

    return {
      alternatives,
      noAlternatives: hasNoAlternatives || alternatives.length === 0,
      dependentCourses,
    };
  }, []);

  // Find the latest recovery message and parse it
  const recoveryMessage = messages
    .filter((m) => m.role === "assistant")
    .reverse()
    .find((m) => {
      const text = m.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { text: string }).text)
        .join("\n");
      return text.includes("[SYSTEM: Recovery needed]") || text.includes("Recovery needed");
    });

  const recoveryParsed = recoveryMessage
    ? parseRecoveryAlternatives(
        recoveryMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => (p as { text: string }).text)
          .join("\n")
      )
    : null;

  const showRecoveryUI = recoveryContext && recoveryMessage && !isLoading && recoveryParsed;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  const text = (part as { text: string }).text;
                  // Hide system messages but still process them
                  if (text.startsWith("[SYSTEM:")) {
                    return null;
                  }
                  return (
                    <div key={`${message.id}-${i}`} className="whitespace-pre-wrap text-sm">
                      {text}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {/* Recovery message UI */}
        {showRecoveryUI && recoveryContext && recoveryParsed && (
          <div className="flex justify-start">
            <div className="max-w-full w-full" data-testid="recovery-message">
              <RecoveryMessage
                failedCourseCode={recoveryContext.failedCourseCode}
                failedCourseTitle={recoveryContext.failedCourseTitle}
                status={recoveryContext.status}
                dependentCourses={recoveryParsed.dependentCourses}
                alternatives={recoveryParsed.alternatives}
                noAlternatives={recoveryParsed.noAlternatives}
                onAcceptAlternative={handleAcceptAlternative}
                isAccepting={isAccepting}
              />
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" />
                </div>
                <span>{recoveryContext ? "Analyzing recovery options..." : "Thinking..."}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 max-w-[85%]">
              <p className="text-sm text-red-700 dark:text-red-300">
                {getErrorMessage(error)}
              </p>
              <button
                onClick={() => clearError()}
                className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Describe your transfer goals..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={isInputEmpty || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function getErrorMessage(error: Error): string {
  const message = error.message || "";

  // Check for rate limit errors (429)
  if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
    return "Rate limited, try again in a moment";
  }

  // Check for server errors (5xx)
  if (
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504")
  ) {
    return "AI temporarily unavailable";
  }

  // Check for error response body content
  if (message.includes("AI temporarily unavailable")) {
    return "AI temporarily unavailable";
  }
  if (message.includes("Rate limited")) {
    return "Rate limited, try again in a moment";
  }

  // Generic error
  return "Something went wrong. Please try again.";
}
