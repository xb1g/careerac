import { createClient } from "@/utils/supabase/server";
import { EmptyState } from "./empty-state";
import { fetchPlanDetail } from "@/utils/fetch-plan-detail";
import PlanDetailClient from "../plan/[id]/plan-detail-client";
import { Suspense } from "react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get the latest plan ID
  const { data: latestPlan } = (await supabase
    .from("transfer_plans")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()) as { data: { id: string } | null };

  if (!latestPlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <EmptyState />
        </div>
      </div>
    );
  }

  const detail = await fetchPlanDetail(latestPlan.id, user.id);

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-hidden">
      <Suspense fallback={<div className="flex-1 animate-pulse bg-zinc-50 dark:bg-zinc-900" />}>
        <PlanDetailClient
          plan={detail.plan}
          transcript={detail.transcript}
          userCourses={detail.userCourses}
          chatDefaultOpen={false}
        />
      </Suspense>
    </main>
  );
}
