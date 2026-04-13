"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/components/chat";
import SemesterPlan from "@/components/semester-plan";
import TranscriptUpload from "@/components/transcript-upload";
import PlanConfig, { type PlanConfiguration } from "@/components/plan-config";
import { ParsedPlan, TransferPlan, MultiUniversityPlan } from "@/types/plan";
import type { TranscriptData } from "@/types/transcript";

type WizardStep = "upload" | "config" | "chat";

export default function NewPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("upload");
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const [planConfig, setPlanConfig] = useState<PlanConfiguration | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ParsedPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      isSavingRef.current = false;
    };
  }, []);

  const handleTranscriptParsed = useCallback((data: TranscriptData, id: string) => {
    setTranscriptData(data);
    setTranscriptId(id || null);
    setStep("config");
  }, []);

  const handleSkipTranscript = useCallback(() => {
    setStep("config");
  }, []);

  const handleConfigured = useCallback((config: PlanConfiguration) => {
    setPlanConfig(config);
    setStep("chat");
  }, []);

  const handleBackToUpload = useCallback(() => {
    setStep("upload");
  }, []);

  const savePlan = useCallback(async (plan: ParsedPlan, messages: unknown[]): Promise<string | null> => {
    if ("isNoData" in plan && plan.isNoData) {
      return null;
    }

    let title: string;
    let targetMajor: string;

    if ("isMultiUniversity" in plan && plan.isMultiUniversity) {
      const multiPlan = plan as MultiUniversityPlan;
      title = `${multiPlan.studentCC} → Multiple Universities (${multiPlan.major})`;
      targetMajor = multiPlan.major;
    } else {
      const transferPlan = plan as TransferPlan;
      title = `${transferPlan.ccName} → ${transferPlan.targetUniversity}`;
      targetMajor = transferPlan.targetMajor;
    }

    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          target_major: targetMajor,
          plan_data: JSON.parse(JSON.stringify(plan)),
          chat_history: JSON.parse(JSON.stringify(messages)),
          max_credits_per_semester: planConfig?.maxCreditsPerSemester || null,
          transcript_id: transcriptId || null,
          has_target_school: planConfig?.hasTargetSchool ?? true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[savePlan] API error:", response.status, errorData);
        return null;
      }

      const data = await response.json();
      return data.id;
    } catch (err) {
      console.error("[savePlan] Exception during save:", err);
      return null;
    }
  }, [planConfig, transcriptId]);

  const debouncedSave = useCallback((plan: ParsedPlan, messages: unknown[]) => {
    if (isSavingRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    setSaveError(null);

    saveTimeoutRef.current = setTimeout(async () => {
      isSavingRef.current = true;
      const planId = await savePlan(plan, messages);
      isSavingRef.current = false;
      setIsSaving(false);
      if (planId) {
        setSavedPlanId(planId);
        router.replace(`/plan/${planId}`);
      } else {
        if (!("isNoData" in plan)) {
          setSaveError("Failed to save plan. Please try again.");
        }
      }
    }, 800);
  }, [savePlan, router]);

  const handlePlanGenerated = useCallback((plan: ParsedPlan) => {
    setCurrentPlan(plan);
  }, []);

  // Build welcome message based on context
  const welcomeMessage = transcriptData
    ? `I see you've taken ${transcriptData.courses.length} courses at ${transcriptData.institution} with ${transcriptData.totalUnitsCompleted} completed units${transcriptData.gpa ? ` (GPA: ${transcriptData.gpa})` : ""}. ${
        planConfig?.hasTargetSchool
          ? `Let me help you plan your transfer to ${planConfig.targetSchool} for ${planConfig.major}.`
          : `Let me analyze your coursework and find the best university matches for ${planConfig?.major || "your major"}.`
      }`
    : planConfig?.hasTargetSchool
    ? `Tell me about your community college and I'll help you plan your transfer to ${planConfig.targetSchool} for ${planConfig.major}.`
    : `I'll analyze the available transfer paths and find the best university matches for ${planConfig?.major || "your major"}. Tell me about your community college to get started.`;

  // Step indicator
  const steps = [
    { key: "upload", label: "Transcript" },
    { key: "config", label: "Settings" },
    { key: "chat", label: "Plan" },
  ] as const;

  if (step === "chat") {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Create a New Plan
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {planConfig?.hasTargetSchool
                  ? `${planConfig.major} → ${planConfig.targetSchool} | Max ${planConfig.maxCreditsPerSemester} units/semester`
                  : `${planConfig?.major} → Best Fit | Max ${planConfig?.maxCreditsPerSemester} units/semester`}
              </p>
            </div>
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}
            {saveError && (
              <div className="text-sm text-red-600 dark:text-red-400">{saveError}</div>
            )}
            {savedPlanId && !isSaving && (
              <div className="text-sm text-green-600 dark:text-green-400">Plan saved</div>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-full lg:w-1/2 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <Chat
              welcomeMessage={welcomeMessage}
              onPlanGenerated={handlePlanGenerated}
              onSavePlan={debouncedSave}
              transcriptData={transcriptData ?? undefined}
              maxCreditsPerSemester={planConfig?.maxCreditsPerSemester}
              hasTargetSchool={planConfig?.hasTargetSchool}
            />
          </div>

          <div className="hidden lg:flex lg:w-1/2 flex-col bg-zinc-50 dark:bg-zinc-900">
            {currentPlan ? (
              <SemesterPlan plan={currentPlan} />
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-white">
                    Your plan will appear here
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                    {planConfig?.hasTargetSchool
                      ? "The AI is generating your semester-by-semester transfer plan."
                      : "The AI will analyze your coursework and show transfer options for multiple universities."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                  s.key === step
                    ? "bg-blue-600 text-white"
                    : steps.findIndex((x) => x.key === step) > i
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {steps.findIndex((x) => x.key === step) > i ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm ${
                  s.key === step
                    ? "font-medium text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
              )}
            </div>
          ))}
        </div>

        {step === "upload" && (
          <TranscriptUpload
            onTranscriptParsed={handleTranscriptParsed}
            onSkip={handleSkipTranscript}
          />
        )}

        {step === "config" && (
          <PlanConfig
            transcriptData={transcriptData}
            onConfigured={handleConfigured}
            onBack={handleBackToUpload}
          />
        )}
      </div>
    </div>
  );
}
