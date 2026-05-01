export type ComparisonCourseStatus = "completed" | "in_progress" | "planned";

export interface ComparisonUserCourse {
  course_code: string;
  course_title: string;
  units: number;
  status: ComparisonCourseStatus;
  grade?: string | null;
}

export interface ComparisonTargetCourse {
  ccCourseCode: string;
  ccCourseTitle: string;
  ccUnits: number;
  universityCourseCode: string;
  universityCourseTitle: string;
  universityUnits: number;
}

export interface ComparisonTarget {
  institutionId: string;
  schoolName: string;
  schoolAbbreviation?: string | null;
  schoolType?: "cc" | "university" | "private";
  logoText?: string;
  maxCreditsPerSemester?: number;
  requiredGpa?: number | null;
  userGpa?: number | null;
  playbookCount?: number;
  requiredCourses: ComparisonTargetCourse[];
  tuition?: {
    tuitionAndFees: number;
    livingExpenses: number;
    totalCost: number;
    studentType: "international" | "resident";
    academicYear: number;
  };
}

export interface ComparisonResult {
  institutionId: string;
  schoolName: string;
  schoolAbbreviation: string | null;
  schoolType: string;
  logoText: string;
  prepProgressPercent: number;
  estimatedLostCredits: number;
  remainingSemesters: number;
  acceptanceChance: {
    label: "reach" | "target" | "safety";
    score: number;
    baselineGpa: number | null;
  };
  totalEstimatedCost: number;
  matchedCourses: ComparisonTargetCourse[];
  missingCourses: ComparisonTargetCourse[];
  recommendationScore: number;
  isBestOption: boolean;
  tuition?: {
    tuitionAndFees: number;
    livingExpenses: number;
    totalCost: number;
    studentType: "international" | "resident";
    academicYear: number;
  };
}

function normalizeCourseCode(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function deriveLogoText(name: string, abbreviation?: string | null): string {
  if (abbreviation?.trim()) {
    return abbreviation.trim().slice(0, 4).toUpperCase();
  }

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4);
}

function inferSchoolType(name: string, explicitType?: string): "cc" | "university" | "private" {
  if (explicitType === "cc" || explicitType === "university" || explicitType === "private") {
    return explicitType;
  }

  const lower = name.toLowerCase();
  if (lower.includes("private") || lower.includes("usc") || lower.includes("stanford")) {
    return "private";
  }
  if (lower.includes("college") && !lower.includes("university")) {
    return "cc";
  }
  return "university";
}

function estimateSemesterCost(
  type: "cc" | "university" | "private",
  schoolName: string,
  realTuition?: ComparisonTarget["tuition"],
): number {
  if (realTuition) {
    return Math.round(realTuition.totalCost / 2);
  }
  const lower = schoolName.toLowerCase();
  if (type === "private") return 32000;
  if (lower.includes("state") || lower.includes("csu") || lower.includes("cal poly")) return 14000;
  if (lower.startsWith("uc ") || lower.includes("university of california") || lower.includes("ucla") || lower.includes("berkeley")) {
    return 22000;
  }
  return type === "cc" ? 8000 : 18000;
}

function calculateAcceptanceChance(target: ComparisonTarget, prepProgressPercent: number): ComparisonResult["acceptanceChance"] {
  const baseline = target.requiredGpa ?? null;
  const gpa = target.userGpa ?? null;
  const playbookBoost = Math.min((target.playbookCount ?? 0) * 2, 10);

  let score = prepProgressPercent * 0.6 + playbookBoost;
  if (baseline !== null && gpa !== null) {
    const delta = gpa - baseline;
    score += Math.max(-20, Math.min(20, delta * 40));
  }

  score = Math.max(5, Math.min(95, Math.round(score)));

  if (baseline !== null && gpa !== null) {
    if (gpa >= baseline + 0.2 && prepProgressPercent >= 65) {
      return { label: "safety", score, baselineGpa: baseline };
    }
    if (gpa >= baseline - 0.15 && prepProgressPercent >= 45) {
      return { label: "target", score, baselineGpa: baseline };
    }
    return { label: "reach", score, baselineGpa: baseline };
  }

  if (prepProgressPercent >= 75) return { label: "safety", score, baselineGpa: baseline };
  if (prepProgressPercent >= 45) return { label: "target", score, baselineGpa: baseline };
  return { label: "reach", score, baselineGpa: baseline };
}

