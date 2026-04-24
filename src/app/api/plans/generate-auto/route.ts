import { NextResponse } from "next/server";
import {
  AutoPlanGenerationError,
  createPlanGenerationJob,
  normalizeAutoPlanRequest,
  type GenerateAutoErrorShape,
} from "@/lib/auto-plan-generation-job";
import { createClient, getSafeUser } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

function errorResponse(status: number, error: GenerateAutoErrorShape) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const user = await getSafeUser(supabase);

    if (!user) {
      return errorResponse(401, {
        code: "UNAUTHORIZED",
        message: "You must sign in before generating an automatic plan.",
        retryable: false,
        fallback: "manual_chat",
      });
    }

    let parsedBody: unknown;
    try {
      parsedBody = await req.json();
    } catch {
      return errorResponse(400, {
        code: "INVALID_INPUT",
        message: "Request body must be valid JSON.",
        retryable: false,
        fallback: "manual_chat",
      });
    }

    const request = normalizeAutoPlanRequest(parsedBody);
    const job = await createPlanGenerationJob(supabase, user.id, request);

    return NextResponse.json(
      {
        jobId: job.id,
        status: job.status,
      },
      { status: 202 },
    );
  } catch (error) {
    if (error instanceof AutoPlanGenerationError) {
      return errorResponse(error.status, error.details);
    }

    console.error("Auto plan job creation error:", error);
    return errorResponse(502, {
      code: "AI_UPSTREAM_ERROR",
      message: "Automatic plan generation failed. Please retry.",
      retryable: true,
      fallback: "retry",
    });
  }
}
