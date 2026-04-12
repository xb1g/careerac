import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: ccs, error: ccError } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .eq("type", "cc")
    .order("name");

  const { data: universities, error: uniError } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .eq("type", "university")
    .order("name");

  if (ccError || uniError) {
    console.error("Error fetching institutions:", ccError || uniError);
    return NextResponse.json({ error: "Failed to fetch institutions" }, { status: 500 });
  }

  return NextResponse.json({
    ccs: ccs ?? [],
    universities: universities ?? [],
  });
}
