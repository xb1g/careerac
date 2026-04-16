"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComparisonResult } from "@/lib/comparison-engine";

interface ComparisonDashboardProps {
  planId: string;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function acceptanceClasses(label: ComparisonResult["acceptanceChance"]["label"]): string {
  switch (label) {
    case "safety":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300";
    case "target":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
}

export default function ComparisonDashboard({ planId, className = "" }: ComparisonDashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded || !loading || results.length > 0) return;

    let active = true;

    fetch("/api/comparison", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId }),
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Failed to load comparison");
        return payload;
      })
      .then((payload) => {
        if (!active) return;
        const comparison = Array.isArray(payload.comparison) ? payload.comparison as ComparisonResult[] : [];
        setResults(comparison);
        setSelectedInstitutionId(comparison[0]?.institutionId ?? null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load comparison");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [expanded, loading, planId, results.length]);

  const selected = useMemo(
    () => results.find((result) => result.institutionId === selectedInstitutionId) ?? results[0] ?? null,
    [results, selectedInstitutionId],
  );

  const handleToggleExpanded = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    if (nextExpanded && results.length === 0) {
      setError(null);
      setLoading(true);
    }
  };

  return (
    <section className={`border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 ${className}`}>
      <div className="px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">School comparison</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Compare prep progress, transfer loss, timeline, admissions fit, and estimated cost.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleExpanded}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            {expanded ? "Hide comparison" : "Compare schools"}
          </button>
        </div>

        {expanded && (
          <div className="mt-5 space-y-5">
            {loading && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Loading comparison...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <>
                <div className="grid gap-4 lg:grid-cols-3">
                  {results.map((result) => (
                    <button
                      key={result.institutionId}
                      type="button"
                      onClick={() => setSelectedInstitutionId(result.institutionId)}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        selectedInstitutionId === result.institutionId
                          ? "border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-500/10"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                            {result.logoText}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{result.schoolName}</h3>
                              {result.isBestOption && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                  Best option
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Score {result.recommendationScore}/100</p>
                          </div>
                        </div>

                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${acceptanceClasses(result.acceptanceChance.label)}`}>
                          {result.acceptanceChance.label}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Major prep completion</span>
                            <span>{result.prepProgressPercent}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${result.prepProgressPercent}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/70 p-3">
                            <div className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Lost credits</div>
                            <div className={`mt-1 font-semibold ${result.estimatedLostCredits > 12 ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                              {result.estimatedLostCredits} units
                            </div>
                          </div>
                          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/70 p-3">
                            <div className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Semesters left</div>
                            <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{result.remainingSemesters}</div>
                          </div>
                          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/70 p-3">
                            <div className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Acceptance fit</div>
                            <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{result.acceptanceChance.score}/100</div>
                          </div>
                          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/70 p-3">
                            <div className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Estimated cost</div>
                            <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(result.totalEstimatedCost)}</div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selected && (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-5">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{selected.schoolName} details</h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {selected.matchedCourses.length} matched courses · {selected.missingCourses.length} still missing
                        </p>
                      </div>
                      {selected.acceptanceChance.baselineGpa !== null && (
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          Competitive GPA benchmark: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selected.acceptanceChance.baselineGpa.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Already satisfied</h4>
                        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {selected.matchedCourses.length === 0 ? (
                            <li className="text-zinc-500 dark:text-zinc-400">No articulated prep completed yet.</li>
                          ) : (
                            selected.matchedCourses.slice(0, 8).map((course) => (
                              <li key={`${course.ccCourseCode}-${course.universityCourseCode}`} className="flex items-start justify-between gap-3">
                                <span>{course.ccCourseCode} → {course.universityCourseCode}</span>
                                <span className="text-zinc-400 dark:text-zinc-500">{course.ccUnits}u</span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Still missing</h4>
                        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {selected.missingCourses.length === 0 ? (
                            <li className="text-emerald-600 dark:text-emerald-400">All currently tracked major prep appears satisfied.</li>
                          ) : (
                            selected.missingCourses.slice(0, 8).map((course) => (
                              <li key={`${course.ccCourseCode}-${course.universityCourseCode}`} className="flex items-start justify-between gap-3">
                                <span>{course.ccCourseCode} → {course.universityCourseCode}</span>
                                <span className="text-zinc-400 dark:text-zinc-500">{course.ccUnits}u</span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
