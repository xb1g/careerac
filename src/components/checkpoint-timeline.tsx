"use client";

import { useState, useEffect, useCallback } from "react";

interface Checkpoint {
  id: string;
  action_label: string;
  created_at: string;
}

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

interface CheckpointTimelineProps {
  planId: string;
  onRestore: (planData: unknown) => void;
}

export default function CheckpointTimeline({ planId, onRestore }: CheckpointTimelineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

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

  useEffect(() => {
    if (isOpen) fetchCheckpoints();
  }, [isOpen, fetchCheckpoints]);

  const handleRestore = async (checkpoint: Checkpoint) => {
    if (!confirm(`Undo to "${checkpoint.action_label}"? Your current plan will be saved as a checkpoint first.`)) return;

    setRestoringId(checkpoint.id);
    try {
      const res = await fetch(`/api/plan/${planId}/checkpoints/${checkpoint.id}/restore`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Restore failed");
      const { plan_data } = await res.json();
      onRestore(plan_data);
      await fetchCheckpoints();
    } catch (err) {
      console.error("Restore error:", err);
      alert("Failed to restore checkpoint");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="p-1.5 rounded-full text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer"
        title="Plan history"
        data-testid="checkpoint-toggle"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl z-50"
          data-testid="checkpoint-panel"
        >
          <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Plan History</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              aria-label="Close history"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : checkpoints.length === 0 ? (
            <p className="px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
              No history yet. Changes will appear here.
            </p>
          ) : (
            <ul className="py-2">
              {checkpoints.map((cp) => (
                <li
                  key={cp.id}
                  className="group flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {cp.action_label}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {timeAgo(cp.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestore(cp)}
                    disabled={restoringId !== null}
                    className="shrink-0 opacity-0 group-hover:opacity-100 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-all cursor-pointer"
                    data-testid={`restore-${cp.id}`}
                  >
                    {restoringId === cp.id ? (
                      <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
                    ) : (
                      "Undo"
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
