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

  // Fetch plan_courses, transcript, and user_courses in parallel
  const [coursesResult, transcriptResult, userCoursesResult] = await Promise.allSettled([
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
    supabase
      .from("user_courses")
      .select("course_code, course_title, units, grade, term, status")
      .eq("user_id", userId),
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

  let userCourses: Array<{ course_code: string; course_title: string; units: number; grade: string | null; term: string | null; status: string }> = [];
  if (userCoursesResult.status === "fulfilled" && !userCoursesResult.value.error) {
    userCourses = (userCoursesResult.value.data ?? []) as typeof userCourses;
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
    target_institution_id: plan.target_institution_id,
    target_major: plan.target_major,
    comparison_targets: plan.comparison_targets,
    plan_data: mergedPlanData,
    chat_history: (plan.chat_history as unknown[]) ?? [],
  };

  return {
    plan: planWithMergedData,
    transcript: transcript as any,
    userCourses,
  };
}
