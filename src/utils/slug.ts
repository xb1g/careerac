import type { UniversityFit } from "@/types/plan";

/**
 * Lowercase, ASCII-only, hyphen-separated slug. Strips diacritics and
 * collapses any non-alphanumeric runs to a single hyphen.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Find the first university in the list whose slugified name matches `slug`.
 * Slug collisions within a single plan resolve to the first match and log a
 * dev-time warning; surfacing disambiguation UI is non-goal v1.
 */
export function findUniversityBySlug(
  universities: UniversityFit[],
  slug: string,
): UniversityFit | null {
  const target = slug.toLowerCase();
  let match: UniversityFit | null = null;
  let collisions = 0;
  for (const u of universities) {
    if (slugify(u.universityName) === target) {
      if (match === null) {
        match = u;
      } else {
        collisions += 1;
      }
    }
  }
  if (collisions > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `[findUniversityBySlug] Slug "${target}" matched ${collisions + 1} universities; using first match.`,
    );
  }
  return match;
}
