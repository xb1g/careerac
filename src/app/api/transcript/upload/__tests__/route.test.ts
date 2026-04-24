import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the server Supabase client. Each test overrides the behavior.
const mockGetUser = vi.fn();
const mockStorageUpload = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    storage: {
      from: vi.fn(() => ({
        upload: mockStorageUpload,
      })),
    },
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  })),
}));

// Build a Request-shaped object that returns a prebuilt FormData when the
// route calls `req.formData()`. We bypass Request's multipart encoder because
// undici's parser and jsdom's File polyfill don't play nicely together.
function buildPdfRequest(): Request {
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // "%PDF"
  const file = new File([pdfBytes], "transcript.pdf", { type: "application/pdf" });
  const formData = new FormData();
  formData.append("file", file);
  return {
    formData: async () => formData,
  } as unknown as Request;
}

describe("POST /api/transcript/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-abc-123" } },
      error: null,
    });

    // Default DB mock: insert().select().single() resolves with an id.
    mockSingle.mockResolvedValue({ data: { id: "transcript-xyz" }, error: null });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
  });

  it("returns 500 with a bucket-configuration error when storage upload fails with an RLS violation", async () => {
    mockStorageUpload.mockResolvedValue({
      data: null,
      error: {
        name: "StorageApiError",
        message: "new row violates row-level security policy",
        statusCode: "403",
        __isStorageError: true,
      },
    });

    const { POST } = await import("../route");
    const response = await POST(buildPdfRequest());

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error).toMatch(/transcripts/i);
    expect(body.error).toMatch(/bucket|migration/i);

    // No orphan row should be created when storage upload fails.
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns 202 with a pending transcript id when storage upload and DB insert both succeed", async () => {
    mockStorageUpload.mockResolvedValue({ data: { path: "ok" }, error: null });

    const { POST } = await import("../route");
    const response = await POST(buildPdfRequest());

    expect(response.status).toBe(202);

    const body = await response.json();
    expect(body.id).toBe("transcript-xyz");
    expect(body.parseStatus).toBe("pending");
    expect(mockStorageUpload).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });
});
