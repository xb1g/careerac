import { DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import type { Database } from "@/types/database";
import type { TranscriptData } from "@/types/transcript";
import { createClient } from "@/utils/supabase/server";
import { parseTranscriptWithAI as parseWithMiniMax } from "@/utils/transcript-ai-parser";
import { parseTranscriptWithGemini } from "@/utils/transcript-gemini-parser";
import { parseTranscriptText } from "@/utils/transcript-parser";
import { syncTranscriptToUserCourses } from "@/utils/sync-transcript-courses";

if (typeof globalThis.DOMMatrix === "undefined") {
  (globalThis as unknown as { DOMMatrix: typeof DOMMatrix }).DOMMatrix = DOMMatrix;
}
if (typeof globalThis.Path2D === "undefined") {
  (globalThis as unknown as { Path2D: typeof Path2D }).Path2D = Path2D;
}
if (typeof globalThis.ImageData === "undefined") {
  (globalThis as unknown as { ImageData: typeof ImageData }).ImageData = ImageData;
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type TranscriptRow = Database["public"]["Tables"]["transcripts"]["Row"];
type TranscriptUpdate = Database["public"]["Tables"]["transcripts"]["Update"];

const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TRANSCRIPT_TIMEOUT_MS ?? 25_000);
const MINIMAX_TIMEOUT_MS = Number(process.env.MINIMAX_TRANSCRIPT_TIMEOUT_MS ?? 25_000);
const TRANSCRIPT_DOWNLOAD_RETRY_COUNT = Number(process.env.TRANSCRIPT_DOWNLOAD_RETRY_COUNT ?? 3);
const TRANSCRIPT_DOWNLOAD_RETRY_DELAY_MS = Number(process.env.TRANSCRIPT_DOWNLOAD_RETRY_DELAY_MS ?? 750);

export interface TranscriptProcessingResult {
  parsedData: TranscriptData | null;
  parseStatus: "completed" | "failed";
  parseError: string | null;
  parseMethod: "ai" | "regex";
  sync: { created: number; updated: number } | null;
}

function isValidTimeout(value: number) {
  return Number.isFinite(value) && value > 0;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function looksLikePdfBuffer(buffer: Buffer) {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

async function downloadTranscriptBuffer(
  supabase: SupabaseServerClient,
  filePath: string,
): Promise<Buffer | null> {
  const attempts = isValidTimeout(TRANSCRIPT_DOWNLOAD_RETRY_COUNT)
    ? Math.max(1, Math.floor(TRANSCRIPT_DOWNLOAD_RETRY_COUNT))
    : 3;
  const retryDelayMs = isValidTimeout(TRANSCRIPT_DOWNLOAD_RETRY_DELAY_MS)
    ? TRANSCRIPT_DOWNLOAD_RETRY_DELAY_MS
    : 750;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { data: downloaded, error: downloadError } = await supabase.storage
      .from("transcripts")
      .download(filePath);

    if (!downloadError && downloaded) {
      const buffer = Buffer.from(await downloaded.arrayBuffer());
      if (buffer.length > 0 && looksLikePdfBuffer(buffer)) {
        return buffer;
      }

      console.warn("Downloaded transcript did not look like a valid PDF", {
        attempt,
        size: buffer.length,
        header: buffer.subarray(0, 8).toString("utf8"),
      });
    } else {
      console.warn("Transcript storage download attempt failed", {
        attempt,
        filePath,
        error: downloadError?.message,
      });
    }

    if (attempt < attempts) {
      await sleep(retryDelayMs * attempt);
    }
  }

  return null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  if (!isValidTimeout(timeoutMs)) {
    return promise;
  }

  return await new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;

  try {
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? (item as { str: string }).str : ""))
        .join(" ");
      fullText += `${pageText}\n\n`;
    }

    return fullText.trim();
  } finally {
    await pdf.destroy();
  }
}

