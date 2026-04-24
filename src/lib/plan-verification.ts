import type { Database } from "@/types/database";
import type { PlanCourse, PlanSemester, TransferPlan } from "@/types/plan";

type SupabaseServerClient = {
  from: Awaited<ReturnType<typeof import("@/utils/supabase/server").createClient>>["from"];
};

type ArticulationRow = Database["public"]["Tables"]["articulation_agreements"]["Row"];
export type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];

interface VerifyPlanInput {
  supabase: SupabaseServerClient;
  planData: unknown;
  ccInstitutionId: string | null;
  targetInstitutionId: string | null;
  targetMajor: string;
  comparisonTargets?: ComparisonTargetPayload[] | null;
}

interface ComparisonTargetPayload {
  institution_id: string;
  name?: string;
  abbreviation?: string | null;
  priority_order?: number;
}

interface ResolvedUniversity {
  name: string;
  institutionId: string | null;
  abbreviation: string | null;
}

export interface TargetSchool {
  id: string;
  label: string;
  abbreviation: string | null;
}

export interface ArticulatedCourse {
  ccCourse: CourseRow;
  universityCourse: CourseRow;
  targetId: string;
}

export interface VerificationScope {
  targets: TargetSchool[];
  coursesByCode: Map<string, ArticulatedCourse[]>;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isTransferPlan(value: unknown): value is TransferPlan {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TransferPlan>;
  return Array.isArray(candidate.semesters) && typeof candidate.targetMajor === "string";
}

function isMajorMatch(agreementMajor: string | null, targetMajor: string): boolean {
  if (!agreementMajor) return false;

  const normalizedAgreement = normalize(agreementMajor);
  const normalizedTarget = normalize(targetMajor);
  if (!normalizedAgreement || !normalizedTarget) return false;

  return (
    normalizedAgreement.includes(normalizedTarget) ||
    normalizedTarget.includes(normalizedAgreement) ||
    normalizedAgreement === normalizedTarget
  );
}

function dedupeTargets(targets: TargetSchool[]): TargetSchool[] {
  const seen = new Set<string>();
  return targets.filter((target) => {
    if (seen.has(target.id)) return false;
    seen.add(target.id);
    return true;
  });
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function buildTransferEquivalency(
  matches: ArticulatedCourse[],
  targetsById: Map<string, TargetSchool>,
): string | undefined {
  const parts = unique(
    matches
      .map((match) => {
        const target = targetsById.get(match.targetId);
        const prefix = target?.abbreviation?.trim() || target?.label || "";
        return prefix ? `${prefix} ${match.universityCourse.code}` : match.universityCourse.code;
      })
      .filter(Boolean),
  );

  return parts.length > 0 ? parts.join(" / ") : undefined;
}

function sanitizeSemesters(
  semesters: PlanSemester[],
  scope: VerificationScope,
  coveredSchoolNames: string[],
): PlanSemester[] {
  const targetsById = new Map(scope.targets.map((target) => [target.id, target]));
  const targetIdsInOrder = scope.targets.map((target) => target.id);
  const coveredNameSet = new Set(coveredSchoolNames);
  const coveredCount = coveredSchoolNames.length;

  const sanitized = semesters
    .map<PlanSemester | null>((semester, semesterIndex) => {
      const courses = semester.courses
        .map<PlanCourse | null>((course) => {
          const matches = scope.coursesByCode.get(normalize(course.code)) ?? [];
          if (matches.length === 0) return null;

          const requestedTargetIds =
            Array.isArray(course.requiredBy) && course.requiredBy.length > 0
              ? course.requiredBy
                  .filter((name) => coveredNameSet.has(name))
                  .map((name) =>
                    scope.targets.find((target) => target.label === name)?.id ?? null,
                  )
                  .filter((id): id is string => Boolean(id))
              : targetIdsInOrder;

          const requestedTargetSet = new Set(
            requestedTargetIds.length > 0 ? requestedTargetIds : targetIdsInOrder,
          );

          const validMatches = matches.filter((match) => requestedTargetSet.has(match.targetId));
          if (validMatches.length === 0) return null;

          const canonical = validMatches[0].ccCourse;
          const validTargetIds = unique(validMatches.map((match) => match.targetId));
          const requiredBy =
            coveredCount > 0 && validTargetIds.length > 0 && validTargetIds.length < coveredCount
              ? coveredSchoolNames.filter((name) => {
                  const targetId = scope.targets.find((target) => target.label === name)?.id;
                  return Boolean(targetId && validTargetIds.includes(targetId));
                })
              : undefined;

          return {
            ...course,
            code: canonical.code,
            title: canonical.title,
            units: Number(canonical.units),
            transferEquivalency: buildTransferEquivalency(validMatches, targetsById),
            ...(requiredBy && requiredBy.length > 0 ? { requiredBy } : { requiredBy: undefined }),
          };
        })
        .filter((course): course is PlanCourse => Boolean(course));

      if (courses.length === 0) return null;

      return {
        number: typeof semester.number === "number" ? semester.number : semesterIndex + 1,
        label: semester.label,
        courses,
        totalUnits: courses.reduce((sum, course) => sum + course.units, 0),
      };
    })
    .filter((semester): semester is PlanSemester => Boolean(semester));

  return sanitized;
}

async function resolvePlanTargets(
  supabase: SupabaseServerClient,
  plan: TransferPlan,
  targetInstitutionId: string | null,
  comparisonTargets: ComparisonTargetPayload[] | null | undefined,
): Promise<TargetSchool[]> {
  const explicitTargets = [
    ...(targetInstitutionId ? [{ id: targetInstitutionId, label: plan.targetUniversity, abbreviation: null }] : []),
    ...((comparisonTargets ?? []).map((target) => ({
      id: target.institution_id,
      label: target.name ?? "",
      abbreviation: target.abbreviation ?? null,
    }))),
  ];

  const planCoveredNames = [
    ...(plan.coveredSchools?.map((school) => school.name) ?? []),
    ...(plan.targetUniversity ? [plan.targetUniversity] : []),
  ].filter(Boolean);

  const unresolvedNames = planCoveredNames.filter(
    (name) => !explicitTargets.some((target) => target.label === name),
  );

  let resolvedByName: ResolvedUniversity[] = [];
  if (unresolvedNames.length > 0) {
    const queries = unresolvedNames.map(async (name): Promise<ResolvedUniversity> => {
      const trimmed = name.trim().replace(/,/g, " ");
      const { data } = await supabase
        .from("institutions")
        .select("id, abbreviation")
        .or(`name.ilike.%${trimmed}%,abbreviation.ilike.%${trimmed}%`)
        .eq("type", "university")
        .limit(1)
        .maybeSingle();

      const row = data as { id: string; abbreviation: string | null } | null;
      return {
        name,
        institutionId: row?.id ?? null,
        abbreviation: row?.abbreviation ?? null,
      };
    });

    resolvedByName = await Promise.all(queries);
  }

  const provisionalTargets = dedupeTargets([
    ...explicitTargets.filter((target) => Boolean(target.id)),
    ...resolvedByName
      .filter((target): target is ResolvedUniversity & { institutionId: string } => Boolean(target.institutionId))
      .map((target) => ({
        id: target.institutionId,
        label: target.name,
        abbreviation: target.abbreviation,
      })),
  ]);

  if (provisionalTargets.length === 0) return [];

  const { data: institutions } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .in(
      "id",
      provisionalTargets.map((target) => target.id),
    )
    .returns<Pick<InstitutionRow, "id" | "name" | "abbreviation">[]>();

  const institutionsById = new Map((institutions ?? []).map((institution) => [institution.id, institution]));
  return provisionalTargets
    .map((target) => {
      const institution = institutionsById.get(target.id);
      if (!institution) return null;

      const coveredLabel =
        plan.coveredSchools?.find((school) => school.name === target.label)?.name ??
        plan.coveredSchools?.find((school) => school.institutionId === target.id)?.name ??
        (target.label || institution.name);

      return {
        id: target.id,
        label: coveredLabel,
        abbreviation: target.abbreviation ?? institution.abbreviation ?? null,
      };
    })
    .filter((target): target is TargetSchool => Boolean(target));
}

async function buildVerificationScope(
  supabase: SupabaseServerClient,
  ccInstitutionId: string,
  targetMajor: string,
  targets: TargetSchool[],
): Promise<VerificationScope | null> {
  if (targets.length === 0) return null;

  const { data: articulationRows } = await supabase
    .from("articulation_agreements")
    .select(
      "id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes, created_at",
    )
    .eq("cc_institution_id", ccInstitutionId)
    .in(
      "university_institution_id",
      targets.map((target) => target.id),
    )
    .limit(5000)
    .returns<ArticulationRow[]>();

  if (!articulationRows || articulationRows.length === 0) return null;

  const scopedRows = targets.flatMap((target) => {
    const rowsForTarget = articulationRows.filter((row) => row.university_institution_id === target.id);
    const majorRows = rowsForTarget.filter((row) => isMajorMatch(row.major, targetMajor));
    return majorRows.length > 0 ? majorRows : rowsForTarget;
  });

  if (scopedRows.length === 0) return null;

  const courseIds = unique(scopedRows.flatMap((row) => [row.cc_course_id, row.university_course_id]));
  const { data: courses } = await supabase
    .from("courses")
    .select("id, institution_id, code, title, units, description, created_at")
    .in("id", courseIds)
    .returns<CourseRow[]>();

  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));
  const coursesByCode = new Map<string, ArticulatedCourse[]>();

