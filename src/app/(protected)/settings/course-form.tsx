"use client";

import { useState } from "react";

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

const DEFAULT_FORM: CourseFormData = {
  course_code: "",
  course_title: "",
  units: 3,
  grade: "",
  term: "",
  status: "completed",
  notes: "",
};

export default function CourseForm({ initialData, onSubmit, onCancel, submitLabel }: CourseFormProps) {
  const [form, setForm] = useState<CourseFormData>(initialData ?? DEFAULT_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="course-code" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Course Code *</label>
          <input id="course-code" className={inputClass} required value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })} placeholder="e.g. CS 101" />
        </div>
        <div>
          <label htmlFor="course-title" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Course Title *</label>
          <input id="course-title" className={inputClass} required value={form.course_title} onChange={(e) => setForm({ ...form, course_title: e.target.value })} placeholder="e.g. Intro to Computer Science" />
        </div>
        <div>
          <label htmlFor="units" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Units</label>
          <input id="units" className={inputClass} type="number" min={0} max={10} step={0.5} value={form.units} onChange={(e) => setForm({ ...form, units: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label htmlFor="grade" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Grade</label>
          <select id="grade" className={inputClass} value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
            <option value="">— No grade —</option>
            {GRADE_OPTIONS.filter(Boolean).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="term" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Term</label>
          <input id="term" className={inputClass} value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="e.g. Fall 2024" />
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Status</label>
          <select id="status" className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CourseFormData["status"] })}>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Notes</label>
        <input id="notes" className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
