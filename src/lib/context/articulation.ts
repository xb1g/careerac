/**
 * Articulation & prerequisite context fetching.
 * Owns all Supabase queries for articulation agreements and prerequisites.
 */

import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";
import type { PlanContext } from "@/lib/plan-pipeline";

type ArticulationRow =
  Database["public"]["Tables"]["articulation_agreements"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];
type MajorRow = Database["public"]["Tables"]["majors"]["Row"];
type PrerequisiteRow = Database["public"]["Tables"]["prerequisites"]["Row"];

export interface ArticulationContextResult {
  context: string;
  exactMatchCount: number;
  institutionMatchCount: number;
  availableMajors: string[];
}

// ---------------------------------------------------------------------------
// Major matching helpers
// ---------------------------------------------------------------------------

function normalizeMajor(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isMajorMatch(
  agreementMajor: string | null,
  targetMajor?: string,
): boolean {
  if (!targetMajor) return true;
  if (!agreementMajor) return false;

  const normalizedAgreementMajor = normalizeMajor(agreementMajor);
  const normalizedTargetMajor = normalizeMajor(targetMajor);

  if (!normalizedAgreementMajor || !normalizedTargetMajor) return false;
  if (
    normalizedAgreementMajor.includes(normalizedTargetMajor) ||
    normalizedTargetMajor.includes(normalizedAgreementMajor)
  ) {
    return true;
  }

  const agreementTokens = new Set(
    normalizedAgreementMajor.split(" ").filter((t) => t.length > 2),
  );
  const targetTokens = new Set(
    normalizedTargetMajor.split(" ").filter((t) => t.length > 2),
  );

  let overlap = 0;
  for (const token of agreementTokens) {
    if (targetTokens.has(token)) {
      overlap += 1;
    }
  }

  const requiredOverlap = Math.min(2, targetTokens.size);
  return overlap >= requiredOverlap && overlap > 0;
}

function normalizeAvailableMajors(
  majors: Array<Pick<MajorRow, "name">> | null | undefined,
): string[] {
  return Array.from(
    new Set(
      (majors || [])
        .map((major) => major.name?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

function buildAvailableMajorsLine(availableMajors: string[]): string {
  return availableMajors.length > 0
    ? `Available majors in CareerAC: ${availableMajors.join(", ")}`
    : "Available majors in CareerAC: unavailable right now.";
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Fetches articulation data for the user's path (CC + target school + major).
 */
export async function getArticulationContext(
  planContext?: PlanContext,
  hasTargetSchool = true,
): Promise<ArticulationContextResult> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("articulation_agreements")
      .select(
        "id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, notes",
      )
      .limit(1500);

    if (planContext?.ccInstitutionId) {
      query = query.eq("cc_institution_id", planContext.ccInstitutionId);
    }

    if (hasTargetSchool !== false && planContext?.targetInstitutionId) {
      query = query.eq(
        "university_institution_id",
        planContext.targetInstitutionId,
      );
    }

    const selectedInstitutionIds = Array.isArray(planContext?.selectedTargetInstitutionIds)
      ? Array.from(
        new Set(
          planContext.selectedTargetInstitutionIds
            .filter((id): id is string => typeof id === "string" && id.trim().length > 0),
        ),
      )
      : [];

    if (selectedInstitutionIds.length > 0) {
      query = query.in("university_institution_id", selectedInstitutionIds);
    }

    // Keep the full major catalog separate from the scoped articulation slice so
    // the AI does not incorrectly infer that only the currently matched majors exist.
    const [{ data: scopedAgreements, error }, { data: majorRows }] =
      await Promise.all([
        query.returns<ArticulationRow[]>(),
        supabase
          .from("majors")
          .select("name")
          .order("name", { ascending: true })
          .returns<Pick<MajorRow, "name">[]>(),
      ]);

    const availableMajors = normalizeAvailableMajors(majorRows);
    const availableMajorsLine = buildAvailableMajorsLine(availableMajors);

    if (error || !scopedAgreements) {
      console.error("Error fetching articulation data:", error);
      return {
        context: `Articulation data is currently unavailable.\n${availableMajorsLine}`,
        exactMatchCount: 0,
        institutionMatchCount: 0,
        availableMajors,
      };
    }

    const institutionMatchCount = scopedAgreements.length;
    const exactMajorMatches = scopedAgreements.filter((agreement) =>
      isMajorMatch(agreement.major, planContext?.targetMajor),
    );
    const exactMatchCount = exactMajorMatches.length;
    const agreementsForPrompt =
      exactMatchCount > 0 ? exactMajorMatches : scopedAgreements;

    // Collect unique IDs to fetch related data
    const ccCourseIds = [
      ...new Set(
        agreementsForPrompt.map((a) => a.cc_course_id).filter(Boolean),
      ),
    ];
    const uniCourseIds = [
      ...new Set(
        agreementsForPrompt
          .map((a) => a.university_course_id)
          .filter(Boolean),
      ),
    ];
    const ccInstIds = [
      ...new Set(
        agreementsForPrompt.map((a) => a.cc_institution_id).filter(Boolean),
      ),
    ];
    const uniInstIds = [
      ...new Set(
        agreementsForPrompt
          .map((a) => a.university_institution_id)
          .filter(Boolean),
      ),
    ];

    // Fetch courses and institutions in parallel
    const [ccCoursesResult, uniCoursesResult, ccInstsResult, uniInstsResult] =
      await Promise.all([
        ccCourseIds.length > 0
          ? supabase
            .from("courses")
            .select("id, code, title, units")
            .in("id", ccCourseIds)
            .returns<CourseRow[]>()
          : Promise.resolve({ data: [] as CourseRow[] }),
        uniCourseIds.length > 0
          ? supabase
            .from("courses")
            .select("id, code, title, units")
            .in("id", uniCourseIds)
            .returns<CourseRow[]>()
          : Promise.resolve({ data: [] as CourseRow[] }),
        ccInstIds.length > 0
          ? supabase
            .from("institutions")
            .select("id, name, abbreviation")
            .in("id", ccInstIds)
            .returns<InstitutionRow[]>()
          : Promise.resolve({ data: [] as InstitutionRow[] }),
        uniInstIds.length > 0
          ? supabase
            .from("institutions")
            .select("id, name, abbreviation")
            .in("id", uniInstIds)
            .returns<InstitutionRow[]>()
          : Promise.resolve({ data: [] as InstitutionRow[] }),
      ]);

    // Build lookup maps
    const courseMap = new Map<string, CourseRow>();
    for (const c of [
      ...(ccCoursesResult.data || []),
      ...(uniCoursesResult.data || []),
    ]) {
      courseMap.set(c.id, c);
    }
    const instMap = new Map<string, InstitutionRow>();
    for (const i of [
      ...(ccInstsResult.data || []),
      ...(uniInstsResult.data || []),
    ]) {
      instMap.set(i.id, i);
    }

    // Format articulation data into a readable string
    const formatted = agreementsForPrompt
      .map((a) => {
        const ccCourse = courseMap.get(a.cc_course_id);
        const uniCourse = courseMap.get(a.university_course_id);
        const ccInst = instMap.get(a.cc_institution_id);
        const uniInst = instMap.get(a.university_institution_id);

        if (!ccCourse || !uniCourse || !ccInst || !uniInst) return null;

        return `- ${ccInst.abbreviation || ccInst.name}: ${ccCourse.code} (${ccCourse.title}, ${ccCourse.units} units) → ${uniInst.abbreviation || uniInst.name}: ${uniCourse.code} (${uniCourse.title}, ${uniCourse.units} units) [${a.major || "General"}]`;
      })
      .filter(Boolean)
      .join("\n");

    const contextPrefix = [
      `Exact path major matches: ${exactMatchCount}`,
      `Institution-scoped matches: ${institutionMatchCount}`,
      availableMajorsLine,
    ].join("\n");

    return {
      context: `${contextPrefix}\n\n${formatted || "No articulation agreements found for the current filters."}`,
      exactMatchCount,
      institutionMatchCount,
      availableMajors,
    };
  } catch {
    return {
      context: "Articulation data is currently unavailable.",
      exactMatchCount: 0,
      institutionMatchCount: 0,
      availableMajors: [],
    };
  }
}

/**
 * Fetches prerequisite relationships for relevant courses.
 */
export async function getPrerequisiteContext(): Promise<string> {
  try {
    const supabase = await createClient();

    const { data: prereqs, error } = await supabase
      .from("prerequisites")
      .select("course_id, prerequisite_course_id")
      .limit(100)
      .returns<PrerequisiteRow[]>();

    if (error || !prereqs) {
      console.error("Error fetching prerequisites:", error);
      return "";
    }

    const courseIds = [
      ...new Set([
        ...prereqs.map((p) => p.course_id).filter(Boolean),
        ...prereqs.map((p) => p.prerequisite_course_id).filter(Boolean),
      ]),
    ];

    const { data: courses } =
      courseIds.length > 0
        ? await supabase
          .from("courses")
          .select("id, code")
          .in("id", courseIds)
          .returns<{ id: string; code: string }[]>()
        : { data: [] };

    const courseCodeMap = new Map<string, string>();
    for (const c of courses || []) {
      courseCodeMap.set(c.id, c.code);
    }

    const formatted = prereqs
      .map((p) => {
        const course = courseCodeMap.get(p.course_id);
        const prereq = courseCodeMap.get(p.prerequisite_course_id);
        if (!course || !prereq) return null;
        return `- ${course} requires ${prereq}`;
      })
      .filter(Boolean)
      .join("\n");

    return formatted || "";
  } catch {
    return "";
  }
}
