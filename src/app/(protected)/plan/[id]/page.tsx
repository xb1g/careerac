import { createClient } from "@/utils/supabase/server";
import PlanDetailPage from "./plan-detail-client";
import type { Database } from "@/types/database";
import { mergeCourseStatusIntoPlanData } from "@/utils/plan-merge";

type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];

interface PlanDetailProps {
  params: Promise<{ id: string }>;
}

export default async function PlanDetail({ params }: PlanDetailProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify the current user owns this plan (isolation check)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <PlanNotFound />;
  }

  // Fetch the plan
  const { data: plan, error } = await supabase
    .from("transfer_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single() as { data: TransferPlanRow | null; error: unknown };

  if (error || !plan) {
    return <PlanNotFound />;
  }

  // Fetch plan_courses to merge authoritative status data
  const { data: planCourses } = await supabase
    .from("plan_courses")
    .select("id, semester_number, status, alternative_for")
    .eq("plan_id", id)
    .order("created_at", { ascending: true }) as { data: Array<{ semester_number: number; status: string; alternative_for: string | null }> | null; error: unknown };

  // Fetch linked transcript if transcript_id exists
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

  // Merge plan_courses status into plan_data for persistence
  let mergedPlanData: unknown = plan.plan_data;
  if (planCourses && planCourses.length > 0) {
    mergedPlanData = mergeCourseStatusIntoPlanData(plan.plan_data, planCourses);
  }

  // Create a plan object with merged data
  const planWithMergedData = {
    id: plan.id,
    title: plan.title,
    target_major: plan.target_major,
    plan_data: mergedPlanData,
    chat_history: (plan.chat_history as unknown[]) ?? [],
  };

  return <PlanDetailPage plan={planWithMergedData} transcript={transcript as never} />;
}

function PlanNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Plan not found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          The plan you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
