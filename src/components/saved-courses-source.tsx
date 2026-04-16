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
        // silent — no saved courses means this card simply won't render
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !data || !data.hasCourses || !data.transcriptData) {
    return null;
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
