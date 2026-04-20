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
import { computeNextRegistrationTerm, findLatestTerm } from "@/utils/term";
import { createClient } from "@/utils/supabase/server";

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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let startTerm: string | undefined;
    if (user) {
      const { data: terms } = await supabase
        .from("user_courses")
        .select("term")
        .eq("user_id", user.id)
        .neq("status", "planned")
        .returns<{ term: string | null }[]>();
      const latestTerm = findLatestTerm((terms ?? []).map((r) => r.term));
      startTerm = computeNextRegistrationTerm(new Date(), latestTerm).label;
    }

    return await PlanGenerationPipeline.stream(
      { messages, planContext },
      {
        transcriptData,
        maxCreditsPerSemester,
        hasTargetSchool,
        recoveryContext,
        startTerm,
      },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
