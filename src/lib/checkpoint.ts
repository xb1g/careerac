import type { SupabaseServerClient } from "@/utils/supabase/server";
import type { Json } from "@/types/database";

/**
 * Snapshot the current plan state into plan_checkpoints before a mutation.
 * Returns the checkpoint id, or null if the plan has no plan_data yet.
 */
export async function createCheckpoint(
  supabase: SupabaseServerClient,
  planId: string,
  actionLabel: string,
): Promise<string | null> {
  // Fetch current plan_data
  const { data: plan } = await supabase
    .from("transfer_plans")
    .select("plan_data")
    .eq("id", planId)
    .single() as { data: { plan_data: Json | null } | null; error: unknown };

  if (!plan?.plan_data) return null;

  // Fetch current plan_courses
  const { data: courses } = await supabase
    .from("plan_courses")
    .select("id, course_id, semester_number, status, alternative_for")
    .eq("plan_id", planId);

  const { data: checkpoint, error } = await supabase
    .from("plan_checkpoints")
    .insert({
      plan_id: planId,
      plan_data: plan.plan_data,
      course_statuses: (courses ?? []) as unknown as Json,
      action_label: actionLabel,
    } as never)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create checkpoint:", error);
    return null;
  }

  return (checkpoint as { id: string }).id;
}
