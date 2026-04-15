import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";

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

    const body = await req.json();
    const { parsed_data, parse_status, parse_method, file_name, institution } = body;

    if (!parsed_data || !file_name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const insertPayload: Database["public"]["Tables"]["transcripts"]["Insert"] = {
      user_id: user.id,
      file_path: `manual/${user.id}/${Date.now()}.json`,
      file_name,
      parsed_data,
      parse_status: parse_status ?? "completed",
      parse_error: null,
      parse_method: parse_method ?? "manual",
      updated_at: new Date().toISOString(),
    };

    const { data: transcript, error } = await supabase
      .from("transcripts")
      .insert(insertPayload as never)
      .select("id")
      .single();

    if (error || !transcript) {
      console.error("Manual transcript insert error:", error);
      return Response.json({ error: "Failed to save manual transcript" }, { status: 500 });
    }

    return Response.json({
      id: transcript.id,
      institution: institution ?? null,
      parsedData: parsed_data,
      parseStatus: parse_status ?? "completed",
      parseMethod: parse_method ?? "manual",
    });
  } catch (error) {
    console.error("Manual transcript error:", error);
    return Response.json({ error: "Failed to process manual transcript" }, { status: 500 });
  }
}
