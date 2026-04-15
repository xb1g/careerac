"use client";

import { useId, useState } from "react";

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

const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P", "NP", "W", "CR", "NC", ""];

function createDefaultFormData(): CourseFormData {
  return {
    course_code: "",
    course_title: "",
    units: 3,
    grade: "",
    term: "",
    status: "completed",
    notes: "",
  };
}

export default function CourseForm({ initialData, onSubmit, onCancel, submitLabel }: CourseFormProps) {
  const [form, setForm] = useState<CourseFormData>(initialData ?? createDefaultFormData());
  const formId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
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
            onChange={(e) => setForm({ ...form, course_code: e.target.value })}
            placeholder="e.g. CS 101"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-course-title`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Course Title *
          </label>
          <input
            id={`${formId}-course-title`}
            className={inputClass}
            required
            value={form.course_title}
            onChange={(e) => setForm({ ...form, course_title: e.target.value })}
            placeholder="e.g. Intro to Computer Science"
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
            <option value="">-- No grade --</option>
            {GRADE_OPTIONS.filter(Boolean).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${formId}-term`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Term
          </label>
          <input
            id={`${formId}-term`}
            className={inputClass}
            value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}
            placeholder="e.g. Fall 2024"
          />
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
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
