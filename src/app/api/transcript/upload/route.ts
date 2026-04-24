import type { Database } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

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
              "Failed to upload to the 'transcripts' storage bucket: row-level security policy violation. Verify the bucket exists and migration 011_storage_transcripts_bucket_policies.sql has been applied to the Supabase project.",
            details: message,
          }
        : {
            error: "Failed to upload transcript file to the 'transcripts' storage bucket.",
            details: message,
          };
      return Response.json(errorPayload, { status: 500 });
    }

    const insertPayload: Database["public"]["Tables"]["transcripts"]["Insert"] = {
      user_id: user.id,
      file_path: filePath,
      file_name: file.name,
      parsed_data: null,
      parse_status: "pending",
      parse_error: null,
      parse_method: null,
      updated_at: new Date().toISOString(),
    };

    const { data: transcript, error: dbError } = await supabase
      .from("transcripts")
      .insert(insertPayload as never)
      .select("id, parse_status")
      .single();

    if (dbError || !transcript) {
      console.error("Database insert error:", dbError);

      if (dbError?.code === "PGRST205") {
        return Response.json(
          { error: "Transcript schema is not deployed. Please run pending Supabase migrations." },
          { status: 500 },
        );
      }

      return Response.json({ error: "Failed to save transcript record" }, { status: 500 });
    }

    return Response.json(
      {
        id: (transcript as { id: string }).id,
        parseStatus: "pending",
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Transcript upload error:", error);
    return Response.json({ error: "Failed to upload transcript" }, { status: 500 });
  }
}
