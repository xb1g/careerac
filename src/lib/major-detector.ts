import type { TranscriptCourse as ParsedTranscriptCourse } from "@/types/transcript";

export type TranscriptCourse = Pick<
  ParsedTranscriptCourse,
  "code" | "title" | "units" | "grade" | "status"
>;

export type MajorFamily =
  | "computer_science"
  | "biology"
  | "chemistry"
  | "physics"
  | "mathematics"
  | "economics"
  | "psychology"
  | "sociology"
  | "english"
  | "history"
  | "engineering"
  | "business";

export interface MajorDetectionResult {
  detectedMajor: string | null;
  confidence: number;
  family: MajorFamily | null;
  reasoning: string;
  alternatives: Array<{ major: string; confidence: number }>;
}

interface PrefixRule {
  prefix: string;
  family: MajorFamily;
  weight: number;
}

interface MajorCandidate {
  score: number;
  supportingCourseCodes: Set<string>;
}

const MAJOR_LABELS: Record<MajorFamily, string> = {
  computer_science: "Computer Science",
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
  mathematics: "Mathematics",
  economics: "Economics",
  psychology: "Psychology",
  sociology: "Sociology",
  english: "English",
  history: "History",
  engineering: "Engineering",
  business: "Business",
};

const PREFIX_RULES = [
  { prefix: "ENGIN", family: "engineering", weight: 3 },
  { prefix: "ENGR", family: "engineering", weight: 3 },
  { prefix: "ENGL", family: "english", weight: 3 },
  { prefix: "BIOL", family: "biology", weight: 3 },
  { prefix: "CHEM", family: "chemistry", weight: 3 },
  { prefix: "PHYS", family: "physics", weight: 3 },
  { prefix: "MATH", family: "mathematics", weight: 2 },
  { prefix: "ECON", family: "economics", weight: 3 },
  { prefix: "PSYC", family: "psychology", weight: 3 },
  { prefix: "PSY", family: "psychology", weight: 3 },
  { prefix: "SOC", family: "sociology", weight: 3 },
  { prefix: "HIST", family: "history", weight: 3 },
  { prefix: "HIS", family: "history", weight: 3 },
  { prefix: "BUSN", family: "business", weight: 3 },
  { prefix: "BUS", family: "business", weight: 3 },
  { prefix: "BIO", family: "biology", weight: 3 },
  { prefix: "CS", family: "computer_science", weight: 3 },
  { prefix: "ENG", family: "english", weight: 3 },
] satisfies PrefixRule[];

const TITLE_KEYWORDS: Record<MajorFamily, string[]> = {
  computer_science: ["computer", "programming", "software", "algorithm", "data structure"],
  biology: ["biology", "biological", "cell", "organism"],
  chemistry: ["chemical", "organic", "molecular", "stoichiometry"],
  physics: ["physics", "mechanics", "motion", "thermodynamics"],
  mathematics: ["calculus", "algebra", "geometry", "statistics"],
  economics: ["microeconomics", "macroeconomics", "economic", "market"],
  psychology: ["psychology", "behavior", "cognition", "development"],
  sociology: ["sociology", "social", "society", "culture"],
  english: ["composition", "literature", "writing", "rhetoric"],
  history: ["history", "historical", "civilization", "modern world"],
  engineering: ["engineering", "circuit", "design", "mechanics"],
  business: ["business", "accounting", "finance", "management", "marketing"],
};

const ALL_MAJOR_FAMILIES = Object.keys(MAJOR_LABELS) as MajorFamily[];
const DETECTION_THRESHOLD = 0.6;
const HIGH_CONFIDENCE_THRESHOLD = 0.85;

