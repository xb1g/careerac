import type { UIMessage } from "ai";
import { MiniMaxApiError } from "@/lib/ai-stream";
import { rankBestFitUniversityIds, type RankedUniversity } from "@/lib/context/articulation";
import { PlanGenerationPipeline } from "@/lib/plan-pipeline";
import { buildSyntheticUserPrompt } from "@/lib/plan-prompts";
import {
  resolveInstitutionIdsByName,
  resolveUniversityIdsByNames,
  savePlanRecord,
  type ComparisonTargetPayload,
} from "@/lib/plan-service";
import type { Database, Json } from "@/types/database";
import type { ParsedPlan, TransferPlan } from "@/types/plan";
import type { TranscriptData } from "@/types/transcript";
import { createClient } from "@/utils/supabase/server";
import { computeNextRegistrationTerm, findLatestTerm } from "@/utils/term";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type PlanGenerationJobInsert = Database["public"]["Tables"]["plan_generation_jobs"]["Insert"];
type PlanGenerationJobRow = Database["public"]["Tables"]["plan_generation_jobs"]["Row"];

export type GenerateAutoErrorCode =
  | "UNAUTHORIZED"
  | "INVALID_INPUT"
  | "MAJOR_REQUIRED"
  | "CC_INSTITUTION_NOT_FOUND"
  | "AI_UPSTREAM_ERROR"
  | "PLAN_PARSE_FAILED"
  | "PLAN_SAVE_FAILED";

export interface GenerateAutoRequestBody {
  transcriptId?: string;
  transcriptData?: TranscriptData;
  detectedMajor?: string;
  targetSchool?: string | null;
  maxCreditsPerSemester?: number;
}

export interface GenerateAutoErrorShape {
  code: GenerateAutoErrorCode;
  message: string;
  retryable: boolean;
  fallback: "manual_chat" | "retry";
}

export class AutoPlanGenerationError extends Error {
  constructor(readonly details: GenerateAutoErrorShape, readonly status: number) {
    super(details.message);
    this.name = "AutoPlanGenerationError";
  }
}

export interface AutoPlanJobResult {
  planId: string;
  plan: ParsedPlan;
  detectedMajor: string;
  chatHistory: UIMessage[];
}

function serializeJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

export function isTranscriptData(value: unknown): value is TranscriptData {
  if (!value || typeof value !== "object") return false;

  const transcript = value as Record<string, unknown>;
  return (
    typeof transcript.institution === "string" &&
    Array.isArray(transcript.courses) &&
    typeof transcript.totalUnitsCompleted === "number" &&
    typeof transcript.totalUnitsInProgress === "number"
  );
}

export function normalizeAutoPlanRequest(body: unknown): GenerateAutoRequestBody {
  if (!body || typeof body !== "object") {
    throw new AutoPlanGenerationError(
      {
        code: "INVALID_INPUT",
        message: "Request body must be valid JSON.",
        retryable: false,
        fallback: "manual_chat",
      },
      400,
    );
  }

  const parsed = body as GenerateAutoRequestBody;

  if (!isTranscriptData(parsed.transcriptData)) {
    throw new AutoPlanGenerationError(
      {
        code: "INVALID_INPUT",
        message: "transcriptData is required to generate an automatic plan.",
        retryable: false,
        fallback: "manual_chat",
      },
      400,
    );
  }

  const detectedMajor = typeof parsed.detectedMajor === "string" ? parsed.detectedMajor.trim() : "";
  if (!detectedMajor) {
    throw new AutoPlanGenerationError(
      {
        code: "MAJOR_REQUIRED",
        message: "A detected major is required before generating an automatic plan.",
        retryable: false,
        fallback: "manual_chat",
      },
      400,
    );
  }

  return {
    transcriptId: typeof parsed.transcriptId === "string" ? parsed.transcriptId : undefined,
    transcriptData: parsed.transcriptData,
    detectedMajor,
    targetSchool: typeof parsed.targetSchool === "string" ? parsed.targetSchool.trim() || null : null,
    maxCreditsPerSemester:
      typeof parsed.maxCreditsPerSemester === "number" && parsed.maxCreditsPerSemester > 0
        ? parsed.maxCreditsPerSemester
        : 15,
  };
}

export function normalizeJobError(errorMessage: string | null): GenerateAutoErrorShape {
  return {
    code: "AI_UPSTREAM_ERROR",
    message: errorMessage || "Automatic plan generation failed. Please retry.",
    retryable: true,
    fallback: "retry",
  };
}

function isSavablePlan(plan: ParsedPlan | null): plan is TransferPlan {
  return Boolean(plan && !("isNoData" in plan));
}

