"use client";

import { useState, useCallback, useRef } from "react";
import { UIMessage } from "@ai-sdk/react";
import Chat, { RecoveryContext } from "@/components/chat";
import ComparisonDashboard from "@/components/comparison-dashboard";
import { RecoveryAlternative } from "@/components/recovery-message";
import SemesterPlan from "@/components/semester-plan";
import CourseStatusMenu from "@/components/course-status-menu";
import { notifyCockpitRefresh } from "@/lib/cockpit-events";
import TranscriptEditor from "@/components/transcript-editor";
import { ParsedPlan, TransferPlan, PlanCourse, CourseStatus } from "@/types/plan";
import { TranscriptData } from "@/types/transcript";
import { createClient } from "@/utils/supabase/client";

interface PlanDetailClientProps {
  plan: {
    id: string;
    title: string;
    target_major: string;
    plan_data: unknown;
    chat_history: unknown[];
  };
  transcript: {
    id: string;
    file_name: string;
    parsed_data: TranscriptData;
    parse_status: string;
  } | null;
}

export default function PlanDetailClient({ plan, transcript }: PlanDetailClientProps) {
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
  const transcriptData = transcriptEditorData;
  const latestMessagesRef = useRef<UIMessage[]>(initialMessages);
  const [isChatLoading, setIsChatLoading] = useState(false);

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
      if (currentPlan && !("isNoData" in currentPlan) && !("isMultiUniversity" in currentPlan)) {
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
      if (!prev || "isNoData" in prev || "isMultiUniversity" in prev) return null;
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
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-6 lg:px-8 py-4 lg:py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl relative z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              {plan.title}
              {isChatLoading && (
                <div className="inline-flex w-4 h-4 ml-2 border-[2.5px] border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
              )}
            </h1>
            <p className="mt-1 text-[15px] font-medium text-zinc-500 dark:text-zinc-400">
              {plan.target_major}
            </p>
          </div>
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

      <ComparisonDashboard planId={plan.id} />

      {/* Split layout: chat panel (left) + plan display (right) */}
      <div className="flex flex-1 overflow-hidden bg-[#FAFAFA] dark:bg-zinc-950">
        {/* Chat panel */}
        <div className="w-full lg:w-1/2 border-r border-zinc-200/50 dark:border-zinc-800/50 z-10 relative">
          <Chat
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
          />
        </div>

        {/* Plan display area */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-[#FAFAFA] dark:bg-zinc-900/50 relative">
          {currentPlan ? (
            <SemesterPlan plan={currentPlan} onCourseClick={handleCourseClick} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
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
      </div>

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
