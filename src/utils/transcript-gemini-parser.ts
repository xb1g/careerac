import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { TranscriptCourse, TranscriptData } from "@/types/transcript";

/**
 * Parses transcript text using Gemini 3.1 Flash Lite.
 */
export async function parseTranscriptWithGemini(rawText: string): Promise<TranscriptData> {
  if (!rawText || !rawText.trim()) {
    throw new Error("No readable text found in the transcript. It may be a scanned image or empty.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-2.0-flash-lite as 3.1 is typically preview/experimental via specific SDKs
  // but if the key supports it, the model name will work.
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest", // Standard stable flash model
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          institution: { type: SchemaType.STRING },
          courses: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                code: { type: SchemaType.STRING },
                title: { type: SchemaType.STRING },
                units: { type: SchemaType.NUMBER },
                grade: { type: SchemaType.STRING },
                status: { type: SchemaType.STRING, enum: ["completed", "in_progress", "withdrawn"] },
                semester: { type: SchemaType.STRING }
              },
              required: ["code", "title", "units", "grade", "status", "semester"]
            }
          }
        },
        required: ["institution", "courses"]
      }
    }
  });

  const prompt = `Extract all courses from this transcript text. Return a clean list of courses with their units, grades, and statuses.
  
  Rules:
  - grade can be: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F, IP, W, P, NP, CR, NC
  - status must be "completed", "in_progress", or "withdrawn"
  - units must be a number
  - semester should be like "Fall 2023"
  
  Transcript Text:
  ${rawText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error("Gemini returned empty content.");
  }

  try {
    const parsed = JSON.parse(content);

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
