"use client";

import { useCallback, useEffect, useState } from "react";
import type { CockpitData } from "@/types/cockpit";
import { COCKPIT_REFRESH_EVENT } from "@/lib/cockpit-events";
import { cn } from "@/lib/utils";

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
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 shadow-inner">
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", toneClass)} style={{ width: `${Math.max(4, Math.min(percent, 100))}%` }} />
      </div>
    </div>
  );
}

export default function RequirementProgress({ hasPlans }: { hasPlans: boolean }) {
  const [data, setData] = useState<CockpitData | null>(null);
  const [isLoading, setIsLoading] = useState(hasPlans);

  const fetchCockpit = useCallback(async () => {
    if (!hasPlans) return;
    try {
      const response = await fetch("/api/cockpit", { cache: "no-store" });
      if (response.ok) {
        const nextData = (await response.json()) as CockpitData;
        setData(nextData);
      }
    } catch (err) {
      console.error("Failed to load progress data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [hasPlans]);

  useEffect(() => {
    fetchCockpit();
  }, [fetchCockpit]);

  useEffect(() => {
    if (!hasPlans) return;
    const refresh = () => fetchCockpit();
    window.addEventListener(COCKPIT_REFRESH_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(COCKPIT_REFRESH_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [fetchCockpit, hasPlans]);

  if (!hasPlans || (!data && !isLoading)) return null;

  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-900/60">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Requirements progress</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Your cumulative transfer readiness across all target schools.</p>
      </div>
      
      {isLoading && !data ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="flex justify-between h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="grid gap-8 md:grid-cols-3">
          <ProgressBar 
            label="Transfer units" 
            completed={data.requirementsProgress.courses.completed} 
            required={data.requirementsProgress.courses.required} 
            percent={data.requirementsProgress.courses.completionPercent} 
            tone="blue" 
          />
          <ProgressBar 
            label="GE progress" 
            completed={data.requirementsProgress.ge.completed} 
            required={data.requirementsProgress.ge.required} 
            percent={data.requirementsProgress.ge.completionPercent} 
            tone="emerald" 
          />
          <ProgressBar 
            label="Major prep coverage" 
            completed={data.requirementsProgress.majorPrep.completed} 
            required={data.requirementsProgress.majorPrep.required} 
            percent={data.requirementsProgress.majorPrep.completionPercent} 
            tone="violet" 
          />
        </div>
      ) : null}
    </div>
  );
}
