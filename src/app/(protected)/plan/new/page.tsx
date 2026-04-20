"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/components/chat";
import SemesterPlan from "@/components/semester-plan";
import TranscriptUpload from "@/components/transcript-upload";
import SavedCoursesSource from "@/components/saved-courses-source";
import PlanConfig, { type PlanConfiguration } from "@/components/plan-config";
import {
  AutoGenerationError,
  AutoGenerationLoading,
  GenerationChoiceScreen,
  MajorConfirmationModal,
  MajorSelectionFallback,
  type GenerationError,
} from "@/components/auto-plan-generation";
import { detectMajorFromTranscript } from "@/lib/major-detector";
import { buildSyntheticUserPrompt } from "@/lib/plan-prompts";
import { ParsedPlan, TransferPlan, MultiUniversityPlan } from "@/types/plan";
import type { TranscriptData } from "@/types/transcript";
import { resolveInstitutionIds } from "@/utils/plan-institutions";

type WizardStep = "upload" | "choice" | "config" | "compare" | "auto-generating" | "chat";

interface PersistedAutoGenerationState {
  step: "auto-generating";
  transcriptData: TranscriptData;
  transcriptId: string | null;
  detectedMajor: string | null;
  detectionConfidence: number;
}

interface UniversityOption {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface SelectedComparisonTarget {
  institution_id: string;
  name: string;
  abbreviation: string | null;
  priority_order: number;
}

const AUTO_GENERATION_SESSION_KEY = "careerac:auto-plan-generation";

function normalizeGenerationError(error: unknown): GenerationError {
  if (error && typeof error === "object") {
    const candidate = error as Partial<GenerationError> & { error?: unknown; message?: unknown };
    const nestedError = candidate.error;

    if (nestedError && typeof nestedError === "object") {
      return normalizeGenerationError(nestedError);
    }

    if (typeof candidate.message === "string") {
      return {
        code: typeof candidate.code === "string" ? candidate.code : "GENERATION_FAILED",
        message: candidate.message,
        retryable: candidate.retryable ?? true,
        fallback: candidate.fallback ?? "retry_or_customize",
      };
    }
  }

  if (typeof error === "string") {
    return {
      code: "GENERATION_FAILED",
      message: error,
      retryable: true,
      fallback: "retry_or_customize",
    };
  }

  return {
    code: "GENERATION_FAILED",
    message: "We couldn’t generate your plan automatically. Please try again or customize your settings.",
    retryable: true,
    fallback: "retry_or_customize",
  };
}

export default function NewPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("upload");
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const [detectedMajor, setDetectedMajor] = useState<string | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<GenerationError | null>(null);
  const [hasCheckedRecoveryState, setHasCheckedRecoveryState] = useState(false);
  const [majorSuggestions, setMajorSuggestions] = useState<string[]>([]);
  const [showMajorConfirmation, setShowMajorConfirmation] = useState(false);
  const [showMajorSelection, setShowMajorSelection] = useState(false);
  const [planConfig, setPlanConfig] = useState<PlanConfiguration | null>(null);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [comparisonTargets, setComparisonTargets] = useState<SelectedComparisonTarget[]>([]);
  const [institutionsLoaded, setInstitutionsLoaded] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ParsedPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const pendingTargetSchoolRef = useRef<string | null>(null);

