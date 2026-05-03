export const NORMAL_GRADE_OPTIONS = [
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
] as const;

export type NormalGrade = (typeof NORMAL_GRADE_OPTIONS)[number];

export const SEMESTER_SEASONS = ["Fall", "Spring"] as const;
export type SemesterSeason = (typeof SEMESTER_SEASONS)[number];

export function normalizeNormalGrade(value: unknown): NormalGrade | null {
  if (typeof value !== "string") return null;
  const grade = value.trim().toUpperCase();
  return NORMAL_GRADE_OPTIONS.includes(grade as NormalGrade)
    ? (grade as NormalGrade)
    : null;
}

export function isValidSemesterYear(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}$/.test(value.trim());
}

export function formatSemesterLabel(
  season: SemesterSeason,
  year: string,
): string {
  return `${season} ${year.trim()}`;
}

export function normalizeSemesterLabel(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.trim().replace(/\s+/g, " ").match(/^(fall|spring) (\d{4})$/i);
  if (!match) return null;
  const season = match[1].toLowerCase() === "fall" ? "Fall" : "Spring";
  return `${season} ${match[2]}`;
}

export function getDefaultSemesterYear(): string {
  return String(new Date().getFullYear());
}
