import { useState, useCallback, useRef, useEffect } from "react";
import { ParsedPlan, TransferPlan } from "@/types/plan";
import { createClient } from "@/utils/supabase/client";
import { resolveInstitutionIds } from "@/utils/plan-institutions";
import type { Database } from "@/types/database";

type TransferPlanRow = Database["public"]["Tables"]["transfer_plans"]["Row"];

interface UsePlanPersistenceOptions {
  onPlanSaved?: (planId: string) => void;
}

interface UsePlanPersistenceReturn {
  planId: string | null;
  setPlanId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  savePlan: (plan: ParsedPlan, chatHistory: unknown[]) => Promise<string | null>;
  loadPlan: (id: string) => Promise<{ plan: ParsedPlan | null; chatHistory: unknown[] } | null>;
}

export function usePlanPersistence({
  onPlanSaved,
}: UsePlanPersistenceOptions = {}): UsePlanPersistenceReturn {
  const [planId, setPlanIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const setPlanId = useCallback((id: string | null) => {
    setPlanIdState(id);
  }, []);

  /**
   * Save a plan to the database.
   * If planId exists, updates the existing plan.
   * If planId is null, creates a new plan and returns the new ID.
   */
  const savePlan = useCallback(
    async (plan: ParsedPlan, chatHistory: unknown[]): Promise<string | null> => {
      // Debounce saves to avoid too many DB calls
      return new Promise<string | null>((resolve) => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
          setIsLoading(true);
          setError(null);

          try {
            const supabase = createClient();

            // Check if we have a valid transfer plan
            if ("isNoData" in plan && plan.isNoData) {
              // Don't save no-data responses
              setIsLoading(false);
              resolve(null);
              return;
            }

            const transferPlan = plan as TransferPlan;

            if (planId) {
              // Update existing plan
              const { error: updateError } = await supabase
                .from("transfer_plans")
                .update({
                  plan_data: JSON.parse(JSON.stringify(transferPlan)),
                  chat_history: JSON.parse(JSON.stringify(chatHistory)),
                  updated_at: new Date().toISOString(),
                } as never)
                .eq("id", planId);

              if (updateError) {
                console.error("Error updating plan:", updateError);
                setError("Failed to save plan changes");
                setIsLoading(false);
                resolve(null);
                return;
              }

              onPlanSaved?.(planId);
              setIsLoading(false);
              resolve(planId);
            } else {
              // Create new plan - resolve institution IDs from names
              const { ccId, targetId } = await resolveInstitutionIds(
                transferPlan.ccName,
                transferPlan.targetUniversity
              );

              // Get current user
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                setError("Not authenticated");
                setIsLoading(false);
                resolve(null);
                return;
              }

              const insertData = {
                user_id: user.id,
                title: `${transferPlan.ccName} → ${transferPlan.targetUniversity}`,
                cc_institution_id: ccId ?? "",
                target_institution_id: targetId ?? "",
                target_major: transferPlan.targetMajor,
                plan_data: JSON.parse(JSON.stringify(transferPlan)),
                chat_history: JSON.parse(JSON.stringify(chatHistory)),
                status: "active",
              };

              const { data, error: insertError } = await supabase
                .from("transfer_plans")
                .insert(insertData as never)
                .select()
                .single();

              if (insertError) {
                console.error("Error creating plan:", insertError);
                setError("Failed to save plan");
                setIsLoading(false);
                resolve(null);
                return;
              }

              const newPlanId = (data as TransferPlanRow).id;
              setPlanIdState(newPlanId);
              onPlanSaved?.(newPlanId);
              setIsLoading(false);
              resolve(newPlanId);
            }
          } catch (err) {
            console.error("Save error:", err);
            setError("Failed to save plan");
            setIsLoading(false);
            resolve(null);
          }
        }, 500); // 500ms debounce
      });
    },
    [planId, onPlanSaved]
  );

  /**
   * Load a plan from the database by ID.
   */
  const loadPlan = useCallback(
    async (id: string): Promise<{ plan: ParsedPlan | null; chatHistory: unknown[] } | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("transfer_plans")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            setError("Plan not found");
          } else {
            setError("Failed to load plan");
          }
          setIsLoading(false);
          return null;
        }

        const row = data as TransferPlanRow;
        setPlanIdState(row.id);

        // Parse the plan data
        let plan: ParsedPlan | null = null;
        if (row.plan_data) {
          plan = row.plan_data as unknown as ParsedPlan;
        }

        const chatHistory: unknown[] = (row.chat_history as unknown[]) ?? [];

        setIsLoading(false);
        return { plan, chatHistory };
      } catch (err) {
        console.error("Load error:", err);
        setError("Failed to load plan");
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  return {
    planId,
    setPlanId,
    isLoading,
    error,
    savePlan,
    loadPlan,
  };
}
