"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/components/chat";
import SemesterPlan from "@/components/semester-plan";
import { ParsedPlan, TransferPlan } from "@/types/plan";
import { createClient } from "@/utils/supabase/client";

export default function NewPlanPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<ParsedPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Save a plan to the database.
   * If the plan doesn't have institution IDs resolved, it tries to look them up.
   */
  const savePlan = useCallback(async (plan: ParsedPlan, messages: unknown[]): Promise<string | null> => {
    // Don't save no-data responses
    if ("isNoData" in plan && plan.isNoData) {
      return null;
    }

    const transferPlan = plan as TransferPlan;

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Auth error during plan save:", authError);
        return null;
      }
      if (!user) {
        console.error("No authenticated user during plan save");
        return null;
      }

      // First, try to resolve institution IDs
      const { data: ccInstitution } = await supabase
        .from("institutions")
        .select("id")
        .or(`name.ilike.%${transferPlan.ccName}%,abbreviation.ilike.%${transferPlan.ccName}%`)
        .eq("type", "cc")
        .limit(1)
        .maybeSingle();

      const { data: targetInstitution } = await supabase
        .from("institutions")
        .select("id")
        .or(`name.ilike.%${transferPlan.targetUniversity}%,abbreviation.ilike.%${transferPlan.targetUniversity}%`)
        .eq("type", "university")
        .limit(1)
        .maybeSingle();

      // Create the plan in the database
      const insertData = {
        user_id: user.id,
        title: `${transferPlan.ccName} → ${transferPlan.targetUniversity}`,
        cc_institution_id: (ccInstitution as { id?: string } | null)?.id ?? null,
        target_institution_id: (targetInstitution as { id?: string } | null)?.id ?? null,
        target_major: transferPlan.targetMajor,
        plan_data: JSON.parse(JSON.stringify(transferPlan)),
        chat_history: JSON.parse(JSON.stringify(messages)),
        status: "active",
      };

      const { data, error } = await supabase
        .from("transfer_plans")
        .insert(insertData as never)
        .select()
        .single();

      if (error) {
        console.error("Error creating plan:", error);
        return null;
      }

      return (data as { id: string }).id;
    } catch (err) {
      console.error("Save error:", err);
      return null;
    }
  }, []);

  /**
   * Debounced save of the current plan to the database.
   * Only saves once per plan generation to prevent duplicates.
   */
  const debouncedSave = useCallback((plan: ParsedPlan, messages: unknown[]) => {
    // Don't schedule duplicate saves for the same plan
    if (savedPlanId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    setSaveError(null);

    saveTimeoutRef.current = setTimeout(async () => {
      const planId = await savePlan(plan, messages);
      setIsSaving(false);
      if (planId) {
        setSavedPlanId(planId);
        // Update URL without navigation so user can share/copy
        router.replace(`/plan/${planId}`);
      } else {
        setSaveError("Failed to save plan. Please try again.");
      }
    }, 800);
  }, [savePlan, router, savedPlanId]);

  const handlePlanGenerated = useCallback((plan: ParsedPlan) => {
    setCurrentPlan(plan);
    // Note: The actual save happens via debouncedSave when chat messages update
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Create a New Plan
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Chat with our AI assistant to build your personalized transfer plan.
            </p>
          </div>
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          )}
          {saveError && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {saveError}
            </div>
          )}
          {savedPlanId && !isSaving && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Plan saved
            </div>
          )}
        </div>
      </div>

      {/* Split layout: chat panel (left) + plan display (right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="w-full lg:w-1/2 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Chat onPlanGenerated={handlePlanGenerated} onSavePlan={debouncedSave} />
        </div>

        {/* Plan display area */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-zinc-50 dark:bg-zinc-900">
          {currentPlan ? (
            <SemesterPlan plan={currentPlan} />
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
                  Your plan will appear here
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Tell the AI your community college, target school, and major to generate your semester-by-semester transfer plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
