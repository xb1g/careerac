"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ParsedPlan } from "@/types/plan";
import { parsePlanFromAIResponse } from "@/utils/plan-parser";
import RecoveryMessage, { RecoveryAlternative } from "./recovery-message";
import type { TranscriptData } from "@/types/transcript";

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
  /** Emits the current chat messages so parent views can persist related actions */
  onMessagesChange?: (messages: UIMessage[]) => void;
  /** Emits loading state for parent UI chrome */
  onLoadingChange?: (isLoading: boolean) => void;
  /** Recovery context for triggering AI recovery conversation */
  recoveryContext?: RecoveryContext | null;
  /** Called when a recovery alternative is accepted */
  onAcceptAlternative?: (alternative: RecoveryAlternative, planId: string) => Promise<void>;
  /** The current plan ID for recovery acceptance */
  planId?: string | null;
  /** Plan context for fetching verified playbooks */
  planContext?: {
    ccInstitutionId?: string;
    targetInstitutionId?: string;
    targetMajor?: string;
  };
  /** Parsed transcript data to pass to AI */
  transcriptData?: TranscriptData;
  /** Max credits per semester (strict limit) */
  maxCreditsPerSemester?: number;
  /** Whether the student has a target school */
  hasTargetSchool?: boolean;
}

export default function Chat({
  welcomeMessage = "Hi! I'm CareerAC, your transfer planning assistant. Tell me about your community college, where you want to transfer, and what you'd like to study. I'll help you build a personalized semester-by-semester plan.",
  className = "",
  onPlanGenerated,
  onSavePlan,
  initialMessages,
  onMessagesChange,
  onLoadingChange,
  recoveryContext,
  onAcceptAlternative,
  planId,
  planContext,
  transcriptData,
  maxCreditsPerSemester,
  hasTargetSchool,
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

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          ...(planContext ? { planContext } : {}),
          ...(transcriptData ? { transcriptData } : {}),
          ...(maxCreditsPerSemester ? { maxCreditsPerSemester } : {}),
          ...(hasTargetSchool !== undefined ? { hasTargetSchool } : {}),
        },
      }),
    [planContext, transcriptData, maxCreditsPerSemester, hasTargetSchool],
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    messages: initialMessages && initialMessages.length > 0 ? initialMessages : defaultMessages,
    transport,
  });

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  const isInputEmpty = input.trim().length === 0;

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

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
    console.log("[Chat] Submit clicked - isInputEmpty:", isInputEmpty, "isLoading:", isLoading, "input:", input);
    if (isInputEmpty || isLoading) return;

    console.log("[Chat] Sending message:", input);
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
    <div className={`flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950 ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 space-y-6 scroll-smooth">
        {messages.map((message) => {
          // Skip mapping system messages to the UI rendering loop entirely
          const isSystem = message.parts.some(p => p.type === "text" && (p as {text: string}).text.startsWith("[SYSTEM:"));
          if (isSystem) return null;

          return (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-[1.25rem] px-5 py-3.5 shadow-sm transition-all duration-300 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm shadow-blue-500/10"
                    : "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-800 dark:text-zinc-200 rounded-bl-sm"
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    const text = (part as { text: string }).text;
                    return (
                      <div key={`${message.id}-${i}`} className="whitespace-pre-wrap text-[15px] leading-relaxed">
                        {text}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}

        {/* Recovery message UI */}
        {showRecoveryUI && recoveryContext && recoveryParsed && (
          <div className="flex justify-start">
            <div className="max-w-[90%] w-full" data-testid="recovery-message">
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
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 rounded-[1.25rem] rounded-bl-sm px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                </div>
                <span className="tracking-wide">
                  {recoveryContext ? "Analyzing recovery options..." : "Thinking..."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-rose-50/90 dark:bg-rose-900/20 backdrop-blur-md border border-rose-200 dark:border-rose-800/50 rounded-[1.25rem] rounded-bl-sm px-5 py-3.5 max-w-[85%] shadow-sm">
              <p className="text-[14px] font-medium text-rose-700 dark:text-rose-300">
                {getErrorMessage(error)}
              </p>
              <button
                onClick={() => clearError()}
                className="mt-2 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 md:px-6 pb-6 md:pb-8 pt-2 bg-gradient-to-t from-[#FAFAFA] dark:from-zinc-950 via-[#FAFAFA]/80 dark:via-zinc-950/80 to-transparent sticky bottom-0 z-10 w-full">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto flex w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Describe your transfer goals..."
            disabled={isLoading}
            className="w-full rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl pl-6 pr-14 py-4 text-[15px] text-zinc-900 dark:text-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] placeholder-zinc-400 dark:placeholder-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={isInputEmpty || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-300 disabled:opacity-0 disabled:scale-90 scale-100 cursor-pointer"
            aria-label="Send message"
          >
            <svg className="w-4 h-4 translate-x-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
            </svg>
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
