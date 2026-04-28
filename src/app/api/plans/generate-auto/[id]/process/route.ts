import { NextResponse } from "next/server";
import {
  AutoPlanGenerationError,
  normalizeAutoPlanRequest,
  normalizeJobError,
  runPlanGenerationJob,
} from "@/lib/auto-plan-generation-job";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let jobId: string | null = null;
  let userId: string | null = null;

  console.log("[process] Starting plan generation job");

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
    jobId = id;
    userId = user.id;

    const jobResult = (await supabase
      .from("plan_generation_jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()) as {
      data: {
        id: string;
        user_id: string;
        status: "pending" | "generating" | "completed" | "failed";
        request_payload: unknown;
        plan_id: string | null;
      } | null;
      error: { message?: string } | null;
    };
    const job = jobResult.data;
    const jobError = jobResult.error;

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.status === "completed" || job.status === "generating") {
      return NextResponse.json({
        id: job.id,
        status: job.status,
        planId: job.plan_id,
        error: null,
      });
    }

    const request = normalizeAutoPlanRequest(job.request_payload);

    console.log("[process] Updating job status to generating");

    await supabase
      .from("plan_generation_jobs")
      .update({
        status: "generating",
        error_message: null,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id)
      .eq("user_id", user.id);

    console.log("[process] Running plan generation job");
    const result = await runPlanGenerationJob(supabase, user.id, request);
    console.log("[process] Plan generation complete");

    await supabase
      .from("plan_generation_jobs")
      .update({
        status: "completed",
        error_message: null,
        plan_id: result.planId,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id)
      .eq("user_id", user.id);

    return NextResponse.json({
      id,
      status: "completed",
      planId: result.planId,
      error: null,
    });
  } catch (error) {
    const normalized =
      error instanceof AutoPlanGenerationError
        ? error.details
        : normalizeJobError("Automatic plan generation failed. Please retry.");

    if (jobId && userId) {
      try {
        const supabase = await createClient();
        await supabase
          .from("plan_generation_jobs")
          .update({
            status: "failed",
            error_message: normalized.message,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", jobId)
          .eq("user_id", userId);
      } catch (updateError) {
        console.error("Plan generation job failure update error:", updateError);
      }
    }

    if (!(error instanceof AutoPlanGenerationError)) {
      console.error("Plan generation processing error:", error);
    }

    return NextResponse.json(
      {
        id: jobId,
        status: "failed",
        planId: null,
        error: normalized,
      },
      { status: error instanceof AutoPlanGenerationError ? error.status : 502 },
    );
  }
}
