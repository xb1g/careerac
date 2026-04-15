import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  generateComparison,
  type ComparisonTarget,
  type ComparisonUserCourse,
} from "@/lib/comparison-engine";
import type { Database, Json } from "@/types/database";

type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];
type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];
type ArticulationRow = Database["public"]["Tables"]["articulation_agreements"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type UserTargetRow = Database["public"]["Tables"]["user_targets"]["Row"];
type UserCourseRow = Database["public"]["Tables"]["user_courses"]["Row"];

interface StoredComparisonTarget {
  institution_id: string;
  name?: string;
  abbreviation?: string | null;
  priority_order?: number;
}

function parseComparisonTargets(value: Json | null): StoredComparisonTarget[] {
  if (!Array.isArray(value)) return [];

  const targets: StoredComparisonTarget[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || !("institution_id" in item)) continue;
    const institutionId = typeof item.institution_id === "string" ? item.institution_id : null;
    if (!institutionId) continue;

    targets.push({
      institution_id: institutionId,
      name: typeof item.name === "string" ? item.name : undefined,
      abbreviation: typeof item.abbreviation === "string" ? item.abbreviation : null,
      priority_order: typeof item.priority_order === "number" ? item.priority_order : undefined,
    });
  }

  return targets;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isMajorMatch(agreementMajor: string | null, targetMajor: string): boolean {
  if (!agreementMajor) return false;
  const left = normalize(agreementMajor);
  const right = normalize(targetMajor);
  return left.includes(right) || right.includes(left) || left === right;
}

function gradeToPoints(grade: string | null): number | null {
  if (!grade) return null;
  const normalized = grade.trim().toUpperCase();
  const lookup: Record<string, number> = {
    A: 4,
    "A-": 3.7,
    "B+": 3.3,
    B: 3,
    "B-": 2.7,
    "C+": 2.3,
    C: 2,
    "C-": 1.7,
    "D+": 1.3,
    D: 1,
    "D-": 0.7,
    F: 0,
  };

  return normalized in lookup ? lookup[normalized] : null;
}

function calculateUserGpa(courses: UserCourseRow[]): number | null {
  let totalPoints = 0;
  let totalUnits = 0;

  for (const course of courses) {
    if (course.status === "planned") continue;
    const points = gradeToPoints(course.grade);
    if (points === null) continue;
    totalPoints += points * course.units;
    totalUnits += course.units;
  }

  if (totalUnits === 0) return null;
  return Math.round((totalPoints / totalUnits) * 100) / 100;
}

function parseCompetitiveGpas(requirements: string | null, institutions: InstitutionRow[]): Map<string, number> {
  const result = new Map<string, number>();
  if (!requirements) return result;

  const regex = /-\s+([^:]+):\s+(\d(?:\.\d+)?)(?:\s*[-–]\s*(\d(?:\.\d+)?))?/g;
  for (const match of requirements.matchAll(regex)) {
    const schoolLabel = match[1]?.trim();
    const minValue = Number(match[2]);
    const maxValue = match[3] ? Number(match[3]) : minValue;
    if (!schoolLabel || Number.isNaN(minValue)) continue;

    const baseline = Math.round((((minValue + maxValue) / 2) || minValue) * 100) / 100;
    const normalizedLabel = normalize(schoolLabel);

    for (const institution of institutions) {
      const institutionName = normalize(institution.name);
      const institutionAbbreviation = normalize(institution.abbreviation ?? "");
      if (
        institutionName.includes(normalizedLabel) ||
        normalizedLabel.includes(institutionName) ||
        (institutionAbbreviation && normalizedLabel.includes(institutionAbbreviation))
      ) {
        result.set(institution.id, baseline);
      }
    }
  }

  return result;
}

function inferDefaultGpa(institution: InstitutionRow): number {
  const name = institution.name.toLowerCase();
  if (name.includes("berkeley") || name.includes("ucla")) return 3.7;
  if (name.startsWith("uc ") || name.includes("university of california")) return 3.45;
  if (name.includes("state") || name.includes("csu") || name.includes("cal poly")) return 3.05;
  return 3.3;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const planId = typeof body.plan_id === "string" ? body.plan_id : null;
    if (!planId) {
      return NextResponse.json({ error: "plan_id is required" }, { status: 400 });
    }

    const { data: plan, error: planError } = await supabase
      .from("transfer_plans")
      .select("*")
      .eq("id", planId)
      .eq("user_id", user.id)
      .single() as { data: TransferPlanRow | null; error: { code?: string; message?: string } | null };

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const comparisonTargets = parseComparisonTargets(plan.comparison_targets);
    let targetIds = Array.from(
      new Set([
        ...(plan.target_institution_id ? [plan.target_institution_id] : []),
        ...comparisonTargets.map((target) => target.institution_id),
      ]),
    );

    if (targetIds.length === 0) {
      const { data: userTargets } = await supabase
        .from("user_targets")
        .select("*")
        .eq("user_id", user.id)
        .order("priority_order", { ascending: true }) as { data: UserTargetRow[] | null; error: unknown };

      targetIds = (userTargets ?? []).map((target) => target.institution_id);
    }

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "No schools configured for comparison" }, { status: 400 });
    }

    const { data: institutions, error: institutionsError } = await supabase
      .from("institutions")
      .select("*")
      .in("id", targetIds) as { data: InstitutionRow[] | null; error: unknown };

    if (institutionsError || !institutions || institutions.length === 0) {
      return NextResponse.json({ error: "Could not load comparison schools" }, { status: 500 });
    }

    const { data: userCourses } = await supabase
      .from("user_courses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }) as { data: UserCourseRow[] | null; error: unknown };

    const { data: articulationRows } = await supabase
      .from("articulation_agreements")
      .select("id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes")
      .in("university_institution_id", targetIds)
      .limit(2000) as { data: ArticulationRow[] | null; error: unknown };

    const scopedArticulation = (articulationRows ?? []).filter((row) => {
      const matchesCc = plan.cc_institution_id ? row.cc_institution_id === plan.cc_institution_id : true;
      return matchesCc && isMajorMatch(row.major, plan.target_major);
    });

    const courseIds = Array.from(new Set(scopedArticulation.flatMap((row) => [row.cc_course_id, row.university_course_id])));
    const { data: courses } = courseIds.length === 0
      ? { data: [] as CourseRow[] }
      : await supabase
          .from("courses")
          .select("*")
          .in("id", courseIds) as { data: CourseRow[] | null; error: unknown };

    const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));

    const { data: majors } = await supabase
      .from("majors")
      .select("id, name")
      .ilike("name", plan.target_major)
      .limit(1) as { data: Array<{ id: string; name: string }> | null; error: unknown };

    const majorId = majors?.[0]?.id ?? null;
    const pathwayResult = plan.cc_institution_id && majorId
      ? await supabase
          .from("transfer_pathways")
          .select("requirements")
          .eq("institution_id", plan.cc_institution_id)
          .eq("major_id", majorId)
          .limit(1)
          .maybeSingle() as { data: { requirements: string | null } | null; error: unknown }
      : { data: null as { requirements: string | null } | null };

    const requiredGpas = parseCompetitiveGpas(pathwayResult.data?.requirements ?? null, institutions);

    const { data: playbookRows } = await supabase
      .from("playbooks")
      .select("target_institution_id")
      .in("target_institution_id", targetIds)
      .eq("verification_status", "verified")
      .eq("outcome", "transferred")
      .eq("target_major", plan.target_major) as { data: Array<{ target_institution_id: string }> | null; error: unknown };

    const playbookCounts = new Map<string, number>();
    for (const row of playbookRows ?? []) {
      playbookCounts.set(row.target_institution_id, (playbookCounts.get(row.target_institution_id) ?? 0) + 1);
    }

    const comparisonInputs: ComparisonTarget[] = institutions.map((institution) => {
      const schoolAgreements = scopedArticulation.filter((row) => row.university_institution_id === institution.id);

      return {
        institutionId: institution.id,
        schoolName: institution.name,
        schoolAbbreviation: institution.abbreviation,
        schoolType: institution.type,
        maxCreditsPerSemester: plan.max_credits_per_semester ?? 15,
        requiredGpa: requiredGpas.get(institution.id) ?? inferDefaultGpa(institution),
        userGpa: calculateUserGpa(userCourses ?? []),
        playbookCount: playbookCounts.get(institution.id) ?? 0,
        requiredCourses: schoolAgreements
          .map((agreement) => {
            const ccCourse = courseMap.get(agreement.cc_course_id);
            const universityCourse = courseMap.get(agreement.university_course_id);
            if (!ccCourse || !universityCourse) return null;

            return {
              ccCourseCode: ccCourse.code,
              ccCourseTitle: ccCourse.title,
              ccUnits: Number(ccCourse.units),
              universityCourseCode: universityCourse.code,
              universityCourseTitle: universityCourse.title,
              universityUnits: Number(universityCourse.units),
            };
          })
          .filter((course): course is NonNullable<typeof course> => course !== null),
      };
    });

    return NextResponse.json({
      comparison: generateComparison((userCourses ?? []) as ComparisonUserCourse[], comparisonInputs),
    });
  } catch (error) {
    console.error("Comparison API error:", error);
    return NextResponse.json({ error: "Failed to generate comparison" }, { status: 500 });
  }
}
