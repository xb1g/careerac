import { createClient } from "@/utils/supabase/server";
import { parseTranscriptText } from "@/utils/transcript-parser";
import { parseTranscriptWithAI as parseWithMiniMax } from "@/utils/transcript-ai-parser";
import { parseTranscriptWithGemini } from "@/utils/transcript-gemini-parser";
import { syncTranscriptToUserCourses } from "@/utils/sync-transcript-courses";
import type { Database } from "@/types/database";

// Polyfill browser globals for pdfjs-dist in Node.js environment
// @napi-rs/canvas provides DOMMatrix, Path2D, ImageData that pdfjs-dist requires
import { DOMMatrix, Path2D, ImageData } from "@napi-rs/canvas";
if (typeof globalThis.DOMMatrix === "undefined") {
  (globalThis as unknown as { DOMMatrix: typeof DOMMatrix }).DOMMatrix = DOMMatrix;
}
if (typeof globalThis.Path2D === "undefined") {
  (globalThis as unknown as { Path2D: typeof Path2D }).Path2D = Path2D;
}
if (typeof globalThis.ImageData === "undefined") {
  (globalThis as unknown as { ImageData: typeof ImageData }).ImageData = ImageData;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const runtime = "nodejs";

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Import worker first to ensure it's available in the bundle
  // This fixes "Cannot find module pdf.worker.mjs" error in serverless environments
  await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  
  // Use the legacy build in Node.js to avoid browser-only globals.
  // The specifier is held in a variable + `/* @vite-ignore */` so Vite's
  // import-analysis plugin (used by Vitest) does not try to statically
  // resolve it at transform time — resolution happens at runtime only.
  const pdfjsSpecifier = "pdfjs-dist/legacy/build/pdf.mjs";
  const pdfjsLib = await import(/* webpackIgnore: true */ /* @vite-ignore */ pdfjsSpecifier);

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
        .map((item: { str?: string }) => ("str" in item ? item.str : ""))
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } finally {
    await pdf.destroy();
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return Response.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const filePath = `${user.id}/${timestamp}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("transcripts")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      const message = uploadError.message ?? "";
      const isRlsViolation = /row-level security|violates row-level/i.test(message);
      const errorPayload = isRlsViolation
        ? {
            error:
              "Failed to upload to the 'transcripts' storage bucket: row-level security policy violation. " +
              "Verify the bucket exists and migration 011_storage_transcripts_bucket_policies.sql has been applied to the Supabase project.",
            details: message,
          }
        : {
            error: "Failed to upload transcript file to the 'transcripts' storage bucket.",
            details: message,
          };
      return Response.json(errorPayload, { status: 500 });
    }

    // Parse PDF text
    let parsedData;
    let parseStatus: "completed" | "failed" = "completed";
    let parseError: string | null = null;
    let parseMethod: "gemini" | "minimax" | "regex" = "regex";

    try {
      const pdfData = { text: await extractTextFromPdf(buffer) };

      // 1. Try Gemini first (most robust)
      if (process.env.GEMINI_API_KEY) {
        try {
          parsedData = await parseTranscriptWithGemini(pdfData.text);
          parseMethod = "gemini";
        } catch (geminiError) {
          console.warn("Gemini parsing failed, falling back:", geminiError);
        }
      }

      // 2. Try MiniMax second
      if (!parsedData && process.env.MINIMAX_API_KEY) {
        try {
          parsedData = await parseWithMiniMax(pdfData.text);
          parseMethod = "minimax";
        } catch (miniMaxError) {
          console.warn("MiniMax parsing failed, falling back:", miniMaxError);
        }
      }

      // 3. Fallback to regex
      if (!parsedData) {
        parsedData = parseTranscriptText(pdfData.text);
        parseMethod = "regex";
        if (parsedData.courses.length === 0) {
          parseStatus = "failed";
          parseError = "Could not extract any courses from the transcript. The format may not be supported. Please use manual entry.";
        }
      }
    } catch (err) {
      parseStatus = "failed";
      parseError = "Failed to read the PDF file. It may be scanned or corrupted. Please use manual entry.";
      console.error("PDF parse error:", err);
    }

    // Save transcript record to database
    const insertPayload: Database["public"]["Tables"]["transcripts"]["Insert"] = {
      user_id: user.id,
      file_path: filePath,
      file_name: file.name,
      parsed_data: parsedData ? JSON.parse(JSON.stringify(parsedData)) : null,
      parse_status: parseStatus,
      parse_error: parseError,
      parse_method: parseMethod === "regex" ? "regex" : "ai",
      updated_at: new Date().toISOString(),
    };

    const { data: transcript, error: dbError } = await supabase
      .from("transcripts")
      .insert(insertPayload as never)
      .select("id")
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);

      if (dbError.code === "PGRST205") {
        return Response.json(
          { error: "Transcript schema is not deployed. Please run pending Supabase migrations." },
          { status: 500 },
        );
      }

      return Response.json({ error: "Failed to save transcript record" }, { status: 500 });
    }

    // After transcript is saved to DB, sync courses to user_courses (best-effort)
    let sync: { created: number; updated: number } | null = null;
    if (parsedData && parsedData.courses.length > 0) {
      try {
        const syncResult = await syncTranscriptToUserCourses(supabase, user.id, parsedData.courses);
        sync = { created: syncResult.created, updated: syncResult.updated };
        if (syncResult.errors.length > 0) {
          console.warn("Transcript course sync partial errors:", syncResult.errors);
        }
      } catch (syncErr) {
        console.error("Transcript course sync failed (non-blocking):", syncErr);
      }
    }

    return Response.json({
      id: (transcript as { id: string }).id,
      parsedData,
      parseStatus,
      parseError,
      parseMethod,
      sync,
    });
  } catch (error) {
    console.error("Transcript upload error:", error);
    return Response.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}
