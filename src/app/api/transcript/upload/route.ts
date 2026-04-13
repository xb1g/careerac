import { createClient } from "@/utils/supabase/server";
import { parseTranscriptText } from "@/utils/transcript-parser";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
      // Continue even if storage fails — we still have the buffer to parse
    }

    // Parse PDF text
    let parsedData;
    let parseStatus: "completed" | "failed" = "completed";
    let parseError: string | null = null;

    try {
      const pdfData = await pdfParse(buffer);
      parsedData = parseTranscriptText(pdfData.text);

      if (parsedData.courses.length === 0) {
        parseStatus = "failed";
        parseError = "Could not extract any courses from the transcript. The format may not be supported. Please use manual entry.";
      }
    } catch (err) {
      parseStatus = "failed";
      parseError = "Failed to read the PDF file. It may be scanned or corrupted. Please use manual entry.";
      console.error("PDF parse error:", err);
    }

    // Save transcript record to database
    const { data: transcript, error: dbError } = await supabase
      .from("transcripts")
      .insert({
        user_id: user.id,
        file_path: filePath,
        file_name: file.name,
        parsed_data: parsedData ? JSON.parse(JSON.stringify(parsedData)) : null,
        parse_status: parseStatus,
        parse_error: parseError,
      } as never)
      .select("id")
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      return Response.json({ error: "Failed to save transcript record" }, { status: 500 });
    }

    return Response.json({
      id: (transcript as { id: string }).id,
      parsedData,
      parseStatus,
      parseError,
    });
  } catch (error) {
    console.error("Transcript upload error:", error);
    return Response.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}
