import { createClient } from "@/utils/supabase/server";
import type { Database, Json } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type TransferPlanInsert = Database["public"]["Tables"]["transfer_plans"]["Insert"];
type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];
type UserTargetInsert = Database["public"]["Tables"]["user_targets"]["Insert"];

export interface ComparisonTargetPayload {
  institution_id: string;
  name?: string;
  abbreviation?: string | null;
  priority_order?: number;
}

export interface SavePlanRecordInput {
  userId: string;
  title: string;
  ccInstitutionId: string | null;
  targetInstitutionId: string | null;
  targetMajor: string;
  planData: unknown;
  chatHistory: unknown[];
  maxCreditsPerSemester?: number | null;
  transcriptId?: string | null;
  hasTargetSchool?: boolean;
  comparisonTargets?: ComparisonTargetPayload[] | null;
  status?: TransferPlanInsert["status"];
}

export interface ResolvedInstitutionIds {
  ccInstitutionId: string | null;
  targetInstitutionId: string | null;
}

function serializeJson(value: unknown): Json | null {
  if (value === undefined || value === null) {
    return null;
  }

  return JSON.parse(JSON.stringify(value)) as Json;
}

async function resolveMajorId(
  supabase: SupabaseServerClient,
  targetMajor: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("majors")
    .select("id, name")
    .ilike("name", targetMajor)
    .limit(1)
    .maybeSingle();

  const major = data as { id: string } | null;
  return major?.id ?? null;
}

async function syncUserTargets(
  supabase: SupabaseServerClient,
  userId: string,
  majorId: string | null,
  primaryTargetId: string | null,
  comparisonTargets: ComparisonTargetPayload[],
) {
  const uniqueTargets = Array.from(
    new Set([
      ...(primaryTargetId ? [primaryTargetId] : []),
      ...comparisonTargets.map((target) => target.institution_id).filter(Boolean),
    ]),
  );

  const { error: deleteError } = await supabase
    .from("user_targets")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  if (uniqueTargets.length === 0) return;

  const inserts: UserTargetInsert[] = uniqueTargets.map((institutionId, index) => ({
    user_id: userId,
    institution_id: institutionId,
    major_id: majorId,
    priority_order: index + 1,
  }));

  const { error: insertError } = await supabase
    .from("user_targets")
    .insert(inserts as never);

  if (insertError) {
    throw insertError;
  }
}

export async function resolveInstitutionIdsByName(
  supabase: SupabaseServerClient,
  ccName: string,
  targetSchool?: string | null,
): Promise<ResolvedInstitutionIds> {
  const trimmedCcName = ccName.trim();
  const trimmedTargetSchool = targetSchool?.trim() ?? "";

  const ccQuery = trimmedCcName
    ? supabase
        .from("institutions")
        .select("id")
        .or(`name.ilike.%${trimmedCcName}%,abbreviation.ilike.%${trimmedCcName}%`)
        .eq("type", "cc")
        .limit(1)
        .maybeSingle()
    : Promise.resolve({ data: null as { id: string } | null });

  const targetQuery = trimmedTargetSchool
    ? supabase
        .from("institutions")
        .select("id")
        .or(`name.ilike.%${trimmedTargetSchool}%,abbreviation.ilike.%${trimmedTargetSchool}%`)
        .eq("type", "university")
        .limit(1)
        .maybeSingle()
    : Promise.resolve({ data: null as { id: string } | null });

  const [ccResult, targetResult] = await Promise.all([ccQuery, targetQuery]);

  return {
    ccInstitutionId: (ccResult.data as { id: string } | null)?.id ?? null,
    targetInstitutionId: (targetResult.data as { id: string } | null)?.id ?? null,
  };
}

export async function savePlanRecord(
  supabase: SupabaseServerClient,
  input: SavePlanRecordInput,
): Promise<TransferPlanRow> {
  const insertData: TransferPlanInsert = {
    user_id: input.userId,
    title: input.title,
    cc_institution_id: input.ccInstitutionId,
    target_institution_id: input.targetInstitutionId,
    target_major: input.targetMajor,
    plan_data: serializeJson(input.planData),
    chat_history: serializeJson(input.chatHistory),
    status: input.status ?? "active",
    max_credits_per_semester: input.maxCreditsPerSemester ?? null,
    transcript_id: input.transcriptId ?? null,
    has_target_school: input.hasTargetSchool ?? true,
    comparison_targets: serializeJson(input.comparisonTargets ?? null),
  };

  const { data, error } = await supabase
    .from("transfer_plans")
    .insert(insertData as never)
    .select()
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to create plan");
  }

  const majorId = await resolveMajorId(supabase, input.targetMajor);
  await syncUserTargets(
    supabase,
    input.userId,
    majorId,
    input.targetInstitutionId,
    Array.isArray(input.comparisonTargets) ? input.comparisonTargets : [],
  );

  return data as TransferPlanRow;
}
