"use client";

import { useState, useCallback } from "react";
import CourseForm, { type CourseFormData } from "./course-form";

type UserCourse = {
  id: string;
  course_code: string;
  course_title: string;
  units: number;
  grade: string | null;
  term: string | null;
  status: "completed" | "in_progress" | "planned";
  notes: string | null;
};

interface CoursesClientProps {
  initialCourses: UserCourse[];
}

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  planned: "Planned",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  planned: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function CoursesClient({ initialCourses }: CoursesClientProps) {
  const [courses, setCourses] = useState<UserCourse[]>(initialCourses);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "in_progress" | "planned">("all");

  const refreshCourses = useCallback(async () => {
    const res = await fetch("/api/user-courses");
    if (res.ok) setCourses(await res.json());
  }, []);

  const handleAdd = async (data: CourseFormData) => {
    setLoading(true);
    const res = await fetch("/api/user-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await refreshCourses();
      setShowAdd(false);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string, data: CourseFormData) => {
    setLoading(true);
    const res = await fetch(`/api/user-courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await refreshCourses();
      setEditingId(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this course?")) return;
    setLoading(true);
    await fetch(`/api/user-courses/${id}`, { method: "DELETE" });
    await refreshCourses();
    setLoading(false);
  };

  const filtered = filter === "all" ? courses : courses.filter((c) => c.status === filter);
  const completed = courses.filter((c) => c.status === "completed");
  const inProgress = courses.filter((c) => c.status === "in_progress");
  const planned = courses.filter((c) => c.status === "planned");
  const totalUnits = completed.reduce((s, c) => s + c.units, 0);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Completed", value: completed.length, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "In Progress", value: inProgress.length, color: "text-blue-600 dark:text-blue-400" },
          { label: "Planned", value: planned.length, color: "text-amber-600 dark:text-amber-400" },
          { label: "Total Units", value: totalUnits, color: "text-zinc-900 dark:text-white" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["all", "completed", "in_progress", "planned"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === f ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}>
              {f === "all" ? "All" : STATUS_LABELS[f]} {f === "all" ? `(${courses.length})` : `(${courses.filter((c) => c.status === f).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => { setShowAdd(true); setEditingId(null); }} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Course
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Add a Course</h3>
          <CourseForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel={loading ? "Adding..." : "Add Course"} />
        </div>
      )}

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          <p className="text-lg font-medium">No courses yet</p>
          <p className="text-sm mt-1">Add your completed, in-progress, or planned courses above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <div key={course.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              {editingId === course.id ? (
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Edit Course</h3>
                  <CourseForm
                    initialData={{ course_code: course.course_code, course_title: course.course_title, units: course.units, grade: course.grade ?? "", term: course.term ?? "", status: course.status, notes: course.notes ?? "" }}
                    onSubmit={(data) => handleUpdate(course.id, data)}
                    onCancel={() => setEditingId(null)}
                    submitLabel={loading ? "Saving..." : "Save Changes"}
                  />
                </div>
              ) : (
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{course.course_code}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[course.status]}`}>{STATUS_LABELS[course.status]}</span>
                      {course.grade && <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{course.grade}</span>}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 truncate">{course.course_title}</p>
                    <div className="flex gap-4 mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                      <span>{course.units} units</span>
                      {course.term && <span>{course.term}</span>}
                      {course.notes && <span className="italic">{course.notes}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setEditingId(course.id); setShowAdd(false); }} className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
