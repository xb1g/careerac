import type { TranscriptCourse, TranscriptData } from "@/types/transcript";

interface MiniMaxMessage {
  role: "system" | "user";
  content: string;
}

interface MiniMaxResponse {
  choices: Array<{
    finish_reason: string;
    messages: Array<{ content: string }>;
  }>;
}

/**
 * Parses transcript text using MiniMax AI model.
 * Falls back to regex parser if AI fails.
 */
export async function parseTranscriptWithAI(rawText: string): Promise<TranscriptData> {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not configured");
  }

  const systemPrompt = `You are a transcript parsing expert. Extract all courses from the provided transcript text and return ONLY valid JSON in this exact format:
{
  "institution": "University Name",
  "courses": [
    {
      "code": "CS 101",
      "title": "Introduction to Computer Science",
      "units": 3.0,
      "grade": "A",
      "status": "completed",
      "semester": "Fall 2023"
    }
  ]
}

Rules:
- status must be "completed", "in_progress", or "withdrawn"
- For in-progress courses use status "in_progress"
- For withdrawn use status "withdrawn"
- grade can be: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F, IP, W, P, NP, CR, NC
- Extract the institution name from the transcript header
- Return ONLY the JSON, no explanation or markdown`;

  const messages: MiniMaxMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Parse this transcript:\n\n${rawText}` }
  ];

  const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages,
      tokens_to_generate: 4096,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
  }

  const data: MiniMaxResponse = await response.json();
  const content = data.choices[0]?.messages[0]?.content;

  if (!content) {
    throw new Error("No content returned from MiniMax");
  }

  // Parse JSON from response (handle potential markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
  const jsonStr = jsonMatch[1]?.trim() || content.trim();

  try {
    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.institution || !Array.isArray(parsed.courses)) {
      throw new Error("Invalid response structure from AI");
    }

    // Calculate totals
    const totalUnitsCompleted = parsed.courses
      .filter((c: TranscriptCourse) => c.status === "completed")
      .reduce((sum: number, c: TranscriptCourse) => sum + c.units, 0);

    const totalUnitsInProgress = parsed.courses
      .filter((c: TranscriptCourse) => c.status === "in_progress")
      .reduce((sum: number, c: TranscriptCourse) => sum + c.units, 0);

    // Calculate GPA
    const GRADE_POINTS: Record<string, number> = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0,
    };

    let totalPoints = 0;
    let totalUnits = 0;
    for (const course of parsed.courses) {
      if (course.status !== "completed") continue;
      const points = GRADE_POINTS[course.grade];
      if (points !== undefined) {
        totalPoints += points * course.units;
        totalUnits += course.units;
      }
    }

    return {
      institution: parsed.institution,
      courses: parsed.courses,
      totalUnitsCompleted,
      totalUnitsInProgress,
      gpa: totalUnits > 0 ? Math.round((totalPoints / totalUnits) * 100) / 100 : undefined
    };
  } catch (parseError) {
    throw new Error(`Failed to parse AI response: ${parseError}`);
  }
}
