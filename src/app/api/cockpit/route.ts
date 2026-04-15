import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";
import type {
  CockpitAction,
  CockpitData,
  CockpitDeadline,
  CockpitGpaMetric,
  CockpitRiskAlert,
  CockpitTargetSchool,
} from "@/types/cockpit";
import type { PlanSemester } from "@/types/plan";

type UserCourseRow = Database["public"]["Tables"]["user_courses"]["Row"];
type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];
type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];
type MajorRow = {
  id: string;
  name: string;
  total_units_required: number | null;
};
type TransferPathwayRow = {
  id: string;
  major_id: string;
  institution_id: string;
  requirements: string | null;
};

const DEFAULT_GE_UNITS_REQUIRED = 39;
const TRANSFER_UNITS_TARGET = 60;
const DEFAULT_COMPETITIVE_RANGE = { low: 3.2, high: 3.6 };

const GRADE_POINTS: Record<string, number> = {
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

interface PlanShape {
  targetUniversity?: string;
  targetMajor?: string;
  semesters?: PlanSemester[];
}

interface DeadlineTemplate {
  month: number;
  day: number;
  kind: CockpitDeadline["kind"];
  title: string;
}

function normalizeCourseCode(value: string): string {
  return value.replace(/\s+/g, " ").trim().toUpperCase();
}

function parseCourseCodesFromText(value: string | null | undefined): string[] {
  if (!value) return [];

  const matches = value.match(/\b[A-Z]{2,6}\s*\d{1,3}[A-Z]{0,2}\b/gi) ?? [];
  return [...new Set(matches.map(normalizeCourseCode))];
}

function isPlanShape(value: unknown): value is PlanShape {
  return !!value && typeof value === "object";
}

function getPlanSemesters(plan: TransferPlanRow): PlanSemester[] {
  if (!isPlanShape(plan.plan_data) || !Array.isArray(plan.plan_data.semesters)) {
    return [];
  }

  return plan.plan_data.semesters as PlanSemester[];
}

function getPlannedCourseCodes(plan: TransferPlanRow): string[] {
  return getPlanSemesters(plan)
    .flatMap((semester) => semester.courses)
    .map((course) => normalizeCourseCode(course.code));
}

function getCourseSequenceIssues(plan: TransferPlanRow): string[] {
  const semesters = getPlanSemesters(plan);
  const courseSemester = new Map<string, number>();

  for (const semester of semesters) {
    for (const course of semester.courses) {
      courseSemester.set(normalizeCourseCode(course.code), semester.number);
    }
  }

  const issues: string[] = [];

  for (const semester of semesters) {
    for (const course of semester.courses) {
      const prereqs = course.prerequisites ?? [];
      for (const prereq of prereqs) {
        const prereqSemester = courseSemester.get(normalizeCourseCode(prereq));
        if (prereqSemester !== undefined && prereqSemester >= semester.number) {
          issues.push(`${course.code} depends on ${normalizeCourseCode(prereq)} earlier in the sequence.`);
        }
      }
    }
  }

  return [...new Set(issues)];
}

function calculateGpa(courses: UserCourseRow[]): number | null {
  let totalPoints = 0;
  let totalUnits = 0;

  for (const course of courses) {
    const grade = course.grade?.trim().toUpperCase();
    if (!grade || !(grade in GRADE_POINTS)) continue;

    const units = Number(course.units ?? 0);
    totalPoints += GRADE_POINTS[grade] * units;
    totalUnits += units;
  }

  if (totalUnits === 0) return null;
  return Number((totalPoints / totalUnits).toFixed(2));
}

function getCompetitiveRange(schoolName: string): { low: number; high: number } {
  const normalized = schoolName.toLowerCase();

  if (normalized.includes("berkeley") || normalized.includes("ucla")) {
    return { low: 3.7, high: 4 };
  }

  if (normalized.includes("san diego") || normalized.includes("irvine")) {
    return { low: 3.5, high: 3.9 };
  }

  if (normalized.includes("davis") || normalized.includes("santa barbara")) {
    return { low: 3.4, high: 3.8 };
  }

  return DEFAULT_COMPETITIVE_RANGE;
}

function getGpaMetric(currentGpa: number | null, schools: string[]): CockpitGpaMetric {
  const ranges = schools.length > 0 ? schools.map(getCompetitiveRange) : [DEFAULT_COMPETITIVE_RANGE];
  const low = Math.max(...ranges.map((range) => range.low));
  const high = Math.max(...ranges.map((range) => range.high));

  if (currentGpa === null) {
    return { current: null, low, high, status: "unknown" };
  }

  if (currentGpa < low) {
    return { current: currentGpa, low, high, status: "below" };
  }

  if (currentGpa > high) {
    return { current: currentGpa, low, high, status: "above" };
  }

  return { current: currentGpa, low, high, status: "within" };
}

function getDeadlineTemplates(schoolName: string): DeadlineTemplate[] {
  const normalized = schoolName.toLowerCase();
  const isUc = normalized.includes("university of california") || normalized.startsWith("uc ");

  if (isUc) {
    return [
      { title: "TAG deadline", month: 9, day: 30, kind: "tag" },
      { title: "UC application deadline", month: 11, day: 30, kind: "application" },
      { title: "Document submission checkpoint", month: 1, day: 31, kind: "documents" },
    ];
  }

  return [
    { title: "Transfer application deadline", month: 11, day: 30, kind: "application" },
    { title: "Transcript/document deadline", month: 1, day: 15, kind: "documents" },
  ];
}

function buildDeadlineDate(template: DeadlineTemplate): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  let year = currentYear;

  if (template.month < now.getMonth() + 1 || (template.month === now.getMonth() + 1 && template.day < now.getDate())) {
    year += 1;
  }

  return new Date(Date.UTC(year, template.month - 1, template.day));
}

