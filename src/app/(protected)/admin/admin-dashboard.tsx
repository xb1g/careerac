"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminUser, AdminUserPlan, AdminUserCourseStats } from "@/app/api/admin/users/route";

type StatusFilter = "all" | "draft" | "active" | "completed";
type RiskFilter = "all" | "on-track" | "at-risk" | "behind";

interface AdminDashboardProps {
  users: AdminUser[];
  plans: AdminUserPlan[];
  courseStats: AdminUserCourseStats[];
}

interface EnrichedUser {
  id: string;
  name: string;
  email: string;
  cc: string | null;
  targetUniversity: string | null;
  targetMajor: string | null;
  planStatus: "draft" | "active" | "completed" | null;
  completedUnits: number;
  totalCourses: number;
  lastActive: string | null;
  riskLevel: RiskFilter;
  planCount: number;
}

const riskColors: Record<RiskFilter, string> = {
  "on-track": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  "at-risk": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "behind": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  all: "",
};

const statusBadgeVariant: Record<string, "primary" | "success" | "default"> = {
  draft: "default",
  active: "primary",
  completed: "success",
};

function enrichUsers(users: AdminUser[], plans: AdminUserPlan[], courseStats: AdminUserCourseStats[]): EnrichedUser[] {
  const plansByUser = new Map<string, AdminUserPlan[]>();
  for (const plan of plans) {
    const list = plansByUser.get(plan.user_id) ?? [];
    list.push(plan);
    plansByUser.set(plan.user_id, list);
  }

  const statsByUser = new Map<string, AdminUserCourseStats>();
  for (const stats of courseStats) {
    statsByUser.set(stats.user_id, stats);
  }

  return users.map((user) => {
    const userPlans = plansByUser.get(user.id) ?? [];
    const latestPlan = userPlans[0] ?? null;
    const stats = statsByUser.get(user.id);

    let riskLevel: RiskFilter = "on-track";
    if (!latestPlan) {
      riskLevel = "behind";
    } else if (latestPlan.status === "draft") {
      riskLevel = "at-risk";
    } else if (stats && stats.completed < 3) {
      riskLevel = "at-risk";
    }

    return {
      id: user.id,
      name: user.full_name ?? user.email.split("@")[0],
      email: user.email,
      cc: latestPlan?.cc_institution_name ?? null,
      targetUniversity: latestPlan?.target_institution_name ?? null,
      targetMajor: latestPlan?.target_major ?? null,
      planStatus: latestPlan?.status ?? null,
      completedUnits: stats?.total_units ?? 0,
      totalCourses: stats ? stats.completed + stats.in_progress + stats.planned : 0,
      lastActive: latestPlan?.updated_at ?? user.created_at,
      riskLevel,
      planCount: userPlans.length,
    };
  });
}

