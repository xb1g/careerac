import type { ParsedPlan, TransferPlan, NoDataResponse, PlanCourse, PlanSemester, CoveredSchool } from "@/types/plan";
import { advanceTerm } from "@/utils/term";

/**
 * Removes fenced JSON code blocks from a chat response so students only see
 * the human-readable prose. Handles partial/streaming text where the closing
 * ``` hasn't arrived yet by hiding everything from the opening fence onward.
 */
export function stripPlanJsonFromText(text: string): string {
  if (!text) return text;

  let stripped = text.replace(/```(?:json)?\s*\n?[\s\S]*?\n?\s*```/g, "");

  // Strip native MiniMax tool-call blocks if the model leaks them into text.
  stripped = stripped.replace(/\[TOOL_CALL\][\s\S]*?\[\/TOOL_CALL\]/g, "");
  stripped = stripped.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, "");
  stripped = stripped.replace(/<function_call>[\s\S]*?<\/function_call>/g, "");

  // Hide in-progress fenced/tool blocks during streaming.
  const openFence = stripped.indexOf("```");
  if (openFence !== -1) {
    stripped = stripped.slice(0, openFence);
  }
  const openToolCall = stripped.indexOf("[TOOL_CALL]");
  if (openToolCall !== -1) {
    stripped = stripped.slice(0, openToolCall);
  }

  return stripped.replace(/\n{3,}/g, "\n\n").trim();
}

export function parsePlanFromAIResponse(
  text: string,
  startTerm?: string,
  expectedMajor?: string,
): ParsedPlan | null {
  // Try to find JSON block in the response
  const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  console.log("[Parser] JSON match found:", !!jsonMatch, jsonMatch ? "length: " + jsonMatch[1].length : "");

  if (!jsonMatch) {
    // Check if the response indicates no data
    if (hasNoDataIndicators(text)) {
      console.log("[Parser] No JSON match, has no-data indicators");
      return extractNoDataMessage(text);
    }
    console.log("[Parser] No JSON match and no no-data indicators, returning null");
    return null;
  }

  try {
    console.log("[Parser] Attempting to parse JSON...");
    const parsed = JSON.parse(jsonMatch[1].trim());
    console.log("[Parser] JSON parsed successfully");

    // Legacy guard: old plans used `isMultiUniversity: true` with a
    // `universities[]` wrapper. The unified schema replaces that with
    // `coveredSchools[]` + `requiredBy[]`; surface a friendly NoData
    // response rather than crashing downstream consumers.
    if (parsed && typeof parsed === "object" && (parsed as Record<string, unknown>).isMultiUniversity === true) {
      return {
        isNoData: true,
        message: "This plan was generated with an older format. Please regenerate it to see the unified multi-school view.",
      };
    }

    return validateAndNormalizePlan(parsed, startTerm, expectedMajor);
  } catch {
    // If JSON parsing fails, check for no-data indicators in the text
    if (hasNoDataIndicators(text)) {
      return extractNoDataMessage(text);
    }
    return null;
  }
}

/** Rewrites semester labels starting from startTerm, advancing Spring/Fall in order. */
function rewriteSemesterLabels(semesters: PlanSemester[], startTerm: string): PlanSemester[] {
  let current = startTerm;
  return semesters.map((sem) => {
    const label = current;
    current = advanceTerm(current);
    return { ...sem, label };
  });
}

function hasNoDataIndicators(text: string): boolean {
  const lower = text.toLowerCase();
  const indicators = [
    "no data found",
    "no articulation data",
    "don't have data",
    "don't have articulation",
    "no matching data",
    "no data available",
    "i don't have information",
    "i don't have specific",
    "unfortunately, i don't",
    "sorry, i don't",
  ];
  return indicators.some((indicator) => lower.includes(indicator));
}

function extractNoDataMessage(text: string): NoDataResponse {
  // Extract a helpful message from the text
  const lines = text.split("\n").filter((line) => line.trim());
  const message = lines.slice(0, 3).join(" ").trim();

  return {
    isNoData: true,
    message: message || "No articulation data found for this path. Please verify with your counselor or try a different combination.",
  };
}

