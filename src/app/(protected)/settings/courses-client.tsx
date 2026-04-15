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

const STATUS_ICONS: Record<string, string> = {
  completed: "✓",
  in_progress: "●",
  planned: "○",
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
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Completed", value: completed.length },
          { label: "In Progress", value: inProgress.length },
          { label: "Planned", value: planned.length },
          { label: "Total Units", value: totalUnits },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 p-5">
            <div className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{s.value}</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1">
          {(["all", "completed", "in_progress", "planned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                filter === f
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {f === "all" ? "All" : STATUS_LABELS[f]}
              <span className="ml-1 text-zinc-400 dark:text-zinc-500">{f === "all" ? courses.length : courses.filter((c) => c.status === f).length}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); }}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Course
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-5">Add a Course</h3>
          <CourseForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel={loading ? "Adding..." : "Add Course"} />
        </div>
      )}

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">No courses yet</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Add your first course to start tracking your progress.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {filtered.map((course) => (
            <div key={course.id} className="bg-white dark:bg-zinc-900/80">
              {editingId === course.id ? (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-5">Edit Course</h3>
                  <CourseForm
                    initialData={{ course_code: course.course_code, course_title: course.course_title, units: course.units, grade: course.grade ?? "", term: course.term ?? "", status: course.status, notes: course.notes ?? "" }}
                    onSubmit={(data) => handleUpdate(course.id, data)}
                    onCancel={() => setEditingId(null)}
                    submitLabel={loading ? "Saving..." : "Save Changes"}
                  />
                </div>
              ) : (
                <div className="px-5 py-4 flex items-center justify-between gap-4 group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {STATUS_ICONS[course.status]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">{course.course_code}</span>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{STATUS_LABELS[course.status]}</span>
                        {course.grade && (
                          <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">{course.grade}</span>
                        )}
                      </div>
                      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{course.course_title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{course.units} units</span>
                        {course.term && (
                          <>
                            <span className="text-zinc-200 dark:text-zinc-700">·</span>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{course.term}</span>
                          </>
                        )}
                        {course.notes && (
                          <>
                            <span className="text-zinc-200 dark:text-zinc-700">·</span>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 italic truncate">{course.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => { setEditingId(course.id); setShowAdd(false); }}
                      className="cursor-pointer p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="cursor-pointer p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
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
