import type { TranscriptCourse, TranscriptData } from "@/types/transcript";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

const SEMESTER_PATTERN = /\b(Fall|Spring|Summer|Winter)\s+(\d{4})\b/i;

const COURSE_PATTERN = /^([A-Z]{2,6}\s+\d+\w{0,2})\s+(.+?)\s+(\d+\.?\d*)\s+([A-F][+-]?|IP|W|CR|NC|P|NP|EW|I)\s*$/;

function classifyGrade(grade: string): TranscriptCourse["status"] {
  if (grade === "IP" || grade === "I") return "in_progress";
  if (grade === "W" || grade === "EW") return "withdrawn";
  return "completed";
}

function calculateGPA(courses: TranscriptCourse[]): number | undefined {
  let totalPoints = 0;
  let totalUnits = 0;

  for (const course of courses) {
    if (course.status !== "completed") continue;
    const points = GRADE_POINTS[course.grade];
    if (points === undefined) continue;
    totalPoints += points * course.units;
    totalUnits += course.units;
  }

  if (totalUnits === 0) return undefined;
  return Math.round((totalPoints / totalUnits) * 100) / 100;
}

/**
 * Parses raw text extracted from a transcript PDF into structured data.
 * Best-effort parser — transcript formats vary between institutions.
 */
export function parseTranscriptText(rawText: string): TranscriptData {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const courses: TranscriptCourse[] = [];
  let currentSemester = "Unknown";
  let institution = "";

  // Try to detect institution name from the first few lines
  for (const line of lines.slice(0, 10)) {
    if (/college|university|institute/i.test(line) && !institution) {
      institution = line.replace(/^\s*official\s+transcript\s*/i, "").trim();
      break;
    }
  }

  for (const line of lines) {
    // Check for semester headers
    const semMatch = line.match(SEMESTER_PATTERN);
    if (semMatch) {
      currentSemester = `${semMatch[1]} ${semMatch[2]}`;
      continue;
    }

    // Try to match a course line
    const courseMatch = line.match(COURSE_PATTERN);
    if (courseMatch) {
      const grade = courseMatch[4].toUpperCase();
      courses.push({
        code: courseMatch[1].trim(),
        title: courseMatch[2].trim(),
        units: parseFloat(courseMatch[3]),
        grade,
        status: classifyGrade(grade),
        semester: currentSemester,
      });
    }
  }

  const totalUnitsCompleted = courses
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.units, 0);

  const totalUnitsInProgress = courses
    .filter((c) => c.status === "in_progress")
    .reduce((sum, c) => sum + c.units, 0);

  return {
    institution: institution || "Unknown Institution",
    courses,
    totalUnitsCompleted,
    totalUnitsInProgress,
    gpa: calculateGPA(courses),
  };
}