function validateAndNormalizePlan(raw: unknown, startTerm?: string, expectedMajor?: string): ParsedPlan | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;
  const normalizedExpectedMajor = expectedMajor?.trim() || "";

  // Check if this is a no-data response
  if (obj.isNoData === true && typeof obj.noDataMessage === "string") {
    return {
      isNoData: true,
      message: obj.noDataMessage,
    };
  }

  // Validate required fields
  if (!obj.semesters || !Array.isArray(obj.semesters) || obj.semesters.length === 0) {
    return null;
  }

  const coveredSchools = normalizeCoveredSchools(obj.coveredSchools);
  const coveredSchoolNames = new Set(coveredSchools.map((s) => s.name));

  const semesters: PlanSemester[] = [];
  let totalUnits = 0;

  for (const sem of obj.semesters) {
    if (!sem || typeof sem !== "object") continue;
    const s = sem as Record<string, unknown>;

    if (!s.courses || !Array.isArray(s.courses)) continue;

    const courses: PlanCourse[] = [];
    let semesterUnits = 0;

    for (const course of s.courses) {
      if (!course || typeof course !== "object") continue;
      const c = course as Record<string, unknown>;

      if (typeof c.code !== "string" || typeof c.title !== "string" || typeof c.units !== "number") {
        continue;
      }

      const planCourse: PlanCourse = {
        code: c.code,
        title: c.title,
        units: c.units,
      };

      if (typeof c.transferEquivalency === "string") {
        planCourse.transferEquivalency = c.transferEquivalency;
      }
      if (Array.isArray(c.prerequisites)) {
        planCourse.prerequisites = c.prerequisites.filter((p) => typeof p === "string") as string[];
      }
      if (typeof c.notes === "string") {
        planCourse.notes = c.notes;
      }

      const requiredBy = normalizeRequiredBy(c.requiredBy, coveredSchoolNames);
      if (requiredBy) {
        planCourse.requiredBy = requiredBy;
      }

      courses.push(planCourse);
      semesterUnits += c.units as number;
    }

    if (courses.length === 0) continue;

    const semester: PlanSemester = {
      number: typeof s.number === "number" ? s.number : semesters.length + 1,
      label: typeof s.label === "string" ? s.label : `Semester ${semesters.length + 1}`,
      courses,
      totalUnits: semesterUnits,
    };

    semesters.push(semester);
    totalUnits += semesterUnits;
  }

  if (semesters.length === 0) return null;

  // When multi-school, mirror the top-fit school into `targetUniversity` so
  // legacy consumers (plan titles, breadcrumbs) continue to read something
  // sensible without knowing about coveredSchools.
  const rawTargetUniversity = typeof obj.targetUniversity === "string" ? obj.targetUniversity : "";
  const targetUniversity = coveredSchools.length > 0
    ? coveredSchools[0].name
    : rawTargetUniversity;

  // Verify prerequisite ordering
  if (!verifyPrerequisiteOrdering(semesters)) {
    // If ordering is wrong, try to fix it
    const fixed = reorderSemestersForPrerequisites(semesters);
    if (fixed) {
      const labeled = startTerm ? rewriteSemesterLabels(fixed, startTerm) : fixed;
      const fixedTotalUnits = labeled.reduce((sum: number, s: PlanSemester) => sum + s.totalUnits, 0);
      return {
        ccName: typeof obj.ccName === "string" ? obj.ccName : "",
        targetUniversity,
        targetMajor: normalizedExpectedMajor || (typeof obj.targetMajor === "string" ? obj.targetMajor : ""),
        ...(coveredSchools.length > 0 ? { coveredSchools } : {}),
        semesters: labeled,
        totalUnits: fixedTotalUnits,
      };
    }
    // If can't fix, still return but note the issue
  }

  const finalSemesters = startTerm ? rewriteSemesterLabels(semesters, startTerm) : semesters;

  const plan: TransferPlan = {
    ccName: typeof obj.ccName === "string" ? obj.ccName : "",
    targetUniversity,
    targetMajor: normalizedExpectedMajor || (typeof obj.targetMajor === "string" ? obj.targetMajor : ""),
    ...(coveredSchools.length > 0 ? { coveredSchools } : {}),
    semesters: finalSemesters,
    totalUnits: typeof obj.totalUnits === "number" ? obj.totalUnits : totalUnits,
  };

  return plan;
}

