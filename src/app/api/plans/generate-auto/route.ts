import { NextResponse } from "next/server";
import type { UIMessage } from "ai";
import { MiniMaxApiError } from "@/lib/ai-stream";
import { PlanGenerationPipeline } from "@/lib/plan-pipeline";
import { buildSyntheticUserPrompt } from "@/lib/plan-prompts";
import {
  resolveInstitutionIdsByName,
  resolveUniversityIdsByNames,
  savePlanRecord,
  type ComparisonTargetPayload,
} from "@/lib/plan-service";
import type { MultiUniversityPlan, ParsedPlan, TransferPlan } from "@/types/plan";
import type { TranscriptData } from "@/types/transcript";
import { createClient } from "@/utils/supabase/server";
import { computeNextRegistrationTerm, findLatestTerm } from "@/utils/term";

export const runtime = "nodejs";
export const maxDuration = 60;

type GenerateAutoErrorCode =
  | "UNAUTHORIZED"
  | "INVALID_INPUT"
  | "MAJOR_REQUIRED"
  | "AI_UPSTREAM_ERROR"
  | "PLAN_PARSE_FAILED"
  | "PLAN_SAVE_FAILED";

interface GenerateAutoRequestBody {
  transcriptId?: string;
  transcriptData?: TranscriptData;
  detectedMajor?: string;
  targetSchool?: string | null;
  maxCreditsPerSemester?: number;
}

function errorResponse(
  status: number,
  code: GenerateAutoErrorCode,
  message: string,
  retryable: boolean,
  fallback: "manual_chat" | "retry",
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        retryable,
        fallback,
      },
    },
    { status },
  );
}

function isTranscriptData(value: unknown): value is TranscriptData {
  if (!value || typeof value !== "object") return false;

  const transcript = value as Record<string, unknown>;
  return (
    typeof transcript.institution === "string" &&
    Array.isArray(transcript.courses) &&
    typeof transcript.totalUnitsCompleted === "number" &&
    typeof transcript.totalUnitsInProgress === "number"
  );
}

function isSavablePlan(
  plan: ParsedPlan | null,
): plan is TransferPlan | MultiUniversityPlan {
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

  const welcomeText = transcriptData
    ? `I see you've taken ${transcriptData.courses.length} courses at ${transcriptData.institution} with ${transcriptData.totalUnitsCompleted} completed units${gpaText}. Let me analyze your coursework and ${destination} for ${detectedMajor}.`
    : `I'll analyze the available transfer paths and ${destination} for ${detectedMajor}.`;

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

function buildPlanTitle(plan: TransferPlan | MultiUniversityPlan): string {
  if ("isMultiUniversity" in plan && plan.isMultiUniversity) {
    return `${plan.studentCC} → Multiple Universities (${plan.major})`;
  }

  const transferPlan = plan as TransferPlan;
  return `${transferPlan.ccName} → ${transferPlan.targetUniversity}`;
}

async function buildComparisonTargetsFromPlan(
  supabase: Awaited<ReturnType<typeof createClient>>,
  plan: ParsedPlan | null,
): Promise<ComparisonTargetPayload[] | null> {
  if (!plan || !("isMultiUniversity" in plan) || !plan.isMultiUniversity) {
    return null;
  }

  const names = plan.universities
    .map((u) => u.universityName)
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0);

  if (names.length === 0) return null;

  const resolved = await resolveUniversityIdsByNames(supabase, names);

  const payload: ComparisonTargetPayload[] = [];
  const seen = new Set<string>();
  resolved.forEach((entry) => {
    if (!entry.institutionId || seen.has(entry.institutionId)) return;
    seen.add(entry.institutionId);
    payload.push({
      institution_id: entry.institutionId,
      name: entry.name,
      abbreviation: entry.abbreviation,
      priority_order: payload.length + 1,
    });
  });

  return payload.length > 0 ? payload : null;
}