export function detectMajorFromTranscript(
  courses: TranscriptCourse[]
): MajorDetectionResult {
  const completedCourses = courses.filter((course) => course.status === "completed");

  if (completedCourses.length === 0) {
    return {
      detectedMajor: null,
      confidence: 0,
      family: null,
      reasoning: "No completed courses available for major detection.",
      alternatives: [],
    };
  }

  const candidates = createCandidates();
  const prefixMatches = createPrefixBuckets();

  for (const course of completedCourses) {
    const prefixRule = getPrefixRule(course.code);
    if (prefixRule) {
      addScore(candidates, prefixRule.family, prefixRule.weight, [course]);
      prefixMatches[prefixRule.family].push(course);
    }

    const normalizedTitle = normalizeTitle(course.title);
    for (const family of ALL_MAJOR_FAMILIES) {
      const keywordMatches = countKeywordMatches(normalizedTitle, TITLE_KEYWORDS[family]);
      if (keywordMatches > 0) {
        addScore(candidates, family, keywordMatches * 2, [course]);
      }
    }
  }

  applyCombinationBonuses(candidates, prefixMatches);

  const rankedFamilies = ALL_MAJOR_FAMILIES
    .map((family) => ({ family, candidate: candidates[family] }))
    .filter(({ candidate }) => candidate.score > 0)
    .sort((left, right) => {
      if (right.candidate.score !== left.candidate.score) {
        return right.candidate.score - left.candidate.score;
      }

      if (
        right.candidate.supportingCourseCodes.size !==
        left.candidate.supportingCourseCodes.size
      ) {
        return (
          right.candidate.supportingCourseCodes.size -
          left.candidate.supportingCourseCodes.size
        );
      }

      return MAJOR_LABELS[left.family].localeCompare(MAJOR_LABELS[right.family]);
    });

  if (rankedFamilies.length === 0) {
    return {
      detectedMajor: null,
      confidence: 0,
      family: null,
      reasoning: "No major-specific completed course pattern found.",
      alternatives: [],
    };
  }

  const topFamily = rankedFamilies[0].family;
  const topCandidate = rankedFamilies[0].candidate;
  const secondScore = rankedFamilies[1]?.candidate.score ?? 0;
  const supportCount = topCandidate.supportingCourseCodes.size;
  const confidence = calculateOverallConfidence(topCandidate.score, secondScore, supportCount);
  const isDetected = confidence >= DETECTION_THRESHOLD;

  return {
    detectedMajor: isDetected ? MAJOR_LABELS[topFamily] : null,
    confidence,
    family: isDetected ? topFamily : null,
    reasoning: buildReasoning(completedCourses, rankedFamilies, confidence, isDetected),
    alternatives: buildAlternatives(rankedFamilies, isDetected ? topFamily : null),
  };
}

export function detectMajor(courses: TranscriptCourse[]): {
  detectedMajor: string | null;
  confidence: number;
  suggestions: string[];
} {
  const result = detectMajorFromTranscript(courses);

  return {
    detectedMajor: result.detectedMajor,
    confidence: result.confidence,
    suggestions: [
      ...(result.detectedMajor ? [result.detectedMajor] : []),
      ...result.alternatives.map((alternative) => alternative.major),
    ].filter((major, index, allMajors) => allMajors.indexOf(major) === index).slice(0, 6),
  };
}

function createCandidates(): Record<MajorFamily, MajorCandidate> {
  return ALL_MAJOR_FAMILIES.reduce((accumulator, family) => {
    accumulator[family] = {
      score: 0,
      supportingCourseCodes: new Set<string>(),
    };
    return accumulator;
  }, {} as Record<MajorFamily, MajorCandidate>);
}

function createPrefixBuckets(): Record<MajorFamily, TranscriptCourse[]> {
  return ALL_MAJOR_FAMILIES.reduce((accumulator, family) => {
    accumulator[family] = [];
    return accumulator;
  }, {} as Record<MajorFamily, TranscriptCourse[]>);
}

function getPrefixRule(code: string): PrefixRule | undefined {
  const normalizedCode = normalizeCode(code);
  const leadingPrefix = normalizedCode.match(/^[A-Z]+/)?.[0];

  if (!leadingPrefix) {
    return undefined;
  }

  return PREFIX_RULES.find((rule) => rule.prefix === leadingPrefix);
}

function countKeywordMatches(title: string, keywords: string[]): number {
  return keywords.filter((keyword) => title.includes(keyword)).length;
}

function addScore(
  candidates: Record<MajorFamily, MajorCandidate>,
  family: MajorFamily,
  score: number,
  courses: TranscriptCourse[]
): void {
  candidates[family].score += score;

  for (const course of courses) {
    candidates[family].supportingCourseCodes.add(course.code);
  }
}

