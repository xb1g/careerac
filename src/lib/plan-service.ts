import { createClient } from "@/utils/supabase/server";
import type { Database, Json } from "@/types/database";
import { verifyPlanDataAgainstArticulation } from "@/lib/plan-verification";

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

export interface ResolvedUniversity {
  name: string;
  institutionId: string | null;
  abbreviation: string | null;
}

export async function resolveUniversityIdsByNames(
  supabase: SupabaseServerClient,
  names: string[],
): Promise<ResolvedUniversity[]> {
  const queries = names
    .filter((name): name is string => typeof name === "string")
    .map(async (name): Promise<ResolvedUniversity> => {
      const trimmed = name.trim().replace(/,/g, " ");
      if (!trimmed) {
        return { name, institutionId: null, abbreviation: null };
      }

    const { data } = await supabase
      .from("institutions")
      .select("id, abbreviation")
      .or(`name.ilike.%${trimmed}%,abbreviation.ilike.%${trimmed}%`)
      .eq("type", "university")
      .limit(1)
      .maybeSingle();

    const inst = data as { id: string; abbreviation: string | null } | null;
    return {
      name,
      institutionId: inst?.id ?? null,
      abbreviation: inst?.abbreviation ?? null,
    };
  });

  return Promise.all(queries);
}

/**
 * Calculates similarity score between two strings (0-1).
 * Uses a combination of:
 * - Longest common substring ratio
 * - Word overlap
 */
function fuzzyScore(input: string, target: string): number {
  const a = input.toLowerCase();
  const b = target.toLowerCase();

  // Exact match
  if (a === b) return 1;

  // Contains match
  if (a.includes(b) || b.includes(a)) return 0.9;

  // Remove common suffixes/prefixes and check
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents (ñ → n, é → e, etc.)
      .replace(/college|university|community college district|district|of$/gi, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normA = normalize(a);
  const normB = normalize(b);

  if (normA === normB) return 0.9;
  if (normA.includes(normB) || normB.includes(normA)) return 0.85;

  // Also check without spaces (handles "deanza" vs "de anza")
  const normANospace = normA.replace(/\s/g, "");
  const normBNospace = normB.replace(/\s/g, "");
  if (normANospace === normBNospace) return 0.88;
  if (normANospace.includes(normBNospace) || normBNospace.includes(normANospace)) return 0.83;

  // Word overlap scoring
  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const word of wordsA) {
    // Check direct match
    if (wordsB.has(word)) {
      overlap++;
    }
    // Check partial match (e.g., "deanza" contains "dean")
    else if ([...wordsB].some((w) => w.includes(word) || word.includes(w))) {
      overlap += 0.5;
    }
    // Check nospace match for spaced names
    else {
      const wordNospace = word.replace(/\s/g, "");
      if ([...wordsB].some((w) => w.replace(/\s/g, "").includes(wordNospace) || wordNospace.includes(w.replace(/\s/g, "")))) {
        overlap += 0.5;
      }
    }
  }

  const unionSize = Math.max(wordsA.size, wordsB.size);
  const wordScore = overlap / unionSize;

  // Longest common substring
  let lcsLen = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let len = 0;
      while (i + len < a.length && j + len < b.length && a[i + len] === b[j + len]) {
        len++;
      }
      lcsLen = Math.max(lcsLen, len);
    }
  }
  const lcsScore = (2 * lcsLen) / (a.length + b.length);

  return Math.max(wordScore * 0.6, lcsScore * 0.4);
}

const MATCH_THRESHOLD = 0.35;

export async function resolveInstitutionIdsByName(
  supabase: SupabaseServerClient,
  ccName: string,
  targetSchool?: string | null,
): Promise<ResolvedInstitutionIds> {
  const trimmedCcName = ccName.trim();
  const trimmedTargetSchool = targetSchool?.trim() ?? "";

  // Try exact/ilike match first
  const ccQueryExact = trimmedCcName
    ? supabase
        .from("institutions")
        .select("id, name, abbreviation")
        .or(`name.ilike.%${trimmedCcName}%,abbreviation.ilike.%${trimmedCcName}%`)
        .in("type", ["cc", "community_college"])
        .limit(5)
    : Promise.resolve({ data: null as Array<{ id: string; name: string; abbreviation: string | null }> | null });

  const targetQuery = trimmedTargetSchool
    ? supabase
        .from("institutions")
        .select("id")
        .or(`name.ilike.%${trimmedTargetSchool}%,abbreviation.ilike.%${trimmedTargetSchool}%`)
        .eq("type", "university")
        .limit(1)
        .maybeSingle()
    : Promise.resolve({ data: null as { id: string } | null });

  const [ccResultExact, targetResult] = await Promise.all([ccQueryExact, targetQuery]);

  // If exact match found, return it
  if (ccResultExact.data && ccResultExact.data.length > 0) {
    return {
      ccInstitutionId: ccResultExact.data[0].id,
      targetInstitutionId: (targetResult?.data as { id: string } | null)?.id ?? null,
    };
  }

  // Fuzzy match: fetch all CCs and score them
  const { data: allCCs } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .in("type", ["cc", "community_college"])
    .returns<Array<{ id: string; name: string; abbreviation: string | null }>>();

  if (!allCCs || allCCs.length === 0) {
    return {
      ccInstitutionId: null,
      targetInstitutionId: (targetResult?.data as { id: string } | null)?.id ?? null,
    };
  }

  // Score each CC
  const scored = allCCs
    .map((cc) => {
      const nameScore = fuzzyScore(trimmedCcName, cc.name);
      const abbrScore = cc.abbreviation ? fuzzyScore(trimmedCcName, cc.abbreviation) : 0;
      return { id: cc.id, name: cc.name, score: Math.max(nameScore, abbrScore) };
    })
    .filter((cc) => cc.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  return {
    ccInstitutionId: scored[0]?.id ?? null,
    targetInstitutionId: (targetResult?.data as { id: string } | null)?.id ?? null,
  };
}

export async function savePlanRecord(
  supabase: SupabaseServerClient,
  input: SavePlanRecordInput,
): Promise<TransferPlanRow> {
  const verifiedPlanData = await verifyPlanDataAgainstArticulation({
    supabase,
    planData: input.planData,
    ccInstitutionId: input.ccInstitutionId,
    targetInstitutionId: input.targetInstitutionId,
    targetMajor: input.targetMajor,
    comparisonTargets: input.comparisonTargets,
  });

  const insertData: TransferPlanInsert = {
    user_id: input.userId,
    title: input.title,
    cc_institution_id: input.ccInstitutionId,
    target_institution_id: input.targetInstitutionId,
    target_major: input.targetMajor,
    plan_data: serializeJson(verifiedPlanData),
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
