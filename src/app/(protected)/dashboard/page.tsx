import { createClient } from "@/utils/supabase/server";
import { EmptyState } from "./empty-state";
import Link from "next/link";
import { TransferCockpit } from "@/components/transfer-cockpit";

interface PlanCard {
  id: string;
  title: string;
  target_major: string;
  status: string;
  created_at: string;
}

async function getUserPlans(): Promise<PlanCard[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("transfer_plans")
    .select("id, title, target_major, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user plans:", error);
    return [];
  }

  return (data ?? []) as PlanCard[];
}

function PlanCard({ plan }: { plan: PlanCard }) {
  const formattedDate = new Date(plan.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/plan/${plan.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[1.25rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-700/50 p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-normal break-words">
            {plan.title}
          </h3>
          <p className="mt-1.5 text-[14px] font-medium text-gray-500 dark:text-gray-400 whitespace-normal break-words">
            {plan.target_major}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            {plan.status}
          </span>
        </div>
      </div>
      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
        <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formattedDate}
        </p>
        <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const plans = await getUserPlans();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-400 font-medium">
              Your transfer readiness overview, plus every plan you&apos;re tracking.
            </p>
          </div>
          <Link
            href="/plan/new"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-[14px] font-bold text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Plan
          </Link>
        </div>

        <TransferCockpit hasPlans={plans.length > 0} />

        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Your plans</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Keep your saved transfer plans close by for deeper edits and recovery workflows.</p>
            </div>
            {plans.length > 0 ? (
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200/70 dark:bg-zinc-900/70 dark:text-zinc-300 dark:ring-zinc-800/80">
                {plans.length} total
              </span>
            ) : null}
          </div>

          {plans.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