function applyCombinationBonuses(
  candidates: Record<MajorFamily, MajorCandidate>,
  prefixMatches: Record<MajorFamily, TranscriptCourse[]>
): void {
  const csCourses = prefixMatches.computer_science;
  const bioCourses = prefixMatches.biology;
  const chemCourses = prefixMatches.chemistry;
  const physCourses = prefixMatches.physics;
  const mathCourses = prefixMatches.mathematics;
  const econCourses = prefixMatches.economics;

  if (csCourses.length >= 2 && mathCourses.length >= 1) {
    addScore(candidates, "computer_science", 5, [...csCourses.slice(0, 2), mathCourses[0]]);
  }

  if (bioCourses.length >= 1 && chemCourses.length >= 1) {
    addScore(candidates, "biology", 5, [bioCourses[0], chemCourses[0]]);
  }

  if (chemCourses.length >= 1 && bioCourses.length >= 1 && physCourses.length >= 1) {
    addScore(candidates, "chemistry", 3, [chemCourses[0], bioCourses[0], physCourses[0]]);
  }

  if (mathCourses.length >= 1 && physCourses.length >= 1) {
    addScore(candidates, "physics", 3, [mathCourses[0], physCourses[0]]);
    addScore(candidates, "engineering", 3, [mathCourses[0], physCourses[0]]);
  }

  if (econCourses.length >= 1 && mathCourses.length >= 1) {
    addScore(candidates, "economics", 3, [econCourses[0], mathCourses[0]]);
  }
}

function calculateOverallConfidence(
  topScore: number,
  secondScore: number,
  supportCount: number
): number {
  const strength = Math.min(topScore / 10, 1);
  const margin = (topScore - secondScore) / Math.max(topScore, 1);
  const coverage = Math.min(supportCount / 3, 1);

  return roundConfidence(0.5 * strength + 0.3 * margin + 0.2 * coverage);
}

function calculateAlternativeConfidence(score: number, supportCount: number): number {
  const strength = Math.min(score / 10, 1);
  const coverage = Math.min(supportCount / 3, 1);

  return roundConfidence(0.7 * strength + 0.3 * coverage);
}

function buildReasoning(
  completedCourses: TranscriptCourse[],
  rankedFamilies: Array<{ family: MajorFamily; candidate: MajorCandidate }>,
  confidence: number,
  isDetected: boolean
): string {
  const topFamily = rankedFamilies[0].family;
  const topCodes = getOrderedSupportCodes(
    completedCourses,
    rankedFamilies[0].candidate.supportingCourseCodes
  );
  const codesSummary = topCodes.join(", ");
  const secondScore = rankedFamilies[1]?.candidate.score ?? 0;

  if (isDetected) {
    if (confidence >= HIGH_CONFIDENCE_THRESHOLD) {
      return `Strong ${MAJOR_LABELS[topFamily]} sequence: ${codesSummary}.`;
    }

    return `Best ${MAJOR_LABELS[topFamily]} signal from completed courses: ${codesSummary}.`;
  }

  if (rankedFamilies.length > 1 && rankedFamilies[0].candidate.score === secondScore) {
    const allCodes = Array.from(
      new Set(
        completedCourses
          .map((course) => course.code)
          .filter((code) =>
            rankedFamilies.some(({ candidate }) => candidate.supportingCourseCodes.has(code))
          )
      )
    );

    return `Scattered signals without a dominant major: ${allCodes.join(", ")}.`;
  }

  return `Low-confidence ${MAJOR_LABELS[topFamily]} signal from completed courses: ${codesSummary}.`;
}

function buildAlternatives(
  rankedFamilies: Array<{ family: MajorFamily; candidate: MajorCandidate }>,
  detectedFamily: MajorFamily | null
): Array<{ major: string; confidence: number }> {
  return rankedFamilies
    .filter(({ family }) => family !== detectedFamily)
    .map(({ family, candidate }) => ({
      major: MAJOR_LABELS[family],
      confidence: calculateAlternativeConfidence(
        candidate.score,
        candidate.supportingCourseCodes.size
      ),
    }))
    .sort((left, right) => {
      if (right.confidence !== left.confidence) {
        return right.confidence - left.confidence;
      }

      return left.major.localeCompare(right.major);
    });
}

function getOrderedSupportCodes(
  completedCourses: TranscriptCourse[],
  supportingCourseCodes: Set<string>
): string[] {
  return completedCourses
    .map((course) => course.code)
    .filter(
      (code, index, codes) => supportingCourseCodes.has(code) && codes.indexOf(code) === index
    );
}

function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase();
}

function roundConfidence(value: number): number {
  return Number(value.toFixed(3));
}
