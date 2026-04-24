import { NextResponse } from "next/server";
import { normalizeJobError } from "@/lib/auto-plan-generation-job";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const jobResult = (await supabase
      .from("plan_generation_jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()) as {
      data: {
        id: string;
        status: "pending" | "generating" | "completed" | "failed";
        plan_id: string | null;
        error_message: string | null;
      } | null;
      error: { message?: string } | null;
    };
    const job = jobResult.data;
    const error = jobResult.error;

    if (error || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      planId: job.plan_id,
      error: job.status === "failed" ? normalizeJobError(job.error_message) : null,
    });
  } catch (error) {
    console.error("Plan generation job fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch generation status" }, { status: 500 });
  }
}
