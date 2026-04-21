import { GoogleGenAI } from "@google/genai";
import type { TranscriptCourse, TranscriptData } from "@/types/transcript";

/**
 * Parses transcript text using Gemini 3.1 Flash Lite Preview.
 * Uses the @google/genai SDK as requested.
 */
export async function parseTranscriptWithGemini(rawText: string): Promise<TranscriptData> {
  if (!rawText || !rawText.trim()) {
    throw new Error("No readable text found in the transcript. It may be a scanned image or empty.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  // Initialize the new SDK
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const model = "gemini-3.1-flash-lite-preview";
  
  // Define the system prompt and rules
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
- grade can be: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F, IP, W, P, NP, CR, NC
- units must be a number
- Extract the institution name from the transcript header
- Return ONLY the JSON, no explanation or markdown`;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `${systemPrompt}\n\nParse this transcript:\n\n${rawText}`,
        },
      ],
    },
  ];

  // Configuration as requested by user
  // Note: @google/genai uses config.thinkingConfig for reasoning models
  const config = {
    thinkingConfig: {
      includeThoughts: true, // Typically required to use thinking features
    },
    // We want structured output
    responseMimeType: "application/json",
  };

  try {
    const result = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    // In @google/genai, the candidates and text are directly on the result object
    const candidate = result.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text;

    if (!content) {
      // Safely access text or provide empty string
      const fallbackText = result.text || "";
      
      if (!fallbackText) {
        throw new Error("Gemini 3.1 returned empty content.");
      }
      return processParsedContent(fallbackText);
    }

    return processParsedContent(content);
  } catch (error) {
    console.error("Gemini 3.1 Parsing Error:", error);
    throw new Error(`Failed to parse transcript with Gemini 3.1: ${error}`);
  }
}

function processParsedContent(content: string): TranscriptData {
  try {
    // Clean potential markdown fencing
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
    const jsonStr = jsonMatch[1]?.trim() || content.trim();
    
    const parsed = JSON.parse(jsonStr) as { 
      institution: string; 
      courses: TranscriptCourse[] 
    };

    // Validate and normalize status
    if (parsed.courses) {
      parsed.courses = parsed.courses.map((c: TranscriptCourse) => ({
        ...c,
        status: (["completed", "in_progress", "withdrawn"].includes(c.status) ? c.status : "completed") as "completed" | "in_progress" | "withdrawn"
      }));
    }

    // Calculate totals
    const totalUnitsCompleted = (parsed.courses || [])
      .filter((c: TranscriptCourse) => c.status === "completed")
      .reduce((sum: number, c: TranscriptCourse) => sum + c.units, 0);

    const totalUnitsInProgress = (parsed.courses || [])
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
    for (const course of (parsed.courses || [])) {
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
    throw new Error(`Failed to parse Gemini response as JSON: ${parseError}`);
  }
}
