"use client";

import { useEffect, useState } from "react";
import type { TranscriptData } from "@/types/transcript";

interface SavedCoursesSourceProps {
  onUseSavedCourses: (data: TranscriptData) => void;
}

interface AsTranscriptResponse {
  hasCourses: boolean;
  courseCount: number;
  institution: string;
  transcriptData: TranscriptData | null;
}

export default function SavedCoursesSource({ onUseSavedCourses }: SavedCoursesSourceProps) {
  const [data, setData] = useState<AsTranscriptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualInstitution, setManualInstitution] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/user-courses/as-transcript");
        if (!res.ok) return;
        const payload = (await res.json()) as AsTranscriptResponse;
        if (!cancelled) setData(payload);
      } catch {
        // silent — empty state will be shown
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-5 mb-6">
        <div className="flex items-start gap-3 animate-pulse">
          <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-full rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
            <div className="h-3 w-5/6 rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
            <div className="mt-3 h-8 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.hasCourses || !data.transcriptData) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shrink-0">
            📚
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              No saved courses yet
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Upload your transcript below to save your courses. Next time, you can skip the upload and generate plans directly from your saved courses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const transcript = data.transcriptData;
  const needsInstitution = !transcript.institution;

  const handleClick = () => {
    setError(null);
    const institution = transcript.institution || manualInstitution.trim();
    if (!institution) {
      setError("Please enter your community college so we know your articulation agreements.");
      return;
    }
    onUseSavedCourses({ ...transcript, institution });
  };

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-5 mb-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl shrink-0">
          📚
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Use your saved courses
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You have <span className="font-medium text-zinc-900 dark:text-white">{data.courseCount}</span>{" "}
            course{data.courseCount === 1 ? "" : "s"} in your profile
            {transcript.institution ? ` from ${transcript.institution}` : ""}
            {transcript.gpa !== undefined ? ` · GPA ${transcript.gpa}` : ""}.
            Skip the upload and generate a plan from your existing courses.
          </p>

          {needsInstitution && (
            <div className="mt-3">
              <label htmlFor="saved-courses-institution" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Community college name
              </label>
              <input
                id="saved-courses-institution"
                type="text"
                value={manualInstitution}
                onChange={(e) => setManualInstitution(e.target.value)}
                placeholder="e.g., De Anza College"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="button"
            onClick={handleClick}
            className="mt-3 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Use saved courses
          </button>
        </div>
      </div>
    </div>
  );
}
