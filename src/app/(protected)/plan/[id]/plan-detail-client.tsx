"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UIMessage } from "@ai-sdk/react";
import { RecoveryContext } from "@/components/chat";
import ChatWidget from "@/components/chat-widget";
import ComparisonDashboard from "@/components/comparison-dashboard";
import { DeletePlanButton } from "@/components/delete-plan-button";
import { RecoveryAlternative } from "@/components/recovery-message";
import SemesterPlan from "@/components/semester-plan";
import CourseStatusMenu from "@/components/course-status-menu";
import PreviousCoursesPanel from "@/components/previous-courses-panel";
import { notifyCockpitRefresh } from "@/lib/cockpit-events";
import TranscriptEditor from "@/components/transcript-editor";
import { ParsedPlan, TransferPlan, PlanCourse, CourseStatus } from "@/types/plan";
import type { Json } from "@/types/database";
import { TranscriptData } from "@/types/transcript";
import { shouldShowComparisonSection } from "@/utils/comparison-visibility";
import { createClient } from "@/utils/supabase/client";

interface Institution {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface PlanDetailClientProps {
  plan: {
    id: string;
    title: string;
    target_institution_id: string | null;
    target_major: string;
    comparison_targets: Json | null;
    plan_data: unknown;
    chat_history: unknown[];
  };
  transcript: {
    id: string;
    file_name: string;
    parsed_data: TranscriptData;
    parse_status: string;
  } | null;
  userCourses?: Array<{ course_code: string; course_title: string; units: number; grade: string | null; term: string | null; status: string }>;
}

function getSchoolFitLabel(rank: number, schoolCount: number, fitScore?: number) {
  if (schoolCount <= 1) return "Target school";
  if (rank === 0) return "Best fit";
  if (typeof fitScore !== "number") return "Matched";
  if (fitScore >= 85) return "Strong fit";
  if (fitScore >= 70) return "Good fit";
  return "Matched";
}

export default function PlanDetailClient({ plan, transcript, userCourses }: PlanDetailClientProps) {
  const searchParams = useSearchParams();
  const resolveRisk = searchParams?.get("resolveRisk") ?? undefined;

  const showComparisonSection = shouldShowComparisonSection({
    target_institution_id: plan.target_institution_id,
    comparison_targets: plan.comparison_targets,
  });

  // Initialize chat history from saved plan
  const initialMessages: UIMessage[] = (() => {
    if (plan.chat_history && Array.isArray(plan.chat_history) && plan.chat_history.length > 0) {
      return plan.chat_history as UIMessage[];
    }
    return [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: `Welcome back! I'm working on your transfer plan: ${plan.title}. You can ask me to modify it or answer any questions about your transfer journey.` }],
      } as unknown as UIMessage,
    ];
  })();

  // Initialize currentPlan directly from the prop
  const initialPlanData = plan.plan_data as unknown as ParsedPlan | null;
  const [currentPlan, setCurrentPlan] = useState<ParsedPlan | null>(
    initialPlanData && !("isNoData" in initialPlanData && initialPlanData.isNoData)
      ? initialPlanData
      : null
  );

  // Derive header bits: ccName as the anchor title, covered universities as chips.
  // Falls back to the DB title when no parsed plan is available yet.
  const transferPlan = currentPlan && !("isNoData" in currentPlan && currentPlan.isNoData)
    ? (currentPlan as TransferPlan)
    : null;
  const headerTitle = transferPlan?.ccName || plan.title;
  const headerSchools: Array<{ name: string; fitScore?: number; fitLabel: string }> = transferPlan
    ? (transferPlan.coveredSchools && transferPlan.coveredSchools.length > 0
        ? transferPlan.coveredSchools.map((s, index, schools) => ({
            name: s.name,
            fitScore: s.fitScore,
            fitLabel: getSchoolFitLabel(index, schools.length, s.fitScore),
          }))
        : transferPlan.targetUniversity
          ? [{ name: transferPlan.targetUniversity, fitLabel: "Target school" }]
          : [])
    : [];
  const remainingUnits = transferPlan
    ? transferPlan.semesters.reduce((total, semester) => (
        total + semester.courses.reduce((semesterTotal, course) => (
          course.status === "completed" ? semesterTotal : semesterTotal + course.units
        ), 0)
      ), 0)
    : null;

  // Course status menu state
  const [selectedCourse, setSelectedCourse] = useState<{
    course: PlanCourse & { semesterNumber: number };
    currentStatus: CourseStatus;
    planCourseId?: string;
  } | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  // Recovery state
  const [recoveryContext, setRecoveryContext] = useState<RecoveryContext | null>(null);

  // Transcript editor state
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [transcriptEditorData, setTranscriptEditorData] = useState<TranscriptData | null>(
    transcript?.parsed_data ?? null
  );
  const [isPreviousCoursesCollapsed, setIsPreviousCoursesCollapsed] = useState(false);
  const transcriptData = transcriptEditorData;
  const latestMessagesRef = useRef<UIMessage[]>(initialMessages);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!transcript?.id) return;
    try {
      const stored = localStorage.getItem(`prev-courses-collapsed-${transcript.id}`);
      if (stored === "true") setIsPreviousCoursesCollapsed(true);
    } catch {}
  }, [transcript?.id]);

  // Target school editing state
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [universities, setUniversities] = useState<Institution[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [targetsChanged, setTargetsChanged] = useState(false);
  const [isSavingTargets, setIsSavingTargets] = useState(false);
  const [regeneratePrompt, setRegeneratePrompt] = useState<string | null>(null);

  // Load universities for target editing
  useEffect(() => {
    if (!isEditingTargets) return;
    fetch("/api/institutions")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.universities ?? []);
      })
      .catch(console.error);
  }, [isEditingTargets]);

  // Initialize selected targets from current plan
  useEffect(() => {
    const ids: string[] = [];
    if (plan.target_institution_id) ids.push(plan.target_institution_id);
    const comparison = plan.comparison_targets;
    if (Array.isArray(comparison)) {
      for (const t of comparison) {
        if (t && typeof t === "object" && "institution_id" in t && typeof t.institution_id === "string") {
          if (!ids.includes(t.institution_id)) ids.push(t.institution_id);
        }
      }
    }
    setSelectedTargetIds(ids);
  }, [plan.target_institution_id, plan.comparison_targets]);

  const handleToggleTarget = useCallback((id: string) => {
    setSelectedTargetIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      return next;
    });
    setTargetsChanged(true);
  }, []);

  const handleSaveTargets = useCallback(async () => {
    setIsSavingTargets(true);
    try {
      const primaryId = selectedTargetIds[0] ?? null;
      const comparison_targets = selectedTargetIds.slice(1).map((id, index) => ({
        institution_id: id,
        priority_order: index + 1,
      }));

      const res = await fetch(`/api/plans/${plan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_institution_id: primaryId,
          comparison_targets,
        }),
      });

      if (!res.ok) throw new Error("Failed to update targets");

      // Build school names for the prompt
      const selectedNames = selectedTargetIds
        .map(id => universities.find(u => u.id === id))
        .filter(Boolean)
        .map(u => u!.abbreviation ?? u!.name);

      setIsEditingTargets(false);
      setTargetsChanged(false);
      setRegeneratePrompt(
        `My target schools have changed to: ${selectedNames.join(", ")}. Please regenerate my transfer plan using the updated articulation data for these schools.`
      );
    } catch (err) {
      console.error("Error saving targets:", err);
    } finally {
      setIsSavingTargets(false);
    }
  }, [plan.id, selectedTargetIds]);

  const handleDismissRegenBanner = useCallback(() => {
    setTargetsChanged(false);
  }, []);

  // Save plan to database - called via Chat's onSavePlan callback
  const handleSavePlan = useCallback(async (planData: ParsedPlan, chatMessages: unknown[]) => {
    try {
      const supabase = createClient();
      const transferPlan = planData as TransferPlan;

      const serializableHistory = (chatMessages as UIMessage[]).map((msg) => ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts.map((part) => {
          if (part.type === "text") {
            return { type: "text", text: (part as { text: string }).text };
          }
          return { ...part };
        }),
      }));

      const { error: updateError } = await supabase
        .from("transfer_plans")
        .update({
          plan_data: JSON.parse(JSON.stringify(transferPlan)),
          chat_history: JSON.parse(JSON.stringify(serializableHistory)),
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", plan.id);

      if (updateError) {
        console.error("Error saving plan:", updateError);
      }
    } catch (err) {
      console.error("Error saving plan:", err);
    }
  }, [plan.id]);

  const handlePlanGenerated = useCallback((newPlan: ParsedPlan) => {
    setCurrentPlan(newPlan);
    // Save will be triggered by Chat's onSavePlan callback
  }, []);

  // Handle course click - opens status menu
  const handleCourseClick = useCallback((course: PlanCourse & { semesterNumber: number }, currentStatus: CourseStatus) => {
    setSelectedCourse({ course, currentStatus });
    setIsStatusMenuOpen(true);
  }, []);

  // Handle accepting a recovery alternative
  const handleAcceptAlternative = useCallback(async (alternative: RecoveryAlternative) => {
    if (!selectedCourse) return;

    const { course, planCourseId } = selectedCourse;

    try {
      const response = await fetch(`/api/plan/${plan.id}/accept-alternative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alternative: {
            code: alternative.code,
            title: alternative.title,
            units: alternative.units,
            transferEquivalency: alternative.transferEquivalency,
            prerequisites: [],
          },
          failedCourseCode: course.code,
          failedCourseTitle: course.title,
          semesterNumber: course.semesterNumber,
          planCourseId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to accept alternative:", error);
        return;
      }

      const result = await response.json();
      console.log("Alternative accepted:", result);

      // Update local plan state to reflect the new course
      if (currentPlan && !("isNoData" in currentPlan)) {
        const updatedPlan: TransferPlan = {
          ...currentPlan,
          semesters: currentPlan.semesters.map((semester) => {
            const targetSemester = result.updatedSemester ?? course.semesterNumber;
            if (semester.number === targetSemester) {
              return {
                ...semester,
                courses: [
                  ...semester.courses,
                  {
                    code: alternative.code,
                    title: alternative.title,
                    units: alternative.units,
                    transferEquivalency: alternative.transferEquivalency,
                    prerequisites: [],
                    status: "planned" as const,
                    alternative_for: course.code,
                  },
                ],
              };
            }
            return semester;
          }),
          totalUnits: (currentPlan as TransferPlan).totalUnits + alternative.units,
        };
        setCurrentPlan(updatedPlan);

        // Re-save the plan with the update
        await handleSavePlan(updatedPlan, latestMessagesRef.current);
      }
    } catch (err) {
      console.error("Error accepting alternative:", err);
    }
  }, [selectedCourse, plan.id, currentPlan, handleSavePlan]);

  // Handle status selection - updates both UI and database
  const handleStatusSelect = useCallback(async (newStatus: CourseStatus) => {
    if (!selectedCourse) return;

    const { course, planCourseId } = selectedCourse;

    // Build the updated plan
    const buildUpdatedPlan = (prev: ParsedPlan | null): TransferPlan | null => {
      if (!prev || "isNoData" in prev) return null;
      return {
        ...prev,
        semesters: prev.semesters.map((semester) => {
          if (semester.number !== course.semesterNumber) return semester;
          return {
            ...semester,
            courses: semester.courses.map((c) => {
              if (c.code === course.code && c.title === course.title) {
                return { ...c, status: newStatus };
              }
              return c;
            }),
          };
        }),
      };
    };

    // Update local state immediately for responsive UI
    const updatedPlan = buildUpdatedPlan(currentPlan);
    if (updatedPlan) {
      setCurrentPlan(updatedPlan);
    }

    // Persist to database
    try {
      const response = await fetch(`/api/plan/${plan.id}/course-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: course.code,
          semesterNumber: course.semesterNumber,
          status: newStatus,
          planCourseId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update course status:", response.statusText);
        // Revert local state on failure
        setCurrentPlan(currentPlan);
      } else {
        const result = await response.json();
        notifyCockpitRefresh();

        // Trigger recovery if this is a failure/cancellation/waitlist
        if (result.triggerRecovery && updatedPlan && !("isNoData" in updatedPlan)) {
          setRecoveryContext({
            failedCourseCode: course.code,
            failedCourseTitle: course.title,
            status: newStatus as "failed" | "cancelled" | "waitlisted",
            planData: JSON.parse(JSON.stringify(updatedPlan)),
          });
        }
      }

      // Save the updated plan_data to persist the status changes
      if (updatedPlan) {
        await handleSavePlan(updatedPlan, latestMessagesRef.current);
      }
    } catch (err) {
      console.error("Error updating course status:", err);
    }

    setSelectedCourse(null);
  }, [selectedCourse, plan.id, currentPlan, handleSavePlan]);

  const handleTranscriptSave = useCallback((updatedData: TranscriptData) => {
    setTranscriptEditorData(updatedData);
    setTranscriptExpanded(false);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="px-6 lg:px-8 py-4 lg:py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl relative z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                {headerTitle}
                {isChatLoading && (
                  <div className="inline-flex w-4 h-4 ml-2 border-[2.5px] border-blue-500/30 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
                )}
              </h1>
              <DeletePlanButton planId={plan.id} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {headerSchools.length > 0 && (
                <ul className="flex flex-wrap items-center gap-1.5" data-testid="plan-header-schools">
                  {headerSchools.map((school) => (
                    <li
                      key={school.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedSchool((prev) => prev === school.name ? null : school.name)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedSchool((prev) => prev === school.name ? null : school.name); } }}
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[13px] font-semibold cursor-pointer transition-colors ${
                        selectedSchool === school.name
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 ring-1 ring-blue-300 dark:ring-blue-700"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                      data-testid={`plan-header-school-${school.name}`}
                    >
                      <span>{school.name}</span>
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-700/80 dark:text-zinc-300">
                        {school.fitLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setIsEditingTargets((p) => !p)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-zinc-300 dark:border-zinc-600 px-2.5 py-1 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                data-testid="edit-targets-button"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {isEditingTargets ? "Done" : "Edit targets"}
              </button>
            </div>

            {/* Target editing panel */}
            {isEditingTargets && (
              <div className="mt-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Select target universities (first = primary):
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {universities.map((uni) => {
                    const isSelected = selectedTargetIds.includes(uni.id);
                    return (
                      <button
                        key={uni.id}
                        onClick={() => handleToggleTarget(uni.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {uni.abbreviation ?? uni.name}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={handleSaveTargets}
                    disabled={isSavingTargets}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingTargets ? "Saving..." : "Save targets"}
                  </button>
                  <button
                    onClick={() => setIsEditingTargets(false)}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Regeneration auto-triggered when targets change */}

            {/* School delta panel */}
            {selectedSchool && transferPlan && (() => {
              const school = transferPlan.coveredSchools?.find((s) => s.name === selectedSchool);
              const allCourses = transferPlan.semesters.flatMap((sem) =>
                sem.courses.map((c) => ({ ...c, semesterLabel: sem.label }))
              );
              const forSchool = allCourses.filter(
                (c) => !c.requiredBy || c.requiredBy.length === 0 || c.requiredBy.includes(selectedSchool)
              );
              const completed = forSchool.filter((c) => c.status === "completed");
              const remaining = forSchool.filter((c) => c.status !== "completed");
              const completedUnits = completed.reduce((s, c) => s + c.units, 0);
              const remainingUnits = remaining.reduce((s, c) => s + c.units, 0);

              return (
                <div className="mt-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedSchool} — Transfer Delta
                    </h3>
                    <button onClick={() => setSelectedSchool(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer" aria-label="Close delta panel">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div className="h-2.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${completedUnits + remainingUnits > 0 ? (completedUnits / (completedUnits + remainingUnits)) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                      {completedUnits}/{completedUnits + remainingUnits} units
                    </span>
                    {school && (
                      <span className="text-xs font-medium text-zinc-500">
                        ({school.fitScore}% fit)
                      </span>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Completed */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-2">
                        ✓ Completed ({completed.length})
                      </h4>
                      {completed.length === 0 ? (
                        <p className="text-xs text-zinc-500 italic">No courses completed yet</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {completed.map((c) => (
                            <li key={c.code} className="text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-300 truncate mr-2">
                                  <span className="font-medium">{c.code}</span> {c.title}
                                </span>
                                <span className="text-zinc-400 shrink-0">{c.units}u</span>
                              </div>
                              {c.transferEquivalency && (
                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 pl-1">→ {c.transferEquivalency}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Remaining */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-2">
                        ○ Still Needed ({remaining.length})
                      </h4>
                      {remaining.length === 0 ? (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">All done! 🎉</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {remaining.map((c) => (
                            <li key={c.code} className="text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-600 dark:text-zinc-300 truncate mr-2">
                                  <span className="font-medium">{c.code}</span> {c.title}
                                </span>
                                <span className="text-zinc-400 shrink-0">{c.units}u · {c.semesterLabel}</span>
                              </div>
                              {c.transferEquivalency && (
                                <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5 pl-1">→ {c.transferEquivalency}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <p className="mt-1 text-[15px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
              {plan.target_major}
            </p>
          </div>
          {remainingUnits !== null && (
            <div
              className="flex shrink-0 flex-col items-end rounded-2xl border border-zinc-200/70 bg-zinc-50/80 px-4 py-3 text-right dark:border-zinc-800/80 dark:bg-zinc-900/80"
              data-testid="plan-header-remaining-units"
            >
              <span className="text-3xl font-bold tracking-tighter text-blue-600 dark:text-blue-500">
                {remainingUnits}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Units Left
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Summary */}
      {transcript && transcriptData && (
        <div className="px-6 lg:px-8 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {transcriptData.institution || transcript.file_name}
                </span>
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {transcriptData.courses.length} courses
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {transcriptData.totalUnitsCompleted} units
              </span>
              {transcriptData.gpa && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  GPA: {transcriptData.gpa.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => setTranscriptExpanded((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {transcriptExpanded ? "Hide Editor" : "Edit Transcript"}
            </button>
          </div>

          {transcriptExpanded && transcript && (
            <div className="mt-3">
              <TranscriptEditor
                transcriptId={transcript.id}
                transcriptData={transcriptData ?? undefined}
                onSave={handleTranscriptSave}
                onCancel={() => setTranscriptExpanded(false)}
              />
            </div>
          )}
        </div>
      )}

      {showComparisonSection && <ComparisonDashboard planId={plan.id} />}

      {/* Full-width plan display; chat lives in a floating widget */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#FAFAFA] dark:bg-zinc-900/50">
        {currentPlan ? (
          <div className="flex h-full min-h-0 flex-1 overflow-hidden">
            <PreviousCoursesPanel
              transcriptId={transcript?.id}
              courses={(() => {
                const transcriptCourses = transcriptData?.courses.filter(c => c.status === "completed") ?? [];
                if (!userCourses?.length) return transcriptCourses;
                const existingCodes = new Set(transcriptCourses.map(c => c.code));
                const mapped = userCourses
                  .filter(uc => !existingCodes.has(uc.course_code))
                  .map(uc => ({
                    code: uc.course_code,
                    title: uc.course_title,
                    units: uc.units,
                    grade: uc.grade ?? "",
                    status: (uc.status === "completed" ? "completed" : uc.status === "in_progress" ? "in_progress" : "completed") as "completed" | "in_progress" | "withdrawn",
                    semester: uc.term ?? "My Courses",
                  }));
                return [...transcriptCourses, ...mapped];
              })()}
              isCollapsed={isPreviousCoursesCollapsed}
              onToggleCollapse={() => setIsPreviousCoursesCollapsed(p => !p)}
            />
            <SemesterPlan plan={currentPlan} onCourseClick={handleCourseClick} planId={plan.id} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-zinc-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-white">
                No plan data loaded
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Chat with the AI to generate or modify your transfer plan.
              </p>
            </div>
          </div>
        )}
      </div>

      <ChatWidget
        defaultOpen={true}
        onPlanGenerated={handlePlanGenerated}
        onSavePlan={handleSavePlan}
        initialMessages={initialMessages}
        onMessagesChange={(messages) => {
          latestMessagesRef.current = messages;
        }}
        onLoadingChange={setIsChatLoading}
        recoveryContext={recoveryContext}
        onAcceptAlternative={handleAcceptAlternative}
        planId={plan.id}
        transcriptData={transcriptData ?? undefined}
        resolveRisk={resolveRisk}
        regeneratePrompt={regeneratePrompt}
      />

      {/* Course Status Menu */}
      {selectedCourse && (
        <CourseStatusMenu
          currentStatus={selectedCourse.currentStatus}
          onSelect={handleStatusSelect}
          isOpen={isStatusMenuOpen}
          onClose={() => {
            setIsStatusMenuOpen(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}
