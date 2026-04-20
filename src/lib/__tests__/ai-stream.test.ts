import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateTextFromMiniMax } from "@/lib/ai-stream";

describe("generateTextFromMiniMax", () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.MINIMAX_API_KEY;

  beforeEach(() => {
    process.env.MINIMAX_API_KEY = "test-key";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.MINIMAX_API_KEY = originalApiKey;
    vi.restoreAllMocks();
  });

  it("returns concatenated text content from the MiniMax response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          { type: "text", text: "```json\n" },
          { type: "text", text: '{"ccName":"De Anza College"}' },
          { type: "text", text: "\n```" },
        ],
      }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await generateTextFromMiniMax("SYSTEM", [
      {
        role: "user",
        content: [{ type: "text", text: "Generate a plan" }],
      },
    ]);

    expect(result).toBe("```json\n{\"ccName\":\"De Anza College\"}\n```");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.minimaxi.com/anthropic/v1/messages");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer test-key");

    const body = JSON.parse(init.body as string);
    expect(body.stream).toBe(false);
    expect(body.system).toBe("SYSTEM");
    expect(body.messages).toHaveLength(1);
  });

  it("throws a clear error when MiniMax returns a non-OK response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => "upstream unavailable",
    }) as unknown as typeof fetch;

    await expect(generateTextFromMiniMax("SYSTEM", [])).rejects.toThrow(
      /MiniMax API error: 503/,
    );
  });
});
