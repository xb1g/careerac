"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CockpitData, CockpitDeadline, CockpitRiskAlert } from "@/types/cockpit";
import { COCKPIT_REFRESH_EVENT, COCKPIT_REFRESH_STORAGE_KEY } from "@/lib/cockpit-events";

interface TransferCockpitProps {
  hasPlans: boolean;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatShortDate(value: string | null) {
  if (!value) return "TBD";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatLongDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildCalendarUrl(deadline: CockpitDeadline) {
  const start = deadline.date.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const endDate = new Date(deadline.date);
  endDate.setHours(endDate.getHours() + 1);
  const end = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const details = encodeURIComponent(`CareerAC reminder for ${deadline.schoolName}`);
  const text = encodeURIComponent(`${deadline.title} · ${deadline.schoolName}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`;
}

function ProgressRing({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 24;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-200 dark:text-zinc-800" />
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-600 dark:text-blue-400 transition-all duration-500"
        />
      </svg>
      <span className="absolute text-sm font-bold text-zinc-900 dark:text-white">{safeValue}%</span>
    </div>
  );
}

function ProgressBar({ label, completed, required, percent, tone = "blue" }: { label: string; completed: number; required: number; percent: number; tone?: "blue" | "emerald" | "violet"; }) {
  const toneClass = {
    blue: "from-blue-500 to-cyan-400",
    emerald: "from-emerald-500 to-teal-400",
    violet: "from-violet-500 to-fuchsia-400",
  }[tone];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{label}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{completed} / {required === 0 ? "—" : required}</p>
        </div>
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800/80">
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", toneClass)} style={{ width: `${Math.max(4, Math.min(percent, 100))}%` }} />
      </div>
    </div>
  );
}

function severityStyles(severity: CockpitRiskAlert["severity"]) {
  if (severity === "high") {
    return "border-rose-200/80 bg-rose-50/70 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200";
  }

  if (severity === "medium") {
    return "border-amber-200/80 bg-amber-50/70 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200";
  }

  return "border-blue-200/80 bg-blue-50/70 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200";
}

function EmptyCockpitState() {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">Transfer Readiness Cockpit</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">Build your first transfer plan to unlock your readiness view.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Once you have a target school and a saved plan, this cockpit will surface progress, deadlines, risks, and the next best action automatically.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/plan/new" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Create a transfer plan
          </Link>
          <Link href="/settings" className="inline-flex items-center justify-center rounded-full border border-zinc-200/80 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:text-white">
            Add your courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TransferCockpit({ hasPlans }: TransferCockpitProps) {
  const [data, setData] = useState<CockpitData | null>(null);
  const [isLoading, setIsLoading] = useState(hasPlans);
  const [error, setError] = useState<string | null>(null);

  const fetchCockpit = useCallback(async () => {
    if (!hasPlans) {
      setIsLoading(false);
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cockpit", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load cockpit");
      }

      const nextData = (await response.json()) as CockpitData;
      setData(nextData);
    } catch (nextError) {
      console.error(nextError);
      setError("Couldn’t load your transfer readiness data right now.");
    } finally {
      setIsLoading(false);
    }
  }, [hasPlans]);

  useEffect(() => {
    void fetchCockpit();
  }, [fetchCockpit]);

  useEffect(() => {
    if (!hasPlans) return;

    const refresh = () => {
      void fetchCockpit();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === COCKPIT_REFRESH_STORAGE_KEY) {
        refresh();
      }
    };

    window.addEventListener(COCKPIT_REFRESH_EVENT, refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener(COCKPIT_REFRESH_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchCockpit, hasPlans]);

  const stats = useMemo(() => {
    if (!data) return [];

    return [
      { label: "Current GPA", value: data.quickStats.currentGpa !== null ? data.quickStats.currentGpa.toFixed(2) : "—", sub: null },
      { label: "Units at CC", value: data.quickStats.ccUnitsCompleted, sub: data.quickStats.transferUnitsEquivalent !== null ? `Transfers as ${data.quickStats.transferUnitsEquivalent} units` : null },
      { label: "Units left at CC", value: data.quickStats.unitsRemaining, sub: "of 60 to transfer" },
      { label: "Estimated transfer", value: data.quickStats.estimatedGraduation, sub: null },
    ];
  }, [data]);

  if (!hasPlans) {
    return <EmptyCockpitState />;
  }

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl dark:border-zinc-800/70 dark:bg-zinc-900/60 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">Transfer Readiness Cockpit</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Everything critical, in one view.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">Monitor school-by-school readiness, requirement coverage, deadlines, and the next move that keeps your transfer path on track.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/plan/new" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
              New plan
            </Link>
            <Link href="/settings" className="inline-flex items-center justify-center rounded-full border border-zinc-200/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:text-white">
              Update courses
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200/70 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>
      ) : null}

      {isLoading && !data ? (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-6">
            <div className="h-72 animate-pulse rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60" />
            <div className="h-72 animate-pulse rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60" />
          </div>
          <div className="grid gap-6">
            <div className="h-56 animate-pulse rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60" />
            <div className="h-56 animate-pulse rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60" />
          </div>
        </div>
      ) : null}

