import type { ParsedPlan, TransferPlan, NoDataResponse, PlanCourse, PlanSemester, MultiUniversityPlan, UniversityFit } from "@/types/plan";
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

/**
 * Extracts and parses a structured transfer plan from AI response text.
 * The AI is expected to output a JSON block with the plan data.
 */
export function parsePlanFromAIResponse(text: string, startTerm?: string): ParsedPlan | null {
  // Try to find JSON block in the response
  const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (!jsonMatch) {
    // Check if the response indicates no data
    if (hasNoDataIndicators(text)) {
      return extractNoDataMessage(text);
    }
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[1].trim());

    // Check for multi-university plan format
    if (parsed && typeof parsed === "object" && parsed.isMultiUniversity === true) {
      return validateMultiUniversityPlan(parsed, startTerm);
    }

    return validateAndNormalizePlan(parsed, startTerm);
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

function validateAndNormalizePlan(raw: unknown, startTerm?: string): ParsedPlan | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;

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

  // Verify prerequisite ordering
  if (!verifyPrerequisiteOrdering(semesters)) {
    // If ordering is wrong, try to fix it
    const fixed = reorderSemestersForPrerequisites(semesters);
    if (fixed) {
      const labeled = startTerm ? rewriteSemesterLabels(fixed, startTerm) : fixed;
      const fixedTotalUnits = labeled.reduce((sum: number, s: PlanSemester) => sum + s.totalUnits, 0);
      return {
        ccName: typeof obj.ccName === "string" ? obj.ccName : "",
        targetUniversity: typeof obj.targetUniversity === "string" ? obj.targetUniversity : "",
        targetMajor: typeof obj.targetMajor === "string" ? obj.targetMajor : "",
        semesters: labeled,
        totalUnits: fixedTotalUnits,
      };
    }
    // If can't fix, still return but note the issue
  }

  const finalSemesters = startTerm ? rewriteSemesterLabels(semesters, startTerm) : semesters;

  const plan: TransferPlan = {
    ccName: typeof obj.ccName === "string" ? obj.ccName : "",
    targetUniversity: typeof obj.targetUniversity === "string" ? obj.targetUniversity : "",
    targetMajor: typeof obj.targetMajor === "string" ? obj.targetMajor : "",
    semesters: finalSemesters,
    totalUnits: typeof obj.totalUnits === "number" ? obj.totalUnits : totalUnits,
  };

  return plan;
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
 * Validates and normalizes a multi-university plan from AI response.
 */
function validateMultiUniversityPlan(raw: Record<string, unknown>, startTerm?: string): MultiUniversityPlan | null {
  if (!raw.universities || !Array.isArray(raw.universities) || raw.universities.length === 0) {
    return null;
  }

  const universities: UniversityFit[] = [];

  for (const uni of raw.universities) {
    if (!uni || typeof uni !== "object") continue;
    const u = uni as Record<string, unknown>;

    if (typeof u.universityName !== "string" || typeof u.fitScore !== "number") continue;

    // Validate the embedded plan
    let plan: TransferPlan | null = null;
    if (u.plan && typeof u.plan === "object") {
      const validated = validateAndNormalizePlan(u.plan, startTerm);
      if (validated && !("isNoData" in validated)) {
        plan = validated as TransferPlan;
      }
    }

    if (!plan) continue;

    universities.push({
      universityName: u.universityName,
      fitScore: Math.max(0, Math.min(100, u.fitScore)),
      articulatedUnits: typeof u.articulatedUnits === "number" ? u.articulatedUnits : 0,
      totalRequiredUnits: typeof u.totalRequiredUnits === "number" ? u.totalRequiredUnits : 0,
      completedPrereqs: typeof u.completedPrereqs === "number" ? u.completedPrereqs : 0,
      totalPrereqs: typeof u.totalPrereqs === "number" ? u.totalPrereqs : 0,
      remainingSemesters: typeof u.remainingSemesters === "number" ? u.remainingSemesters : plan.semesters.length,
      plan,
      highlights: Array.isArray(u.highlights) ? u.highlights.filter((h): h is string => typeof h === "string") : [],
    });
  }

  if (universities.length === 0) return null;

  // Sort by fitScore descending
  universities.sort((a, b) => b.fitScore - a.fitScore);

  const summary = raw.transcriptSummary as Record<string, unknown> | undefined;

  return {
    isMultiUniversity: true,
    studentCC: typeof raw.studentCC === "string" ? raw.studentCC : "",
    major: typeof raw.major === "string" ? raw.major : "",
    maxCreditsPerSemester: typeof raw.maxCreditsPerSemester === "number" ? raw.maxCreditsPerSemester : 15,
    transcriptSummary: {
      completedCourses: typeof summary?.completedCourses === "number" ? summary.completedCourses : 0,
      totalUnits: typeof summary?.totalUnits === "number" ? summary.totalUnits : 0,
      gpa: typeof summary?.gpa === "number" ? summary.gpa : undefined,
    },
    universities,
  };
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
