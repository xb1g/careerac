"use client";

import { useState } from "react";
import { TranscriptData, TranscriptCourse } from "@/types/transcript";

interface TranscriptEditorProps {
  transcriptId: string;
  transcriptData: TranscriptData;
  onSave: (updatedData: TranscriptData) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = ["completed", "in_progress", "withdrawn"] as const;

export default function TranscriptEditor({
  transcriptId,
  transcriptData,
  onSave,
  onCancel,
}: TranscriptEditorProps) {
  const [courses, setCourses] = useState<TranscriptCourse[]>(transcriptData.courses);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCourseChange = (
    index: number,
    field: keyof TranscriptCourse,
    value: string | number
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        code: "",
        title: "",
        units: 3,
        grade: "",
        status: "completed",
        semester: "",
      },
    ]);
  };

  const handleRemoveCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const updatedData: TranscriptData = {
      ...transcriptData,
      courses,
    };

    try {
      const response = await fetch(`/api/transcript/${transcriptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsed_data: updatedData,
          parse_status: "completed",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      onSave(updatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save transcript");
    } finally {
      setSaving(false);
    }
  };

  const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);

  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Edit Transcript Courses
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {courses.length} courses · {totalUnits} total units
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-2 pr-3 font-medium text-zinc-500 dark:text-zinc-400">Code</th>
              <th className="text-left py-2 pr-3 font-medium text-zinc-500 dark:text-zinc-400">Title</th>
              <th className="text-left py-2 pr-3 font-medium text-zinc-500 dark:text-zinc-400 w-16">Units</th>
              <th className="text-left py-2 pr-3 font-medium text-zinc-500 dark:text-zinc-400 w-16">Grade</th>
              <th className="text-left py-2 pr-3 font-medium text-zinc-500 dark:text-zinc-400 w-28">Status</th>
              <th className="text-left py-2 pr-3 font-medium text-zinc-500 dark:text-zinc-400 w-28">Semester</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr
                key={index}
                className="border-b border-zinc-100 dark:border-zinc-800"
              >
                <td className="py-1.5 pr-3">
                  <input
                    type="text"
                    value={course.code}
                    onChange={(e) => handleCourseChange(index, "code", e.target.value)}
                    className="w-full px-2 py-1 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="CS 101"
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => handleCourseChange(index, "title", e.target.value)}
                    className="w-full px-2 py-1 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Course title"
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={course.units}
                    onChange={(e) => handleCourseChange(index, "units", parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    type="text"
                    value={course.grade}
                    onChange={(e) => handleCourseChange(index, "grade", e.target.value)}
                    className="w-16 px-2 py-1 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="A"
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <select
                    value={course.status}
                    onChange={(e) => handleCourseChange(index, "status", e.target.value)}
                    className="w-28 px-2 py-1 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1.5 pr-3">
                  <input
                    type="text"
                    value={course.semester}
                    onChange={(e) => handleCourseChange(index, "semester", e.target.value)}
                    className="w-28 px-2 py-1 text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Fall 2023"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveCourse(index)}
                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove course"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddCourse}
        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Course
      </button>
    </div>
  );
}