  const clearPersistedAutoGeneration = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(AUTO_GENERATION_SESSION_KEY);
    }
  }, []);

  const buildDefaultComparisonTargets = useCallback((targetSchool: string | null | undefined, availableUniversities: UniversityOption[]) => {
    if (!targetSchool || availableUniversities.length === 0) return [];

    const normalizedTarget = targetSchool.toLowerCase();
    const bestMatch = availableUniversities.find((institution) => {
      const name = institution.name.toLowerCase();
      const abbreviation = institution.abbreviation?.toLowerCase() ?? "";
      return name.includes(normalizedTarget) || normalizedTarget.includes(name) || (abbreviation && abbreviation === normalizedTarget);
    });

    if (!bestMatch) return [];

    return [
      {
        institution_id: bestMatch.id,
        name: bestMatch.name,
        abbreviation: bestMatch.abbreviation,
        priority_order: 1,
      },
    ];
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.sessionStorage.getItem(AUTO_GENERATION_SESSION_KEY);
    if (!stored) {
      setHasCheckedRecoveryState(true);
      return;
    }

    try {
      const recovered = JSON.parse(stored) as PersistedAutoGenerationState;

      if (recovered.step !== "auto-generating" || !recovered.transcriptData) {
        clearPersistedAutoGeneration();
        setHasCheckedRecoveryState(true);
        return;
      }

      setTranscriptData(recovered.transcriptData);
      setTranscriptId(recovered.transcriptId);
      setDetectedMajor(recovered.detectedMajor);
      setDetectionConfidence(recovered.detectionConfidence);
      setGenerationError({
        code: "RECOVERY_REQUIRED",
        message: "We restored your pending auto-generation request. Retry to continue or switch to customized settings.",
        retryable: true,
        fallback: "retry_or_customize",
      });
      setStep("auto-generating");
    } catch {
      clearPersistedAutoGeneration();
    } finally {
      setHasCheckedRecoveryState(true);
    }
  }, [clearPersistedAutoGeneration]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasCheckedRecoveryState) return;

    if (step === "auto-generating" && transcriptData) {
      const persistedState: PersistedAutoGenerationState = {
        step: "auto-generating",
        transcriptData,
        transcriptId,
        detectedMajor,
        detectionConfidence,
      };

      window.sessionStorage.setItem(AUTO_GENERATION_SESSION_KEY, JSON.stringify(persistedState));
      return;
    }

    clearPersistedAutoGeneration();
  }, [clearPersistedAutoGeneration, detectedMajor, detectionConfidence, hasCheckedRecoveryState, step, transcriptData, transcriptId]);

  useEffect(() => {
    if (!isGenerating || typeof window === "undefined") return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGenerating]);

  useEffect(() => {
    fetch("/api/institutions")
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (response.ok) {
          const nextUniversities = Array.isArray(payload.universities) ? payload.universities : [];
          setUniversities(nextUniversities);
          setComparisonTargets((current) => current.length > 0 ? current : buildDefaultComparisonTargets(pendingTargetSchoolRef.current, nextUniversities));
        }
        setInstitutionsLoaded(true);
      })
      .catch(() => {
        setInstitutionsLoaded(true);
      });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      isSavingRef.current = false;
    };
  }, [buildDefaultComparisonTargets]);

  const handleTranscriptParsed = useCallback((data: TranscriptData, id: string) => {
    setTranscriptData(data);
    setTranscriptId(id || null);
    setDetectedMajor(null);
    setDetectionConfidence(0);
    setGenerationError(null);
    setStep("choice");
  }, []);

  const handleUseSavedCourses = useCallback((data: TranscriptData) => {
    setTranscriptData(data);
    setTranscriptId(null);
    setDetectedMajor(null);
    setDetectionConfidence(0);
    setGenerationError(null);
    setStep("choice");
  }, []);

  const handleSkipTranscript = useCallback(() => {
    setDetectedMajor(null);
    setDetectionConfidence(0);
    setGenerationError(null);
    setStep("config");
  }, []);

  const startAutoGeneration = useCallback(async (major: string) => {
    if (!transcriptData) return;

    setTranscriptData((current) => current ? { ...current, major } : current);
    setDetectedMajor(major);
    setShowMajorConfirmation(false);
    setShowMajorSelection(false);
    setGenerationError(null);
    setStep("auto-generating");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/plans/generate-auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcriptId,
          transcriptData: {
            ...transcriptData,
            major,
          },
          detectedMajor: major,
          maxCreditsPerSemester: 15,
          hasTargetSchool: false,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setGenerationError(normalizeGenerationError(data.error ?? data));
        return;
      }

      clearPersistedAutoGeneration();
      router.push(`/plan/${data.planId}`);
    } catch {
      setGenerationError({
        code: "NETWORK_ERROR",
        message: "Failed to connect. Please try again.",
        retryable: true,
        fallback: "retry_or_customize",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [clearPersistedAutoGeneration, router, transcriptData, transcriptId]);

  const handleAutoGenerateClick = useCallback(async () => {
    if (!transcriptData) {
      setStep("config");
      return;
    }

    const detection = detectMajorFromTranscript(transcriptData.courses);
    const result = {
      detectedMajor: detection.detectedMajor,
      confidence: detection.confidence,
      suggestions: [
        ...(detection.detectedMajor ? [detection.detectedMajor] : []),
        ...detection.alternatives.map((alternative) => alternative.major),
      ].slice(0, 6),
    };
    setDetectedMajor(result.detectedMajor);
    setDetectionConfidence(result.confidence);
    setMajorSuggestions(result.suggestions);

    if (result.detectedMajor && result.confidence >= 0.85) {
      await startAutoGeneration(result.detectedMajor);
      return;
    }

    if (result.detectedMajor && result.confidence >= 0.60) {
      setShowMajorConfirmation(true);
      return;
    }

    setShowMajorSelection(true);
  }, [startAutoGeneration, transcriptData]);

  const handleOpenCustomizeSettings = useCallback(() => {
    setGenerationError(null);
    setShowMajorConfirmation(false);
    setShowMajorSelection(false);
    setStep("config");
  }, []);

  const handleConfigured = useCallback((config: PlanConfiguration) => {
    pendingTargetSchoolRef.current = config.targetSchool;
    setPlanConfig(config);
    setComparisonTargets((current) => current.length > 0 ? current : buildDefaultComparisonTargets(config.targetSchool, universities));
    setStep("compare");
  }, [buildDefaultComparisonTargets, universities]);

  const handleBackToUpload = useCallback(() => {
    setGenerationError(null);
    setStep("upload");
  }, []);

  const handleBackToConfig = useCallback(() => {
    setGenerationError(null);
    setStep(transcriptData ? "choice" : "upload");
  }, [transcriptData]);

  const handleRetryAutoGeneration = useCallback(() => {
    if (!detectedMajor) {
      setShowMajorSelection(true);
      return;
    }

    void startAutoGeneration(detectedMajor);
  }, [detectedMajor, startAutoGeneration]);

  const addComparisonTarget = useCallback((institution: UniversityOption) => {
    setComparisonTargets((current) => {
      if (current.some((target) => target.institution_id === institution.id) || current.length >= 4) {
        return current;
      }

      return [
        ...current,
        {
          institution_id: institution.id,
          name: institution.name,
          abbreviation: institution.abbreviation,
          priority_order: current.length + 1,
        },
      ];
    });
  }, []);

  const removeComparisonTarget = useCallback((institutionId: string) => {
    setComparisonTargets((current) =>
      current
        .filter((target) => target.institution_id !== institutionId)
        .map((target, index) => ({ ...target, priority_order: index + 1 })),
    );
  }, []);

  const handleContinueToChat = useCallback(() => {
    setStep("chat");
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
      const primaryTarget = comparisonTargets[0] ?? null;
      const comparisonPayload = comparisonTargets.slice(primaryTarget ? 1 : 0).map((target, index) => ({
        institution_id: target.institution_id,
        name: target.name,
        abbreviation: target.abbreviation,
        priority_order: index + 2,
      }));

      const resolvedNames = await resolveInstitutionIds(
        transcriptData?.institution || ("ccName" in plan ? plan.ccName : ""),
        ("isMultiUniversity" in plan && plan.isMultiUniversity)
          ? primaryTarget?.name || ""
          : (plan as TransferPlan).targetUniversity,
      );

      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          cc_institution_id: resolvedNames.ccId ?? null,
          target_institution_id: primaryTarget?.institution_id ?? resolvedNames.targetId ?? null,
          target_major: targetMajor,
          plan_data: JSON.parse(JSON.stringify(plan)),
          chat_history: JSON.parse(JSON.stringify(messages)),
          max_credits_per_semester: planConfig?.maxCreditsPerSemester || null,
          transcript_id: transcriptId || null,
          has_target_school: planConfig?.hasTargetSchool ?? true,
          comparison_targets: comparisonPayload,
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
  }, [comparisonTargets, planConfig, transcriptData, transcriptId]);

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

  const autoStartPrompt = useMemo(() => {
    if (!transcriptData || !planConfig?.major) return undefined;
    return buildSyntheticUserPrompt(
      transcriptData,
      planConfig.major,
      planConfig.hasTargetSchool ? planConfig.targetSchool : null,
      planConfig.maxCreditsPerSemester ?? 15,
    );
  }, [transcriptData, planConfig]);

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
  const steps = step === "auto-generating"
    ? [
        { key: "upload", label: "Transcript" },
        { key: "choice", label: "Choose" },
        { key: "auto-generating", label: "Generating" },
      ]
    : transcriptData
      ? [
          { key: "upload", label: "Transcript" },
          { key: "choice", label: "Choose" },
          { key: "config", label: "Settings" },
          { key: "compare", label: "Compare" },
          { key: "chat", label: "Plan" },
        ]
      : [
          { key: "upload", label: "Transcript" },
          { key: "config", label: "Settings" },
          { key: "compare", label: "Compare" },
          { key: "chat", label: "Plan" },
        ];

  const filteredUniversities = universities
    .filter((institution) => {
      if (!institutionSearch.trim()) return true;
      const query = institutionSearch.toLowerCase();
      return institution.name.toLowerCase().includes(query) || institution.abbreviation?.toLowerCase().includes(query);
    })
    .slice(0, 12);

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
              autoStartPrompt={autoStartPrompt}
            />
          </div>

          <div className="hidden lg:flex lg:w-1/2 flex-col bg-zinc-50 dark:bg-zinc-900">
            {currentPlan ? (
              <SemesterPlan plan={currentPlan} planId={savedPlanId} />
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
          <>
            <SavedCoursesSource onUseSavedCourses={handleUseSavedCourses} />
            <TranscriptUpload
              onTranscriptParsed={handleTranscriptParsed}
              onSkip={handleSkipTranscript}
            />
          </>
        )}

        {step === "config" && (
          <PlanConfig
            transcriptData={transcriptData}
            onConfigured={handleConfigured}
            onBack={handleBackToConfig}
          />
        )}

        {step === "choice" && transcriptData && (
          showMajorSelection ? (
            <MajorSelectionFallback
              key={`${detectedMajor ?? "none"}-${majorSuggestions.join("|")}`}
              open={true}
              suggestions={majorSuggestions}
              initialValue={detectedMajor}
              onConfirm={(major) => {
                if (!major) return;
                void startAutoGeneration(major);
              }}
              onCancel={() => {
                setShowMajorSelection(false);
                setGenerationError(null);
              }}
            />
          ) : (
            <GenerationChoiceScreen
              transcriptData={transcriptData}
              onCustomize={handleOpenCustomizeSettings}
              onAutoGenerate={() => void handleAutoGenerateClick()}
              onBack={handleBackToUpload}
            />
          )
        )}

        {step === "auto-generating" && (
          generationError ? (
            <AutoGenerationError
              error={generationError}
              onRetry={handleRetryAutoGeneration}
              onCustomize={handleOpenCustomizeSettings}
            />
          ) : (
            <AutoGenerationLoading major={detectedMajor} />
          )
        )}

        {step === "compare" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Compare Schools</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Choose up to 4 universities to compare. The first selected school becomes your primary target.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4">
              <label htmlFor="comparison-search" className="block text-sm font-medium text-zinc-900 dark:text-white">
                Search universities
              </label>
              <input
                id="comparison-search"
                type="text"
                value={institutionSearch}
                onChange={(event) => setInstitutionSearch(event.target.value)}
                placeholder="e.g., UCLA, UC Berkeley, San Jose State"
                className="mt-2 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {comparisonTargets.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {planConfig?.hasTargetSchool
                      ? "Select your main target and any alternate schools to compare later."
                      : "Pick schools you want the dashboard to compare after your plan is saved."}
                  </p>
                ) : (
                  comparisonTargets.map((target, index) => (
                    <div
                      key={target.institution_id}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-zinc-900"
                    >
                      <span>{target.abbreviation ?? target.name}</span>
                      {index === 0 && <span className="text-[10px] uppercase tracking-wide opacity-70">Primary</span>}
                      <button
                        type="button"
                        onClick={() => removeComparisonTarget(target.institution_id)}
                        className="text-white/70 hover:text-white dark:text-zinc-500 dark:hover:text-zinc-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {filteredUniversities.map((institution) => {
                const isSelected = comparisonTargets.some((target) => target.institution_id === institution.id);

                return (
                  <button
                    key={institution.id}
                    type="button"
                    onClick={() => (isSelected ? removeComparisonTarget(institution.id) : addComparisonTarget(institution))}
                    className={`rounded-2xl border p-4 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-white">{institution.name}</div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{institution.abbreviation ?? "University"}</div>
                      </div>
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{isSelected ? "Selected" : "Add"}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {institutionsLoaded && filteredUniversities.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No matching universities found.</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleContinueToChat}
                className="rounded-lg bg-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Continue to Plan
              </button>
              <button
                type="button"
                onClick={handleBackToConfig}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <MajorConfirmationModal
          open={showMajorConfirmation && !!detectedMajor}
          major={detectedMajor ?? ""}
          confidence={detectionConfidence}
          onConfirm={() => {
            if (!detectedMajor) return;
            void startAutoGeneration(detectedMajor);
          }}
          onChooseAnother={() => {
            setShowMajorConfirmation(false);
            setShowMajorSelection(true);
          }}
        />

        {step !== "choice" && (
          <MajorSelectionFallback
            key={`${detectedMajor ?? "none"}-${majorSuggestions.join("|")}-${showMajorSelection ? "open" : "closed"}`}
            open={showMajorSelection}
            suggestions={majorSuggestions}
            initialValue={detectedMajor}
            onConfirm={(major) => {
              if (!major) return;
              void startAutoGeneration(major);
            }}
            onCancel={() => {
              setShowMajorSelection(false);
              setGenerationError(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
