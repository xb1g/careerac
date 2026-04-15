import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseTranscriptWithAI } from "../transcript-ai-parser";

// Valid AI output the parser will wrap around
const FAKE_AI_JSON = JSON.stringify({
  institution: "Foothill College",
  courses: [
    {
      code: "CS 1A",
      title: "Object-Oriented Programming",
      units: 4.5,
      grade: "A",
      status: "completed",
      semester: "Fall 2023",
    },
    {
      code: "MATH 1A",
      title: "Calculus",
      units: 5.0,
      grade: "B+",
      status: "completed",
      semester: "Fall 2023",
    },
    {
      code: "PHYS 4A",
      title: "Mechanics",
      units: 5.0,
      grade: "IP",
      status: "in_progress",
      semester: "Spring 2024",
    },
  ],
});

// Shape the MiniMax chatcompletion_v2 endpoint actually returns (per docs).
function buildMiniMaxResponse(content: string) {
  return {
    id: "chatcmpl-test",
    choices: [
      {
        finish_reason: "stop",
        index: 0,
        message: {
          content,
          role: "assistant",
          name: "MiniMax AI",
        },
      },
    ],
    created: 1_700_000_000,
    model: "MiniMax-Text-01",
    object: "chat.completion",
    usage: { total_tokens: 100, prompt_tokens: 50, completion_tokens: 50 },
    base_resp: { status_code: 0, status_msg: "" },
  };
}

describe("parseTranscriptWithAI", () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.MINIMAX_API_KEY;

  beforeEach(() => {
    process.env.MINIMAX_API_KEY = "test-key";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.MINIMAX_API_KEY = originalKey;
    vi.restoreAllMocks();
  });

  it("hits the chatcompletion_v2 endpoint on api.minimax.io with a Bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => buildMiniMaxResponse(FAKE_AI_JSON),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await parseTranscriptWithAI("raw transcript text");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.minimax.io/v1/text/chatcompletion_v2");
    expect(init.method).toBe("POST");
    expect(init.headers["Authorization"]).toBe("Bearer test-key");
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("extracts content from choices[0].message.content (v2 singular shape)", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => buildMiniMaxResponse(FAKE_AI_JSON),
    }) as unknown as typeof fetch;

    const result = await parseTranscriptWithAI("raw transcript text");

    expect(result.institution).toBe("Foothill College");
    expect(result.courses).toHaveLength(3);
    expect(result.courses[0].code).toBe("CS 1A");
    // GPA weighted across 2 completed courses: A=4.0*4.5=18, B+=3.3*5.0=16.5 → 34.5 / 9.5 = 3.6315...
    expect(result.gpa).toBeCloseTo(3.63, 2);
    // Completed units: 4.5 + 5.0 = 9.5; in-progress: 5.0
    expect(result.totalUnitsCompleted).toBe(9.5);
    expect(result.totalUnitsInProgress).toBe(5);
  });

  it("unwraps AI content fenced in ```json``` code blocks", async () => {
    const fenced = "```json\n" + FAKE_AI_JSON + "\n```";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => buildMiniMaxResponse(fenced),
    }) as unknown as typeof fetch;

    const result = await parseTranscriptWithAI("raw transcript text");
    expect(result.institution).toBe("Foothill College");
    expect(result.courses).toHaveLength(3);
  });

  it("throws a clear error when the API returns a non-OK status", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "invalid api key",
    }) as unknown as typeof fetch;

    await expect(parseTranscriptWithAI("raw"))
      .rejects.toThrow(/MiniMax API error: 401/);
  });

  it("throws when MINIMAX_API_KEY is not configured", async () => {
    delete process.env.MINIMAX_API_KEY;
    await expect(parseTranscriptWithAI("raw"))
      .rejects.toThrow(/MINIMAX_API_KEY is not configured/);
  });
});
