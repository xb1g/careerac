"use client";

import { useState, useEffect } from "react";
import type { TranscriptData } from "@/types/transcript";
import { MajorAutocomplete } from "./major-autocomplete";

export interface PlanConfiguration {
  maxCreditsPerSemester: number;
  major: string;
  hasTargetSchool: boolean;
  targetSchool: string;
}

interface PlanConfigProps {
  transcriptData: TranscriptData | null;
  onConfigured: (config: PlanConfiguration) => void;
  onBack: () => void;
}

const CREDIT_PRESETS = [12, 15, 18];

export default function PlanConfig({ transcriptData, onConfigured, onBack }: PlanConfigProps) {
  const [maxCredits, setMaxCredits] = useState<number>(15);
  const [customCredits, setCustomCredits] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [major, setMajor] = useState(transcriptData?.major || "");
  const [hasTargetSchool, setHasTargetSchool] = useState(false);
  const [targetSchool, setTargetSchool] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [majorOptions, setMajorOptions] = useState<
    { id: string; name: string; category: string | null }[]
  >([]);

  useEffect(() => {
    fetch("/api/majors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMajorOptions(data);
      })
      .catch((err) => console.error("Failed to fetch majors:", err));
  }, []);

  const effectiveCredits = isCustom ? parseInt(customCredits) || 0 : maxCredits;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (effectiveCredits < 1 || effectiveCredits > 24) {
      newErrors.credits = "Credits must be between 1 and 24.";
    }
    if (!major.trim()) {
      newErrors.major = "Please enter your intended major.";
    }
    if (hasTargetSchool && !targetSchool.trim()) {
      newErrors.targetSchool = "Please enter your target school or choose 'Help me find the best fit'.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfigured({
      maxCreditsPerSemester: effectiveCredits,
      major: major.trim(),
      hasTargetSchool,
      targetSchool: hasTargetSchool ? targetSchool.trim() : "",
    });
  };

  const handleSkip = () => {
    const skippedMajor = major.trim() || "Undecided";
    onConfigured({
      maxCreditsPerSemester: 15,
      major: skippedMajor,
      hasTargetSchool: false,
      targetSchool: "",
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
          majors={majorOptions}
          placeholder="e.g., Computer Science"
          autoFocus
        />
        {errors.major && <p className="text-sm text-red-600 dark:text-red-400">{errors.major}</p>}
      </div>

      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-zinc-900 dark:text-white">
          Maximum Credits Per Semester
        </legend>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          This is a strict limit. Every semester in your plan will have this many units or fewer.
        </p>
        <div className="flex flex-wrap gap-2">
          {CREDIT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => { setMaxCredits(preset); setIsCustom(false); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                !isCustom && maxCredits === preset
                  ? "bg-blue-600 text-white"
                  : "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {preset} units
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              isCustom
                ? "bg-blue-600 text-white"
                : "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            Custom
          </button>
        </div>
        {isCustom && (
          <input
            type="number"
            min={1}
            max={24}
            value={customCredits}
            onChange={(e) => setCustomCredits(e.target.value)}
            placeholder="Enter max units"
            className="w-32 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        )}
        {errors.credits && <p className="text-sm text-red-600 dark:text-red-400">{errors.credits}</p>}
      </fieldset>

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
                I&apos;ll analyze your courses and show transfer likelihoods for multiple universities.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="targetSchool"
              checked={hasTargetSchool}
              onChange={() => setHasTargetSchool(true)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Yes, I have a target school</span>
              {hasTargetSchool && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={targetSchool}
                    onChange={(e) => setTargetSchool(e.target.value)}
                    placeholder="e.g., UCLA, UC Berkeley, San Jose State"
                    className="w-full max-w-md rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  {errors.targetSchool && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.targetSchool}</p>}
                </div>
              )}
            </div>
          </label>
        </div>
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
