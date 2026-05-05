import { NextResponse } from "next/server";
import { getCurrentAdminContext } from "@/utils/admin";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type UserCourseRow = Database["public"]["Tables"]["user_courses"]["Row"];

export interface TransferPlanResult {
  id: string;
  user_id: string;
  title: string;
  status: "draft" | "active" | "completed";
  target_major: string | null;
  cc_institution_id: string | null;
  target_institution_id: string | null;
  created_at: string;
  updated_at: string;
  cc_institution: { id: string; name: string } | null;
  target_institution: { id: string; name: string } | null;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface AdminUserPlan {
  id: string;
  user_id: string;
  title: string;
  status: "draft" | "active" | "completed";
  target_major: string;
  cc_institution_name: string | null;
  target_institution_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserCourseStats {
  user_id: string;
  completed: number;
  in_progress: number;
  planned: number;
  total_units: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  plans: AdminUserPlan[];
  courseStats: AdminUserCourseStats[];
}

export async function GET() {
  try {
    const { supabase, user, isAdmin } = await getCurrentAdminContext();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const profiles = (profilesData ?? []) as ProfileRow[];
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
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }

    if (coursesError) {
      console.error("Error fetching user courses:", coursesError);
      return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
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

    for (const course of (coursesData ?? []) as UserCourseRow[]) {
      const stats = courseStatsMap.get(course.user_id);
      if (stats) {
        if (course.status === "completed") stats.completed += 1;
        else if (course.status === "in_progress") stats.in_progress += 1;
        else if (course.status === "planned") stats.planned += 1;
        stats.total_units += Number(course.units ?? 0);
      }
    }

    const courseStats = Array.from(courseStatsMap.values());

    const response: AdminUsersResponse = {
      users,
      plans,
      courseStats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Admin users route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
