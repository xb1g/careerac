export type TermSeason = "Spring" | "Fall";

export interface Term {
  label: string;
  season: TermSeason;
  year: number;
}

/** Parses "Fall 2026" or "Spring 2025" into a Term object. Returns null if unparseable. */
export function parseTerm(label: string): Term | null {
  const match = label.trim().match(/^(Spring|Fall)\s+(\d{4})$/);
  if (!match) return null;
  return { label: label.trim(), season: match[1] as TermSeason, year: Number(match[2]) };
}

export function termToOrdinal(term: Term): number {
  return term.year * 2 + (term.season === "Spring" ? 0 : 1);
}

/** Returns the next academic term after the given label (Spring → Fall same year, Fall → Spring next year). */
export function advanceTerm(label: string): string {
  const t = parseTerm(label);
  if (!t) return label;
  if (t.season === "Fall") return `Spring ${t.year + 1}`;
  return `Fall ${t.year}`;
}

/**
 * Compute the next registration term the student can enroll in.
 *
 * Rules:
 * - April or earlier → next term is Fall of this year (registration opens in spring)
 * - May–November → next term is Fall of this year
 * - December → next term is Spring of next year
 * - Always ensure the returned term is strictly after latestTranscriptTerm (if provided).
 */
export function computeNextRegistrationTerm(now = new Date(), latestTranscriptTerm?: string): Term {
  const month = now.getMonth() + 1; // 1-based
  const year = now.getFullYear();

  // December → next registration is Spring next year; otherwise Fall this year
  let candidate: Term =
    month === 12
      ? { label: `Spring ${year + 1}`, season: "Spring", year: year + 1 }
      : { label: `Fall ${year}`, season: "Fall", year };

  // Ensure candidate is strictly after the latest completed transcript term
  if (latestTranscriptTerm) {
    const latest = parseTerm(latestTranscriptTerm);
    if (latest) {
      while (termToOrdinal(candidate) <= termToOrdinal(latest)) {
        const next = advanceTerm(candidate.label);
        const parsed = parseTerm(next);
        if (!parsed) break;
        candidate = parsed;
      }
    }
  }

  return candidate;
}

/** Given an ordered list of user_courses term strings, return the latest one. */
export function findLatestTerm(terms: (string | null | undefined)[]): string | undefined {
  let best: Term | undefined;
  for (const raw of terms) {
    if (!raw) continue;
    const t = parseTerm(raw);
    if (!t) continue;
    if (!best || termToOrdinal(t) > termToOrdinal(best)) best = t;
  }
  return best?.label;
}