function isMiniMaxError(error: unknown): boolean {
  if (error instanceof MiniMaxApiError) return true;
  if (error instanceof Error) {
    return (
      error.message.includes("MiniMax API error") ||
      error.name === "AbortError"
    );
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse(
        401,
        "UNAUTHORIZED",
        "You must sign in before generating an automatic plan.",
        false,
        "manual_chat",
      );
    }

    let body: GenerateAutoRequestBody;
    try {
      body = (await req.json()) as GenerateAutoRequestBody;
    } catch {
      return errorResponse(
        400,
        "INVALID_INPUT",
        "Request body must be valid JSON.",
        false,
        "manual_chat",
      );
    }

    if (!isTranscriptData(body.transcriptData)) {
      return errorResponse(
        400,
        "INVALID_INPUT",
        "transcriptData is required to generate an automatic plan.",
        false,
        "manual_chat",
      );
    }

    const detectedMajor = typeof body.detectedMajor === "string"
      ? body.detectedMajor.trim()
      : "";

    if (!detectedMajor) {
      return errorResponse(
        400,
        "MAJOR_REQUIRED",
        "A detected major is required before generating an automatic plan.",
        false,
        "manual_chat",
      );
    }

    const targetSchool = typeof body.targetSchool === "string"
      ? body.targetSchool.trim() || null
      : null;
    const hasTargetSchool = Boolean(targetSchool);
    const maxCreditsPerSemester =
      typeof body.maxCreditsPerSemester === "number" && body.maxCreditsPerSemester > 0
        ? body.maxCreditsPerSemester
        : 15;
    const transcriptId = typeof body.transcriptId === "string"
      ? body.transcriptId
      : null;

    const [{ ccInstitutionId, targetInstitutionId }, { data: userCourseTerms }] = await Promise.all([
      resolveInstitutionIdsByName(supabase, body.transcriptData.institution, targetSchool),
      supabase.from("user_courses").select("term").eq("user_id", user.id).neq("status", "planned").returns<{ term: string | null }[]>(),
    ]);

    const latestTerm = findLatestTerm((userCourseTerms ?? []).map((r) => r.term));
    const startTerm = computeNextRegistrationTerm(new Date(), latestTerm).label;

    const userPrompt = buildSyntheticUserPrompt(
      body.transcriptData,
      detectedMajor,
      targetSchool,
      maxCreditsPerSemester,
      startTerm,
    );

    let generated;
    const generateStartedAt = Date.now();
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
            targetInstitutionId: hasTargetSchool
              ? (targetInstitutionId ?? undefined)
              : undefined,
            targetMajor: detectedMajor,
          },
        },
        {
          transcriptData: body.transcriptData,
          maxCreditsPerSemester,
          hasTargetSchool,
          startTerm,
        },
      );
      console.log("auto-plan generate ms", Date.now() - generateStartedAt);
    } catch (error) {
      console.log(
        "auto-plan generate failed ms",
        Date.now() - generateStartedAt,
        error instanceof Error ? error.name : typeof error,
      );
      if (isMiniMaxError(error)) {
        return errorResponse(
          502,
          "AI_UPSTREAM_ERROR",
          "The AI provider failed while generating the plan. Please retry.",
          true,
          "retry",
        );
      }

      throw error;
    }

    if (!isSavablePlan(generated.parsedPlan)) {
      return errorResponse(
        502,
        "PLAN_PARSE_FAILED",
        "The AI response could not be parsed into a saveable plan. Please retry.",
        true,
        "retry",
      );
    }

    const chatHistory = buildSyntheticChatHistory(
      body.transcriptData,
      detectedMajor,
      targetSchool,
      generated.rawText,
    );

    const comparisonTargets = await buildComparisonTargetsFromPlan(
      supabase,
      generated.parsedPlan,
    );

    try {
      const savedPlan = await savePlanRecord(supabase, {
        userId: user.id,
        title: buildPlanTitle(generated.parsedPlan),
        ccInstitutionId,
        targetInstitutionId: hasTargetSchool ? targetInstitutionId : null,
        targetMajor: detectedMajor,
        planData: generated.parsedPlan,
        chatHistory,
        maxCreditsPerSemester,
        transcriptId,
        hasTargetSchool,
        comparisonTargets,
      });

      return NextResponse.json(
        {
          planId: savedPlan.id,
          plan: generated.parsedPlan,
          detectedMajor,
          chatHistory,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Auto plan save error:", error);
      return errorResponse(
        500,
        "PLAN_SAVE_FAILED",
        "The generated plan could not be saved. Please retry.",
        true,
        "retry",
      );
    }
  } catch (error) {
    console.error("Auto plan generation error:", error);
    return errorResponse(
      502,
      "AI_UPSTREAM_ERROR",
      "Automatic plan generation failed. Please retry.",
      true,
      "retry",
    );
  }
}
