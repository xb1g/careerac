/**
 * Chat API route — thin wrapper around PlanGenerationPipeline.
 *
 * All context fetching, prompt assembly, and AI streaming are handled
 * by the pipeline. This route only parses the request body and delegates.
 */
import type { UIMessage } from "ai";
import type { TranscriptData } from "@/types/transcript";
import {
  PlanGenerationPipeline,
  type PlanContext,
  type RecoveryContext,
} from "@/lib/plan-pipeline";

export async function POST(req: Request) {
  try {
    const {
      messages,
      recoveryContext,
      planContext,
      transcriptData,
      maxCreditsPerSemester,
      hasTargetSchool,
    }: {
      messages: UIMessage[];
      recoveryContext?: RecoveryContext;
      planContext?: PlanContext;
      transcriptData?: TranscriptData;
      maxCreditsPerSemester?: number;
      hasTargetSchool?: boolean;
    } = await req.json();

    return await PlanGenerationPipeline.stream(
      { messages, planContext },
      {
        transcriptData,
        maxCreditsPerSemester,
        hasTargetSchool,
        recoveryContext,
      },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
