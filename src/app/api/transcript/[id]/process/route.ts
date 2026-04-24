import { NextResponse } from "next/server";
import {
  finalizeTranscriptProcessing,
  updateTranscriptRecord,
} from "@/lib/transcript-processing";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let transcriptId: string | null = null;
  let userId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    transcriptId = id;
    userId = user.id;
    const transcriptResult = (await supabase
      .from("transcripts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()) as {
      data: {
        id: string;
        file_path: string;
        parse_status: "pending" | "parsing" | "completed" | "failed";
      } | null;
      error: { message?: string } | null;
    };
    const transcript = transcriptResult.data;
    const fetchError = transcriptResult.error;

    if (fetchError || !transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    if (
      transcript.parse_status === "completed" ||
      transcript.parse_status === "failed" ||
      transcript.parse_status === "parsing"
    ) {
      return NextResponse.json(transcript);
    }

    await updateTranscriptRecord(supabase, transcript.id, user.id, {
      parse_status: "parsing",
      parse_error: null,
      parse_method: null,
      updated_at: new Date().toISOString(),
    });

    const result = await finalizeTranscriptProcessing(supabase, {
      id: transcript.id,
      user_id: user.id,
      file_path: transcript.file_path,
    });

    const updatedTranscript = await updateTranscriptRecord(supabase, transcript.id, user.id, {
      parsed_data: result.parsedData ? JSON.parse(JSON.stringify(result.parsedData)) : null,
      parse_status: result.parseStatus,
      parse_error: result.parseError,
      parse_method: result.parseMethod,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      ...updatedTranscript,
      sync: result.sync,
    });
  } catch (error) {
    console.error("Transcript processing error:", error);
    if (transcriptId && userId) {
      try {
        const supabase = await createClient();
        await updateTranscriptRecord(supabase, transcriptId, userId, {
          parse_status: "failed",
          parse_error: "Failed to process transcript. Please retry or enter courses manually.",
          parse_method: "regex",
          updated_at: new Date().toISOString(),
        });
      } catch (updateError) {
        console.error("Transcript failure update error:", updateError);
      }
    }
    return NextResponse.json({ error: "Failed to process transcript" }, { status: 500 });
  }
}
