"use client";

import { useChat, UIMessage } from "@ai-sdk/react";
import { useState } from "react";

interface ChatProps {
  welcomeMessage?: string;
  className?: string;
}

export default function Chat({
  welcomeMessage = "Hi! I'm CareerAC, your transfer planning assistant. Tell me about your community college, where you want to transfer, and what you'd like to study. I'll help you build a personalized semester-by-semester plan.",
  className = "",
}: ChatProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, clearError } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: "",
        parts: [{ type: "text", text: welcomeMessage }],
      } as UIMessage,
    ],
  });

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  const isInputEmpty = input.trim().length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInputEmpty || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

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
                  return (
                    <div key={`${message.id}-${i}`} className="whitespace-pre-wrap text-sm">
                      {part.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

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
                <span>Thinking...</span>
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
