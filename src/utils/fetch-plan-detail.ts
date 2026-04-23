import { createClient } from "@/utils/supabase/server";
import { mergeCourseStatusIntoPlanData } from "@/utils/plan-merge";
import type { Database } from "@/types/database";

type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];

export async function fetchPlanDetail(id: string, userId: string) {
  const supabase = await createClient();

  // Fetch the plan
  const { data: plan, error } = (await supabase
    .from("transfer_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()) as { data: TransferPlanRow | null; error: unknown };

  if (error || !plan) {
    return null;
  }

  // Fetch plan_courses and transcript in parallel
  const [coursesResult, transcriptResult] = await Promise.allSettled([
    supabase
      .from("plan_courses")
      .select("id, semester_number, status, alternative_for")
      .eq("plan_id", id)
      .order("created_at", { ascending: true }),
    plan.transcript_id
      ? supabase
          .from("transcripts")
          .select("*")
          .eq("id", plan.transcript_id)
          .eq("user_id", userId)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  let planCourses = null;
  if (coursesResult.status === "fulfilled" && !coursesResult.value.error) {
    planCourses = coursesResult.value.data as Array<{
      semester_number: number;
      status: string;
      alternative_for: string | null;
    }>;
  }

  let transcript = null;
  if (transcriptResult.status === "fulfilled" && !transcriptResult.value.error) {
    transcript = transcriptResult.value.data;
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

  return {
    plan: planWithMergedData,
    transcript: transcript as any,
  };
}
