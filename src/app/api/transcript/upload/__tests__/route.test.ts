import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the server Supabase client
const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}));

// Build a Request-shaped object that returns a prebuilt FormData
function buildPdfRequest(): Request {
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // "%PDF"
  const file = new File([pdfBytes], "transcript.pdf", { type: "application/pdf" });
  const formData = new FormData();
  formData.append("file", file);
  return { formData: async () => formData } as unknown as Request;
}

describe("POST /api/transcript/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-abc-123" } },
      error: null,
    });

    mockSingle.mockResolvedValue({ data: { id: "transcript-xyz" }, error: null });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
  });

  it("returns 401 when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Auth error") });

    const { POST } = await import("../route");
    const response = await POST(buildPdfRequest());

    expect(response.status).toBe(401);
  });

  it("returns 400 when no file is provided", async () => {
    const req = { formData: async () => new FormData() } as Request;

    const { POST } = await import("../route");
    const response = await POST(req);

    expect(response.status).toBe(400);
  });

  it("returns 400 when file is not a PDF", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", file);
    const req = { formData: async () => formData } as Request;

    const { POST } = await import("../route");
    const response = await POST(req);

    expect(response.status).toBe(400);
  });
});