export function generateComparison(
  userCourses: ComparisonUserCourse[],
  targets: ComparisonTarget[],
): ComparisonResult[] {
  const earnedCourses = userCourses.filter((course) => course.status !== "planned");
  const earnedCourseCodes = new Set(earnedCourses.map((course) => normalizeCourseCode(course.course_code)));
  const earnedCourseUnitsByCode = new Map(
    earnedCourses.map((course) => [normalizeCourseCode(course.course_code), course.units]),
  );

  const comparison = targets.map<ComparisonResult>((target) => {
    const uniqueRequiredCourses = Array.from(
      new Map(
        target.requiredCourses.map((course) => [normalizeCourseCode(course.ccCourseCode), course]),
      ).values(),
    );

    const matchedCourses = uniqueRequiredCourses.filter((course) =>
      earnedCourseCodes.has(normalizeCourseCode(course.ccCourseCode)),
    );
    const missingCourses = uniqueRequiredCourses.filter(
      (course) => !earnedCourseCodes.has(normalizeCourseCode(course.ccCourseCode)),
    );

    const totalRequiredUnits = uniqueRequiredCourses.reduce((sum, course) => sum + course.ccUnits, 0);
    const matchedUnits = matchedCourses.reduce((sum, course) => {
      return sum + (earnedCourseUnitsByCode.get(normalizeCourseCode(course.ccCourseCode)) ?? course.ccUnits);
    }, 0);
    const prepProgressPercent = uniqueRequiredCourses.length === 0
      ? 0
      : Math.round((matchedCourses.length / uniqueRequiredCourses.length) * 100);

    const acceptedCourseCodes = new Set(uniqueRequiredCourses.map((course) => normalizeCourseCode(course.ccCourseCode)));
    const estimatedLostCredits = Math.round(
      earnedCourses.reduce((sum, course) => {
        return acceptedCourseCodes.has(normalizeCourseCode(course.course_code)) ? sum : sum + course.units;
      }, 0),
    );

    const remainingUnits = Math.max(totalRequiredUnits - matchedUnits, 0);
    const maxCreditsPerSemester = Math.max(target.maxCreditsPerSemester ?? 15, 1);
    const remainingSemesters = remainingUnits === 0 ? 0 : Math.ceil(remainingUnits / maxCreditsPerSemester);
    const acceptanceChance = calculateAcceptanceChance(target, prepProgressPercent);
    const schoolType = inferSchoolType(target.schoolName, target.schoolType);
    const totalEstimatedCost = remainingSemesters * estimateSemesterCost(schoolType, target.schoolName, target.tuition);

    const recommendationScore = Math.round(
      prepProgressPercent * 0.4 +
      acceptanceChance.score * 0.25 +
      Math.max(0, 100 - estimatedLostCredits * 4) * 0.15 +
      Math.max(0, 100 - remainingSemesters * 15) * 0.1 +
      Math.max(0, 100 - totalEstimatedCost / 1000) * 0.1,
    );

    return {
      institutionId: target.institutionId,
      schoolName: target.schoolName,
      schoolAbbreviation: target.schoolAbbreviation ?? null,
      schoolType,
      logoText: target.logoText ?? deriveLogoText(target.schoolName, target.schoolAbbreviation),
      prepProgressPercent,
      estimatedLostCredits,
      remainingSemesters,
      acceptanceChance,
      totalEstimatedCost,
      matchedCourses,
      missingCourses,
      recommendationScore,
      isBestOption: false,
      tuition: target.tuition,
    };
  });

  const sorted = comparison.sort((a, b) => b.recommendationScore - a.recommendationScore);
  return sorted.map((result, index) => ({
    ...result,
    isBestOption: index === 0,
  }));
}
