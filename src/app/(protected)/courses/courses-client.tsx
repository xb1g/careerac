"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Institution {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface Course {
  id: string;
  institution_id: string;
  code: string;
  title: string;
  units: number;
  description: string | null;
}

interface Props {
  colleges: Institution[];
  courses: Course[];
  subjects: string[];
  totalCount: number;
  selectedCollege: string;
  selectedSubject: string;
  searchQuery: string;
  page: number;
  pageSize: number;
}

export default function CoursesClient({
  colleges,
  courses,
  subjects,
  totalCount,
  selectedCollege,
  selectedSubject,
  searchQuery,
  page,
  pageSize,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged: Record<string, string> = {
        college: selectedCollege,
        subject: selectedSubject,
        q: searchQuery,
        page: String(page),
        ...overrides,
      };
      for (const [k, v] of Object.entries(merged)) {
        if (v) params.set(k, v);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [selectedCollege, selectedSubject, searchQuery, page, pathname, router],
  );

  const totalPages = Math.ceil(totalCount / pageSize);
  const collegeName = colleges.find((c) => c.id === selectedCollege);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Course Browser
          </h1>
          <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-400 font-medium">
            Browse California Community College courses by college and subject area
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          {/* College selector */}
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="college-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College
            </label>
            <select
              id="college-select"
              value={selectedCollege}
              onChange={(e) => navigate({ college: e.target.value, subject: "", q: "", page: "1" })}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select a college...</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject selector — only when a college is selected */}
          {selectedCollege && subjects.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject Area
              </label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => navigate({ subject: e.target.value, page: "1" })}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Search */}
          {selectedCollege && (
            <div className="w-full">
              <label htmlFor="course-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  navigate({ q: (fd.get("q") as string) || "", page: "1" });
                }}
              >
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="course-search"
                    name="q"
                    type="text"
                    defaultValue={searchQuery}
                    placeholder="Search by course code or title, then press Enter..."
                    className="w-full pl-10 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </form>
            </div>
          )}

          {selectedCollege && (
            <div className="flex items-end">
              <Badge variant="default" className="px-4 py-2.5 text-sm font-medium">
                {totalCount.toLocaleString()} courses
              </Badge>
            </div>
          )}
        </div>

        {isPending && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
        )}

        {!selectedCollege && !isPending && (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Select a college to browse its courses.
            </p>
          </Card>
        )}

        {selectedCollege && !isPending && courses.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No courses found matching your filters.
            </p>
          </Card>
        )}

        {!isPending && courses.length > 0 && (
          <>
            <section>
              {collegeName && (
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {collegeName.name}
                  </h2>
                  {collegeName.abbreviation && (
                    <Badge variant="default">{collegeName.abbreviation}</Badge>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {course.code}
                      </span>
                      <Badge variant="default" className="text-xs">
                        {course.units} {course.units === 1 ? "unit" : "units"}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  disabled={page <= 1}
                  onClick={() => navigate({ page: String(page - 1) })}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => navigate({ page: String(page + 1) })}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
