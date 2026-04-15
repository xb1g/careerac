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

export interface AnthropicMessage {
  role: "user" | "assistant";
  content: Array<{ type: "text"; text: string }>;
}

interface MiniMaxTextBlock {
  type?: string;
  text?: string;
}

interface MiniMaxMessageResponse {
  content?: MiniMaxTextBlock[];
}

export class MiniMaxApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "MiniMaxApiError";
  }
}

function getMiniMaxToken(): string {
  return (
    process.env.MINIMAX_API_KEY ??
    process.env.FIREWORKS_API_KEY ??
    "YOUR_API_KEY"
  );
}

function buildMiniMaxRequestBody(
  systemPrompt: string,
  messages: AnthropicMessage[],
  stream: boolean,
) {
  return {
    model: "MiniMax-M2.5",
    system: systemPrompt,
    messages,
    max_tokens: 8192,
    temperature: 0.6,
    top_p: 0.95,
    stream,
  };
}

async function callMiniMax(
  systemPrompt: string,
  messages: AnthropicMessage[],
  stream: boolean,
): Promise<Response> {
  const minimaxResponse = await fetch(
    "https://api.minimax.io/anthropic/v1/messages",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getMiniMaxToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildMiniMaxRequestBody(systemPrompt, messages, stream)),
    },
  );

  if (!minimaxResponse.ok) {
    const errorText = await minimaxResponse.text();
    throw new MiniMaxApiError(
      `MiniMax API error: ${minimaxResponse.status} - ${errorText}`,
      minimaxResponse.status,
    );
  }

  return minimaxResponse;
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
  let minimaxResponse: Response;

  try {
    minimaxResponse = await callMiniMax(systemPrompt, messages, true);
  } catch (error) {
    if (error instanceof MiniMaxApiError) {
      console.error("MiniMax API error:", error.status, error.message);
      return Response.json(
        { error: "AI service error" },
        { status: error.status },
      );
    }

    throw error;
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

export async function generateTextFromMiniMax(
  systemPrompt: string,
  messages: AnthropicMessage[],
): Promise<string> {
  const minimaxResponse = await callMiniMax(systemPrompt, messages, false);
  const data = (await minimaxResponse.json()) as MiniMaxMessageResponse;
  const text = (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text ?? "")
    .join("");

  if (!text.trim()) {
    throw new Error("No content returned from MiniMax");
  }

  return text;
}