function normalizeCoveredSchools(raw: unknown): CoveredSchool[] {
  if (!Array.isArray(raw)) return [];

  const schools: CoveredSchool[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const s = entry as Record<string, unknown>;
    if (typeof s.name !== "string" || !s.name.trim()) continue;

    schools.push({
      name: s.name.trim(),
      institutionId: typeof s.institutionId === "string" ? s.institutionId : null,
      fitScore: clampScore(s.fitScore),
      articulatedUnits: typeof s.articulatedUnits === "number" ? s.articulatedUnits : 0,
      totalRequiredUnits: typeof s.totalRequiredUnits === "number" ? s.totalRequiredUnits : 0,
      highlights: Array.isArray(s.highlights)
        ? s.highlights.filter((h): h is string => typeof h === "string")
        : undefined,
    });
  }

  schools.sort((a, b) => b.fitScore - a.fitScore);
  return schools;
}

function clampScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function normalizeRequiredBy(raw: unknown, coveredNames: Set<string>): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  if (coveredNames.size === 0) return undefined;

  const filtered = raw
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => coveredNames.has(entry));

  // Omitted / all-schools / empty after filtering -> treat as universal.
  if (filtered.length === 0 || filtered.length === coveredNames.size) {
    return undefined;
  }

  return [...new Set(filtered)];
}

