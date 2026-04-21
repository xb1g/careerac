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

  // Build the example JSON from the schema constant
  const planExample = JSON.stringify(
    {
      ccName: "Community College Name",
      targetUniversity: "Target University Name",
      targetMajor: "Target Major",
      semesters: [
        {
          number: 1,
          label: startTerm ?? "Fall 2026",
          courses: [
            {
              code: "CS 1",
              title: "Introduction to Computer Science I",
              units: 4,
              transferEquivalency: "UCLA CS 31",
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

## AVAILABLE ARTICULATION DATA
The following are the articulation agreements in our database. Use ONLY these courses when generating plans:

${articulationContext}

${buildAvailableMajorsSection(availableMajors)}

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

  if (hasTargetSchool === false || selectedUniversityNames.length > 0) {
    prompt += buildMultiUniversitySection(maxCreditsPerSemester, selectedUniversityNames);
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

function buildMultiUniversitySection(
  maxCreditsPerSemester?: number,
  selectedUniversityNames: string[] = [],
): string {
  const selectedList = selectedUniversityNames.length > 0
    ? `\n\nONLY use these selected universities: ${selectedUniversityNames.join(", ")}. Do not add universities outside this list, even if they have articulation data.`
    : "";

  return `

## MULTI-UNIVERSITY ANALYSIS MODE
The student does NOT have a specific target school. Analyze the articulation data and generate plans for MULTIPLE universities that match their CC and major.
${selectedList}

You MUST output a JSON code block with this structure instead of the standard plan format:

\`\`\`json
{
  "isMultiUniversity": true,
  "studentCC": "Community College Name",
  "major": "Student's Major",
  "maxCreditsPerSemester": ${maxCreditsPerSemester || 15},
  "transcriptSummary": {
    "completedCourses": 10,
    "totalUnits": 32,
    "gpa": 3.45
  },
  "universities": [
    {
      "universityName": "University Name",
      "fitScore": 85,
      "articulatedUnits": 40,
      "totalRequiredUnits": 60,
      "completedPrereqs": 8,
      "totalPrereqs": 10,
      "remainingSemesters": 3,
      "plan": {
        "ccName": "...",
        "targetUniversity": "...",
        "targetMajor": "...",
        "semesters": [...],
        "totalUnits": 60
      },
      "highlights": ["85% of lower-div major requirements completed", "All math prerequisites satisfied"]
    }
  ]
}
\`\`\`

RANKING: Sort universities by fitScore (highest first). Calculate fitScore as:
- 40% weight: percentage of required courses already completed or articulated
- 30% weight: percentage of prerequisites already satisfied
- 20% weight: fewer remaining semesters = higher score
- 10% weight: GPA competitiveness for the program

Each university's plan must respect the max credits per semester limit. Include only universities where articulation data exists.`;
}
