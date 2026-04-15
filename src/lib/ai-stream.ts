/**
 * AI streaming module.
 * Handles message conversion, MiniMax API calls, and SSE response encoding.
 * This is the ONLY file that knows about the MiniMax wire protocol.
 */

import { createUIMessageStreamResponse } from "ai";
import type { UIMessage } from "ai";

// ---------------------------------------------------------------------------
// Message conversion
// ---------------------------------------------------------------------------

interface AnthropicMessage {
  role: "user" | "assistant";
  content: Array<{ type: "text"; text: string }>;
}

/**
 * Converts UIMessage[] (from @ai-sdk/react) → Anthropic message format
 * for the MiniMax API, filtering out system messages.
 */
export function convertToAnthropicMessages(
  messages: UIMessage[],
): AnthropicMessage[] {
  return messages
    .map((msg) => {
      let content = "";
      if (Array.isArray(msg.parts)) {
        content = msg.parts
          .filter(
            (part): part is { type: "text"; text: string } =>
              part.type === "text",
          )
          .map((part) => part.text)
          .join("");
      }
      return {
        role: msg.role as "system" | "user" | "assistant",
        content,
      };
    })
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: [{ type: "text" as const, text: msg.content }],
    }));
}

// ---------------------------------------------------------------------------
// MiniMax streaming
// ---------------------------------------------------------------------------

/**
 * Calls the MiniMax API with the assembled system prompt and messages,
 * then returns a streaming SSE Response suitable for the frontend.
 */
export async function streamFromMiniMax(
  systemPrompt: string,
  messages: AnthropicMessage[],
): Promise<Response> {
  const token =
    process.env.MINIMAX_API_KEY ??
    process.env.FIREWORKS_API_KEY ??
    "YOUR_API_KEY";

  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  const body = {
    model: "MiniMax-M2.5",
    system: systemPrompt,
    messages,
    max_tokens: 8192,
    temperature: 0.6,
    top_p: 0.95,
    stream: true,
  };

  const minimaxResponse = await fetch(
    "https://api.minimax.io/anthropic/v1/messages",
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    },
  );

  if (!minimaxResponse.ok) {
    const errorText = await minimaxResponse.text();
    console.error("MiniMax API error:", minimaxResponse.status, errorText);
    return Response.json(
      { error: "AI service error" },
      { status: minimaxResponse.status },
    );
  }

  const messageId = `msg-${Date.now()}`;
  const textId = `text-${Date.now()}`;

  const stream = new ReadableStream({
    async start(controller) {
      const reader = minimaxResponse.body?.getReader();

      if (!reader) {
        controller.error(new Error("No response body"));
        return;
      }

      let started = false;
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += new TextDecoder().decode(value);
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.delta;
                let content = "";

                if (delta) {
                  if (delta.type === "text_delta" && delta.text) {
                    content = delta.text;
                  } else if (delta.type === "thinking_delta") {
                    continue;
                  }
                }

                if (!started) {
                  started = true;
                  controller.enqueue({ type: "start", messageId });
                  controller.enqueue({ type: "text-start", id: textId });
                }

                if (content) {
                  controller.enqueue({ type: "text-delta", id: textId, delta: content });
                }
              } catch {
                // SSE chunks may be incomplete, ignore parse errors
              }
            }
          }
        }

        if (started) {
          controller.enqueue({ type: "text-end", id: textId });
        }
        controller.enqueue({ type: "finish", finishReason: "stop" });
        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);
        controller.error(error);
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}
