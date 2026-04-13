"use client";

import { useState } from "react";
import type { MultiUniversityPlan, UniversityFit } from "@/types/plan";

interface MultiUniversityViewProps {
  plan: MultiUniversityPlan;
}

function getFitColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-zinc-400";
}

function getFitLabel(score: number): string {
  if (score >= 80) return "Strong Fit";
  if (score >= 60) return "Good Fit";
  if (score >= 40) return "Moderate Fit";
  return "Weak Fit";
}

function getFitTextColor(score: number): string {
  if (score >= 80) return "text-green-700 dark:text-green-300";
  if (score >= 60) return "text-blue-700 dark:text-blue-300";
  if (score >= 40) return "text-amber-700 dark:text-amber-300";
  return "text-zinc-600 dark:text-zinc-400";
}

export default function MultiUniversityView({ plan }: MultiUniversityViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = plan.universities[selectedIndex];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Transfer Options for {plan.major}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {plan.universities.length} universit{plan.universities.length === 1 ? "y" : "ies"} matched
          {plan.transcriptSummary.totalUnits > 0 && ` | ${plan.transcriptSummary.totalUnits} units completed`}
          {plan.transcriptSummary.gpa && ` | GPA: ${plan.transcriptSummary.gpa}`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* University cards */}
        <div className="px-6 py-4 space-y-3">
          {plan.universities.map((uni, i) => (
            <UniversityCard
              key={uni.universityName}
              university={uni}
              isSelected={i === selectedIndex}
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>

        {/* Selected university detail */}
        {selected && (
          <div className="px-6 pb-6">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {selected.universityName} -- Semester Plan
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selected.remainingSemesters} semester{selected.remainingSemesters !== 1 ? "s" : ""} remaining | Max {plan.maxCreditsPerSemester} units/semester
                </p>
              </div>

              <div className="p-4 space-y-4">
                {selected.plan.semesters.map((semester) => (
                  <div key={semester.number} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                        {semester.label}
                      </h4>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {semester.totalUnits} units
                      </span>
                    </div>
                    <div className="space-y-1">
                      {semester.courses.map((course) => (
                        <div
                          key={course.code}
                          className="flex items-center justify-between rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                              {course.code}
                            </span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {course.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                            {course.transferEquivalency && (
                              <span className="text-blue-600 dark:text-blue-400">
                                → {course.transferEquivalency}
                              </span>
                            )}
                            <span>{course.units}u</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UniversityCard({
  university,
  isSelected,
  onClick,
}: {
  university: UniversityFit;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500/30"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
            {university.universityName}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{university.articulatedUnits}/{university.totalRequiredUnits} units articulated</span>
            <span>{university.remainingSemesters} semester{university.remainingSemesters !== 1 ? "s" : ""} left</span>
          </div>
          {university.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {university.highlights.slice(0, 2).map((h, i) => (
                <span
                  key={i}
                  className="inline-block rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Fit score */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-700"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                className={getFitColor(university.fitScore).replace("bg-", "text-")}
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${university.fitScore}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white">
              {university.fitScore}
            </span>
          </div>
          <span className={`text-[10px] font-medium ${getFitTextColor(university.fitScore)}`}>
            {getFitLabel(university.fitScore)}
          </span>
        </div>
      </div>
    </button>
  );
}
