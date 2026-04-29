import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createCheckpoint } from "@/lib/checkpoint";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; checkpointId: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId, checkpointId } = await params;

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

    // Fetch the checkpoint to restore
    const { data: checkpoint } = await supabase
      .from("plan_checkpoints")
      .select("plan_data, course_statuses, action_label")
      .eq("id", checkpointId)
      .eq("plan_id", planId)
      .single();

    if (!checkpoint) {
      return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 });
    }

    const typed = checkpoint as { plan_data: unknown; course_statuses: unknown; action_label: string };

    // Snapshot current state before restoring (so restore is itself undoable)
    await createCheckpoint(supabase, planId, `Undo to: ${typed.action_label}`);

    // Restore plan_data
    const { error: updateError } = await supabase
      .from("transfer_plans")
      .update({
        plan_data: typed.plan_data as never,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", planId);

    if (updateError) {
      console.error("Error restoring plan_data:", updateError);
      return NextResponse.json({ error: "Failed to restore plan" }, { status: 500 });
    }

    // Restore plan_courses: delete current, re-insert from snapshot
    const courseStatuses = Array.isArray(typed.course_statuses) ? typed.course_statuses : [];

    await supabase.from("plan_courses").delete().eq("plan_id", planId);

    if (courseStatuses.length > 0) {
      const rows = courseStatuses.map((c: Record<string, unknown>) => ({
        id: c.id,
        plan_id: planId,
        course_id: c.course_id ?? null,
        semester_number: c.semester_number,
        status: c.status ?? "planned",
        alternative_for: c.alternative_for ?? null,
      }));
      await supabase.from("plan_courses").insert(rows as never);
    }

    return NextResponse.json({ success: true, plan_data: typed.plan_data });
  } catch (error) {
    console.error("Checkpoint restore error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
