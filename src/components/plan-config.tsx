"use client";

import { useMemo, useState } from "react";
import type { TranscriptData } from "@/types/transcript";
import { MajorAutocomplete } from "./major-autocomplete";
import {
  advanceTerm,
  computeNextRegistrationTerm,
  findLatestTerm,
  parseTerm,
  termToOrdinal,
} from "@/utils/term";

export interface PlanConfiguration {
  maxCreditsPerSemester: number;
  major: string;
  hasTargetSchool: boolean;
  targetSchool: string | null;
}

interface PlanConfigProps {
  transcriptData: TranscriptData | null;
  onConfigured: (config: PlanConfiguration) => void;
  onBack: () => void;
}

const DROPDOWN_COUNT = 10;
const DEFAULT_SEMESTERS_AHEAD = 4;

function semestersBetween(from: string, to: string): number {
  const a = parseTerm(from);
  const b = parseTerm(to);
  if (!a || !b) return 1;
  return Math.max(1, termToOrdinal(b) - termToOrdinal(a) + 1);
}

function currentTerm(now = new Date()): string {
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return month >= 6 ? `Fall ${year}` : `Spring ${year}`;
}

export default function PlanConfig({ transcriptData, onConfigured, onBack }: PlanConfigProps) {
  const [major, setMajor] = useState(transcriptData?.major || "");
  const [hasTargetSchool, setHasTargetSchool] = useState(false);
  const [targetSchool, setTargetSchool] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { startTerm, gradOptions, defaultGrad } = useMemo(() => {
    const latestTerm = findLatestTerm(
      (transcriptData?.courses ?? []).map((c) => (c as { semester?: string }).semester),
    );
    const start = computeNextRegistrationTerm(new Date(), latestTerm).label;
    const curr = currentTerm();

    // Default: 4 semesters ahead of the current academic term, but never before startTerm.
    const currParsed = parseTerm(curr);
    const startParsed = parseTerm(start);
    let defaultValue = start;
    if (currParsed && startParsed) {
      let ahead = start;
      let count = termToOrdinal(startParsed) - termToOrdinal(currParsed);
      while (count < DEFAULT_SEMESTERS_AHEAD) {
        ahead = advanceTerm(ahead);
        count++;
      }
      defaultValue = ahead;
    }

    // Options begin at startTerm (= at least 1 semester ahead) so users can
    // still pick an earlier graduation than the 4-ahead default.
    const options: string[] = [];
    let cur = start;
    for (let i = 0; i < DROPDOWN_COUNT; i++) {
      options.push(cur);
      cur = advanceTerm(cur);
    }
    // Ensure the default is reachable from the dropdown, even if startTerm is
    // unusually early and DROPDOWN_COUNT doesn't cover the default.
    while (!options.includes(defaultValue)) {
      options.push(cur);
      cur = advanceTerm(cur);
    }

    return { startTerm: start, gradOptions: options, defaultGrad: defaultValue };
  }, [transcriptData]);

  const [gradSemester, setGradSemester] = useState<string>("");
  const selectedGrad = gradSemester || defaultGrad;

  const maxCreditsPerSemester = useMemo(() => {
    const totalUnitsCompleted = transcriptData?.totalUnitsCompleted ?? 0;
    const remaining = Math.max(60 - totalUnitsCompleted, 15);
    const sems = semestersBetween(startTerm, selectedGrad);
    return Math.min(18, Math.max(12, Math.ceil(remaining / sems)));
  }, [startTerm, selectedGrad, transcriptData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!major.trim()) newErrors.major = "Please enter your intended major.";
    if (hasTargetSchool && !targetSchool.trim()) {
      newErrors.targetSchool = "Enter your target school, or switch to “Help me find the best fit.”";
    }
    // Ensure at least 1 semester ahead
    const startParsed = parseTerm(startTerm);
    const gradParsed = parseTerm(selectedGrad);
    if (!startParsed || !gradParsed || termToOrdinal(gradParsed) < termToOrdinal(startParsed)) {
      newErrors.gradSemester = "Intended graduation must be at least one semester ahead.";
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    onConfigured({
      maxCreditsPerSemester,
      major: major.trim(),
      hasTargetSchool,
      targetSchool: hasTargetSchool ? targetSchool.trim() : null,
    });
  };

  const handleSkip = () => {
    onConfigured({
      maxCreditsPerSemester: 15,
      major: major.trim() || "Undecided",
      hasTargetSchool: false,
      targetSchool: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Plan Settings</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Configure your transfer plan preferences. Or skip to use smart defaults.
        </p>
      </div>

      {transcriptData && (
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
          Transcript loaded: {transcriptData.courses.length} courses from {transcriptData.institution}
          {transcriptData.gpa !== undefined && ` (GPA: ${transcriptData.gpa})`}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="major-input" className="block text-sm font-medium text-zinc-900 dark:text-white">
          Intended Major
        </label>
        <MajorAutocomplete
          id="major-input"
          value={major}
          onChange={(v) => { setMajor(v); setErrors({}); }}
          placeholder="e.g., Computer Science"
        />
        {errors.major && <p className="text-sm text-red-600 dark:text-red-400">{errors.major}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="grad-semester" className="block text-sm font-medium text-zinc-900 dark:text-white">
          Intended Graduation Semester
        </label>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The semester you plan to transfer. Your plan will be paced to finish by then.
        </p>
        <select
          id="grad-semester"
          value={selectedGrad}
          onChange={(e) => { setGradSemester(e.target.value); setErrors({}); }}
          className="w-48 cursor-pointer rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {gradOptions.map((term) => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
        {errors.gradSemester && <p className="text-sm text-red-600 dark:text-red-400">{errors.gradSemester}</p>}
      </div>

      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-zinc-900 dark:text-white">
          Do you have a target school?
        </legend>
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="targetSchool"
              checked={!hasTargetSchool}
              onChange={() => setHasTargetSchool(false)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Help me find the best fit</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                I&apos;ll pick the strongest transfer options for your major automatically.
              </p>
            </div>
          </label>

          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="targetSchool"
              checked={hasTargetSchool}
              onChange={() => setHasTargetSchool(true)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">I have schools in mind</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Next you&apos;ll select schools from the full university catalog.
              </p>
            </div>
          </label>
        </div>

        {hasTargetSchool && (
          <div className="ml-7 space-y-2">
            <label htmlFor="target-school-input" className="block text-sm font-medium text-zinc-900 dark:text-white">
              Primary target school
            </label>
            <input
              id="target-school-input"
              type="text"
              value={targetSchool}
              onChange={(e) => { setTargetSchool(e.target.value); setErrors((prev) => ({ ...prev, targetSchool: "" })); }}
              placeholder="e.g., UC Berkeley"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {errors.targetSchool && <p className="text-sm text-red-600 dark:text-red-400">{errors.targetSchool}</p>}
          </div>
        )}
      </fieldset>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Generate Plan
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Skip → Use Defaults
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg text-zinc-500 dark:text-zinc-400 px-4 py-2.5 text-sm hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>
    </form>
  );
}