export async function parseTranscriptBuffer(buffer: Buffer): Promise<Omit<TranscriptProcessingResult, "sync">> {
  try {
    const rawText = await extractTextFromPdf(buffer);
    let parsedData: TranscriptData | null = null;
    let parseMethod: "ai" | "regex" = "regex";

    if (process.env.GEMINI_API_KEY) {
      try {
        parsedData = await withTimeout(
          parseTranscriptWithGemini(rawText),
          GEMINI_TIMEOUT_MS,
          "Gemini transcript parsing",
        );
        parseMethod = "ai";
      } catch (error) {
        console.warn("Gemini transcript parsing failed, falling back:", error);
      }
    }

    if (!parsedData && process.env.MINIMAX_API_KEY) {
      try {
        parsedData = await withTimeout(
          parseWithMiniMax(rawText),
          MINIMAX_TIMEOUT_MS,
          "MiniMax transcript parsing",
        );
        parseMethod = "ai";
      } catch (error) {
        console.warn("MiniMax transcript parsing failed, falling back:", error);
      }
    }

    if (!parsedData) {
      parsedData = parseTranscriptText(rawText);
      parseMethod = "regex";
    }

    if (parsedData.courses.length === 0) {
      return {
        parsedData,
        parseStatus: "failed",
        parseError:
          "Could not extract any courses from the transcript. The format may not be supported. Please use manual entry.",
        parseMethod,
      };
    }

    return {
      parsedData,
      parseStatus: "completed",
      parseError: null,
      parseMethod,
    };
  } catch (error) {
    console.error("Transcript PDF processing error:", error);
    return {
      parsedData: null,
      parseStatus: "failed",
      parseError: "Failed to read the PDF file. It may be scanned or corrupted. Please use manual entry.",
      parseMethod: "regex",
    };
  }
}

export async function finalizeTranscriptProcessing(
  supabase: SupabaseServerClient,
  transcript: Pick<TranscriptRow, "id" | "user_id" | "file_path">,
): Promise<TranscriptProcessingResult> {
  const attempts = isValidTimeout(TRANSCRIPT_DOWNLOAD_RETRY_COUNT)
    ? Math.max(1, Math.floor(TRANSCRIPT_DOWNLOAD_RETRY_COUNT))
    : 3;
  const retryDelayMs = isValidTimeout(TRANSCRIPT_DOWNLOAD_RETRY_DELAY_MS)
    ? TRANSCRIPT_DOWNLOAD_RETRY_DELAY_MS
    : 750;
  let parsed: Omit<TranscriptProcessingResult, "sync"> | null = null;
  let buffer: Buffer | null = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    buffer = await downloadTranscriptBuffer(supabase, transcript.file_path);

    if (!buffer) {
      continue;
    }

    parsed = await parseTranscriptBuffer(buffer);
    if (
      parsed.parseStatus === "completed" ||
      parsed.parseError !== "Failed to read the PDF file. It may be scanned or corrupted. Please use manual entry."
    ) {
      break;
    }

    console.warn("Transcript PDF parse failed after download; retrying", {
      attempt,
      filePath: transcript.file_path,
      size: buffer.length,
    });

    if (attempt < attempts) {
      await sleep(retryDelayMs * attempt);
    }
  }

  if (!buffer || !parsed) {
    console.error("Transcript storage download validation failed:", transcript.file_path);
    return {
      parsedData: null,
      parseStatus: "failed",
      parseError: "We uploaded your transcript, but could not read back a valid PDF from storage. Please retry the upload.",
      parseMethod: "regex",
      sync: null,
    };
  }

  let sync: { created: number; updated: number } | null = null;
  if (parsed.parseStatus === "completed" && parsed.parsedData && parsed.parsedData.courses.length > 0) {
    try {
      const syncResult = await syncTranscriptToUserCourses(
        supabase,
        transcript.user_id,
        parsed.parsedData.courses,
      );
      sync = { created: syncResult.created, updated: syncResult.updated };
      if (syncResult.errors.length > 0) {
        console.warn("Transcript course sync partial errors:", syncResult.errors);
      }
    } catch (error) {
      console.error("Transcript course sync failed (non-blocking):", error);
    }
  }

  return {
    ...parsed,
    sync,
  };
}

export async function updateTranscriptRecord(
  supabase: SupabaseServerClient,
  transcriptId: string,
  userId: string,
  values: TranscriptUpdate,
) {
  const { data, error } = await supabase
    .from("transcripts")
    .update(values as never)
    .eq("id", transcriptId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to update transcript");
  }

  return data as TranscriptRow;
}