function verifyPrerequisiteOrdering(semesters: PlanSemester[]): boolean {
  const courseSemesterMap = new Map<string, number>();

  for (const sem of semesters) {
    for (const course of sem.courses) {
      courseSemesterMap.set(course.code.toLowerCase(), sem.number);
    }
  }

  for (const sem of semesters) {
    for (const course of sem.courses) {
      if (course.prerequisites) {
        for (const prereq of course.prerequisites) {
          const prereqSemester = courseSemesterMap.get(prereq.toLowerCase());
          if (prereqSemester !== undefined && prereqSemester >= sem.number) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

/**
 * Attempts to reorder courses across semesters to satisfy prerequisite constraints.
 * Returns reordered semesters or null if impossible.
 */
function reorderSemestersForPrerequisites(semesters: PlanSemester[]): PlanSemester[] | null {
  // Build a flat list of all courses with their semester assignments
  const allCourses: { course: PlanCourse; originalSemester: number }[] = [];
  for (const sem of semesters) {
    for (const course of sem.courses) {
      allCourses.push({ course, originalSemester: sem.number });
    }
  }

  // Build adjacency list for topological sort
  const courseMap = new Map<string, PlanCourse>();
  const prerequisites = new Map<string, string[]>();

  for (const { course } of allCourses) {
    courseMap.set(course.code.toLowerCase(), course);
    prerequisites.set(course.code.toLowerCase(), course.prerequisites?.map((p) => p.toLowerCase()) || []);
  }

  // Topological sort with Kahn's algorithm
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const code of courseMap.keys()) {
    inDegree.set(code, 0);
    dependents.set(code, []);
  }

  for (const [code, prereqs] of prerequisites) {
    inDegree.set(code, prereqs.length);
    for (const prereq of prereqs) {
      if (dependents.has(prereq)) {
        dependents.get(prereq)!.push(code);
      }
    }
  }

  const queue: string[] = [];
  for (const [code, degree] of inDegree) {
    if (degree === 0) {
      queue.push(code);
    }
  }

  const ordered: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    ordered.push(current);
    for (const dep of dependents.get(current) || []) {
      inDegree.set(dep, inDegree.get(dep)! - 1);
      if (inDegree.get(dep) === 0) {
        queue.push(dep);
      }
    }
  }

  // If we couldn't order all courses, there's a cycle
  if (ordered.length !== courseMap.size) {
    return null;
  }

  // Assign courses to semester levels based on longest prerequisite chain
  // This ensures courses with prerequisites go in later semesters
  const semesterLevel = new Map<string, number>();

  for (const code of ordered) {
    const prereqs = prerequisites.get(code) || [];
    if (prereqs.length === 0) {
      semesterLevel.set(code, 0);
    } else {
      const maxPrereqLevel = Math.max(
        ...prereqs
          .filter((p) => semesterLevel.has(p))
          .map((p) => semesterLevel.get(p)!)
      );
      semesterLevel.set(code, maxPrereqLevel + 1);
    }
  }

  // Group courses by their assigned semester level
  const levelCourses = new Map<number, PlanCourse[]>();
  for (const [code, level] of semesterLevel) {
    if (!levelCourses.has(level)) {
      levelCourses.set(level, []);
    }
    levelCourses.get(level)!.push(courseMap.get(code)!);
  }

  // Create semesters from the levels
  const newSemesters: PlanSemester[] = [];
  const levels = [...levelCourses.keys()].sort((a, b) => a - b);

  for (const level of levels) {
    const courses = levelCourses.get(level)!;
    const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);
    newSemesters.push({
      number: newSemesters.length + 1,
      label: `Semester ${newSemesters.length + 1}`,
      courses,
      totalUnits,
    });
  }

  return newSemesters;
}

/**
 * Enforces a max credit limit on every semester of a plan.
 * If any semester exceeds the limit, courses are redistributed into new semesters
 * while respecting prerequisite ordering.
 */
export function enforceMaxCredits(plan: TransferPlan, maxCredits: number): TransferPlan {
  const needsFix = plan.semesters.some((s) => s.totalUnits > maxCredits);
  if (!needsFix) return plan;

  // Flatten all courses with their prerequisite info
  const allCourses: PlanCourse[] = [];
  for (const sem of plan.semesters) {
    for (const course of sem.courses) {
      allCourses.push(course);
    }
  }

  // Build prerequisite map
  const prereqMap = new Map<string, string[]>();
  for (const course of allCourses) {
    prereqMap.set(course.code.toLowerCase(), course.prerequisites?.map((p) => p.toLowerCase()) || []);
  }

  // Topological sort
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const course of allCourses) {
    const code = course.code.toLowerCase();
    inDegree.set(code, 0);
    dependents.set(code, []);
  }

  for (const [code, prereqs] of prereqMap) {
    let degree = 0;
    for (const prereq of prereqs) {
      if (dependents.has(prereq)) {
        dependents.get(prereq)!.push(code);
        degree++;
      }
    }
    inDegree.set(code, degree);
  }

  const queue: string[] = [];
  for (const [code, degree] of inDegree) {
    if (degree === 0) queue.push(code);
  }

  const ordered: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    ordered.push(current);
    for (const dep of dependents.get(current) || []) {
      inDegree.set(dep, inDegree.get(dep)! - 1);
      if (inDegree.get(dep) === 0) queue.push(dep);
    }
  }

  // Assign semester levels based on prerequisite chains
  const semesterLevel = new Map<string, number>();
  for (const code of ordered) {
    const prereqs = prereqMap.get(code) || [];
    if (prereqs.length === 0) {
      semesterLevel.set(code, 0);
    } else {
      const maxLevel = Math.max(
        ...prereqs.filter((p) => semesterLevel.has(p)).map((p) => semesterLevel.get(p)!)
      );
      semesterLevel.set(code, maxLevel + 1);
    }
  }

  // Group by level, then split groups that exceed max credits
  const courseByCode = new Map<string, PlanCourse>();
  for (const c of allCourses) courseByCode.set(c.code.toLowerCase(), c);

  const levelGroups = new Map<number, PlanCourse[]>();
  for (const [code, level] of semesterLevel) {
    if (!levelGroups.has(level)) levelGroups.set(level, []);
    const course = courseByCode.get(code);
    if (course) levelGroups.get(level)!.push(course);
  }

  const newSemesters: PlanSemester[] = [];
  const levels = [...levelGroups.keys()].sort((a, b) => a - b);

  for (const level of levels) {
    const courses = levelGroups.get(level)!;
    let currentBatch: PlanCourse[] = [];
    let currentUnits = 0;

    for (const course of courses) {
      if (currentUnits + course.units > maxCredits && currentBatch.length > 0) {
        const semUnits = currentBatch.reduce((s, c) => s + c.units, 0);
        newSemesters.push({
          number: newSemesters.length + 1,
          label: `Semester ${newSemesters.length + 1}`,
          courses: currentBatch,
          totalUnits: semUnits,
        });
        currentBatch = [];
        currentUnits = 0;
      }
      currentBatch.push(course);
      currentUnits += course.units;
    }

    if (currentBatch.length > 0) {
      const semUnits = currentBatch.reduce((s, c) => s + c.units, 0);
      newSemesters.push({
        number: newSemesters.length + 1,
        label: `Semester ${newSemesters.length + 1}`,
        courses: currentBatch,
        totalUnits: semUnits,
      });
    }
  }

  return {
    ...plan,
    semesters: newSemesters,
    totalUnits: newSemesters.reduce((s, sem) => s + sem.totalUnits, 0),
  };
}
