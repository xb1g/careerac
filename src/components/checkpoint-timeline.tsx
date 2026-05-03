"use client";

import { useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef } from "react";

/* ── Types ── */
interface PlanData {
  semesters?: Array<{
    number: number;
    courses: Array<{ code: string; title: string; units: number; status?: string }>;
  }>;
  totalUnits?: number;
}

interface Checkpoint {
  id: string;
  action_label: string;
  plan_data: PlanData | null;
  created_at: string;
}

interface DiffSummary {
  added: string[];
  removed: string[];
  statusChanged: string[];
  unitsDelta: number;
}

export interface CheckpointTimelineHandle {
  refresh: () => void;
}

interface CheckpointTimelineProps {
  planId: string;
  currentPlanData: unknown;
  onRestore: (planData: unknown) => void;
}

/* ── Helpers ── */

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCourseSet(plan: PlanData | null): Map<string, string> {
  const map = new Map<string, string>();
  if (!plan?.semesters) return map;
  for (const sem of plan.semesters) {
    for (const c of sem.courses) {
      map.set(c.code, c.status ?? "planned");
    }
  }
  return map;
}

function computeDiff(before: PlanData | null, after: PlanData | null): DiffSummary {
  const beforeCourses = getCourseSet(before);
  const afterCourses = getCourseSet(after);
  const added: string[] = [];
  const removed: string[] = [];
  const statusChanged: string[] = [];

  for (const [code, status] of afterCourses) {
    if (!beforeCourses.has(code)) added.push(code);
    else if (beforeCourses.get(code) !== status) statusChanged.push(code);
  }
  for (const [code] of beforeCourses) {
    if (!afterCourses.has(code)) removed.push(code);
  }

  const unitsBefore = before?.totalUnits ?? 0;
  const unitsAfter = after?.totalUnits ?? 0;

  return { added, removed, statusChanged, unitsDelta: unitsAfter - unitsBefore };
}

/* ── Action icon by label pattern ── */
function ActionIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("failed") || l.includes("cancelled") || l.includes("waitlisted")) {
    return (
      <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
    );
  }
  if (l.includes("ai updated") || l.includes("regenerat")) {
    return (
      <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
    );
  }
  if (l.includes("accepted") || l.includes("alternative")) {
    return (
      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      </div>
    );
  }
  if (l.includes("target") || l.includes("school")) {
    return (
      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      </div>
    );
  }
  if (l.includes("undo to")) {
    return (
      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      </div>
    );
  }
  // Default: status change
  return (
    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    </div>
  );
}

/* ── Diff badge ── */
function DiffBadge({ diff }: { diff: DiffSummary }) {
  const parts: JSX.Element[] = [];
  if (diff.added.length > 0) {
    parts.push(
      <span key="add" className="text-emerald-600 dark:text-emerald-400">+{diff.added.length} course{diff.added.length > 1 ? "s" : ""}</span>
    );
  }
  if (diff.removed.length > 0) {
    parts.push(
      <span key="rm" className="text-rose-600 dark:text-rose-400">−{diff.removed.length} course{diff.removed.length > 1 ? "s" : ""}</span>
    );
  }
  if (diff.statusChanged.length > 0) {
    parts.push(
      <span key="ch" className="text-amber-600 dark:text-amber-400">{diff.statusChanged.length} changed</span>
    );
  }
  if (parts.length === 0 && diff.unitsDelta !== 0) {
    parts.push(
      <span key="u" className="text-zinc-500">{diff.unitsDelta > 0 ? "+" : ""}{diff.unitsDelta} units</span>
    );
  }
  if (parts.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium mt-0.5">
      {parts.map((p, i) => (
        <span key={i}>{i > 0 && <span className="text-zinc-300 dark:text-zinc-600 mx-0.5">·</span>}{p}</span>
      ))}
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium shadow-2xl">
        <svg className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {message}
      </div>
    </div>
  );
}

