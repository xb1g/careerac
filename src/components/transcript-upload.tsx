"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { TranscriptData, TranscriptCourse } from "@/types/transcript";
import { createClient } from "@/utils/supabase/client";
import {
  formatSemesterLabel,
  getDefaultSemesterYear,
  isValidSemesterYear,
  NORMAL_GRADE_OPTIONS,
  normalizeNormalGrade,
  SEMESTER_SEASONS,
  type SemesterSeason,
} from "@/utils/course-input-rules";

interface TranscriptUploadProps {
  onTranscriptParsed: (data: TranscriptData, transcriptId: string) => void;
  onSkip: () => void;
}

type ProcessingStage =
  | "idle"
  | "uploading"
  | "extracting"
  | "parsing"
  | "syncing";

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 80;

function getProcessingMessage(stage: ProcessingStage) {
  switch (stage) {
    case "uploading":
      return "Uploading transcript...";
    case "extracting":
      return "Extracting transcript text...";
    case "parsing":
      return "Parsing transcript...";
    case "syncing":
      return "Syncing your courses...";
    default:
      return "Uploading and parsing transcript...";
  }
}

function getProcessingStage(attempt: number): ProcessingStage {
  if (attempt < 2) return "extracting";
  if (attempt < 8) return "parsing";
  return "syncing";
}

