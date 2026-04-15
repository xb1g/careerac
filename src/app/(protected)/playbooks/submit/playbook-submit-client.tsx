"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface BasicInfo {
  ccInstitutionId: string;
  targetInstitutionId: string;
  targetMajor: string;
  transferYear: string;
}

interface CourseEntry {
  courseCode: string;
  title: string;
  units: string;
  grade?: string;
  note?: string;
}

interface SemesterEntry {
  number: number;
  courses: CourseEntry[];
}

interface FailureEventEntry {
  courseCode: string;
  failureType: "failed" | "cancelled" | "waitlisted";
  reason: string;
  resolution: string;
  lessonsLearned: string;
}

interface PlaybookFormData {
  basicInfo: BasicInfo;
  semesters: SemesterEntry[];
  failureEvents: FailureEventEntry[];
  outcome: "transferred" | "in_progress" | "changed_direction";
}

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Basic Info", "Courses", "Failures", "Outcome"];

function validateBasicInfo(info: BasicInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!info.ccInstitutionId) errors.ccInstitutionId = "Community college is required";
  if (!info.targetInstitutionId) errors.targetInstitutionId = "Target school is required";
  if (!info.targetMajor.trim()) errors.targetMajor = "Major is required";
  if (!info.transferYear) errors.transferYear = "Transfer year is required";
  return errors;
}

