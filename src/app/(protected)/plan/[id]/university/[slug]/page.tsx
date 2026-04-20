import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";
import type { MultiUniversityPlan, TransferPlan } from "@/types/plan";
import { mergeCourseStatusIntoPlanData } from "@/utils/plan-merge";
import { findUniversityBySlug } from "@/utils/slug";
import UniversityDetailClient from "./university-detail-client";

type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];

interface Props {
  params: Promise<{ id: string; slug: string }>;
}

export default async function UniversityDetail({ params }: Props) {
  const { id, slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <NotFound message="Sign in to view this plan." />;
  }

  const { data: plan } = (await supabase
    .from("transfer_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()) as { data: TransferPlanRow | null };

  if (!plan) {
    return <NotFound message="Plan not found." />;
  }

  const planData = plan.plan_data as unknown;
  const isMulti =
    !!planData &&
    typeof planData === "object" &&
    (planData as { isMultiUniversity?: boolean }).isMultiUniversity === true &&
    Array.isArray((planData as { universities?: unknown }).universities);

  if (!isMulti) {
    return <NotFound message="This plan is not a multi-university comparison." parentId={id} />;
  }

  const multi = planData as MultiUniversityPlan;
  const match = findUniversityBySlug(multi.universities, slug);
  if (!match) {
    return <NotFound message={`No university matches "${slug}" in this plan.`} parentId={id} />;
  }

  // v1 best-effort: plan_courses on the parent multi-plan aren't keyed to a
  // specific university, so merged statuses may land on the wrong extracted plan.
  const { data: planCourses } = (await supabase
    .from("plan_courses")
    .select("id, semester_number, status, alternative_for")
    .eq("plan_id", id)
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

  return (
    <UniversityDetailClient
      parentPlanId={id}
      parentTitle={plan.title}
      major={multi.major}
      maxCreditsPerSemester={multi.maxCreditsPerSemester}
      universityName={match.universityName}
      transferPlan={mergedPlan}
      fitScore={match.fitScore}
      highlights={match.highlights}
      transcriptId={plan.transcript_id}
      transcript={transcript as never}
    />
  );
}

function NotFound({ message, parentId }: { message: string; parentId?: string }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 text-center">
      <div>
        <p className="text-zinc-700 dark:text-zinc-300 mb-4">{message}</p>
        <a
          href={parentId ? `/plan/${parentId}` : "/dashboard"}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </a>
      </div>
    </div>
  );
}