function getDaysRemaining(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatEstimatedGraduation(unitsRemaining: number): string {
  if (unitsRemaining <= 0) return "Ready to transfer";

  const semestersNeeded = Math.max(1, Math.ceil(unitsRemaining / 15));
  const now = new Date();
  let year = now.getFullYear();
  let termIndex = now.getMonth() < 6 ? 0 : 1; // 0 spring, 1 fall

  for (let i = 0; i < semestersNeeded; i += 1) {
    if (termIndex === 1) {
      year += 1;
      termIndex = 0;
    } else {
      termIndex = 1;
    }
  }

  return `${termIndex === 0 ? "Spring" : "Fall"} ${year}`;
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [{ data: userCourses, error: userCoursesError }, { data: plans, error: plansError }] = await Promise.all([
      supabase
        .from("user_courses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("transfer_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (userCoursesError || plansError) {
      console.error("Error fetching cockpit data:", userCoursesError ?? plansError);
      return NextResponse.json({ error: "Failed to fetch cockpit data" }, { status: 500 });
    }

    const planRows = (plans ?? []) as TransferPlanRow[];
    const userCourseRows = (userCourses ?? []) as UserCourseRow[];

    const institutionIds = [...new Set(planRows.map((plan) => plan.target_institution_id).filter(Boolean))] as string[];
    const majorNames = [...new Set(planRows.map((plan) => plan.target_major).filter(Boolean))];

    const [{ data: institutions }, { data: majors }] = await Promise.all([
      institutionIds.length > 0
        ? supabase.from("institutions").select("*").in("id", institutionIds)
        : Promise.resolve({ data: [] as InstitutionRow[] }),
      majorNames.length > 0
        ? supabase.from("majors").select("*").in("name", majorNames)
        : Promise.resolve({ data: [] as MajorRow[] }),
    ]);

    const majorIdByName = new Map((majors ?? []).map((major) => [major.name, major.id]));
    const majorIds = [...new Set((majors ?? []).map((major) => major.id))];

    const { data: pathways } = majorIds.length > 0 && institutionIds.length > 0
      ? await supabase
          .from("transfer_pathways")
          .select("*")
          .in("major_id", majorIds)
          .in("institution_id", institutionIds)
      : { data: [] as TransferPathwayRow[] };

    const institutionById = new Map((institutions ?? []).map((institution) => [institution.id, institution]));
    const pathwayByKey = new Map(
      (pathways ?? []).map((pathway) => [`${pathway.major_id}:${pathway.institution_id}`, pathway])
    );

    const completedCourses = userCourseRows.filter((course) => course.status === "completed");
    const inProgressCourses = userCourseRows.filter((course) => course.status === "in_progress");
    const completedCourseCodes = new Set(completedCourses.map((course) => normalizeCourseCode(course.course_code)));
    const inProgressCourseCodes = new Set(inProgressCourses.map((course) => normalizeCourseCode(course.course_code)));
    const currentGpa = calculateGpa(completedCourses);
    const unitsCompleted = completedCourses.reduce((sum, course) => sum + Number(course.units ?? 0), 0);

    const targetSchools: CockpitTargetSchool[] = [];
    const upcomingDeadlines: CockpitDeadline[] = [];
    const riskAlerts: CockpitRiskAlert[] = [];
    const allRequiredCodes = new Set<string>();

    for (const plan of planRows) {
      const institution = plan.target_institution_id ? institutionById.get(plan.target_institution_id) : null;
      const schoolName = institution?.name ?? (isPlanShape(plan.plan_data) ? plan.plan_data.targetUniversity : null) ?? plan.title;
      const majorId = majorIdByName.get(plan.target_major);
      const pathway = majorId && plan.target_institution_id
        ? pathwayByKey.get(`${majorId}:${plan.target_institution_id}`)
        : undefined;

      const requiredCodes = new Set<string>([
        ...parseCourseCodesFromText(pathway?.requirements),
        ...getPlannedCourseCodes(plan),
      ]);

      requiredCodes.forEach((code) => allRequiredCodes.add(code));

      const majorPrepCompleted = [...requiredCodes].filter((code) => completedCourseCodes.has(code)).length;
      const majorPrepRequired = requiredCodes.size;
      const majorPrepCompletionPercent = majorPrepRequired === 0 ? 0 : Math.round((majorPrepCompleted / majorPrepRequired) * 100);

      const deadlines = getDeadlineTemplates(schoolName)
        .map((template) => {
          const date = buildDeadlineDate(template);
          return {
            id: `${plan.id}-${template.kind}-${date.toISOString()}`,
            planId: plan.id,
            title: template.title,
            schoolName,
            date: date.toISOString(),
            daysRemaining: getDaysRemaining(date),
            kind: template.kind,
          } satisfies CockpitDeadline;
        })
        .sort((a, b) => a.daysRemaining - b.daysRemaining);

      upcomingDeadlines.push(...deadlines);

      const nextDeadline = deadlines[0] ?? null;

      targetSchools.push({
        planId: plan.id,
        title: plan.title,
        schoolName,
        targetMajor: plan.target_major,
        status: plan.status,
        majorPrepCompleted,
        majorPrepRequired,
        majorPrepCompletionPercent,
        daysUntilDeadline: nextDeadline?.daysRemaining ?? null,
        nextDeadlineLabel: nextDeadline?.title ?? "No deadlines yet",
        nextDeadlineDate: nextDeadline?.date ?? null,
      });

      const missingRequirements = [...requiredCodes].filter(
        (code) => !completedCourseCodes.has(code) && !inProgressCourseCodes.has(code)
      );

      if (missingRequirements.length > 0) {
        riskAlerts.push({
          id: `${plan.id}-missing-prereqs`,
          severity: missingRequirements.length > 2 ? "high" : "medium",
          title: `Missing major prep for ${schoolName}`,
          description: `${missingRequirements.slice(0, 3).join(", ")} still need to be completed or scheduled.`,
          planId: plan.id,
        });
      }

      if (nextDeadline && nextDeadline.daysRemaining <= 45) {
        riskAlerts.push({
          id: `${plan.id}-deadline-risk`,
          severity: nextDeadline.daysRemaining <= 21 ? "high" : "medium",
          title: `${schoolName} deadline is approaching`,
          description: `${nextDeadline.title} is due in ${Math.max(nextDeadline.daysRemaining, 0)} days.`,
          planId: plan.id,
        });
      }

      const sequenceIssues = getCourseSequenceIssues(plan);
      if (sequenceIssues.length > 0) {
        riskAlerts.push({
          id: `${plan.id}-sequence-issues`,
          severity: "medium",
          title: `Course sequence issue for ${schoolName}`,
          description: sequenceIssues[0],
          planId: plan.id,
        });
      }

      if (missingRequirements.length >= 4 && nextDeadline && nextDeadline.daysRemaining <= 180) {
        riskAlerts.push({
          id: `${plan.id}-availability-warning`,
          severity: "medium",
          title: `Next semester availability looks tight for ${schoolName}`,
          description: `You still have ${missingRequirements.length} unscheduled prep courses before the next major deadline.`,
          planId: plan.id,
        });
      }
    }

    const gpaMetric = getGpaMetric(
      currentGpa,
      targetSchools.map((school) => school.schoolName)
    );

    if (gpaMetric.current !== null && gpaMetric.status === "below") {
      riskAlerts.push({
        id: "global-gpa-risk",
        severity: "high",
        title: "GPA is below the current competitive range",
        description: `Current GPA ${gpaMetric.current.toFixed(2)} is below the target range of ${gpaMetric.low.toFixed(1)}-${gpaMetric.high.toFixed(1)}.`,
      });
    }

    const requiredCodesList = [...allRequiredCodes];
    const totalRequiredCourses = requiredCodesList.length;
    const completedRequiredCourses = requiredCodesList.filter((code) => completedCourseCodes.has(code)).length;
    const completedRequiredUnits = requiredCodesList
      .filter((code) => completedCourseCodes.has(code))
      .reduce((sum, code) => {
        const matchedCourse = completedCourses.find((course) => normalizeCourseCode(course.course_code) === code);
        return sum + Number(matchedCourse?.units ?? 0);
      }, 0);

    const geCompletedUnits = Math.max(unitsCompleted - completedRequiredUnits, 0);
    const unitsRemaining = Math.max(TRANSFER_UNITS_TARGET - unitsCompleted, 0);

    const nextBestAction: CockpitAction | null = (() => {
      const severeRisk = riskAlerts.find((alert) => alert.severity === "high");
      if (severeRisk) {
        return {
          title: severeRisk.title,
          description: severeRisk.description,
          href: severeRisk.planId ? `/plan/${severeRisk.planId}` : "/settings",
          cta: severeRisk.planId ? "Open plan" : "Review courses",
        };
      }

      const nextDeadline = [...upcomingDeadlines].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
      if (nextDeadline) {
        return {
          title: `Prepare ${nextDeadline.title.toLowerCase()}`,
          description: `${nextDeadline.schoolName} is due in ${Math.max(nextDeadline.daysRemaining, 0)} days. Add it to your calendar and gather materials now.`,
          href: nextDeadline.planId ? `/plan/${nextDeadline.planId}` : "/dashboard",
          cta: "Review deadline",
        };
      }

      const firstTarget = targetSchools[0];
      if (firstTarget) {
        return {
          title: `Meet with a counselor about ${firstTarget.schoolName}`,
          description: `Validate your remaining prep for ${firstTarget.targetMajor} and confirm your transfer timeline.`,
          href: `/plan/${firstTarget.planId}`,
          cta: "Open plan",
        };
      }

      return null;
    })();

    const cockpit: CockpitData = {
      targetSchools,
      requirementsProgress: {
        courses: {
          completed: completedRequiredCourses,
          required: totalRequiredCourses,
          completionPercent: totalRequiredCourses === 0 ? 0 : Math.round((completedRequiredCourses / totalRequiredCourses) * 100),
        },
        ge: {
          completed: Math.round(geCompletedUnits),
          required: DEFAULT_GE_UNITS_REQUIRED,
          completionPercent: Math.min(100, Math.round((geCompletedUnits / DEFAULT_GE_UNITS_REQUIRED) * 100)),
        },
        majorPrep: {
          completed: completedRequiredCourses,
          required: totalRequiredCourses,
          completionPercent: totalRequiredCourses === 0 ? 0 : Math.round((completedRequiredCourses / totalRequiredCourses) * 100),
        },
        gpa: gpaMetric,
      },
      upcomingDeadlines: dedupeById(upcomingDeadlines)
        .filter((deadline) => deadline.daysRemaining >= -7)
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
        .slice(0, 6),
      riskAlerts: dedupeById(riskAlerts).slice(0, 6),
      nextBestAction,
      quickStats: {
        currentGpa,
        unitsCompleted: Math.round(unitsCompleted * 10) / 10,
        unitsRemaining: Math.round(unitsRemaining * 10) / 10,
        estimatedGraduation: formatEstimatedGraduation(unitsRemaining),
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        planCount: targetSchools.length,
        alertCount: dedupeById(riskAlerts).length,
      },
    };

    return NextResponse.json(cockpit);
  } catch (error) {
    console.error("Cockpit route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
