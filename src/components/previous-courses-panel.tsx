"use client";

import { useState, useEffect, useCallback, useMemo, useRef, useId } from "react";
import { TranscriptCourse } from "@/types/transcript";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  formatSemesterLabel,
  getDefaultSemesterYear,
  isValidSemesterYear,
  NORMAL_GRADE_OPTIONS,
  normalizeNormalGrade,
  SEMESTER_SEASONS,
  type SemesterSeason,
} from "@/utils/course-input-rules";

const GRADE_POINTS: Record<string, number> = {
  "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

function calculateGPA(courses: TranscriptCourse[]): number | null {
  const graded = courses.filter(c => GRADE_POINTS[c.grade] !== undefined);
  if (graded.length === 0) return null;
  const totalPoints = graded.reduce((sum, c) => sum + GRADE_POINTS[c.grade], 0);
  return totalPoints / graded.length;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: Omit<TranscriptCourse, "status">) => void;
  existingCodes: Set<string>;
}

function AddCourseModal({ isOpen, onClose, onAdd, existingCodes }: AddCourseModalProps) {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [units, setUnits] = useState("");
  const [grade, setGrade] = useState("A");
  const [semesterSeason, setSemesterSeason] = useState<SemesterSeason>("Fall");
  const [semesterYear, setSemesterYear] = useState(getDefaultSemesterYear);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  const resetForm = useCallback(() => {
    setCode("");
    setTitle("");
    setUnits("");
    setGrade("A");
    setSemesterSeason("Fall");
    setSemesterYear(getDefaultSemesterYear());
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!code || code.length < 2 || code.length > 10) {
      errs.code = "Course code must be 2-10 characters";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(code)) {
      errs.code = "Course code must be alphanumeric";
    } else if (existingCodes.has(code.trim())) {
      errs.code = `Course "${code}" already exists`;
    }
    if (!title || title.length < 1 || title.length > 200) {
      errs.title = "Title must be 1-200 characters";
    }
    const unitsNum = parseFloat(units);
    if (!units || isNaN(unitsNum) || unitsNum <= 0 || unitsNum > 20) {
      errs.units = "Units must be a number > 0 and ≤ 20";
    }
    if (!normalizeNormalGrade(grade)) {
      errs.grade = `Grade must be one of: ${NORMAL_GRADE_OPTIONS.join(", ")}`;
    }
    if (!isValidSemesterYear(semesterYear)) {
      errs.semester = "Semester year must be four digits";
    }
    return errs;
  }, [code, title, units, grade, semesterYear, existingCodes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    onAdd({
      code: code.trim(),
      title: title.trim(),
      units: parseFloat(units),
      grade: normalizeNormalGrade(grade) ?? "A",
      semester: formatSemesterLabel(semesterSeason, semesterYear),
    });
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Add course">
      <button type="button" className="absolute inset-0 bg-black/20 border-0 cursor-default" onClick={handleClose} aria-label="Close modal" />
      <div className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add Course</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor={`${formId}-code`} className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Course Code</label>
            <input
              id={`${formId}-code`}
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., ENG 1A"
              className={cn(
                "w-full rounded-lg border bg-white dark:bg-zinc-800 px-3 py-2 text-sm",
                errors.code ? "border-red-500 dark:border-red-500" : "border-zinc-300 dark:border-zinc-700"
              )}
              aria-invalid={!!errors.code}
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
          </div>
          <div>
            <label htmlFor={`${formId}-title`} className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Title</label>
            <input
              id={`${formId}-title`}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., English Composition"
              className={cn(
                "w-full rounded-lg border bg-white dark:bg-zinc-800 px-3 py-2 text-sm",
                errors.title ? "border-red-500 dark:border-red-500" : "border-zinc-300 dark:border-zinc-700"
              )}
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${formId}-units`} className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Units</label>
              <input
                id={`${formId}-units`}
                type="number"
                value={units}
                onChange={e => setUnits(e.target.value)}
                placeholder="3"
                min="0.5" max="20" step="0.5"
                className={cn(
                  "w-full rounded-lg border bg-white dark:bg-zinc-800 px-3 py-2 text-sm",
                  errors.units ? "border-red-500 dark:border-red-500" : "border-zinc-300 dark:border-zinc-700"
                )}
                aria-invalid={!!errors.units}
              />
              {errors.units && <p className="mt-1 text-xs text-red-500">{errors.units}</p>}
            </div>
            <div>
              <label htmlFor={`${formId}-grade`} className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Grade</label>
              <select
                id={`${formId}-grade`}
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
              >
                {NORMAL_GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.grade && <p className="mt-1 text-xs text-red-500">{errors.grade}</p>}
            </div>
          </div>
          <fieldset>
            <legend className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Semester</legend>
            <div className="grid grid-cols-2 gap-3">
              <label htmlFor={`${formId}-semester-season`} className="sr-only">Semester season</label>
              <select
                id={`${formId}-semester-season`}
                value={semesterSeason}
                onChange={e => setSemesterSeason(e.target.value as SemesterSeason)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                aria-label="Semester season"
              >
                {SEMESTER_SEASONS.map(season => <option key={season} value={season}>{season}</option>)}
              </select>
              <label htmlFor={`${formId}-semester-year`} className="sr-only">Semester year</label>
              <input
                id={`${formId}-semester-year`}
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={semesterYear}
                onChange={e => setSemesterYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Year"
                className={cn(
                  "w-full rounded-lg border bg-white dark:bg-zinc-800 px-3 py-2 text-sm",
                  errors.semester ? "border-red-500 dark:border-red-500" : "border-zinc-300 dark:border-zinc-700"
                )}
                aria-label="Semester year"
                aria-invalid={!!errors.semester}
              />
            </div>
            {errors.semester && <p className="mt-1 text-xs text-red-500">{errors.semester}</p>}
          </fieldset>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" size="sm" loading={isSubmitting}>Add Course</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface RemoveConfirmDialogProps {
  isOpen: boolean;
  courseCode: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function RemoveConfirmDialog({ isOpen, courseCode, onConfirm, onCancel }: RemoveConfirmDialogProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Confirm remove">
      <button type="button" className="absolute inset-0 bg-black/20 border-0 cursor-default" onClick={onCancel} aria-label="Close dialog" />
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Remove Course</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Remove <span className="font-medium">{courseCode}</span> from your completed courses?</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>Remove</Button>
        </div>
      </div>
    </div>
  );
}

interface PreviousCoursesPanelProps {
  transcriptId?: string;
  courses: TranscriptCourse[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function PreviousCoursesPanel({
  transcriptId,
  courses,
  isCollapsed,
  onToggleCollapse,
}: PreviousCoursesPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [coursesState, setCoursesState] = useState<TranscriptCourse[]>(courses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageKey = transcriptId ? `prev-courses-collapsed-${transcriptId}` : null;

  useEffect(() => { setCoursesState(courses); }, [courses]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "true" && !isCollapsed) onToggleCollapse();
    } catch {}
  }, [storageKey, isCollapsed, onToggleCollapse]);

  useEffect(() => {
    if (!storageKey) return;
    try { localStorage.setItem(storageKey, String(isCollapsed)); } catch {}
  }, [isCollapsed, storageKey]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery]);

  const groupedCourses = useMemo(() => {
    const completed = coursesState.filter(c => c.status === "completed");
    const query = debouncedQuery.toLowerCase();
    const filtered = query
      ? completed.filter(c => c.code.toLowerCase().includes(query) || c.title.toLowerCase().includes(query))
      : completed;
    const groups: Record<string, TranscriptCourse[]> = {};
    for (const course of filtered) {
      const sem = course.semester || "Unknown Semester";
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(course);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [coursesState, debouncedQuery]);

  const gpa = useMemo(() => calculateGPA(coursesState.filter(c => c.status === "completed")), [coursesState]);

  const existingCodes = useMemo(() => new Set(coursesState.map(c => c.code)), [coursesState]);

  const handleAddCourse = useCallback(async (course: Omit<TranscriptCourse, "status">) => {
    if (!transcriptId) return;
    setIsSubmitting(true);
    setError(null);
    const newCourse: TranscriptCourse = { ...course, status: "completed" };
    const optimistic = [...coursesState, newCourse];
    setCoursesState(optimistic);
    setIsAddModalOpen(false);
    try {
      const res = await fetch(`/api/transcript/${transcriptId}/courses`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ add: [newCourse] }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add course");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add course");
      setCoursesState(coursesState);
    } finally {
      setIsSubmitting(false);
    }
  }, [transcriptId, coursesState]);

  const handleRemoveCourse = useCallback(async () => {
    if (!transcriptId || !removeTarget) return;
    setIsSubmitting(true);
    setError(null);
    const code = removeTarget;
    const optimistic = coursesState.filter(c => c.code !== code);
    setCoursesState(optimistic);
    setRemoveTarget(null);
    try {
      const res = await fetch(`/api/transcript/${transcriptId}/courses`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remove: [code] }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove course");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove course");
      setCoursesState(coursesState);
    } finally {
      setIsSubmitting(false);
    }
  }, [transcriptId, removeTarget, coursesState]);

  if (isCollapsed) {
    return (
      <div className="shrink-0 w-12 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col items-center py-4 gap-2">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Expand previous courses"
          title="Expand Previous Courses"
        >
          <svg className="w-5 h-5 text-zinc-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 sm:w-80">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Previous Courses</h2>
              {gpa !== null && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400" title="GPA from completed courses">
                  GPA: {gpa.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Collapse previous courses"
              title="Collapse"
            >
              <svg className="w-5 h-5 text-zinc-500 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {error && (
          <div className="mx-3 mt-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {groupedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <svg className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {debouncedQuery ? "No courses match your search" : "No completed courses yet"}
              </p>
              {!debouncedQuery && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Add courses or upload a transcript
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 space-y-4">
              {groupedCourses.map(([semester, semCourses]) => (
                <div key={semester}>
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2 px-1">
                    {semester}
                  </h3>
                  <div className="space-y-1.5">
                    {semCourses.map(course => (
                      <div
                        key={course.code}
                        className="group flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{course.code}</span>
                            {course.grade && (
                              <Badge variant="default" className="text-[10px] px-1.5 py-0 font-semibold">
                                {course.grade}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{course.title}</p>
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{course.units} {course.units === 1 ? "unit" : "units"}</p>
                        </div>
                        <button
                          onClick={() => setRemoveTarget(course.code)}
                          className="rounded-md p-1 text-zinc-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                          aria-label={`Remove ${course.code}`}
                          disabled={isSubmitting}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            onClick={() => setIsAddModalOpen(true)}
            disabled={!transcriptId || isSubmitting}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Course
          </Button>
        </div>
      </div>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCourse}
        existingCodes={existingCodes}
      />

      <RemoveConfirmDialog
        isOpen={removeTarget !== null}
        courseCode={removeTarget ?? ""}
        onConfirm={handleRemoveCourse}
        onCancel={() => setRemoveTarget(null)}
      />
    </>
  );
}