function buildSyntheticChatHistory(
  transcriptData: TranscriptData,
  detectedMajor: string,
  targetSchool: string | null,
  rawText: string,
): UIMessage[] {
  const destination = targetSchool
    ? `transfer to ${targetSchool}`
    : "find the best-fit transfer options";

  const gpaText = transcriptData.gpa ? ` (GPA: ${transcriptData.gpa})` : "";

  const welcomeText = `I see you've taken ${transcriptData.courses.length} courses at ${transcriptData.institution} with ${transcriptData.totalUnitsCompleted} completed units${gpaText}. Let me analyze your coursework and ${destination} for ${detectedMajor}.`;

  return [
    {
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: welcomeText }],
    } as unknown as UIMessage,
    {
      id: "auto-plan-request",
      role: "user",
      parts: [{ type: "text", text: `Generate a complete 2-year transfer plan for ${detectedMajor}.` }],
    } as unknown as UIMessage,
    {
      id: "auto-plan-response",
      role: "assistant",
      parts: [{ type: "text", text: rawText }],
    } as unknown as UIMessage,
  ];
}

function buildPlanTitle(plan: TransferPlan): string {
  const covered = plan.coveredSchools ?? [];
  if (covered.length > 1) {
    return `${plan.ccName} -> ${covered.length} schools (${plan.targetMajor})`;
  }
  return `${plan.ccName} -> ${plan.targetUniversity}`;
}

const MAX_COMPARISON_TARGETS = 10;

async function buildComparisonTargets(
  supabase: SupabaseServerClient,
  plan: ParsedPlan | null,
  rankedInstitutions: RankedUniversity[],
): Promise<ComparisonTargetPayload[] | null> {
  if (!plan || "isNoData" in plan) return null;
  const covered = plan.coveredSchools ?? [];
  const hasMultiSchool = covered.length > 1 || rankedInstitutions.length > 1;
  if (!hasMultiSchool) return null;

  const payload: ComparisonTargetPayload[] = [];
  const seen = new Set<string>();

  const names = covered
    .map((school) => school.name)
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0);

  if (names.length > 0) {
    const resolved = await resolveUniversityIdsByNames(supabase, names);
    resolved.forEach((entry) => {
      if (!entry.institutionId || seen.has(entry.institutionId)) return;
      if (payload.length >= MAX_COMPARISON_TARGETS) return;
      seen.add(entry.institutionId);
      payload.push({
        institution_id: entry.institutionId,
        name: entry.name,
        abbreviation: entry.abbreviation,
        priority_order: payload.length + 1,
      });
    });
  }

  rankedInstitutions.forEach((ranked) => {
    if (!ranked.id || seen.has(ranked.id)) return;
    if (payload.length >= MAX_COMPARISON_TARGETS) return;
    seen.add(ranked.id);
    payload.push({
      institution_id: ranked.id,
      name: ranked.name,
      abbreviation: ranked.abbreviation,
      priority_order: payload.length + 1,
    });
  });

  return payload.length > 0 ? payload : null;
}

function isMiniMaxError(error: unknown): boolean {
  if (error instanceof MiniMaxApiError) return true;
  if (error instanceof Error) {
    return error.message.includes("MiniMax API error") || error.name === "AbortError";
  }
  return false;
}

export async function createPlanGenerationJob(
  supabase: SupabaseServerClient,
  userId: string,
  request: GenerateAutoRequestBody,
): Promise<PlanGenerationJobRow> {
  const insertPayload: PlanGenerationJobInsert = {
    user_id: userId,
    transcript_id: request.transcriptId ?? null,
    request_payload: serializeJson(request),
    status: "pending",
    error_message: null,
    plan_id: null,
  };

  const { data, error } = await supabase
    .from("plan_generation_jobs")
    .insert(insertPayload as never)
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to create plan generation job");
  }

  return data as PlanGenerationJobRow;
}

