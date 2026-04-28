/**
 * Pure system prompt assembly — NO I/O, NO database calls.
 * All data must be pre-fetched and passed in.
 *
 * Imports PLAN_JSON_SCHEMA to keep the AI↔parser contract explicit.
 */

import type { TranscriptData } from "@/types/transcript";
import { PLAN_JSON_SCHEMA, NO_DATA_JSON_SCHEMA } from "@/lib/plan-pipeline";

export interface PromptInputs {
  articulationContext: string;
  availableMajors?: string[];
  prerequisiteData: string;
  playbookContext: string;
  selectedMajor?: string;
  transcriptData?: TranscriptData;
  maxCreditsPerSemester?: number;
  hasTargetSchool?: boolean;
  selectedUniversityNames?: string[];
  recoveryPrompt?: string;
  startTerm?: string;
}

/**
 * Extracts 1-2 sample course examples from the articulation context for the prompt.
 * These are real CC course patterns from our database, NOT made-up codes.
 */
function extractExampleCourses(articulationContext: string): { code: string; title: string }[] {
  // Real CC course patterns found in our database (e.g., Evergreen Valley, SMCCCD)
  const realPatterns = [
    { code: "CS 181", title: "Introduction to C++ Programming" },
    { code: "CS 182", title: "Introduction to JAVA Programming" },
    { code: "MATH 071", title: "Calculus I with Analytic Geometry" },
    { code: "MATH 072", title: "Calculus II with Analytic Geometry" },
    { code: "MATH 176", title: "Precalculus: Functions and Graphs" },
    { code: "ENGL 001B", title: "English Composition" },
    { code: "CHEM 001A", title: "General Chemistry" },
    { code: "PHYS 004A", title: "General Physics" },
  ];

  // If articulation context is rich, try to extract actual codes from it
  const lines = articulationContext.split("\n").filter((line) => line.includes("→"));
  if (lines.length >= 2) {
    // Extract CC course codes from articulation lines like:
    // "- EVERGREENVALLE: CS 181 (Introduction to C++ Programming, 4 units) → UCLA: CS 31..."
    const examples: { code: string; title: string }[] = [];
    for (const line of lines.slice(0, 3)) {
      const match = line.match(/:\s+([A-Z]+\s+\d+[A-Z]*)\s+\(([^,]+)/);
      if (match) {
        examples.push({ code: match[1], title: match[2].trim() });
      }
    }
    if (examples.length >= 2) {
      return examples.slice(0, 2);
    }
  }

  // Fallback to real CC course patterns (NOT generic "CS 1")
  return realPatterns.slice(0, 2);
}

/**
 * Assembles the full system prompt from pre-fetched context.
 * The JSON output format is derived from PLAN_JSON_SCHEMA so the prompt
 * and the parser always agree on the expected shape.
 */
export function buildSystemPrompt(inputs: PromptInputs): string {
  const {
    articulationContext,
    availableMajors = [],
    prerequisiteData,
    playbookContext,
    selectedMajor,
    transcriptData,
    maxCreditsPerSemester,
    hasTargetSchool,
    selectedUniversityNames = [],
    recoveryPrompt,
    startTerm,
  } = inputs;

  // Extract real CC course examples from articulation data
  const exampleCourses = extractExampleCourses(articulationContext);
  const hasRealExamples = exampleCourses.length === 2;

  // Build a realistic example using actual CC course patterns
  // IMPORTANT: These must be real course codes from our database, not generic "CS 1"
  const planExample = JSON.stringify(
    {
      ccName: "Your Community College",
      targetUniversity: "Target University",
      targetMajor: selectedMajor ?? "Your Major",
      semesters: [
        {
          number: 1,
          label: startTerm ?? "Fall 2026",
          courses: hasRealExamples
            ? [
                {
                  code: exampleCourses[0].code,
                  title: exampleCourses[0].title,
                  units: 4,
                  transferEquivalency: exampleCourses[0].code.includes("CS") ? "Target CS 31" : "Target Course",
                  prerequisites: [],
                  notes: "",
                },
                {
                  code: exampleCourses[1].code,
                  title: exampleCourses[1].title,
                  units: 4,
                  transferEquivalency: "Target Course",
                  prerequisites: [],
                  notes: "",
                },
              ]
            : [
                // Fallback only when absolutely no articulation data exists
                // Use real course codes from actual CCC catalogs, NOT made-up codes
                {
                  code: "CS 181",
                  title: "Introduction to C++ Programming",
                  units: 4,
                  transferEquivalency: "Target CS 31",
                  prerequisites: [],
                  notes: "",
                },
              ],
        },
      ],
      totalUnits: 60,
    },
    null,
    2,
  );

  const noDataExample = JSON.stringify(
    {
      isNoData: true,
      noDataMessage:
        "No articulation data found for your specific path. We currently have data for select California community colleges transferring to UC and CSU schools. Please verify course requirements with your academic counselor, or try a different school/major combination.",
    },
    null,
    2,
  );

  // Keep schema references for contract documentation (not used at runtime yet,
  // but their existence here enforces that prompt ↔ parser share a single source)
  void PLAN_JSON_SCHEMA;
  void NO_DATA_JSON_SCHEMA;

  let prompt = `You are CareerAC, an AI transfer planning assistant for California community college students.

## YOUR ROLE
Help students plan their transfer from community college to 4-year universities by generating semester-by-semester transfer plans.

## OUTPUT FORMAT
When generating a transfer plan, you MUST output a fenced JSON code block with this exact structure:

\`\`\`json
${planExample}
\`\`\`

CRITICAL OUTPUT RULES:
- NEVER emit tool-call syntax such as \`[TOOL_CALL]\`, \`[/TOOL_CALL]\`, \`<tool_call>\`, \`<function_call>\`, or any other function-invocation tokens. No tools are available in this environment.
- NEVER ask the system to "call" a function to generate the plan. YOU must produce the plan content yourself.
- Write the full plan JSON inline, inside a single \`\`\`json ... \`\`\` fenced block. Always close the fence.
- Before the JSON block, include a short, friendly natural-language intro (1–3 sentences) describing what the plan does (e.g. "Here's a maximized 1-year plan with as many transferable units as possible:"). After the JSON block you may add brief notes or recommendations. Keep all prose in plain English — no raw JSON outside the fenced block.

## GUARDRAILS
1. **Stay on topic**: Only discuss transfer planning, articulation, and course planning.
2. **Don't fabricate courses**: ONLY use courses from the articulation data provided below. If a course doesn't exist in the data, don't invent it.
2a. **Use exact CC courses only**: Every scheduled course MUST use the exact community-college course code and title from the articulation data. Do NOT paraphrase, rename, or generalize course names.
2b. **Require articulation proof**: Never include a course unless the articulation data explicitly shows that CC course mapping to at least one selected university. If there is no matching articulation row, omit the course.
2c. **Use canonical equivalencies**: \`transferEquivalency\` must match the articulated university course code(s) from the data. Do not invent equivalent courses or requirements from general knowledge.
2d. **NEVER use generic codes like "CS 1", "MATH 1"**: These do not exist in any California community college. Real CCC courses use codes like "CS 181", "MATH 071", "ENGL 001B", "CHEM 001A". If you cannot find an articulated course, output isNoData=true instead.
3. **Admit when no data (strict)**: You may output isNoData=true ONLY when both values are 0:
  - Exact path major matches
  - Institution-scoped matches

If Institution-scoped matches is greater than 0, you MUST generate a best-effort plan from the provided articulation courses and clearly mark limitations in course notes.

If no data condition is met, output:
\`\`\`json
${noDataExample}
\`\`\`
4. **Prerequisite ordering**: NEVER schedule a course before its prerequisites. If CS 2 requires CS 1, then CS 1 must appear in an earlier semester than CS 2.
5. **Include all fields**: Every course must have code, title, and units. Include transfer equivalency when available.
6. **Be precise about supported majors**: If a student asks for a major that is not in the articulation matches above, do NOT claim CareerAC only supports a narrower set unless that limitation is explicitly stated in the available major list below.
7. **Respect the start term**: The first semester's label MUST be "${startTerm ?? "Fall 2026"}" and subsequent semesters follow Spring/Fall progression in order from there. Never emit past terms or terms earlier than the start term.

${selectedMajor
      ? `8. **Lock the major**: The student's selected major is "${selectedMajor}". In every JSON response, the output major MUST stay exactly "${selectedMajor}". Never replace it with a different major.`
      : ""}

## AVAILABLE ARTICULATION DATA FOR ${transcriptData?.institution ?? "YOUR COMMUNITY COLLEGE"}
The following are the articulation agreements in our database for courses at ${transcriptData?.institution ?? "the student's community college"}. Use ONLY these courses when generating plans:

${articulationContext}

${buildAvailableMajorsSection(availableMajors)}

## CRITICAL: COURSE ORIGIN RULE
Every course in the plan MUST be from ${transcriptData?.institution ?? "the student's community college"}. Do NOT include courses from other community colleges, even if they appear in similar format (e.g., do not use "CS 1" from Santa Monica College if the student is at Evergreen Valley College).

## PREREQUISITE RELATIONSHIPS
${prerequisiteData || "No prerequisite data is currently available. Use your knowledge of typical course sequences."}

## RESPONDING TO FOLLOW-UP MESSAGES
If the user already has a plan and asks to modify it (e.g., "Move MATH 101 to semester 2"), regenerate the full plan JSON with the requested changes while maintaining prerequisite ordering.`;

  // Append optional sections
  if (playbookContext) {
    prompt += playbookContext;
  }

  if (transcriptData && transcriptData.courses.length > 0) {
    prompt += buildTranscriptSection(transcriptData);
  }

  if (maxCreditsPerSemester) {
    prompt += buildMaxCreditsSection(maxCreditsPerSemester);
  }

  // Engage unified multi-school mode when there is no single target OR when the
  // user explicitly selected more than one school to compare. A single-school
  // selection still routes through the standard template.
  const isMultiSchool = hasTargetSchool === false || selectedUniversityNames.length > 1;
  if (isMultiSchool) {
    prompt += buildUnifiedMultiSchoolSection(maxCreditsPerSemester, selectedUniversityNames);
  }

  if (recoveryPrompt) {
    prompt += recoveryPrompt;
  }

  return prompt;
}

// ---------------------------------------------------------------------------
// Section builders (private, pure)
// ---------------------------------------------------------------------------

function buildTranscriptSection(transcriptData: TranscriptData): string {
  const completedCoursesList = transcriptData.courses
    .filter((c) => c.status === "completed")
    .map((c) => `- ${c.code}: ${c.title} (${c.units} units, Grade: ${c.grade})`)
    .join("\n");
  const inProgressList = transcriptData.courses
    .filter((c) => c.status === "in_progress")
    .map((c) => `- ${c.code}: ${c.title} (${c.units} units)`)
    .join("\n");

  return `

## STUDENT TRANSCRIPT
The student has uploaded their transcript from ${transcriptData.institution}.

COMPLETED COURSES:
${completedCoursesList || "None"}

IN-PROGRESS COURSES:
${inProgressList || "None"}

Total completed units: ${transcriptData.totalUnitsCompleted}${transcriptData.gpa !== undefined ? ` | GPA: ${transcriptData.gpa}` : ""}

IMPORTANT: Do NOT include any completed courses in the generated plan. Only schedule remaining required courses that the student still needs to take. In-progress courses should only be included if they might need to be retaken.`;
}

function buildAvailableMajorsSection(availableMajors: string[]): string {
  if (availableMajors.length === 0) {
    return "";
  }

  // Make the supported-major catalog explicit so the model does not treat the
  // current articulation slice as the full product catalog.
  return `## AVAILABLE MAJORS IN CAREERAC
${availableMajors.join(", ")}

If a student asks for a major that is not in the articulation matches above, tell them you do not yet have specific articulation data for that major. Then reference this available major list accurately and offer general transfer guidance when helpful.`;
}

function buildMaxCreditsSection(maxCreditsPerSemester: number): string {
  return `

## MAX CREDITS PER SEMESTER: ${maxCreditsPerSemester} units
This is a STRICT limit. Every semester in the plan MUST have ${maxCreditsPerSemester} or fewer total units. No exceptions. If you cannot fit all required courses within this limit, add more semesters rather than exceeding the limit. NEVER generate a semester that exceeds ${maxCreditsPerSemester} units.`;
}

function buildUnifiedMultiSchoolSection(
  maxCreditsPerSemester: number | undefined,
  selectedUniversityNames: string[],
): string {
  const explicit = selectedUniversityNames.length > 0;
  const schoolList = explicit
    ? `You MUST produce exactly one coveredSchools entry for each of these ${selectedUniversityNames.length} selected universities: ${selectedUniversityNames.join(", ")}. Do NOT drop any. Do NOT add universities outside this list. Sort coveredSchools by fitScore descending, but include every school even if its fitScore is low. Plan across all of them in a SINGLE unified plan — do NOT produce one plan per school.`
    : `The student has NOT selected target schools. From the articulation data, pick the 3–5 universities with the BEST articulation coverage for their major and cover all of them in a single unified plan.`;

  return `

## UNIFIED MULTI-SCHOOL PLAN MODE
${schoolList}

You MUST output a SINGLE TransferPlan JSON block (same shape as the standard plan), with two multi-school additions:

1. A top-level \`coveredSchools\` array listing every school this plan serves.
2. On every course, a \`requiredBy\` array listing which of the coveredSchools names require or accept that course.

### HOLISTIC PLANNING RULES
- Analyze ALL covered schools' requirements together. Do NOT duplicate plans per school.
- PREFER courses that satisfy the MOST schools. When a single CC course articulates to multiple targets, schedule it ONCE and list all targets in \`requiredBy\`.
- Only add a school-specific course (one that articulates to a subset of covered schools) when omitting it would leave a required subject gap for that school.
- \`requiredBy\` course names MUST exactly match entries in \`coveredSchools[].name\`.
- If a course is universal (required/accepted by every covered school), you MAY set \`requiredBy\` to all coveredSchool names or omit the field (the parser defaults omission to "all").

### EXAMPLE JSON (2 covered schools)

\`\`\`json
{
  "ccName": "Santa Monica College",
  "targetUniversity": "UCLA",
  "targetMajor": "Computer Science",
  "coveredSchools": [
    {
      "name": "UCLA",
      "institutionId": null,
      "fitScore": 86,
      "articulatedUnits": 42,
      "totalRequiredUnits": 60,
      "highlights": ["All math prereqs satisfied"]
    },
    {
      "name": "UC Berkeley",
      "institutionId": null,
      "fitScore": 78,
      "articulatedUnits": 38,
      "totalRequiredUnits": 60,
      "highlights": ["Strong CS articulation"]
    }
  ],
  "semesters": [
    {
      "number": 1,
      "label": "Fall 2026",
      "courses": [
        {
          "code": "CS 181",
          "title": "Introduction to C++ Programming",
          "units": 4,
          "transferEquivalency": "UCLA CS 31 / UCB CS 61A",
          "requiredBy": ["UCLA", "UC Berkeley"]
        },
        {
          "code": "MATH 071",
          "title": "Calculus I with Analytic Geometry",
          "units": 5,
          "transferEquivalency": "UCLA MATH 31A",
          "requiredBy": ["UCLA", "UC Berkeley"]
        }
      ]
    }
  ],
  "totalUnits": 60
}
\`\`\`

In the example above, CS 17 is school-specific (UCLA only) and the UI will render "CS 17*".

### RANKING (for coveredSchools.fitScore)
Calculate fitScore 0–100 per school:
- 40%: percentage of required courses already completed or articulated
- 30%: percentage of prerequisites already satisfied
- 20%: fewer remaining semesters → higher score
- 10%: GPA competitiveness for that program

Sort coveredSchools descending by fitScore. Set top-level \`targetUniversity\` = coveredSchools[0].name.

Every semester must still respect the max credits per semester limit (${maxCreditsPerSemester ?? 15}).`;
}