      {data ? (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-6">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Target schools</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Major prep status and the next deadline for each destination.</p>
                </div>
                <span className="rounded-full bg-zinc-100/80 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">{data.meta.planCount} tracked</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {data.targetSchools.map((school) => (
                  <Link key={school.planId} href={`/plan/${school.planId}`} className="group rounded-[1.25rem] border border-white/80 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/70 dark:bg-zinc-950/60">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{school.status}</p>
                        <h4 className="mt-2 text-lg font-bold text-zinc-900 dark:text-white">{school.schoolName}</h4>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{school.targetMajor}</p>
                      </div>
                      <ProgressRing value={school.majorPrepCompletionPercent} />
                    </div>
                    <div className="mt-5 grid gap-3 rounded-2xl bg-zinc-50/80 p-4 dark:bg-zinc-900/70">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Major prep</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{school.majorPrepCompleted}/{school.majorPrepRequired === 0 ? "—" : school.majorPrepRequired}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Next deadline</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{school.nextDeadlineLabel}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Days remaining</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{school.daysUntilDeadline ?? "—"}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatShortDate(school.nextDeadlineDate)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Requirements progress</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">See how your completed coursework stacks up against transfer expectations.</p>
                <div className="mt-6 space-y-5">
                  <ProgressBar label="Courses completed / required" completed={data.requirementsProgress.courses.completed} required={data.requirementsProgress.courses.required} percent={data.requirementsProgress.courses.completionPercent} tone="blue" />
                  <ProgressBar label="GE progress" completed={data.requirementsProgress.ge.completed} required={data.requirementsProgress.ge.required} percent={data.requirementsProgress.ge.completionPercent} tone="emerald" />
                  <ProgressBar label="Major prep progress" completed={data.requirementsProgress.majorPrep.completed} required={data.requirementsProgress.majorPrep.required} percent={data.requirementsProgress.majorPrep.completionPercent} tone="violet" />
                </div>
                <div className="mt-6 rounded-2xl bg-zinc-50/80 p-4 dark:bg-zinc-900/70">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">GPA vs. competitive range</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Target range {data.requirementsProgress.gpa.low.toFixed(1)}–{data.requirementsProgress.gpa.high.toFixed(1)}</p>
                    </div>
                    <span className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      data.requirementsProgress.gpa.status === "below" && "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200",
                      data.requirementsProgress.gpa.status === "within" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
                      data.requirementsProgress.gpa.status === "above" && "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
                      data.requirementsProgress.gpa.status === "unknown" && "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                    )}>
                      {data.requirementsProgress.gpa.current !== null ? data.requirementsProgress.gpa.current.toFixed(2) : "Add grades"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Upcoming deadlines</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Stay ahead of TAG, applications, and document checkpoints.</p>
                  </div>
                  <span className="rounded-full bg-zinc-100/80 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">Calendar sync</span>
                </div>
                <div className="mt-5 space-y-3">
                  {data.upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="rounded-2xl border border-zinc-200/70 bg-white/70 p-4 dark:border-zinc-800/70 dark:bg-zinc-950/50">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{deadline.title}</p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{deadline.schoolName} · {formatLongDate(deadline.date)}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">{deadline.daysRemaining}d</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Link href={`/plan/${deadline.planId}`} className="text-xs font-semibold text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300">
                          Open plan
                        </Link>
                        <a href={buildCalendarUrl(deadline)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-300">
                          Add to calendar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Risk alerts</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">High-signal blockers that need attention now.</p>
                </div>
                <span className="rounded-full bg-zinc-100/80 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300">{data.meta.alertCount}</span>
              </div>
              <div className="mt-5 space-y-3">
                {data.riskAlerts.length > 0 ? data.riskAlerts.map((alert) => (
                  <div key={alert.id} className={cn("rounded-2xl border p-4", severityStyles(alert.severity))}>
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="mt-1 text-xs leading-5 opacity-90">{alert.description}</p>
                    {alert.planId ? (
                      <Link href={`/plan/${alert.planId}`} className="mt-3 inline-flex text-xs font-semibold underline-offset-4 hover:underline">
                        Resolve in plan
                      </Link>
                    ) : null}
                  </div>
                )) : (
                  <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">No active risks detected. Keep your coursework and deadlines updated to stay in the clear.</div>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Next best action</h3>
              {data.nextBestAction ? (
                <>
                  <p className="mt-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{data.nextBestAction.title}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{data.nextBestAction.description}</p>
                  <Link href={data.nextBestAction.href} className="mt-5 inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                    {data.nextBestAction.cta}
                  </Link>
                </>
              ) : (
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Add a plan and coursework to unlock personalized recommendations.</p>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Quick stats</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-zinc-50/80 p-4 dark:bg-zinc-900/70">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{stat.value}</p>
                    {stat.sub ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stat.sub}</p> : null}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Last refreshed {formatLongDate(data.meta.lastUpdated)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