/* ── Main Component ── */
const CheckpointTimeline = forwardRef<CheckpointTimelineHandle, CheckpointTimelineProps>(
  function CheckpointTimeline({ planId, currentPlanData, onRestore }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [restoringId, setRestoringId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const fetchCheckpoints = useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/plan/${planId}/checkpoints`);
        if (res.ok) setCheckpoints(await res.json());
      } catch (err) {
        console.error("Failed to fetch checkpoints:", err);
      } finally {
        setLoading(false);
      }
    }, [planId]);

    // Expose refresh to parent
    useImperativeHandle(ref, () => ({ refresh: fetchCheckpoints }), [fetchCheckpoints]);

    useEffect(() => {
      if (isOpen) fetchCheckpoints();
    }, [isOpen, fetchCheckpoints]);

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Cmd+Z shortcut — undo to latest checkpoint
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
          // Don't intercept if user is typing in an input/textarea
          const tag = (e.target as HTMLElement)?.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;

          e.preventDefault();
          if (checkpoints.length > 0 && !restoringId) {
            handleRestore(checkpoints[0]);
          }
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [checkpoints, restoringId]);

    const handleRestore = async (checkpoint: Checkpoint) => {
      setRestoringId(checkpoint.id);
      try {
        const res = await fetch(`/api/plan/${planId}/checkpoints/${checkpoint.id}/restore`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Restore failed");
        const { plan_data } = await res.json();
        onRestore(plan_data);
        setToast(`Restored: ${checkpoint.action_label}`);
        await fetchCheckpoints();
      } catch (err) {
        console.error("Restore error:", err);
        setToast("Failed to restore checkpoint");
      } finally {
        setRestoringId(null);
      }
    };

    // Group checkpoints by day
    const grouped = checkpoints.reduce<Record<string, Checkpoint[]>>((acc, cp) => {
      const day = dayLabel(cp.created_at);
      (acc[day] ??= []).push(cp);
      return acc;
    }, {});

    const count = checkpoints.length;

    return (
      <>
        {/* Toggle button with badge */}
        <div ref={panelRef}>
          <button
            onClick={() => setIsOpen((p) => !p)}
            className={`relative p-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              isOpen
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title={`Plan history${count > 0 ? ` (${count})` : ""} · ⌘Z to undo`}
            data-testid="checkpoint-toggle"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {/* Panel */}
          {isOpen && (
            <div
              className="fixed inset-x-3 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-700/80 dark:bg-zinc-900 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[28rem]"
              data-testid="checkpoint-panel"
            >
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-t-2xl">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Plan History</h3>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {count > 0 ? `${count} checkpoint${count > 1 ? "s" : ""} · ⌘Z to undo` : "Changes will appear here"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Close history"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : checkpoints.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No history yet</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    Changes to your plan will be tracked here
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {Object.entries(grouped).map(([day, cps]) => (
                    <div key={day}>
                      {/* Day header */}
                      <div className="px-4 pt-3 pb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          {day}
                        </span>
                      </div>

                      {cps.map((cp, idx) => {
                        // Diff: compare this checkpoint's plan_data (the "before" state) against
                        // the next newer state. For the most recent checkpoint, compare against current plan.
                        // For older ones, compare against the checkpoint that came after it.
                        const globalIdx = checkpoints.indexOf(cp);
                        const newerPlan = globalIdx === 0
                          ? (currentPlanData as PlanData)
                          : checkpoints[globalIdx - 1]?.plan_data ?? null;
                        const diff = computeDiff(cp.plan_data, newerPlan);
                        const isExpanded = expandedId === cp.id;

                        return (
                          <div
                            key={cp.id}
                            className="group relative px-4 py-2"
                          >
                            {/* Timeline connector line */}
                            {idx < cps.length - 1 && (
                              <div className="absolute left-[2.15rem] top-9 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700/50" />
                            )}

                            <div className="flex items-start gap-3">
                              <ActionIcon label={cp.action_label} />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <button
                                      onClick={() => setExpandedId(isExpanded ? null : cp.id)}
                                      className="text-left cursor-pointer"
                                    >
                                      <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                                        {cp.action_label}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                          {timeAgo(cp.created_at)}
                                        </span>
                                        <DiffBadge diff={diff} />
                                      </div>
                                    </button>

                                    {/* Expanded diff detail */}
                                    {isExpanded && (diff.added.length > 0 || diff.removed.length > 0 || diff.statusChanged.length > 0) && (
                                      <div className="mt-2 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-[12px] space-y-1">
                                        {diff.added.map((c) => (
                                          <div key={`a-${c}`} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                                            <span className="font-mono">+</span> <span className="font-medium">{c}</span> added
                                          </div>
                                        ))}
                                        {diff.removed.map((c) => (
                                          <div key={`r-${c}`} className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                                            <span className="font-mono">−</span> <span className="font-medium">{c}</span> removed
                                          </div>
                                        ))}
                                        {diff.statusChanged.map((c) => (
                                          <div key={`s-${c}`} className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                                            <span className="font-mono">~</span> <span className="font-medium">{c}</span> status changed
                                          </div>
                                        ))}
                                        {diff.unitsDelta !== 0 && (
                                          <div className="text-zinc-500 dark:text-zinc-400 pt-0.5 border-t border-zinc-200 dark:border-zinc-700 mt-1">
                                            {diff.unitsDelta > 0 ? "+" : ""}{diff.unitsDelta} total units
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Restore button */}
                                  <button
                                    onClick={() => handleRestore(cp)}
                                    disabled={restoringId !== null}
                                    className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-all cursor-pointer"
                                    data-testid={`restore-${cp.id}`}
                                  >
                                    {restoringId === cp.id ? (
                                      <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
                                    ) : (
                                      "Restore"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toast notification */}
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </>
    );
  }
);

export default CheckpointTimeline;
