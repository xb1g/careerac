import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: transcript, error: fetchError } = await supabase
      .from("transcripts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !transcript) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    return NextResponse.json(transcript);
  } catch (error) {
    console.error("Transcript fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { parsed_data, parse_status } = body;

    const { data: transcript, error: updateError } = await supabase
      .from("transcripts")
      .update({
        parsed_data,
        parse_status: parse_status ?? "completed",
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (updateError || !transcript) {
      return NextResponse.json({ error: "Failed to update transcript" }, { status: 404 });
    }

    return NextResponse.json(transcript);
  } catch (error) {
    console.error("Transcript update error:", error);
    return NextResponse.json({ error: "Failed to update transcript" }, { status: 500 });
  }
}