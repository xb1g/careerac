"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import CourseForm, { type CourseFormData } from "./course-form";
import { notifyCockpitRefresh, COCKPIT_REFRESH_EVENT, COCKPIT_REFRESH_STORAGE_KEY } from "@/lib/cockpit-events";

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSummary, setUploadSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshCourses = useCallback(async () => {
    const res = await fetch("/api/user-courses");
    if (res.ok) setCourses(await res.json());
  }, []);

  useEffect(() => {
    const refresh = () => {
      void refreshCourses();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === COCKPIT_REFRESH_STORAGE_KEY) {
        refresh();
      }
    };

    window.addEventListener(COCKPIT_REFRESH_EVENT, refresh);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(COCKPIT_REFRESH_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshCourses]);

  const uploadTranscript = useCallback(async (file: File) => {
    setUploadError(null);
    setUploadSummary(null);

    if (!file.type.includes("pdf")) {
      setUploadError("Please upload a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/transcript/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Upload failed.");
        return;
      }
      if (data.parseStatus === "failed") {
        setUploadError(data.parseError || "Could not parse transcript.");
        return;
      }

      await refreshCourses();
      notifyCockpitRefresh();

      const created = data.sync?.created ?? 0;
      const updated = data.sync?.updated ?? 0;
      setUploadSummary(
        created + updated === 0
          ? "Transcript processed, but no new courses were added."
          : `${created} added, ${updated} updated from your transcript.`,
      );
    } catch {
      setUploadError("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [refreshCourses]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadTranscript(file);
    e.target.value = "";
  };

  const handleUploadClick = () => {
    setUploadError(null);
    setUploadSummary(null);
    fileInputRef.current?.click();
  };

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
      notifyCockpitRefresh();
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
      notifyCockpitRefresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this course?")) return;
    setLoading(true);
    await fetch(`/api/user-courses/${id}`, { method: "DELETE" });
    await refreshCourses();
    notifyCockpitRefresh();
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
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                Upload Transcript
              </>
            )}
          </button>
          <button
            onClick={() => { setShowAdd(true); setEditingId(null); }}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Course
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm text-red-800 dark:text-red-200 flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 cursor-pointer text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {uploadSummary && (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2.5 text-sm text-green-800 dark:text-green-200 flex items-center justify-between">
          <span>{uploadSummary}</span>
          <button
            onClick={() => setUploadSummary(null)}
            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 cursor-pointer text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

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