export default function AdminDashboard({ users, plans, courseStats }: AdminDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [search, setSearch] = useState("");

  const enrichedUsers = useMemo(() => enrichUsers(users, plans, courseStats), [users, plans, courseStats]);

  const filtered = useMemo(() => {
    return enrichedUsers.filter((u) => {
      if (statusFilter !== "all" && u.planStatus !== statusFilter) return false;
      if (riskFilter !== "all" && u.riskLevel !== riskFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.targetMajor?.toLowerCase() ?? "").includes(q) ||
          (u.cc?.toLowerCase() ?? "").includes(q) ||
          (u.targetUniversity?.toLowerCase() ?? "").includes(q)
        );
      }
      return true;
    });
  }, [enrichedUsers, statusFilter, riskFilter, search]);

  const stats = useMemo(() => {
    const withPlans = enrichedUsers.filter((u) => u.planStatus !== null);
    const activePlans = withPlans.filter((u) => u.planStatus === "active").length;
    const atRisk = enrichedUsers.filter((u) => u.riskLevel === "at-risk" || u.riskLevel === "behind").length;
    const completedPlans = withPlans.filter((u) => u.planStatus === "completed").length;
    const avgProgress = withPlans.length > 0
      ? Math.round(withPlans.reduce((sum, u) => sum + (u.totalCourses > 0 ? (u.completedUnits / Math.max(u.totalCourses * 3, 1)) * 100 : 0), 0) / withPlans.length)
      : 0;

    return {
      total: enrichedUsers.length,
      active: activePlans,
      atRisk,
      completed: completedPlans,
      avgProgress,
      totalPlans: plans.length,
    };
  }, [enrichedUsers, plans.length]);

  const universityDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const plan of plans) {
      const name = plan.target_institution_name ?? "Unknown";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [plans]);

  const ccDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    for (const plan of plans) {
      const name = plan.cc_institution_name ?? "Unknown";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [plans]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Users" value={stats.total} />
        <StatCard label="Total Plans" value={stats.totalPlans} accent="blue" />
        <StatCard label="Active Plans" value={stats.active} accent="blue" />
        <StatCard label="At Risk" value={stats.atRisk} accent="amber" />
        <StatCard label="Completed" value={stats.completed} accent="emerald" />
        <StatCard label="Avg Progress" value={`${stats.avgProgress}%`} accent="violet" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search users, majors, schools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
        />
        <div className="flex gap-2">
          <FilterSelect
            label="Risk"
            value={riskFilter}
            onChange={(v) => setRiskFilter(v as RiskFilter)}
            options={[["all", "All Risk"], ["on-track", "On Track"], ["at-risk", "At Risk"], ["behind", "Behind"]]}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
            options={[["all", "All Status"], ["draft", "Draft"], ["active", "Active"], ["completed", "Completed"]]}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Users ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500 dark:text-zinc-400">
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium hidden sm:table-cell">CC</th>
                  <th className="pb-3 pr-4 font-medium">Target</th>
                  <th className="pb-3 pr-4 font-medium hidden md:table-cell">Progress</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Risk</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-zinc-900 dark:text-white">{u.name}</div>
                      <div className="text-xs text-zinc-500">{u.email}</div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell text-zinc-600 dark:text-zinc-400">{u.cc ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="text-zinc-900 dark:text-white">{u.targetUniversity ?? "—"}</div>
                      <div className="text-xs text-zinc-500">{u.targetMajor ?? "—"}</div>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{
                              width: `${u.totalCourses > 0 ? Math.min(100, (u.completedUnits / Math.max(u.totalCourses * 3, 1)) * 100) : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">{u.completedUnits} units</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {u.planStatus ? (
                        <Badge variant={statusBadgeVariant[u.planStatus]}>{u.planStatus}</Badge>
                      ) : (
                        <span className="text-xs text-zinc-400">No plan</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[u.riskLevel]}`}
                      >
                        {u.riskLevel === "on-track" ? "On Track" : u.riskLevel === "at-risk" ? "At Risk" : "Behind"}
                      </span>
                    </td>
                    <td className="py-3 hidden lg:table-cell text-zinc-500 dark:text-zinc-400">
                      {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500">No users match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plans by Target University</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {universityDistribution.map(([uni, count]) => (
                <div key={uni} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{uni}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-2 rounded-full bg-violet-500"
                        style={{ width: `${plans.length > 0 ? (count / plans.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">{count}</span>
                  </div>
                </div>
              ))}
              {universityDistribution.length === 0 && (
                <p className="text-sm text-zinc-500">No plans yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plans by Community College</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ccDistribution.map(([cc, count]) => (
                <div key={cc} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{cc}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${plans.length > 0 ? (count / plans.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">{count}</span>
                  </div>
                </div>
              ))}
              {ccDistribution.length === 0 && (
                <p className="text-sm text-zinc-500">No plans yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    violet: "text-violet-600 dark:text-violet-400",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${accent ? colors[accent] : "text-zinc-900 dark:text-white"}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[][];
}) {
  return (
    <select
      aria-label={`Filter by ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
    >
      {options.map(([val, lbl]) => (
        <option key={val} value={val}>
          {lbl}
        </option>
      ))}
    </select>
  );
}
