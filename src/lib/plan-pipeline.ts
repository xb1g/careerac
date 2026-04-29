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
import {
  convertToAnthropicMessages,
  generateTextFromMiniMax,
  streamFromMiniMax,
  type AnthropicMessage,
} from "@/lib/ai-stream";
import { parsePlanFromAIResponse } from "@/utils/plan-parser";
import type { ParsedPlan } from "@/types/plan";

// ---------------------------------------------------------------------------
// Shared JSON schema constant — used by prompt-builder AND plan-parser
// to keep the AI↔parser contract explicit.
// ---------------------------------------------------------------------------

export const PLAN_JSON_SCHEMA = {
  type: "object",
  properties: {
    ccName: { type: "string", description: "Community College Name" },
    targetUniversity: { type: "string", description: "Top-fit university; equals coveredSchools[0].name when multi-school" },
    targetMajor: { type: "string", description: "Target Major" },
    coveredSchools: {
      type: "array",
      description: "Schools this unified plan serves (present only in multi-school mode).",
      items: {
        type: "object",
        required: ["name", "fitScore", "articulatedUnits", "totalRequiredUnits"],
        properties: {
          name: { type: "string" },
          institutionId: { type: ["string", "null"] },
          fitScore: { type: "number" },
          articulatedUnits: { type: "number" },
          totalRequiredUnits: { type: "number" },
          highlights: { type: "array", items: { type: "string" } },
        },
      },
    },
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
                requiredBy: {
                  type: "array",
                  items: { type: "string" },
                  description: "Subset of coveredSchools[].name that require/accept this course; omit when universal.",
                },
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
  selectedTargetInstitutionIds?: string[];
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
  selectedUniversityNames?: string[];
  recoveryContext?: RecoveryContext;
  startTerm?: string;
}

interface PreparedPlanPrompt {
  systemPrompt: string;
  messages: AnthropicMessage[];
}

interface GeneratedPlanResult {
  rawText: string;
  parsedPlan: ParsedPlan | null;
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export class PlanGenerationPipeline {
  private static async prepare(
    request: PlanRequest,
    options: PlanRequestOptions = {},
  ): Promise<PreparedPlanPrompt> {
    const { messages, planContext } = request;
    const {
      transcriptData,
      maxCreditsPerSemester,
      hasTargetSchool,
      selectedUniversityNames,
      recoveryContext,
      startTerm,
    } = options;

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

    const recoveryPrompt = recoveryContext
      ? await buildRecoveryContext(recoveryContext, playbookContext)
      : undefined;

    const systemPrompt = buildSystemPrompt({
      articulationContext: articulationResult.context,
      availableMajors: articulationResult.availableMajors,
      prerequisiteData,
      playbookContext,
      selectedMajor: planContext?.targetMajor,
      transcriptData,
      maxCreditsPerSemester,
      hasTargetSchool,
      selectedUniversityNames,
      recoveryPrompt,
      startTerm,
    });

    return {
      systemPrompt,
      messages: convertToAnthropicMessages(messages),
    };
  }

  /**
   * Builds the full system prompt, calls the AI, and returns a streaming Response.
   * This is the ONLY public method — everything else is internal.
   */
  static async stream(
    request: PlanRequest,
    options: PlanRequestOptions = {},
  ): Promise<Response> {
    const prepared = await this.prepare(request, options);
    return streamFromMiniMax(prepared.systemPrompt, prepared.messages);
  }

  static async generate(
    request: PlanRequest,
    options: PlanRequestOptions = {},
  ): Promise<GeneratedPlanResult> {
    console.log("[Pipeline] Preparing prompt...");
    const prepared = await this.prepare(request, options);
    console.log("[Pipeline] Prompt prepared, system prompt length:", prepared.systemPrompt.length);

    console.log("[Pipeline] Calling generateTextFromMiniMax...");
    const rawText = await generateTextFromMiniMax(
      prepared.systemPrompt,
      prepared.messages,
    );
    console.log("[Pipeline] Raw text received, length:", rawText.length);

    console.log("[Pipeline] Parsing plan from AI response...");
    const parsedPlan = parsePlanFromAIResponse(
      rawText,
      options.startTerm,
      request.planContext?.targetMajor,
    );
    console.log("[Pipeline] Plan parsed:", parsedPlan ? "success" : "null");

    return {
      rawText,
      parsedPlan,
    };
  }
}
