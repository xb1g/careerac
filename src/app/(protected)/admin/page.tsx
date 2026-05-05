import { getCurrentAdminContext } from "@/utils/admin";
import { redirect } from "next/navigation";
import AdminDashboard from "./admin-dashboard";
import type { AdminUser, AdminUserPlan, AdminUserCourseStats, TransferPlanResult } from "@/app/api/admin/users/route";

async function getAdminUsersData() {
  const { supabase, user, isAdmin } = await getCurrentAdminContext();

  if (!user) {
    redirect("/auth/signin");
  }

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return { users: [] as AdminUser[], plans: [] as AdminUserPlan[], courseStats: [] as AdminUserCourseStats[] };
  }

  const profiles = (profilesData ?? []) as Array<{ id: string; email: string; full_name: string | null; created_at: string }>;
  const userIds = profiles.map((p) => p.id);

  const plansQuery = userIds.length > 0
    ? supabase
        .from("transfer_plans")
        .select(
          `
          id,
          user_id,
          title,
          status,
          target_major,
          cc_institution_id,
          target_institution_id,
          created_at,
          updated_at,
          cc_institution:cc_institution_id (id, name),
          target_institution:target_institution_id (id, name)
        `,
        )
        .in("user_id", userIds)
        .order("created_at", { ascending: false })
    : Promise.resolve({ data: [], error: null });

  const coursesQuery = userIds.length > 0
    ? supabase
        .from("user_courses")
        .select("user_id, status, units")
        .in("user_id", userIds)
    : Promise.resolve({ data: [], error: null });

  const [{ data: plansData, error: plansError }, { data: coursesData, error: coursesError }] = await Promise.all([
    plansQuery,
    coursesQuery,
  ]);

  if (plansError) {
    console.error("Error fetching plans:", plansError);
  }

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
  }

  const users: AdminUser[] = profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    created_at: profile.created_at,
  }));

  const plans: AdminUserPlan[] = ((plansData ?? []) as TransferPlanResult[]).map((plan) => ({
    id: plan.id,
    user_id: plan.user_id,
    title: plan.title,
    status: plan.status,
    target_major: plan.target_major ?? "",
    cc_institution_name: plan.cc_institution?.name ?? null,
    target_institution_name: plan.target_institution?.name ?? null,
    created_at: plan.created_at,
    updated_at: plan.updated_at,
  }));

  const courseStatsMap = new Map<string, AdminUserCourseStats>();
  for (const user of users) {
    courseStatsMap.set(user.id, {
      user_id: user.id,
      completed: 0,
      in_progress: 0,
      planned: 0,
      total_units: 0,
    });
  }

  for (const course of (coursesData ?? []) as Array<{ user_id: string; status: string; units: number | null }>) {
    const stats = courseStatsMap.get(course.user_id);
    if (stats) {
      if (course.status === "completed") stats.completed += 1;
      else if (course.status === "in_progress") stats.in_progress += 1;
      else if (course.status === "planned") stats.planned += 1;
      stats.total_units += Number(course.units ?? 0);
    }
  }

  const courseStats = Array.from(courseStatsMap.values());

  return { users, plans, courseStats };
}

export default async function AdminPage() {
  const { users, plans, courseStats } = await getAdminUsersData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Overview of all users, their transfer plans, progress, and activity.
        </p>
      </div>
      <AdminDashboard users={users} plans={plans} courseStats={courseStats} />
    </div>
  );
}