export default function PlaybookSubmitClient({ institutions: initialInstitutions }: { institutions: { ccs: { id: string; name: string; abbreviation: string | null }[]; universities: { id: string; name: string; abbreviation: string | null }[] } }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdPlaybookId, setCreatedPlaybookId] = useState<string | null>(null);

  const [formData, setFormData] = useState<PlaybookFormData>({
    basicInfo: {
      ccInstitutionId: "",
      targetInstitutionId: "",
      targetMajor: "",
      transferYear: "",
    },
    semesters: [
      { number: 1, courses: [{ courseCode: "", title: "", units: "" }] },
    ],
    failureEvents: [],
    outcome: "transferred",
  });

  const [basicInfoErrors, setBasicInfoErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const updateBasicInfo = useCallback((field: keyof BasicInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));
    setTouchedFields((prev) => new Set(prev).add(field));
    // Clear error when user types
    if (basicInfoErrors[field]) {
      setBasicInfoErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [basicInfoErrors]);

  const canProceed = useCallback((): boolean => {
    if (currentStep === 0) {
      const errors = validateBasicInfo(formData.basicInfo);
      setBasicInfoErrors(errors);
      setTouchedFields(new Set(["ccInstitutionId", "targetInstitutionId", "targetMajor", "transferYear"]));
      return Object.keys(errors).length === 0;
    }
    return true;
  }, [currentStep, formData.basicInfo]);

  const handleNext = useCallback(() => {
    if (canProceed()) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    }
  }, [canProceed]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const addSemester = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      semesters: [
        ...prev.semesters,
        {
          number: prev.semesters.length + 1,
          courses: [{ courseCode: "", title: "", units: "" }],
        },
      ],
    }));
  }, []);

  const removeSemester = useCallback((index: number) => {
    setFormData((prev) => {
      if (prev.semesters.length <= 1) return prev;
      const newSemesters = prev.semesters.filter((_, i) => i !== index);
      return {
        ...prev,
        semesters: newSemesters.map((s, i) => ({ ...s, number: i + 1 })),
      };
    });
  }, []);

  const updateCourse = useCallback((semesterIdx: number, courseIdx: number, field: keyof CourseEntry, value: string) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters];
      const newCourses = [...newSemesters[semesterIdx].courses];
      newCourses[courseIdx] = { ...newCourses[courseIdx], [field]: value };
      newSemesters[semesterIdx] = { ...newSemesters[semesterIdx], courses: newCourses };
      return { ...prev, semesters: newSemesters };
    });
  }, []);

  const addCourse = useCallback((semesterIdx: number) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters];
      newSemesters[semesterIdx] = {
        ...newSemesters[semesterIdx],
        courses: [...newSemesters[semesterIdx].courses, { courseCode: "", title: "", units: "" }],
      };
      return { ...prev, semesters: newSemesters };
    });
  }, []);

  const removeCourse = useCallback((semesterIdx: number, courseIdx: number) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters];
      const courses = newSemesters[semesterIdx].courses;
      if (courses.length <= 1) return prev;
      newSemesters[semesterIdx] = {
        ...newSemesters[semesterIdx],
        courses: courses.filter((_, i) => i !== courseIdx),
      };
      return { ...prev, semesters: newSemesters };
    });
  }, []);

  const addFailureEvent = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      failureEvents: [
        ...prev.failureEvents,
        { courseCode: "", failureType: "failed", reason: "", resolution: "", lessonsLearned: "" },
      ],
    }));
  }, []);

  const removeFailureEvent = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      failureEvents: prev.failureEvents.filter((_, i) => i !== index),
    }));
  }, []);

  const updateFailureEvent = useCallback((index: number, field: keyof FailureEventEntry, value: string) => {
    setFormData((prev) => {
      const newEvents = [...prev.failureEvents];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return { ...prev, failureEvents: newEvents };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Build the playbook_data JSONB
      const playbookData = {
        semesters: formData.semesters.map((sem) => ({
          number: sem.number,
          courses: sem.courses
            .filter((c) => c.courseCode.trim())
            .map((c) => ({
              course_code: c.courseCode.trim(),
              title: c.title.trim(),
              units: parseFloat(c.units) || 0,
              grade: c.grade?.trim() || undefined,
              note: c.note?.trim() || undefined,
            })),
        })),
        failure_events: formData.failureEvents
          .filter((e) => e.courseCode.trim())
          .map((e) => ({
            course_code: e.courseCode.trim(),
            failure_type: e.failureType,
            reason: e.reason.trim() || undefined,
            resolution: e.resolution.trim() || undefined,
            lessons_learned: e.lessonsLearned.trim() || undefined,
          })),
      };

      const response = await fetch("/api/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ccInstitutionId: formData.basicInfo.ccInstitutionId,
          targetInstitutionId: formData.basicInfo.targetInstitutionId,
          targetMajor: formData.basicInfo.targetMajor.trim(),
          transferYear: parseInt(formData.basicInfo.transferYear, 10),
          outcome: formData.outcome,
          playbookData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create playbook");
      }

      const data = await response.json();
      setCreatedPlaybookId(data.id);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Success state
  if (createdPlaybookId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            Playbook Submitted!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Thank you for sharing your transfer story. Your playbook has been submitted and is awaiting verification.
          </p>

          {/* Pending verification indicator */}
          <div
            className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-900/30 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20 mb-8"
            data-testid="pending-verification-badge"
          >
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Pending Verification
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/playbooks/${createdPlaybookId}`}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
              data-testid="view-playbook-link"
            >
              View Your Playbook
            </Link>
            <Link
              href="/playbooks"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Browse Playbooks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/playbooks"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Playbooks
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Share Your Transfer Story
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Help future students by documenting your community college transfer journey.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, index) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? "bg-blue-600 text-white"
                      : index === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                  }`}
                  data-testid={`step-indicator-${index}`}
                >
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-1 text-xs hidden sm:block ${
                    index <= currentStep ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 sm:p-8">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div data-testid="step-basic-info">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Basic Information</h2>
            <div className="space-y-5">
              {/* Community College */}
              <div>
                <label htmlFor="cc" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Community College <span className="text-red-500">*</span>
                </label>
                <select
                  id="cc"
                  value={formData.basicInfo.ccInstitutionId}
                  onChange={(e) => updateBasicInfo("ccInstitutionId", e.target.value)}
                  aria-invalid={!!basicInfoErrors.ccInstitutionId}
                  aria-describedby={basicInfoErrors.ccInstitutionId ? "cc-error" : undefined}
                  className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select your community college</option>
                  {initialInstitutions.ccs.map((cc) => (
                    <option key={cc.id} value={cc.id}>
                      {cc.abbreviation ? `${cc.abbreviation} - ${cc.name}` : cc.name}
                    </option>
                  ))}
                </select>
                {touchedFields.has("ccInstitutionId") && basicInfoErrors.ccInstitutionId && (
                  <p id="cc-error" className="mt-1 text-sm text-red-600" role="alert" data-testid="cc-error">
                    {basicInfoErrors.ccInstitutionId}
                  </p>
                )}
              </div>

              {/* Target School */}
              <div>
                <label htmlFor="target" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Target School <span className="text-red-500">*</span>
                </label>
                <select
                  id="target"
                  value={formData.basicInfo.targetInstitutionId}
                  onChange={(e) => updateBasicInfo("targetInstitutionId", e.target.value)}
                  aria-invalid={!!basicInfoErrors.targetInstitutionId}
                  aria-describedby={basicInfoErrors.targetInstitutionId ? "target-error" : undefined}
                  className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select target school</option>
                  {initialInstitutions.universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.abbreviation ? `${uni.abbreviation} - ${uni.name}` : uni.name}
                    </option>
                  ))}
                </select>
                {touchedFields.has("targetInstitutionId") && basicInfoErrors.targetInstitutionId && (
                  <p id="target-error" className="mt-1 text-sm text-red-600" role="alert" data-testid="target-error">
                    {basicInfoErrors.targetInstitutionId}
                  </p>
                )}
              </div>

              {/* Major */}
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Major <span className="text-red-500">*</span>
                </label>
                <input
                  id="major"
                  type="text"
                  value={formData.basicInfo.targetMajor}
                  onChange={(e) => updateBasicInfo("targetMajor", e.target.value)}
                  placeholder="e.g., Computer Science"
                  aria-invalid={!!basicInfoErrors.targetMajor}
                  aria-describedby={basicInfoErrors.targetMajor ? "major-error" : undefined}
                  className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {touchedFields.has("targetMajor") && basicInfoErrors.targetMajor && (
                  <p id="major-error" className="mt-1 text-sm text-red-600" role="alert" data-testid="major-error">
                    {basicInfoErrors.targetMajor}
                  </p>
                )}
              </div>

              {/* Transfer Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Transfer Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  min="2000"
                  max="2035"
                  value={formData.basicInfo.transferYear}
                  onChange={(e) => updateBasicInfo("transferYear", e.target.value)}
                  placeholder="e.g., 2024"
                  aria-invalid={!!basicInfoErrors.transferYear}
                  aria-describedby={basicInfoErrors.transferYear ? "year-error" : undefined}
                  className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {touchedFields.has("transferYear") && basicInfoErrors.transferYear && (
                  <p id="year-error" className="mt-1 text-sm text-red-600" role="alert" data-testid="year-error">
                    {basicInfoErrors.transferYear}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Semester-by-Semester Courses */}
        {currentStep === 1 && (
          <div data-testid="step-courses">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Semester-by-Semester Courses</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              List the courses you took each semester. Add semesters as needed.
            </p>

            <div className="space-y-6">
              {formData.semesters.map((semester, semIdx) => (
                <div key={semIdx} className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden" data-testid="semester">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900 dark:text-white">
                      Semester {semester.number}
                    </h3>
                    {formData.semesters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSemester(semIdx)}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {semester.courses.map((course, courseIdx) => (
                      <div key={courseIdx} className="grid grid-cols-12 gap-2">
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Course code"
                            value={course.courseCode}
                            onChange={(e) => updateCourse(semIdx, courseIdx, "courseCode", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Course title"
                            value={course.title}
                            onChange={(e) => updateCourse(semIdx, courseIdx, "title", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Units"
                            value={course.units}
                            onChange={(e) => updateCourse(semIdx, courseIdx, "units", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Grade"
                            value={course.grade || ""}
                            onChange={(e) => updateCourse(semIdx, courseIdx, "grade", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 py-1.5 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          {semester.courses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCourse(semIdx, courseIdx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              aria-label="Remove course"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addCourse(semIdx)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Course
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSemester}
                className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Semester
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Failure Events */}
        {currentStep === 2 && (
          <div data-testid="step-failures">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Challenges & Recovery</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Optional: Share any courses you failed, that were cancelled, or where you were waitlisted. This helps future students prepare.
            </p>

            {formData.failureEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">No challenges to report? That&apos;s great!</p>
                <button
                  type="button"
                  onClick={addFailureEvent}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add a Challenge
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.failureEvents.map((event, idx) => (
                  <div key={idx} className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-zinc-900 dark:text-white">Challenge #{idx + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeFailureEvent(idx)}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`failure-course-${idx}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          Course Code
                        </label>
                        <input
                          id={`failure-course-${idx}`}
                          type="text"
                          value={event.courseCode}
                          onChange={(e) => updateFailureEvent(idx, "courseCode", e.target.value)}
                          placeholder="e.g., MATH 101"
                          className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`failure-type-${idx}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          Type
                        </label>
                        <select
                          id={`failure-type-${idx}`}
                          value={event.failureType}
                          onChange={(e) => updateFailureEvent(idx, "failureType", e.target.value)}
                          className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="waitlisted">Waitlisted</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`failure-reason-${idx}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Reason (optional)
                      </label>
                      <input
                        id={`failure-reason-${idx}`}
                        type="text"
                        value={event.reason}
                        onChange={(e) => updateFailureEvent(idx, "reason", e.target.value)}
                        placeholder="Why did this happen?"
                        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`failure-resolution-${idx}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        How did you resolve it?
                      </label>
                      <textarea
                        id={`failure-resolution-${idx}`}
                        value={event.resolution}
                        onChange={(e) => updateFailureEvent(idx, "resolution", e.target.value)}
                        placeholder="What did you do to overcome this challenge?"
                        rows={2}
                        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`failure-lessons-${idx}`} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Lessons Learned (optional)
                      </label>
                      <textarea
                        id={`failure-lessons-${idx}`}
                        value={event.lessonsLearned}
                        onChange={(e) => updateFailureEvent(idx, "lessonsLearned", e.target.value)}
                        placeholder="What would you tell future students?"
                        rows={2}
                        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFailureEvent}
                  className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Another Challenge
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Outcome */}
        {currentStep === 3 && (
          <div data-testid="step-outcome">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Outcome</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              What was the outcome of your transfer journey?
            </p>

            <div className="space-y-3">
              {[
                {
                  value: "transferred" as const,
                  label: "Successfully Transferred",
                  description: "I completed my transfer to the target school",
                },
                {
                  value: "in_progress" as const,
                  label: "In Progress",
                  description: "I'm still working toward my transfer",
                },
                {
                  value: "changed_direction" as const,
                  label: "Changed Direction",
                  description: "I ended up pursuing a different path",
                },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.outcome === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, outcome: option.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFormData((prev) => ({ ...prev, outcome: option.value }));
                    }
                  }}
                  role="radio"
                  aria-checked={formData.outcome === option.value}
                  tabIndex={0}
                >
                  <input
                    id={`outcome-${option.value}`}
                    type="radio"
                    name="outcome"
                    value={option.value}
                    checked={formData.outcome === option.value}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, outcome: e.target.value as PlaybookFormData["outcome"] }))
                    }
                    className="mt-1 h-4 w-4 text-blue-600 border-zinc-300 focus:ring-blue-500"
                  />
                  <label htmlFor={`outcome-${option.value}`} className="cursor-pointer">
                    <span className="font-medium text-zinc-900 dark:text-white">{option.label}</span>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{option.description}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Server error */}
        {submitError && (
          <div className="mt-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800" role="alert" data-testid="submit-error">
            {submitError}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          {currentStep < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors cursor-pointer"
              data-testid="next-step-button"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              data-testid="submit-button"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Submit Playbook
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