export async function runPlanGenerationJob(
  supabase: SupabaseServerClient,
  userId: string,
  request: GenerateAutoRequestBody,
): Promise<AutoPlanJobResult> {
  if (!request.transcriptData || !request.detectedMajor) {
    throw new AutoPlanGenerationError(
      {
        code: "INVALID_INPUT",
        message: "transcriptData and detectedMajor are required to generate an automatic plan.",
        retryable: false,
        fallback: "manual_chat",
      },
      400,
    );
  }

  const transcriptId = request.transcriptId ?? null;
  const targetSchool = request.targetSchool ?? null;
  const hasTargetSchool = Boolean(targetSchool);
  const maxCreditsPerSemester = request.maxCreditsPerSemester ?? 15;

  const [{ ccInstitutionId, targetInstitutionId }, { data: userCourseTerms }] = await Promise.all([
    resolveInstitutionIdsByName(supabase, request.transcriptData.institution, targetSchool),
    supabase
      .from("user_courses")
      .select("term")
      .eq("user_id", userId)
      .neq("status", "planned")
      .returns<{ term: string | null }[]>(),
  ]);

  // CRITICAL: Validate that the CC institution was found in our database
  // If not found, we cannot generate courses from the correct CC
  if (!ccInstitutionId) {
    throw new AutoPlanGenerationError(
      {
        code: "CC_INSTITUTION_NOT_FOUND",
        message: `We couldn't find "${request.transcriptData.institution}" in our community college database. Please ensure your transcript is from a supported California community college, or try entering your courses manually.`,
        retryable: false,
        fallback: "manual_chat",
      },
      400,
    );
  }

  const latestTerm = findLatestTerm((userCourseTerms ?? []).map((row) => row.term));
  const startTerm = computeNextRegistrationTerm(new Date(), latestTerm).label;

  const coveredInstitutions = hasTargetSchool
    ? []
    : await rankBestFitUniversityIds(ccInstitutionId, request.detectedMajor, 5);
  const selectedUniversityNames = coveredInstitutions.map((institution) => institution.name);
  const selectedTargetInstitutionIds = coveredInstitutions.map((institution) => institution.id);

  const userPrompt = buildSyntheticUserPrompt(
    request.transcriptData,
    request.detectedMajor,
    targetSchool,
    maxCreditsPerSemester,
    startTerm,
  );

  let generated;
  try {
    generated = await PlanGenerationPipeline.generate(
      {
        messages: [
          {
            id: "auto-plan-request",
            role: "user",
            parts: [{ type: "text", text: userPrompt }],
          } as unknown as UIMessage,
        ],
        planContext: {
          ccInstitutionId: ccInstitutionId ?? undefined,
          targetInstitutionId: hasTargetSchool ? (targetInstitutionId ?? undefined) : undefined,
          targetMajor: request.detectedMajor,
          selectedTargetInstitutionIds:
            selectedTargetInstitutionIds.length > 0 ? selectedTargetInstitutionIds : undefined,
        },
      },
      {
        transcriptData: request.transcriptData,
        maxCreditsPerSemester,
        hasTargetSchool,
        selectedUniversityNames: selectedUniversityNames.length > 0 ? selectedUniversityNames : undefined,
        startTerm,
      },
    );
  } catch (error) {
    if (isMiniMaxError(error)) {
      throw new AutoPlanGenerationError(
        {
          code: "AI_UPSTREAM_ERROR",
          message: "The AI provider failed while generating the plan. Please retry.",
          retryable: true,
          fallback: "retry",
        },
        502,
      );
    }
    throw error;
  }

  if (!isSavablePlan(generated.parsedPlan)) {
    throw new AutoPlanGenerationError(
      {
        code: "PLAN_PARSE_FAILED",
        message: "The AI response could not be parsed into a saveable plan. Please retry.",
        retryable: true,
        fallback: "retry",
      },
      502,
    );
  }

  const chatHistory = buildSyntheticChatHistory(
    request.transcriptData,
    request.detectedMajor,
    targetSchool,
    generated.rawText,
  );

  const comparisonTargets = await buildComparisonTargets(
    supabase,
    generated.parsedPlan,
    coveredInstitutions,
  );

  const plan = generated.parsedPlan;
  const topFitName = plan.coveredSchools?.[0]?.name;
  let resolvedTopFitId: string | null = null;
  if (topFitName) {
    const match = coveredInstitutions.find((institution) => institution.name === topFitName);
    resolvedTopFitId =
      match?.id ??
      (await resolveUniversityIdsByNames(supabase, [topFitName]))[0]?.institutionId ??
      null;
  }

  const finalTargetInstitutionId = hasTargetSchool ? targetInstitutionId : resolvedTopFitId;

  let savedPlan;
  try {
    savedPlan = await savePlanRecord(supabase, {
      userId,
      title: buildPlanTitle(plan),
      ccInstitutionId,
      targetInstitutionId: finalTargetInstitutionId,
      targetMajor: request.detectedMajor,
      planData: plan,
      chatHistory,
      maxCreditsPerSemester,
      transcriptId,
      hasTargetSchool,
      comparisonTargets,
    });
  } catch (error) {
    console.error("Auto plan save error:", error);
    throw new AutoPlanGenerationError(
      {
        code: "PLAN_SAVE_FAILED",
        message: "The generated plan could not be saved. Please retry.",
        retryable: true,
        fallback: "retry",
      },
      500,
    );
  }

  return {
    planId: savedPlan.id,
    plan: generated.parsedPlan,
    detectedMajor: request.detectedMajor,
    chatHistory,
  };
}
