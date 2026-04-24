"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

interface CommunityCollegeOption {
  id: string;
  name: string;
  abbreviation: string | null;
}

export default function SavedCoursesSource({ onUseSavedCourses }: SavedCoursesSourceProps) {
  const [data, setData] = useState<AsTranscriptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualInstitution, setManualInstitution] = useState("");
  const [communityColleges, setCommunityColleges] = useState<CommunityCollegeOption[]>([]);
  const [isCollegeMenuOpen, setIsCollegeMenuOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const collegeFieldRef = useRef<HTMLDivElement>(null);
  const collegeListboxId = "saved-courses-institution-listbox";

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [transcriptRes, institutionsRes] = await Promise.all([
          fetch("/api/user-courses/as-transcript"),
          fetch("/api/institutions"),
        ]);

        if (transcriptRes.ok) {
          const payload = (await transcriptRes.json()) as AsTranscriptResponse;
          if (!cancelled) setData(payload);
        }

        if (institutionsRes.ok) {
          const payload = (await institutionsRes.json()) as { ccs?: CommunityCollegeOption[] };
          if (!cancelled) {
            setCommunityColleges(Array.isArray(payload.ccs) ? payload.ccs : []);
          }
        }
      } catch {
        // Silent: empty state will be shown instead.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (collegeFieldRef.current && !collegeFieldRef.current.contains(event.target as Node)) {
        setIsCollegeMenuOpen(false);
        setHighlightIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const collegeSuggestions = useMemo(() => {
    const query = manualInstitution.trim().toLowerCase();
    if (!query) return [];

    return communityColleges
      .filter((college) => {
        const name = college.name.toLowerCase();
        const abbreviation = college.abbreviation?.toLowerCase() ?? "";
        return name.includes(query) || abbreviation.includes(query);
      })
      .slice(0, 8);
  }, [communityColleges, manualInstitution]);

  const showCollegeSuggestions = isCollegeMenuOpen && collegeSuggestions.length > 0;

  const selectCollege = (collegeName: string) => {
    setManualInstitution(collegeName);
    setError(null);
    setIsCollegeMenuOpen(false);
    setHighlightIndex(-1);
  };

  if (loading) {
    return (
      <div className="mb-6 rounded-2xl border border-zinc-200 bg-white/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex animate-pulse items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="min-w-0 flex-1 space-y-2">
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
      <div className="mb-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-5 dark:border-zinc-700 dark:bg-zinc-900/30">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800">
            📚
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              No saved courses yet
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Upload your transcript below to save your courses. Next time, you can skip the upload and
              generate plans directly from your saved courses.
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
    <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl dark:bg-blue-900/40">
          📚
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Use your saved courses
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You have <span className="font-medium text-zinc-900 dark:text-white">{data.courseCount}</span>{" "}
            course{data.courseCount === 1 ? "" : "s"} in your profile
            {transcript.institution ? ` from ${transcript.institution}` : ""}
            {transcript.gpa !== undefined ? ` · GPA ${transcript.gpa}` : ""}.
            {" "}Skip the upload and generate a plan from your existing courses.
          </p>

          {needsInstitution && (
            <div className="mt-3">
              <label
                htmlFor="saved-courses-institution"
                className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Community college name
              </label>
              <div ref={collegeFieldRef} className="relative">
                <input
                  id="saved-courses-institution"
                  type="text"
                  role="combobox"
                  aria-expanded={showCollegeSuggestions}
                  aria-controls={collegeListboxId}
                  aria-activedescendant={
                    highlightIndex >= 0 ? `${collegeListboxId}-option-${highlightIndex}` : undefined
                  }
                  aria-autocomplete="list"
                  value={manualInstitution}
                  onChange={(e) => {
                    setManualInstitution(e.target.value);
                    setError(null);
                    setHighlightIndex(-1);
                    setIsCollegeMenuOpen(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => {
                    if (collegeSuggestions.length > 0) {
                      setIsCollegeMenuOpen(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!showCollegeSuggestions) {
                      if (e.key === "ArrowDown" && collegeSuggestions.length > 0) {
                        e.preventDefault();
                        setIsCollegeMenuOpen(true);
                        setHighlightIndex(0);
                      }
                      return;
                    }

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightIndex((current) => (current + 1) % collegeSuggestions.length);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightIndex(
                        (current) => (current - 1 + collegeSuggestions.length) % collegeSuggestions.length,
                      );
                    } else if (e.key === "Enter") {
                      if (highlightIndex >= 0 && highlightIndex < collegeSuggestions.length) {
                        e.preventDefault();
                        selectCollege(collegeSuggestions[highlightIndex].name);
                      }
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setIsCollegeMenuOpen(false);
                      setHighlightIndex(-1);
                    }
                  }}
                  placeholder="e.g., De Anza College"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />

                {showCollegeSuggestions && (
                  <ul
                    id={collegeListboxId}
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    {collegeSuggestions.map((college, index) => (
                      <li
                        key={college.id}
                        id={`${collegeListboxId}-option-${index}`}
                        role="option"
                        aria-selected={highlightIndex === index}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectCollege(college.name);
                        }}
                        onMouseEnter={() => setHighlightIndex(index)}
                        className={`cursor-pointer px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 ${
                          highlightIndex === index
                            ? "bg-blue-50 dark:bg-blue-900/30"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="font-medium">{college.name}</span>
                        {college.abbreviation && (
                          <span className="ml-2 text-zinc-500 dark:text-zinc-400">{college.abbreviation}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="button"
            onClick={handleClick}
            className="mt-3 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Use saved courses
          </button>
        </div>
      </div>
    </div>
  );
}
