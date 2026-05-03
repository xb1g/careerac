"use client";

import { useId, useState } from "react";
import {
  formatSemesterLabel,
  getDefaultSemesterYear,
  isValidSemesterYear,
  NORMAL_GRADE_OPTIONS,
  normalizeNormalGrade,
  normalizeSemesterLabel,
  SEMESTER_SEASONS,
  type SemesterSeason,
} from "@/utils/course-input-rules";

export interface CourseFormData {
  course_code: string;
  course_title: string;
  units: number;
  grade: string;
  term: string;
  status: "completed" | "in_progress" | "planned";
  notes: string;
}

interface CourseFormProps {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  submitLabel: string;
}

function createDefaultFormData(): CourseFormData {
  return {
    course_code: "",
    course_title: "",
    units: 3,
    grade: "A",
    term: "",
    status: "completed",
    notes: "",
  };
}

function normalizeInitialFormData(initialData?: CourseFormData): CourseFormData {
  const data = initialData ?? createDefaultFormData();
  return {
    ...data,
    grade: normalizeNormalGrade(data.grade) ?? "A",
  };
}

function getInitialTermParts(term: string): {
  season: SemesterSeason;
  year: string;
} {
  const normalized = normalizeSemesterLabel(term);
  if (!normalized) {
    return { season: "Fall", year: getDefaultSemesterYear() };
  }

  const [season, year] = normalized.split(" ") as [SemesterSeason, string];
  return { season, year };
}

export default function CourseForm({ initialData, onSubmit, onCancel, submitLabel }: CourseFormProps) {
  const [form, setForm] = useState<CourseFormData>(() => normalizeInitialFormData(initialData));
  const initialTerm = getInitialTermParts(initialData?.term ?? "");
  const [termSeason, setTermSeason] = useState<SemesterSeason>(initialTerm.season);
  const [termYear, setTermYear] = useState(initialTerm.year);
  const formId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSemesterYear(termYear)) return;

    const courseCode = form.course_code.trim();
    if (!courseCode) return;

    onSubmit({
      ...form,
      course_code: courseCode,
      course_title: form.course_title.trim() || courseCode,
      grade: normalizeNormalGrade(form.grade) ?? "A",
      term: formatSemesterLabel(termSeason, termYear),
    });
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-course-code`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Course Code *
          </label>
          <input
            id={`${formId}-course-code`}
            className={inputClass}
            required
            value={form.course_code}
            onChange={(e) =>
              setForm({
                ...form,
                course_code: e.target.value,
                course_title:
                  initialData?.course_code === e.target.value
                    ? initialData.course_title
                    : "",
              })
            }
            placeholder="e.g. CS 101"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-units`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Units
          </label>
          <input
            id={`${formId}-units`}
            className={inputClass}
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={form.units}
            onChange={(e) => setForm({ ...form, units: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-grade`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Grade
          </label>
          <select
            id={`${formId}-grade`}
            className={inputClass}
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          >
            {NORMAL_GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Term
          </span>
          <div className="grid grid-cols-2 gap-3">
            <select
              id={`${formId}-term-season`}
              className={inputClass}
              value={termSeason}
              onChange={(e) => setTermSeason(e.target.value as SemesterSeason)}
              aria-label="Term season"
            >
              {SEMESTER_SEASONS.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
            <input
              id={`${formId}-term-year`}
              className={inputClass}
              type="text"
              inputMode="numeric"
              maxLength={4}
              required
              value={termYear}
              onChange={(e) => setTermYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="Year"
              aria-label="Term year"
              aria-invalid={!isValidSemesterYear(termYear)}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${formId}-status`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Status
          </label>
          <select
            id={`${formId}-status`}
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as CourseFormData["status"] })}
          >
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${formId}-notes`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Notes
        </label>
        <input
          id={`${formId}-notes`}
          className={inputClass}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Optional notes"
        />
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white sm:w-auto cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
