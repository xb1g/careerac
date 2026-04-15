/**
 * PlanGenerationPipeline — public API for AI plan generation.
 *
 * This is the single entry point that hides all complexity:
 *   context fetching → prompt assembly → AI call → SSE streaming.
 *
 * The route handler should call `PlanGenerationPipeline.stream()` and nothing else.
 */

import type { UIMessage } from "ai";
import type { TranscriptData } from "@/types/transcript";
import { getArticulationContext, getPrerequisiteContext } from "@/lib/context/articulation";
import { buildRecoveryContext } from "@/lib/context/recovery";
import { getVerifiedPlaybooksContext } from "@/utils/playbook-context";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import { convertToAnthropicMessages, streamFromMiniMax } from "@/lib/ai-stream";

// ---------------------------------------------------------------------------
// Shared JSON schema constant — used by prompt-builder AND plan-parser
// to keep the AI↔parser contract explicit.
// ---------------------------------------------------------------------------

export const PLAN_JSON_SCHEMA = {
  type: "object",
  properties: {
    ccName: { type: "string", description: "Community College Name" },
    targetUniversity: { type: "string", description: "Target University Name" },
    targetMajor: { type: "string", description: "Target Major" },
    semesters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "number" },
          label: { type: "string", description: "e.g. Fall 2024" },
          courses: {
            type: "array",
            items: {
              type: "object",
              required: ["code", "title", "units"],
              properties: {
                code: { type: "string" },
                title: { type: "string" },
                units: { type: "number" },
                transferEquivalency: { type: "string" },
                prerequisites: { type: "array", items: { type: "string" } },
                notes: { type: "string" },
              },
            },
          },
        },
      },
    },
    totalUnits: { type: "number" },
  },
} as const;

export const NO_DATA_JSON_SCHEMA = {
  type: "object",
  properties: {
    isNoData: { type: "boolean", const: true },
    noDataMessage: { type: "string" },
  },
} as const;

// ---------------------------------------------------------------------------
// Request types
// ---------------------------------------------------------------------------

export interface PlanContext {
  ccInstitutionId?: string;
  targetInstitutionId?: string;
  targetMajor?: string;
}

export interface RecoveryContext {
  failedCourseCode: string;
  failedCourseTitle: string;
  status: "failed" | "cancelled" | "waitlisted";
  planData: Record<string, unknown> | null;
}

export interface PlanRequest {
  messages: UIMessage[];
  planContext?: PlanContext;
}

export interface PlanRequestOptions {
  transcriptData?: TranscriptData;
  maxCreditsPerSemester?: number;
  hasTargetSchool?: boolean;
  recoveryContext?: RecoveryContext;
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export class PlanGenerationPipeline {
  /**
   * Builds the full system prompt, calls the AI, and returns a streaming Response.
   * This is the ONLY public method — everything else is internal.
   */
  static async stream(
    request: PlanRequest,
    options: PlanRequestOptions = {},
  ): Promise<Response> {
    const { messages, planContext } = request;
    const {
      transcriptData,
      maxCreditsPerSemester,
      hasTargetSchool,
      recoveryContext,
    } = options;

    // 1. Fetch all context in parallel
    const [articulationResult, prerequisiteData, playbookContext] =
      await Promise.all([
        getArticulationContext(planContext, hasTargetSchool !== false),
        getPrerequisiteContext(),
        getVerifiedPlaybooksContext(
          planContext?.ccInstitutionId,
          planContext?.targetInstitutionId,
          planContext?.targetMajor,
        ),
      ]);

    // 2. Build optional recovery context (may do additional DB queries)
    const recoveryPrompt = recoveryContext
      ? await buildRecoveryContext(recoveryContext, playbookContext)
      : undefined;

    // 3. Assemble system prompt (pure function — no I/O)
    const systemPrompt = buildSystemPrompt({
      articulationContext: articulationResult.context,
      prerequisiteData,
      playbookContext,
      transcriptData,
      maxCreditsPerSemester,
      hasTargetSchool,
      recoveryPrompt,
    });

    // 4. Convert messages and stream from AI
    const anthropicMessages = convertToAnthropicMessages(messages);
    return streamFromMiniMax(systemPrompt, anthropicMessages);
  }
}
