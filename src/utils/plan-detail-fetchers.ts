import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";
import type { MultiUniversityPlan, TransferPlan } from "@/types/plan";
import { mergeCourseStatusIntoPlanData } from "@/utils/plan-merge";
import { findUniversityBySlug } from "@/utils/slug";
import type { TranscriptData } from "@/types/transcript";

type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];

export interface UniversityDetailProps {
  parentPlanId: string;
  parentTitle: string;
  major: string;
  maxCreditsPerSemester: number;
  universityName: string;
  transferPlan: TransferPlan;
  fitScore: number;
  highlights: string[];
  transcriptId: string | null;
  transcript: {
    id: string;
    file_name: string;
    parsed_data: TranscriptData;
    parse_status: string;
  } | null;
}

export type LoadResult =
  | { ok: true; props: UniversityDetailProps }
  | { ok: false; message: string; parentId?: string };

export async function loadUniversityDetail(
  planId: string,
  slug: string,
): Promise<LoadResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sign in to view this plan." };
  }

  const { data: plan } = (await supabase
    .from("transfer_plans")
    .select("*")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single()) as { data: TransferPlanRow | null };

  if (!plan) {
    return { ok: false, message: "Plan not found." };
  }

  const planData = plan.plan_data as unknown;
  const isMulti =
    !!planData &&
    typeof planData === "object" &&
    (planData as { isMultiUniversity?: boolean }).isMultiUniversity === true &&
    Array.isArray((planData as { universities?: unknown }).universities);

  if (!isMulti) {
    return {
      ok: false,
      message: "This plan is not a multi-university comparison.",
      parentId: planId,
    };
  }

  const multi = planData as MultiUniversityPlan;
  const match = findUniversityBySlug(multi.universities, slug);
  if (!match) {
    return {
      ok: false,
      message: `No university matches "${slug}" in this plan.`,
      parentId: planId,
    };
  }

  const { data: planCourses } = (await supabase
    .from("plan_courses")
    .select("id, semester_number, status, alternative_for")
    .eq("plan_id", planId)
    .order("created_at", { ascending: true })) as {
    data: Array<{ semester_number: number; status: string; alternative_for: string | null }> | null;
  };

  const mergedPlan = (planCourses && planCourses.length > 0
    ? mergeCourseStatusIntoPlanData(match.plan, planCourses)
    : match.plan) as TransferPlan;

  let transcript = null;
  if (plan.transcript_id) {
    const { data: transcriptData } = await supabase
      .from("transcripts")
      .select("*")
      .eq("id", plan.transcript_id)
      .eq("user_id", user.id)
      .single();
    transcript = transcriptData;
  }

  return {
    ok: true,
    props: {
      parentPlanId: planId,
      parentTitle: plan.title,
      major: multi.major,
      maxCreditsPerSemester: multi.maxCreditsPerSemester,
      universityName: match.universityName,
      transferPlan: mergedPlan,
      fitScore: match.fitScore,
      highlights: match.highlights,
      transcriptId: plan.transcript_id,
      transcript: transcript as UniversityDetailProps["transcript"],
    },
  };
}
