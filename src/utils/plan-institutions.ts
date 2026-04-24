import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/types/database";

type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];

/**
 * Resolve institution names to database IDs.
 * Returns null for any ID that couldn't be found.
 */
export async function resolveInstitutionIds(
  ccName: string,
  targetUniversity: string
): Promise<{ ccId: string | null; targetId: string | null }> {
  const supabase = createClient();

  // Search by name or abbreviation
  const { data: ccData } = await supabase
    .from("institutions")
    .select("id")
    .or(`name.ilike.%${ccName}%,abbreviation.ilike.%${ccName}%`)
    .in("type", ["cc", "community_college"])
    .limit(1)
    .maybeSingle();

  const { data: targetData } = await supabase
    .from("institutions")
    .select("id")
    .or(`name.ilike.%${targetUniversity}%,abbreviation.ilike.%${targetUniversity}%`)
    .eq("type", "university")
    .limit(1)
    .maybeSingle();

  return {
    ccId: (ccData as InstitutionRow | null)?.id ?? null,
    targetId: (targetData as InstitutionRow | null)?.id ?? null,
  };
}

/**
 * Update a plan's institution IDs after they've been resolved.
 */
export async function updatePlanInstitutionIds(
  planId: string,
  ccId: string | null,
  targetId: string | null
): Promise<void> {
  const supabase = createClient();

  const updateData: Record<string, string | null> = {};
  if (ccId) updateData.cc_institution_id = ccId;
  if (targetId) updateData.target_institution_id = targetId;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("transfer_plans")
      .update(updateData as never)
      .eq("id", planId);

    if (error) {
      console.error("Failed to update plan institution IDs:", error);
    }
  }
}
