import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId } = await params;

    // Verify ownership
    const { data: plan } = await supabase
      .from("transfer_plans")
      .select("id")
      .eq("id", planId)
      .eq("user_id", user.id)
      .single();

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const { data: checkpoints, error } = await supabase
      .from("plan_checkpoints")
      .select("id, action_label, plan_data, created_at")
      .eq("plan_id", planId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching checkpoints:", error);
      return NextResponse.json({ error: "Failed to fetch checkpoints" }, { status: 500 });
    }

    return NextResponse.json(checkpoints ?? []);
  } catch (error) {
    console.error("Checkpoints fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
