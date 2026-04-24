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
  const pdfjsLib = await import(/* webpackIgnore: true */ "pdfjs-dist/legacy/build/pdf.mjs");

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
  const { data: downloaded, error: downloadError } = await supabase.storage
    .from("transcripts")
    .download(transcript.file_path);

  if (downloadError || !downloaded) {
    console.error("Transcript storage download error:", downloadError);
    return {
      parsedData: null,
      parseStatus: "failed",
      parseError: "Failed to download the uploaded transcript for parsing. Please retry the upload.",
      parseMethod: "regex",
      sync: null,
    };
  }

  const buffer = Buffer.from(await downloaded.arrayBuffer());
  const parsed = await parseTranscriptBuffer(buffer);

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
