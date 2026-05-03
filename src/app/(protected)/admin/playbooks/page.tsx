import AdminPlaybooksDashboard, { type AdminPlaybookRecord } from "./admin-playbooks-dashboard";
import { getCurrentAdminContext } from "@/utils/admin";
import { redirect } from "next/navigation";

async function getAdminPlaybooks(statuses: Array<"pending" | "verified" | "rejected">) {
  const { supabase } = await getCurrentAdminContext();

  const { data, error } = await supabase
    .from("playbooks")
    .select(
      `
      id,
      user_id,
      target_major,
      transfer_year,
      outcome,
      verification_status,
      playbook_data,
      created_at,
      cc_institution:cc_institution_id (
        id,
        name,
        abbreviation
      ),
      target_institution:target_institution_id (
        id,
        name,
        abbreviation
      )
    `,
    )
    .in("verification_status", statuses)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin dashboard playbooks:", error);
    return [];
  }

  return (data ?? []) as AdminPlaybookRecord[];
}

export default async function AdminPlaybooksPage() {
  const { user, isAdmin } = await getCurrentAdminContext();

  if (!user) {
    redirect("/auth/signin");
  }

  if (!isAdmin) {
    redirect("/playbooks");
  }

  const [pendingPlaybooks, historyPlaybooks] = await Promise.all([
    getAdminPlaybooks(["pending"]),
    getAdminPlaybooks(["verified", "rejected"]),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Playbook verification
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Moderate community-submitted playbooks so verified transfer stories stay trustworthy.
        </p>
      </div>

      <AdminPlaybooksDashboard
        pendingPlaybooks={pendingPlaybooks}
        historyPlaybooks={historyPlaybooks}
      />
    </div>
  );
}
