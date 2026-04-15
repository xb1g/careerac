"use client";

import { useState, useRef, useCallback } from "react";
import type { TranscriptData, TranscriptCourse } from "@/types/transcript";

interface TranscriptUploadProps {
  onTranscriptParsed: (data: TranscriptData, transcriptId: string) => void;
  onSkip: () => void;
}

export default function TranscriptUpload({ onTranscriptParsed, onSkip }: TranscriptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<TranscriptData | null>(null);
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);

    if (!file.type.includes("pdf")) {
      setError("Please upload a PDF file.");
      setIsUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcript/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setIsUploading(false);
        return;
      }

      if (data.parseStatus === "failed") {
        setError(data.parseError || "Could not parse transcript.");
        setShowManualEntry(true);
        setIsUploading(false);
        return;
      }

      setParsedData(data.parsedData);
      setTranscriptId(data.id);
    } catch {
      setError("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);

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

  // Manual entry state
  const [manualCourse, setManualCourse] = useState({ code: "", title: "", units: "", grade: "", semester: "" });
  const [manualCourses, setManualCourses] = useState<TranscriptCourse[]>([]);
  const [manualInstitution, setManualInstitution] = useState("");

  const handleAddManualCourse = () => {
    if (!manualCourse.code || !manualCourse.title || !manualCourse.units || !manualCourse.grade) return;

    const grade = manualCourse.grade.toUpperCase();
    const status: TranscriptCourse["status"] =
      grade === "IP" || grade === "I" ? "in_progress" :
      grade === "W" || grade === "EW" ? "withdrawn" : "completed";

    setManualCourses((prev) => [
      ...prev,
      {
        code: manualCourse.code.toUpperCase(),
        title: manualCourse.title,
        units: parseFloat(manualCourse.units),
        grade,
        status,
        semester: manualCourse.semester || "Unknown",
      },
    ]);
    setManualCourse({ code: "", title: "", units: "", grade: "", semester: "" });
  };

  const handleConfirmManual = () => {
    if (manualCourses.length === 0 || isSavingManual) return;

    const data: TranscriptData = {
      institution: manualInstitution || "Unknown Institution",
      courses: manualCourses,
      totalUnitsCompleted: manualCourses.filter((c) => c.status === "completed").reduce((s, c) => s + c.units, 0),
      totalUnitsInProgress: manualCourses.filter((c) => c.status === "in_progress").reduce((s, c) => s + c.units, 0),
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
        setError(err instanceof Error ? err.message : "Failed to save manual transcript.");
      } finally {
        setIsSavingManual(false);
      }
    })();
  };

  if (showManualEntry || (!parsedData && showManualEntry)) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Enter Your Courses</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your completed and in-progress courses manually.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="institution-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Institution Name
          </label>
          <input
            id="institution-name"
            type="text"
            value={manualInstitution}
            onChange={(e) => setManualInstitution(e.target.value)}
            placeholder="e.g., De Anza College"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={manualCourse.code}
            onChange={(e) => setManualCourse((p) => ({ ...p, code: e.target.value }))}
            placeholder="Code (CS 1)"
            className="w-full sm:w-24 xl:w-28 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="text"
            value={manualCourse.title}
            onChange={(e) => setManualCourse((p) => ({ ...p, title: e.target.value }))}
            placeholder="Course Title"
            className="w-full sm:flex-1 min-w-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="number"
            value={manualCourse.units}
            onChange={(e) => setManualCourse((p) => ({ ...p, units: e.target.value }))}
            placeholder="Units"
            className="w-full sm:w-24 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="text"
            value={manualCourse.grade}
            onChange={(e) => setManualCourse((p) => ({ ...p, grade: e.target.value }))}
            placeholder="Grade"
            className="w-full sm:w-24 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="text"
            value={manualCourse.semester}
            onChange={(e) => setManualCourse((p) => ({ ...p, semester: e.target.value }))}
            placeholder="Semester"
            className="w-full sm:w-32 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            onClick={handleAddManualCourse}
            disabled={!manualCourse.code || !manualCourse.title || !manualCourse.units || !manualCourse.grade}
            className="w-full sm:w-auto shrink-0 whitespace-nowrap rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Course
          </button>
        </div>

        {manualCourses.length > 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Code</th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Title</th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Units</th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Grade</th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Semester</th>
                  <th className="px-3 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {manualCourses.map((course, i) => (
                  <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100">{course.code}</td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{course.title}</td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{course.units}</td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{course.grade}</td>
                    <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">{course.semester}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setManualCourses((prev) => prev.filter((_, idx) => idx !== i))}
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

        <div className="flex gap-3">
          <button
            onClick={handleConfirmManual}
            disabled={manualCourses.length === 0 || isSavingManual}
            className="rounded-lg bg-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSavingManual
              ? "Saving..."
              : `Continue with ${manualCourses.length} course${manualCourses.length !== 1 ? "s" : ""}`}
          </button>
          <button
            onClick={onSkip}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  if (parsedData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Review Your Transcript</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            We found {parsedData.courses.length} courses from {parsedData.institution}. Remove any that were parsed incorrectly.
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2">
            <span className="font-medium text-green-800 dark:text-green-200">{parsedData.totalUnitsCompleted}</span>
            <span className="text-green-600 dark:text-green-400 ml-1">units completed</span>
          </div>
          {parsedData.totalUnitsInProgress > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2">
              <span className="font-medium text-blue-800 dark:text-blue-200">{parsedData.totalUnitsInProgress}</span>
              <span className="text-blue-600 dark:text-blue-400 ml-1">units in progress</span>
            </div>
          )}
          {parsedData.gpa !== undefined && (
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 px-4 py-2">
              <span className="font-medium text-purple-800 dark:text-purple-200">{parsedData.gpa}</span>
              <span className="text-purple-600 dark:text-purple-400 ml-1">GPA</span>
            </div>
          )}
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Code</th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Title</th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Units</th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Grade</th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Semester</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {parsedData.courses.map((course, i) => (
                <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100">{course.code}</td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{course.title}</td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{course.units}</td>
                  <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">{course.grade}</td>
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
                      {course.status === "in_progress" ? "In Progress" : course.status === "completed" ? "Completed" : "Withdrawn"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">{course.semester}</td>
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

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="rounded-lg bg-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Looks Good, Continue
          </button>
          <button
            onClick={() => { setParsedData(null); setTranscriptId(null); }}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Upload Different File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Upload Your Transcript</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload your unofficial transcript as a PDF so we can see what courses you&apos;ve already taken.
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
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Uploading and parsing transcript...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
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
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Enter Courses Manually
        </button>
        <button
          onClick={onSkip}
          className="rounded-lg text-zinc-500 dark:text-zinc-400 px-6 py-2.5 text-sm font-medium hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Skip This Step
        </button>
      </div>
    </div>
  );
}
