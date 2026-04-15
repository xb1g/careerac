import type { TranscriptCourse } from "@/types/transcript";

export interface MajorDetectionResult {
  detectedMajor: string | null;
  confidence: number;
  suggestions: string[];
}

interface MajorRule {
  major: string;
  patterns: RegExp[];
}

const MAJOR_RULES: MajorRule[] = [
  {
    major: "Computer Science",
    patterns: [/\bcs\b/i, /\bcis\b/i, /\bcsc\b/i, /computer/i, /program/i, /algorithm/i, /data structure/i, /software/i],
  },
  {
    major: "Business Administration",
    patterns: [/\bbus\b/i, /account/i, /finance/i, /marketing/i, /management/i, /econom/i],
  },
  {
    major: "Biology",
    patterns: [/\bbio\b/i, /biolog/i, /genetics/i, /ecology/i, /anatomy/i, /physiology/i, /microbio/i],
  },
  {
    major: "Psychology",
    patterns: [/\bpsych\b/i, /\bpsyc\b/i, /psychology/i, /behavior/i, /cognitive/i],
  },
  {
    major: "Engineering",
    patterns: [/\bengr\b/i, /engineering/i, /circuit/i, /statics/i, /dynamics/i, /mechanics/i],
  },
  {
    major: "Mathematics",
    patterns: [/\bmath\b/i, /calculus/i, /linear algebra/i, /differential/i, /statistics/i],
  },
  {
    major: "Economics",
    patterns: [/\becon\b/i, /economics/i, /microeconomics/i, /macroeconomics/i],
  },
  {
    major: "English",
    patterns: [/english/i, /composition/i, /literature/i, /writing/i],
  },
];

function normalizeCourse(course: TranscriptCourse) {
  return `${course.code} ${course.title}`.toLowerCase();
}

export function detectMajor(courses: TranscriptCourse[]): MajorDetectionResult {
  if (!courses.length) {
    return {
      detectedMajor: null,
      confidence: 0,
      suggestions: MAJOR_RULES.slice(0, 5).map((rule) => rule.major),
    };
  }

  const scores = MAJOR_RULES.map((rule) => {
    const score = courses.reduce((total, course) => {
      const text = normalizeCourse(course);
      const matches = rule.patterns.filter((pattern) => pattern.test(text)).length;
      return total + matches;
    }, 0);

    return { major: rule.major, score };
  }).sort((left, right) => right.score - left.score);

  const [top, runnerUp] = scores;
  const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);

  if (!top || top.score === 0) {
    return {
      detectedMajor: null,
      confidence: 0.4,
      suggestions: scores.slice(0, 5).map((entry) => entry.major),
    };
  }

  const dominance = totalScore > 0 ? top.score / totalScore : 0;
  const separation = top.score > 0 ? (top.score - (runnerUp?.score ?? 0)) / top.score : 0;
  const courseCoverage = Math.min(top.score / Math.max(courses.length, 1), 1);
  const confidence = Math.max(0.35, Math.min(0.97, dominance * 0.45 + separation * 0.35 + courseCoverage * 0.2));

  return {
    detectedMajor: top.major,
    confidence: Number(confidence.toFixed(2)),
    suggestions: scores.slice(0, 5).map((entry) => entry.major),
  };
}