export default function TranscriptUpload({
  onTranscriptParsed,
  onSkip,
}: TranscriptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] =
    useState<ProcessingStage>("idle");
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<TranscriptData | null>(null);
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePollTokenRef = useRef(0);

  useEffect(() => {
    return () => {
      activePollTokenRef.current += 1;
    };
  }, []);

  const pollTranscriptStatus = useCallback(
    async (id: string, pollToken: number) => {
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        if (activePollTokenRef.current !== pollToken) {
          return;
        }

        setProcessingStage(getProcessingStage(attempt));

        try {
          const response = await fetch(`/api/transcript/${id}`, {
            method: "GET",
            cache: "no-store",
          });
          const payload = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(
              payload.error || "Failed to fetch transcript status.",
            );
          }

          if (payload.parse_status === "completed" && payload.parsed_data) {
            setParsedData(payload.parsed_data as TranscriptData);
            setTranscriptId(id);
            setIsProcessing(false);
            setProcessingStage("idle");
            return;
          }

          if (payload.parse_status === "failed") {
            setError(payload.parse_error || "Could not parse transcript.");
            setShowManualEntry(true);
            setIsProcessing(false);
            setProcessingStage("idle");
            return;
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch transcript status.",
          );
          setIsProcessing(false);
          setProcessingStage("idle");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      if (activePollTokenRef.current === pollToken) {
        setError(
          "Transcript parsing took too long. Please retry or enter courses manually.",
        );
        setShowManualEntry(true);
        setIsProcessing(false);
        setProcessingStage("idle");
      }
    },
    [],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      activePollTokenRef.current += 1;
      const pollToken = activePollTokenRef.current;

      setIsUploading(true);
      setIsProcessing(false);
      setProcessingStage("uploading");
      setError(null);

      if (!file.type.includes("pdf")) {
        setError("Please upload a PDF file.");
        setIsUploading(false);
        setProcessingStage("idle");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File must be under 5MB.");
        setIsUploading(false);
        setProcessingStage("idle");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/transcript/upload", {
          method: "POST",
          body: formData,
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(payload.error || "Upload failed.");
          setIsUploading(false);
          setProcessingStage("idle");
          return;
        }

        const nextTranscriptId = payload.id as string | undefined;
        if (!nextTranscriptId) {
          setError(
            "Transcript upload succeeded, but no transcript id was returned.",
          );
          setIsUploading(false);
          setProcessingStage("idle");
          return;
        }

        setTranscriptId(nextTranscriptId);
        setIsUploading(false);
        setIsProcessing(true);
        setProcessingStage("extracting");

        void fetch(`/api/transcript/${nextTranscriptId}/process`, {
          method: "POST",
        }).catch((err) => {
          if (activePollTokenRef.current !== pollToken) return;
          setError(
            err instanceof Error
              ? err.message
              : "Failed to start transcript parsing.",
          );
          setIsProcessing(false);
          setProcessingStage("idle");
        });

        void pollTranscriptStatus(nextTranscriptId, pollToken);
      } catch {
        setError("Failed to upload. Please try again.");
        setIsUploading(false);
        setIsProcessing(false);
        setProcessingStage("idle");
      }
    },
    [pollTranscriptStatus],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleRemoveCourse = (index: number) => {
    if (!parsedData) return;
    const updated = {
      ...parsedData,
      courses: parsedData.courses.filter((_, i) => i !== index),
    };
    updated.totalUnitsCompleted = updated.courses
      .filter((c) => c.status === "completed")
      .reduce((sum, c) => sum + c.units, 0);
    updated.totalUnitsInProgress = updated.courses
      .filter((c) => c.status === "in_progress")
      .reduce((sum, c) => sum + c.units, 0);
    setParsedData(updated);
  };

  const handleConfirm = () => {
    if (parsedData && transcriptId) {
      onTranscriptParsed(parsedData, transcriptId);
    }
  };

  const [manualInstitution, setManualInstitution] = useState("");
  const [manualCourses, setManualCourses] = useState<TranscriptCourse[]>([]);
  const [manualCourse, setManualCourse] = useState({
    code: "",
    title: "",
    units: "",
    grade: "A",
  });
  const [manualSemesterSeason, setManualSemesterSeason] =
    useState<SemesterSeason>("Fall");
  const [manualSemesterYear, setManualSemesterYear] = useState(
    getDefaultSemesterYear,
  );
  const [communityColleges, setCommunityColleges] = useState<
    { id: string; name: string; abbreviation: string | null }[]
  >([]);
  const [courseSuggestions, setCourseSuggestions] = useState<
    { code: string; title: string; units: number }[]
  >([]);
  const [isCollegeMenuOpen, setIsCollegeMenuOpen] = useState(false);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [collegeHighlight, setCollegeHighlight] = useState(-1);
  const [courseHighlight, setCourseHighlight] = useState(-1);

  // Fetch community colleges on mount
  useEffect(() => {
    fetch("/api/institutions")
      .then((res) => res.json())
      .then((data) => {
        if (data.ccs) setCommunityColleges(data.ccs);
      })
      .catch(() => {});
  }, []);

  // Fetch courses when an institution is selected
  useEffect(() => {
    if (!manualInstitution) {
      setCourseSuggestions([]);
      return;
    }
    const matchedCC = communityColleges.find(
      (cc) => cc.name.toLowerCase() === manualInstitution.trim().toLowerCase(),
    );
    if (matchedCC) {
      const supabase = createClient();
      supabase
        .from("courses")
        .select("code, title, units")
        .eq("institution_id", matchedCC.id)
        .order("code")
        .then(({ data }) => {
          if (data) setCourseSuggestions(data);
        });
    } else {
      setCourseSuggestions([]);
    }
  }, [manualInstitution, communityColleges]);

  const filteredColleges = useMemo(() => {
    const q = manualInstitution.trim().toLowerCase();
    if (!q) return [];
    return communityColleges
      .filter(
        (cc) =>
          cc.name.toLowerCase().includes(q) ||
          cc.abbreviation?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [manualInstitution, communityColleges]);

  const filteredCourses = useMemo(() => {
    const q = manualCourse.code.trim().toLowerCase();
    if (!q) return [];
    return courseSuggestions
      .filter(
        (c) =>
          c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [manualCourse.code, courseSuggestions]);

  const selectCollege = (name: string) => {
    setManualInstitution(name);
    setIsCollegeMenuOpen(false);
    setCollegeHighlight(-1);
  };

  const selectCourse = (course: {
    code: string;
    title: string;
    units: number;
  }) => {
    setManualCourse((p) => ({
      ...p,
      code: course.code,
      title: course.title,
      units: String(course.units),
    }));
    setIsCourseMenuOpen(false);
    setCourseHighlight(-1);
  };

  const getManualCourseTitle = (courseCode: string) => {
    const code = courseCode.trim();
    const matchedCourse = courseSuggestions.find(
      (course) => course.code.toLowerCase() === code.toLowerCase(),
    );

    return (
      manualCourse.title.trim() ||
      matchedCourse?.title ||
      code.toUpperCase()
    );
  };

  const isCollegeListOpen = isCollegeMenuOpen && filteredColleges.length > 0;
  const isCourseListOpen = isCourseMenuOpen && filteredCourses.length > 0;
  const activeCollegeOptionId =
    isCollegeListOpen && collegeHighlight >= 0
      ? `institution-option-${filteredColleges[collegeHighlight]?.id}`
      : undefined;
  const activeCourseOptionId =
    isCourseListOpen && courseHighlight >= 0
      ? `course-code-option-${courseHighlight}`
      : undefined;
  const isManualSemesterValid = isValidSemesterYear(manualSemesterYear);

  const handleAddManualCourse = () => {
    const courseCode = manualCourse.code.trim();

    if (
      !courseCode ||
      !manualCourse.units ||
      !manualCourse.grade
    )
      return;

    const grade = normalizeNormalGrade(manualCourse.grade);
    if (!grade || !isManualSemesterValid) return;

    setManualCourses((prev) => [
      ...prev,
      {
        code: courseCode.toUpperCase(),
        title: getManualCourseTitle(courseCode),
        units: parseFloat(manualCourse.units),
        grade,
        status: "completed",
        semester: formatSemesterLabel(manualSemesterSeason, manualSemesterYear),
      },
    ]);
    setManualCourse({
      code: "",
      title: "",
      units: "",
      grade: "A",
    });
  };

  const handleConfirmManual = () => {
    if (manualCourses.length === 0 || isSavingManual) return;

    const data: TranscriptData = {
      institution: manualInstitution || "Unknown Institution",
      courses: manualCourses,
      totalUnitsCompleted: manualCourses
        .filter((c) => c.status === "completed")
        .reduce((s, c) => s + c.units, 0),
      totalUnitsInProgress: manualCourses
        .filter((c) => c.status === "in_progress")
        .reduce((s, c) => s + c.units, 0),
    };

    void (async () => {
      setIsSavingManual(true);
      setError(null);

      try {
        const response = await fetch("/api/transcript/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parsed_data: data,
            parse_status: "completed",
            parse_method: "manual",
            file_name: "Manual transcript entry",
            institution: data.institution,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to save manual transcript.");
        }

        onTranscriptParsed(data, result.id);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save manual transcript.",
        );
      } finally {
        setIsSavingManual(false);
      }
    })();
  };

  if (showManualEntry || (!parsedData && showManualEntry)) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Enter Your Courses
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your completed and in-progress courses manually.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {error}
          </div>
        )}

        <div className="relative">
          <label
            htmlFor="institution-name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Institution Name
          </label>
          <input
            id="institution-name"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="institution-name-options"
            aria-expanded={isCollegeListOpen}
            aria-haspopup="listbox"
            aria-activedescendant={activeCollegeOptionId}
            value={manualInstitution}
            onChange={(e) => {
              setManualInstitution(e.target.value);
              setIsCollegeMenuOpen(true);
              setCollegeHighlight(-1);
            }}
            onFocus={() => {
              if (filteredColleges.length > 0) setIsCollegeMenuOpen(true);
            }}
            onKeyDown={(e) => {
              if (!isCollegeMenuOpen) {
                if (e.key === "ArrowDown" && filteredColleges.length > 0) {
                  e.preventDefault();
                  setIsCollegeMenuOpen(true);
                  setCollegeHighlight(0);
                }
                return;
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCollegeHighlight((c) => (c + 1) % filteredColleges.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCollegeHighlight(
                  (c) =>
                    (c - 1 + filteredColleges.length) % filteredColleges.length,
                );
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (
                  collegeHighlight >= 0 &&
                  collegeHighlight < filteredColleges.length
                ) {
                  selectCollege(filteredColleges[collegeHighlight].name);
                } else if (filteredColleges.length > 0) {
                  selectCollege(filteredColleges[0].name);
                }
              } else if (e.key === "Escape") {
                e.preventDefault();
                setIsCollegeMenuOpen(false);
              }
            }}
            placeholder="e.g., De Anza College"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          {isCollegeListOpen && (
            <ul
              id="institution-name-options"
              role="listbox"
              className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            >
              {filteredColleges.map((college, idx) => (
                <li
                  id={`institution-option-${college.id}`}
                  key={college.id}
                  role="option"
                  aria-selected={collegeHighlight === idx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCollege(college.name);
                  }}
                  onMouseEnter={() => setCollegeHighlight(idx)}
                  className={`cursor-pointer px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 ${
                    collegeHighlight === idx
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="font-medium">{college.name}</span>
                  {college.abbreviation && (
                    <span className="ml-2 text-zinc-500">
                      ({college.abbreviation})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:flex-nowrap">
          <div className="relative w-full sm:w-32 xl:w-40 shrink-0">
            <input
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="course-code-options"
              aria-expanded={isCourseListOpen}
              aria-haspopup="listbox"
              aria-activedescendant={activeCourseOptionId}
              aria-label="Course code"
              value={manualCourse.code}
              onChange={(e) => {
                setManualCourse((p) => ({
                  ...p,
                  code: e.target.value,
                  title: "",
                }));
                setIsCourseMenuOpen(true);
                setCourseHighlight(-1);
              }}
              onFocus={() => {
                if (filteredCourses.length > 0) setIsCourseMenuOpen(true);
              }}
              onKeyDown={(e) => {
                if (!isCourseMenuOpen) {
                  if (e.key === "ArrowDown" && filteredCourses.length > 0) {
                    e.preventDefault();
                    setIsCourseMenuOpen(true);
                    setCourseHighlight(0);
                  }
                  return;
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCourseHighlight((c) => (c + 1) % filteredCourses.length);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCourseHighlight(
                    (c) =>
                      (c - 1 + filteredCourses.length) % filteredCourses.length,
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    courseHighlight >= 0 &&
                    courseHighlight < filteredCourses.length
                  ) {
                    selectCourse(filteredCourses[courseHighlight]);
                  } else if (filteredCourses.length > 0) {
                    selectCourse(filteredCourses[0]);
                  }
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setIsCourseMenuOpen(false);
                }
              }}
              placeholder="Code (CS 1)"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {isCourseListOpen && (
              <ul
                id="course-code-options"
                role="listbox"
                className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 sm:w-[300px]"
              >
                {filteredCourses.map((c, idx) => (
                  <li
                    id={`course-code-option-${idx}`}
                    key={`${c.code}-${idx}`}
                    role="option"
                    aria-selected={courseHighlight === idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectCourse(c);
                    }}
                    onMouseEnter={() => setCourseHighlight(idx)}
                    className={`cursor-pointer px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 ${
                      courseHighlight === idx
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="font-bold">{c.code}</span>{" "}
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {c.title}
                    </span>{" "}
                    ({c.units}u)
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="number"
            value={manualCourse.units}
            onChange={(e) =>
              setManualCourse((p) => ({ ...p, units: e.target.value }))
            }
            placeholder="Units"
            className="w-full sm:w-24 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <select
            value={manualCourse.grade}
            onChange={(e) =>
              setManualCourse((p) => ({ ...p, grade: e.target.value }))
            }
            aria-label="Grade"
            className="w-full sm:w-24 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {NORMAL_GRADE_OPTIONS.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <select
            value={manualSemesterSeason}
            onChange={(e) =>
              setManualSemesterSeason(e.target.value as SemesterSeason)
            }
            aria-label="Semester season"
            className="w-full sm:w-28 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {SEMESTER_SEASONS.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={manualSemesterYear}
            onChange={(e) =>
              setManualSemesterYear(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            aria-label="Semester year"
            placeholder="Year"
            className={`w-full sm:w-24 shrink-0 rounded-lg border bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              isManualSemesterValid
                ? "border-zinc-300 dark:border-zinc-700"
                : "border-red-300 dark:border-red-700"
            }`}
          />
          <button
            onClick={handleAddManualCourse}
            disabled={
              !manualCourse.code.trim() ||
              !manualCourse.units ||
              !manualCourse.grade ||
              !isManualSemesterValid
            }
            className="w-full sm:w-auto shrink-0 whitespace-nowrap rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Course
          </button>
        </div>

        {manualCourses.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Code
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Units
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Grade
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                    Semester
                  </th>
                  <th className="px-3 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {manualCourses.map((course, i) => (
                  <tr
                    key={i}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100">
                      {course.code}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {course.units}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {course.grade}
                    </td>
                    <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">
                      {course.semester}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() =>
                          setManualCourses((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleConfirmManual}
            disabled={manualCourses.length === 0 || isSavingManual}
            className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSavingManual
              ? "Saving..."
              : `Continue with ${manualCourses.length} course${manualCourses.length !== 1 ? "s" : ""}`}
          </button>
          <button
            onClick={onSkip}
            className="w-full rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto cursor-pointer"
          >
            Skip
          </button>
          <button
            onClick={() => setShowManualEntry(false)}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 sm:ml-auto sm:w-auto cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (parsedData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Review Your Transcript
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            We found {parsedData.courses.length} courses from{" "}
            {parsedData.institution}. Remove any that were parsed incorrectly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2">
            <span className="font-medium text-green-800 dark:text-green-200">
              {parsedData.totalUnitsCompleted}
            </span>
            <span className="text-green-600 dark:text-green-400 ml-1">
              units completed
            </span>
          </div>
          {parsedData.totalUnitsInProgress > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2">
              <span className="font-medium text-blue-800 dark:text-blue-200">
                {parsedData.totalUnitsInProgress}
              </span>
              <span className="text-blue-600 dark:text-blue-400 ml-1">
                units in progress
              </span>
            </div>
          )}
          {parsedData.gpa !== undefined && (
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-4 py-2">
              <span className="font-medium text-purple-800 dark:text-purple-200">
                {parsedData.gpa}
              </span>
              <span className="text-purple-600 dark:text-purple-400 ml-1">
                GPA
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Code
                </th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Title
                </th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Units
                </th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Grade
                </th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                  Semester
                </th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {parsedData.courses.map((course, i) => (
                <tr
                  key={i}
                  className="border-t border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100">
                    {course.code}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                    {course.title}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                    {course.units}
                  </td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                    {course.grade}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        course.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : course.status === "in_progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {course.status === "in_progress"
                        ? "In Progress"
                        : course.status === "completed"
                          ? "Completed"
                          : "Withdrawn"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">
                    {course.semester}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleRemoveCourse(i)}
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer transition-colors"
                      aria-label={`Remove ${course.code}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleConfirm}
            className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto cursor-pointer"
          >
            Looks Good, Continue
          </button>
          <button
            onClick={() => {
              activePollTokenRef.current += 1;
              setParsedData(null);
              setTranscriptId(null);
              setProcessingStage("idle");
            }}
            className="w-full rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto cursor-pointer"
          >
            Upload Different File
          </button>
        </div>
      </div>
    );
  }

  const isBusy = isUploading || isProcessing;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Upload Your Transcript
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload your unofficial transcript as a PDF so we can see what courses
          you&apos;ve already taken.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
        } ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {isBusy ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {getProcessingMessage(processingStage)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg
              className="w-10 h-10 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                Drop your transcript PDF here or click to browse
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                PDF files up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowManualEntry(true)}
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-[11px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Enter Courses Manually
        </button>
        <button
          onClick={onSkip}
          className="rounded-lg text-zinc-500 dark:text-zinc-400 px-6 py-2.5 text-[11px] font-medium hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Skip This Step
        </button>
      </div>
    </div>
  );
}
