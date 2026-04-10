import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createClient } from "@/utils/supabase/server";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Fetches articulation data for the user's path (CC + target school + major).
 * Returns formatted text that can be included in the system prompt.
 */
async function getArticulationContext(): Promise<string> {
  try {
    const supabase = await createClient();

    // Fetch all articulation agreements with course and institution details
    // Using any type because Supabase generated types don't include relationship types
    const { data: agreements, error } = await supabase
      .from("articulation_agreements")
      .select(`
        id,
        major,
        cc_institution_id,
        university_institution_id,
        courses!articulation_agreements_cc_course_id_fkey(id, code, title, units, institution_id),
        courses_1!articulation_agreements_university_course_id_fkey(id, code, title, units, institution_id),
        institutions!articulation_agreements_cc_institution_id_fkey(id, name, abbreviation),
        institutions_1!articulation_agreements_university_institution_id_fkey(id, name, abbreviation)
      `)
      .limit(200) as { data: unknown; error: unknown };

    if (error || !agreements) {
      console.error("Error fetching articulation data:", error);
      return "Articulation data is currently unavailable.";
    }

    const typedAgreements = agreements as Array<{
      major?: string;
      courses?: { code: string; title: string; units: number } | { code: string; title: string; units: number }[];
      courses_1?: { code: string; title: string; units: number } | { code: string; title: string; units: number }[];
      institutions?: { name: string; abbreviation?: string } | { name: string; abbreviation?: string }[];
      institutions_1?: { name: string; abbreviation?: string } | { name: string; abbreviation?: string }[];
    }>;

    // Format articulation data into a readable string
    const formatted = typedAgreements.map((a) => {
      const ccCourse = Array.isArray(a.courses) ? a.courses[0] : a.courses;
      const uniCourse = Array.isArray(a.courses_1) ? a.courses_1[0] : a.courses_1;
      const ccInst = Array.isArray(a.institutions) ? a.institutions[0] : a.institutions;
      const uniInst = Array.isArray(a.institutions_1) ? a.institutions_1[0] : a.institutions_1;

      if (!ccCourse || !uniCourse || !ccInst || !uniInst) return null;

      return `- ${ccInst.abbreviation || ccInst.name}: ${ccCourse.code} (${ccCourse.title}, ${ccCourse.units} units) → ${uniInst.abbreviation || uniInst.name}: ${uniCourse.code} (${uniCourse.title}, ${uniCourse.units} units) [${a.major || "General"}]`;
    }).filter(Boolean).join("\n");

    return formatted || "No articulation agreements found in the database.";
  } catch {
    return "Articulation data is currently unavailable.";
  }
}

/**
 * Fetches prerequisite relationships for relevant courses.
 */
async function getPrerequisiteContext(): Promise<string> {
  try {
    const supabase = await createClient();

    const { data: prereqs, error } = await supabase
      .from("prerequisites")
      .select(`
        course_id,
        prerequisite_course_id,
        courses!prerequisites_course_id_fkey(id, code, title, institution_id),
        courses_1!prerequisites_prerequisite_course_id_fkey(id, code, title, institution_id)
      `)
      .limit(100) as { data: unknown; error: unknown };

    if (error || !prereqs) {
      console.error("Error fetching prerequisites:", error);
      return "";
    }

    const typedPrereqs = prereqs as Array<{
      courses?: { code: string } | { code: string }[];
      courses_1?: { code: string } | { code: string }[];
    }>;

    const formatted = typedPrereqs
      .map((p) => {
        const course = Array.isArray(p.courses) ? p.courses[0] : p.courses;
        const prereq = Array.isArray(p.courses_1) ? p.courses_1[0] : p.courses_1;

        if (!course || !prereq) return null;

        return `- ${course.code} requires ${prereq.code}`;
      })
      .filter(Boolean)
      .join("\n");

    return formatted || "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Fetch articulation data and prerequisites for context
    const [articulationData, prerequisiteData] = await Promise.all([
      getArticulationContext(),
      getPrerequisiteContext(),
    ]);

    const systemPrompt = `You are CareerAC, an AI transfer planning assistant for California community college students.

## YOUR ROLE
Help students plan their transfer from community college to 4-year universities by generating semester-by-semester transfer plans.

## OUTPUT FORMAT
When generating a transfer plan, you MUST output a JSON code block with this exact structure:

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
1. **Stay on topic**: Only discuss transfer planning, articulation, and course planning.
2. **Don't fabricate courses**: ONLY use courses from the articulation data provided below. If a course doesn't exist in the data, don't invent it.
3. **Admit when no data**: If no articulation data matches the student's CC + target school + major combination, output:
\`\`\`json
{
  "isNoData": true,
  "noDataMessage": "No articulation data found for your specific path. We currently have data for select California community colleges transferring to UC and CSU schools. Please verify course requirements with your academic counselor, or try a different school/major combination."
}
\`\`\`
4. **Prerequisite ordering**: NEVER schedule a course before its prerequisites. If CS 2 requires CS 1, then CS 1 must appear in an earlier semester than CS 2.
5. **Include all fields**: Every course must have code, title, and units. Include transfer equivalency when available.

## AVAILABLE ARTICULATION DATA
The following are the articulation agreements in our database. Use ONLY these courses when generating plans:

${articulationData}

## PREREQUISITE RELATIONSHIPS
${prerequisiteData || "No prerequisite data is currently available. Use your knowledge of typical course sequences."}

## RESPONDING TO FOLLOW-UP MESSAGES
If the user already has a plan and asks to modify it (e.g., "Move MATH 101 to semester 2"), regenerate the full plan JSON with the requested changes while maintaining prerequisite ordering.`;

    const result = streamText({
      model: openrouter("google/gemma-4-31b-it:free"),
      messages: await convertToModelMessages(messages),
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    
    if (error instanceof Error && error.message?.includes("429")) {
      return Response.json(
        { error: "Rate limited, try again in a moment" },
        { status: 429 }
      );
    }
    
    return Response.json(
      { error: "AI temporarily unavailable" },
      { status: 500 }
    );
  }
}
