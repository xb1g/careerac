import type { ParsedPlan, TransferPlan, NoDataResponse, PlanCourse, PlanSemester } from "@/types/plan";

/**
 * Extracts and parses a structured transfer plan from AI response text.
 * The AI is expected to output a JSON block with the plan data.
 */
export function parsePlanFromAIResponse(text: string): ParsedPlan | null {
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
    return validateAndNormalizePlan(parsed);
  } catch {
    // If JSON parsing fails, check for no-data indicators in the text
    if (hasNoDataIndicators(text)) {
      return extractNoDataMessage(text);
    }
    return null;
  }
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

function validateAndNormalizePlan(raw: unknown): ParsedPlan | null {
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
      const fixedTotalUnits = fixed.reduce((sum: number, s: PlanSemester) => sum + s.totalUnits, 0);
      return {
        ccName: typeof obj.ccName === "string" ? obj.ccName : "",
        targetUniversity: typeof obj.targetUniversity === "string" ? obj.targetUniversity : "",
        targetMajor: typeof obj.targetMajor === "string" ? obj.targetMajor : "",
        semesters: fixed,
        totalUnits: fixedTotalUnits,
      };
    }
    // If can't fix, still return but note the issue
  }

  const plan: TransferPlan = {
    ccName: typeof obj.ccName === "string" ? obj.ccName : "",
    targetUniversity: typeof obj.targetUniversity === "string" ? obj.targetUniversity : "",
    targetMajor: typeof obj.targetMajor === "string" ? obj.targetMajor : "",
    semesters,
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
 * Generates a system prompt for the AI that includes articulation data context.
 */
export function generateSystemPrompt(options: {
  articulationData?: string;
  prerequisiteInfo?: string;
  existingPlan?: string;
  playbookInsights?: string;
}): string {
  const parts = [
    `You are CareerAC, an AI transfer planning assistant for California community college students.

## YOUR ROLE
Help students plan their transfer from community college to 4-year universities by generating semester-by-semester transfer plans using articulation data.

## OUTPUT FORMAT
When generating a transfer plan, you MUST output a JSON code block with this structure:

\`\`\`json
{
  "ccName": "Community College Name",
  "targetUniversity": "Target University Name",
  "targetMajor": "Target Major",
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2024",
      "courses": [
        {
          "code": "CS 1",
          "title": "Introduction to Computer Science I",
          "units": 4,
          "transferEquivalency": "UCLA CS 31",
          "prerequisites": [],
          "notes": ""
        }
      ]
    }
  ],
  "totalUnits": 60
}
\`\`\`

## GUARDRAILS
1. STAY ON TOPIC: Only discuss transfer planning, articulation, and course planning.
2. DON'T FABRICATE: Only use courses from the articulation data provided below. If a course doesn't exist in the data, don't invent it.
3. ADMIT WHEN NO DATA: If no articulation data matches the student's path, output:
\`\`\`json
{
  "isNoData": true,
  "noDataMessage": "No articulation data found for [CC] to [University] for [Major]. Please verify course requirements with your academic counselor or try a different school/major combination."
}
\`\`\`
4. PREREQUISITE ORDERING: Never schedule a course before its prerequisites. If CS 2 requires CS 1, CS 1 must be in an earlier semester.
5. INCLUDE ALL FIELDS: Every course must have code, title, and units. Include transfer equivalency when available.`,
  ];

  if (options.articulationData) {
    parts.push(`## AVAILABLE ARTICULATION DATA
The following articulation agreements show which community college courses transfer to which university courses:

${options.articulationData}`);
  }

  if (options.prerequisiteInfo) {
    parts.push(`## PREREQUISITE RELATIONSHIPS
${options.prerequisiteInfo}`);
  }

  if (options.playbookInsights) {
    parts.push(`## VERIFIED PLAYBOOK INSIGHTS
Real transfer students have shared these successful paths:

${options.playbookInsights}`);
  }

  if (options.existingPlan) {
    parts.push(`## CURRENT PLAN
The student already has this plan. Modify it based on their new request:

${options.existingPlan}`);
  }

  return parts.join("\n\n");
}
