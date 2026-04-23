"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { CockpitData } from "@/types/cockpit";
import { COCKPIT_REFRESH_EVENT, COCKPIT_REFRESH_STORAGE_KEY } from "@/lib/cockpit-events";
import { cn } from "@/lib/utils";

function formatLongDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Inbox() {
  const [data, setData] = useState<CockpitData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCockpit = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cockpit", { cache: "no-store" });
      if (response.ok) {
        const nextData = (await response.json()) as CockpitData;
        setData(nextData);
      }
    } catch (err) {
      console.error("Failed to load inbox data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCockpit();
  }, [fetchCockpit]);

  useEffect(() => {
    const refresh = () => fetchCockpit();
    const onStorage = (event: StorageEvent) => {
      if (event.key === COCKPIT_REFRESH_STORAGE_KEY) refresh();
    };

    window.addEventListener(COCKPIT_REFRESH_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener(COCKPIT_REFRESH_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchCockpit]);

  const unreadCount = (data?.upcomingDeadlines.length ?? 0) + (data?.riskAlerts.length ?? 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
          isOpen 
            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" 
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        )}
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-[1.25rem] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 z-[60]">
          <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800/50">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Inbox</h3>
          </div>
          
          <div className="max-h-[32rem] overflow-y-auto">
            {isLoading && !data ? (
              <div className="p-8 text-center text-sm text-zinc-500">Loading notifications...</div>
            ) : unreadCount === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900">
                  <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-white">All caught up!</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">No upcoming deadlines or risks detected.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {/* Risk Alerts */}
                {data?.riskAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                        alert.severity === "high" ? "bg-rose-500" : alert.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                      )} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{alert.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{alert.description}</p>
                        {alert.planId && (
                          <Link 
                            href={`/plan/${alert.planId}?resolveRisk=${encodeURIComponent(alert.title)}`}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "mt-3 inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[10px] font-bold transition-all duration-300 border shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] active:scale-95 group",
                              alert.severity === "high" 
                                ? "bg-linear-to-r from-rose-600 to-rose-500 text-white border-rose-400/30 dark:border-rose-400/20 shadow-rose-500/10"
                                : "bg-linear-to-r from-blue-600 to-indigo-500 text-white border-blue-400/30 dark:border-blue-400/20 shadow-blue-500/10"
                            )}
                          >
                            <span>Resolve in plan</span>
                            <svg className="ml-1.5 h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Deadlines */}
                {data?.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{deadline.title}</p>
                        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {deadline.schoolName} · {formatLongDate(deadline.date)}
                        </p>
                        <Link 
                          href={`/plan/${deadline.planId}`}
                          onClick={() => setIsOpen(false)}
                          className="mt-2 inline-block text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Open plan →
                        </Link>
                      </div>
                      <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {deadline.daysRemaining}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-zinc-100 bg-zinc-50/50 px-5 py-3 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <Link 
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              View dashboard overview
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