  for (const row of scopedRows) {
    const ccCourse = courseMap.get(row.cc_course_id);
    const universityCourse = courseMap.get(row.university_course_id);
    if (!ccCourse || !universityCourse) continue;

    const key = normalize(ccCourse.code);
    const existing = coursesByCode.get(key) ?? [];
    existing.push({
      ccCourse,
      universityCourse,
      targetId: row.university_institution_id,
    });
    coursesByCode.set(key, existing);
  }

  return { targets, coursesByCode };
}

export function sanitizePlanWithArticulation(
  plan: TransferPlan,
  scope: VerificationScope,
): TransferPlan {
  const coveredSchoolNames = plan.coveredSchools?.map((school) => school.name) ?? [];
  const semesters = sanitizeSemesters(plan.semesters, scope, coveredSchoolNames);

  const coveredSchools = plan.coveredSchools
    ? plan.coveredSchools
        .map((school) => {
          const target = scope.targets.find((targetSchool) => targetSchool.label === school.name);
          return {
            ...school,
            institutionId: target?.id ?? school.institutionId ?? null,
          };
        })
    : undefined;

  return {
    ...plan,
    ...(coveredSchools ? { coveredSchools } : {}),
    semesters,
    totalUnits: semesters.reduce((sum, semester) => sum + semester.totalUnits, 0),
  };
}

export async function verifyPlanDataAgainstArticulation({
  supabase,
  planData,
  ccInstitutionId,
  targetInstitutionId,
  targetMajor,
  comparisonTargets,
}: VerifyPlanInput): Promise<unknown> {
  if (!ccInstitutionId || !isTransferPlan(planData)) {
    return planData;
  }

  const targets = await resolvePlanTargets(
    supabase,
    planData,
    targetInstitutionId,
    comparisonTargets,
  );
  const scope = await buildVerificationScope(supabase, ccInstitutionId, targetMajor, targets);
  if (!scope) {
    return planData;
  }

  return sanitizePlanWithArticulation(planData, scope);
}
