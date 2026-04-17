import type { TranscriptData } from "@/types/transcript";

export function buildSyntheticUserPrompt(
  transcriptData: TranscriptData,
  major: string,
  targetSchool: string | null,
  maxCreditsPerSemester: number,
): string {
  const destination = targetSchool
    ? `transfer to ${targetSchool}`
    : "find the best-fit transfer options";

  return [
    `Generate a complete transfer plan for a ${transcriptData.institution} student who wants to ${destination}.`,
    `The student's intended major is ${major}.`,
    `Use the transcript to account for completed and in-progress coursework.`,
    `Keep every semester at or below ${maxCreditsPerSemester} units.`,
  ].join(" ");
}
