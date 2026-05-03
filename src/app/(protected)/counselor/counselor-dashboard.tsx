"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- Mock data ---

interface MockStudent {
  id: string;
  name: string;
  email: string;
  cc: string;
  targetUniversity: string;
  targetMajor: string;
  planStatus: "draft" | "active" | "completed";
  completedUnits: number;
  totalUnits: number;
  semestersLeft: number;
  lastActive: string;
  riskLevel: "on-track" | "at-risk" | "behind";
  failedCourses: number;
}

const MOCK_STUDENTS: MockStudent[] = [
  { id: "1", name: "Maria Garcia", email: "maria.g@email.com", cc: "De Anza College", targetUniversity: "UCLA", targetMajor: "Computer Science", planStatus: "active", completedUnits: 42, totalUnits: 60, semestersLeft: 2, lastActive: "2026-04-28", riskLevel: "on-track", failedCourses: 0 },
  { id: "2", name: "James Chen", email: "james.c@email.com", cc: "Foothill College", targetUniversity: "UC Berkeley", targetMajor: "Data Science", planStatus: "active", completedUnits: 28, totalUnits: 62, semestersLeft: 3, lastActive: "2026-04-27", riskLevel: "at-risk", failedCourses: 1 },
  { id: "3", name: "Aisha Patel", email: "aisha.p@email.com", cc: "Santa Monica College", targetUniversity: "UC San Diego", targetMajor: "Biology", planStatus: "active", completedUnits: 51, totalUnits: 58, semestersLeft: 1, lastActive: "2026-04-29", riskLevel: "on-track", failedCourses: 0 },
  { id: "4", name: "David Kim", email: "david.k@email.com", cc: "De Anza College", targetUniversity: "UC Davis", targetMajor: "Mechanical Engineering", planStatus: "draft", completedUnits: 12, totalUnits: 64, semestersLeft: 4, lastActive: "2026-04-20", riskLevel: "behind", failedCourses: 2 },
  { id: "5", name: "Sofia Rodriguez", email: "sofia.r@email.com", cc: "Pasadena City College", targetUniversity: "UCLA", targetMajor: "Psychology", planStatus: "completed", completedUnits: 60, totalUnits: 60, semestersLeft: 0, lastActive: "2026-04-15", riskLevel: "on-track", failedCourses: 0 },
  { id: "6", name: "Tyler Washington", email: "tyler.w@email.com", cc: "Foothill College", targetUniversity: "UC Santa Barbara", targetMajor: "Economics", planStatus: "active", completedUnits: 35, totalUnits: 58, semestersLeft: 2, lastActive: "2026-04-26", riskLevel: "at-risk", failedCourses: 1 },
  { id: "7", name: "Emily Nguyen", email: "emily.n@email.com", cc: "Santa Monica College", targetUniversity: "UC Irvine", targetMajor: "Nursing", planStatus: "active", completedUnits: 44, totalUnits: 66, semestersLeft: 2, lastActive: "2026-04-28", riskLevel: "on-track", failedCourses: 0 },
  { id: "8", name: "Carlos Mendez", email: "carlos.m@email.com", cc: "De Anza College", targetUniversity: "UC Berkeley", targetMajor: "Electrical Engineering", planStatus: "active", completedUnits: 20, totalUnits: 64, semestersLeft: 4, lastActive: "2026-04-22", riskLevel: "behind", failedCourses: 3 },
];

type RiskFilter = "all" | "on-track" | "at-risk" | "behind";
type StatusFilter = "all" | "draft" | "active" | "completed";

const riskColors: Record<MockStudent["riskLevel"], string> = {
  "on-track": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  "at-risk": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "behind": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusBadgeVariant: Record<MockStudent["planStatus"], "primary" | "success" | "default"> = {
  draft: "default",
  active: "primary",
  completed: "success",
};

export default function CounselorDashboard() {
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_STUDENTS.filter((s) => {
    if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
    if (statusFilter !== "all" && s.planStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.targetMajor.toLowerCase().includes(q) || s.cc.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: MOCK_STUDENTS.length,
    active: MOCK_STUDENTS.filter((s) => s.planStatus === "active").length,
    atRisk: MOCK_STUDENTS.filter((s) => s.riskLevel === "at-risk" || s.riskLevel === "behind").length,
    completed: MOCK_STUDENTS.filter((s) => s.planStatus === "completed").length,
    avgProgress: Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + (s.completedUnits / s.totalUnits) * 100, 0) / MOCK_STUDENTS.length),
  };

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Students" value={stats.total} />
        <StatCard label="Active Plans" value={stats.active} accent="blue" />
        <StatCard label="At Risk" value={stats.atRisk} accent="amber" />
        <StatCard label="Completed" value={stats.completed} accent="emerald" />
        <StatCard label="Avg Progress" value={`${stats.avgProgress}%`} accent="violet" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          type="text"
          placeholder="Search students, majors, schools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <FilterSelect label="Risk" value={riskFilter} onChange={(v) => setRiskFilter(v as RiskFilter)} options={[["all", "All Risk"], ["on-track", "On Track"], ["at-risk", "At Risk"], ["behind", "Behind"]]} />
          <FilterSelect label="Status" value={statusFilter} onChange={(v) => setStatusFilter(v as StatusFilter)} options={[["all", "All Status"], ["draft", "Draft"], ["active", "Active"], ["completed", "Completed"]]} />
        </div>
      </div>

      {/* Student table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Students ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500 dark:text-zinc-400">
                  <th className="pb-3 pr-4 font-medium">Student</th>
                  <th className="pb-3 pr-4 font-medium hidden sm:table-cell">CC</th>
                  <th className="pb-3 pr-4 font-medium">Target</th>
                  <th className="pb-3 pr-4 font-medium hidden md:table-cell">Progress</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Risk</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-zinc-900 dark:text-white">{s.name}</div>
                      <div className="text-xs text-zinc-500">{s.email}</div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell text-zinc-600 dark:text-zinc-400">{s.cc}</td>
                    <td className="py-3 pr-4">
                      <div className="text-zinc-900 dark:text-white">{s.targetUniversity}</div>
                      <div className="text-xs text-zinc-500">{s.targetMajor}</div>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(s.completedUnits / s.totalUnits) * 100}%` }} />
                        </div>
                        <span className="text-xs text-zinc-500">{s.completedUnits}/{s.totalUnits}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusBadgeVariant[s.planStatus]}>{s.planStatus}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[s.riskLevel]}`}>
                        {s.riskLevel === "on-track" ? "On Track" : s.riskLevel === "at-risk" ? "At Risk" : "Behind"}
                      </span>
                    </td>
                    <td className="py-3 hidden lg:table-cell text-zinc-500 dark:text-zinc-400">{s.lastActive}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500">No students match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Plan distribution by school */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Plans by Target University</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(MOCK_STUDENTS.reduce<Record<string, number>>((acc, s) => { acc[s.targetUniversity] = (acc[s.targetUniversity] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([uni, count]) => (
                <div key={uni} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{uni}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div className="h-2 rounded-full bg-violet-500" style={{ width: `${(count / MOCK_STUDENTS.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Plans by Community College</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(MOCK_STUDENTS.reduce<Record<string, number>>((acc, s) => { acc[s.cc] = (acc[s.cc] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([cc, count]) => (
                <div key={cc} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{cc}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(count / MOCK_STUDENTS.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">{count}</span>
                  </div>
                </div>
              ))}
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

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[][] }) {
  return (
    <select
      aria-label={`Filter by ${label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
    >
      {options.map(([val, lbl]) => (
        <option key={val} value={val}>{lbl}</option>
      ))}
    </select>
  );
}
