"use client";

import { useState, useCallback } from "react";
import { useChat, UIMessage } from "@ai-sdk/react";
import Chat from "@/components/chat";
import SemesterPlan from "@/components/semester-plan";
import CourseStatusMenu from "@/components/course-status-menu";
import { ParsedPlan, TransferPlan, PlanCourse, CourseStatus } from "@/types/plan";
import { createClient } from "@/utils/supabase/client";

interface PlanDetailClientProps {
  plan: {
    id: string;
    title: string;
    target_major: string;
    plan_data: unknown;
    chat_history: unknown[];
  };
}

export default function PlanDetailClient({ plan }: PlanDetailClientProps) {
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
  } | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { messages, status } = useChat({
    messages: initialMessages,
  });

  const isLoading = status === "submitted" || status === "streaming";

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

  // Handle status selection - updates both UI and database
  const handleStatusSelect = useCallback(async (newStatus: CourseStatus) => {
    if (!selectedCourse) return;

    const { course } = selectedCourse;

    // Update local state immediately for responsive UI
    setCurrentPlan((prev) => {
      if (!prev || "isNoData" in prev) return prev;

      const updatedPlan = { ...prev };
      updatedPlan.semesters = prev.semesters.map((semester) => {
        if (semester.number !== course.semesterNumber) return semester;

        const updatedCourses = semester.courses.map((c) => {
          if (c.code === course.code && c.title === course.title) {
            return { ...c, status: newStatus };
          }
          return c;
        });

        return { ...semester, courses: updatedCourses };
      });

      return updatedPlan;
    });

    // Persist to database
    try {
      const response = await fetch(`/api/plan/${plan.id}/course-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: course.code,
          semesterNumber: course.semesterNumber,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update course status:", response.statusText);
        // Revert local state on failure
        setCurrentPlan((prev) => {
          if (!prev || "isNoData" in prev) return prev;
          const updatedPlan = { ...prev };
          updatedPlan.semesters = prev.semesters.map((semester) => {
            if (semester.number !== course.semesterNumber) return semester;
            const updatedCourses = semester.courses.map((c) => {
              if (c.code === course.code && c.title === course.title) {
                return { ...c, status: course.status || "planned" };
              }
              return c;
            });
            return { ...semester, courses: updatedCourses };
          });
          return updatedPlan;
        });
      }

      // Save the updated plan_data to persist the status changes
      if (currentPlan && !("isNoData" in currentPlan)) {
        await handleSavePlan(currentPlan, messages);
      }
    } catch (err) {
      console.error("Error updating course status:", err);
    }

    setSelectedCourse(null);
  }, [selectedCourse, plan.id, currentPlan, messages, handleSavePlan]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {plan.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {plan.target_major}
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </div>

      {/* Split layout: chat panel (left) + plan display (right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="w-full lg:w-1/2 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Chat
            onPlanGenerated={handlePlanGenerated}
            onSavePlan={handleSavePlan}
          />
        </div>

        {/* Plan display area */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-zinc-50 dark:bg-zinc-900">
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
