"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition, useState, useRef, useEffect } from "react";
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

  const [liveQuery, setLiveQuery] = useState(searchQuery);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleSearchChange = useCallback(
    (value: string) => {
      setLiveQuery(value);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        navigate({ q: value, page: "1" });
      }, 300);
    },
    [navigate],
  );

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);
  const collegeName = colleges.find((c) => c.id === selectedCollege);
  const activeFilterCount =
    (selectedCollege ? 1 : 0) +
    (selectedSubject ? 1 : 0) +
    (searchQuery ? 1 : 0);

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

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* College pills */}
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College
            </span>
            <div className="flex flex-wrap gap-2">
              {colleges.map((college) => {
                const active = selectedCollege === college.id;
                return (
                  <button
                    key={college.id}
                    onClick={() => navigate({ college: active ? "" : college.id, subject: "", q: "", page: "1" })}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {active && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {college.abbreviation ?? college.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject pills + Search row */}
          {selectedCollege && (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Subject pills */}
              {subjects.length > 0 && (
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    <button
                      onClick={() => navigate({ subject: "", page: "1" })}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        !selectedSubject
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      All
                    </button>
                    {subjects.map((s) => (
                      <button
                        key={s}
                        onClick={() => navigate({ subject: selectedSubject === s ? "" : s, page: "1" })}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          selectedSubject === s
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="w-full sm:w-72 shrink-0">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </span>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={liveQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Code or title..."
                    className="w-full pl-9 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  {liveQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Count + Clear */}
              <div className="flex items-end gap-2 shrink-0">
                <Badge variant="default" className="px-3 py-2 text-sm font-medium">
                  {totalCount.toLocaleString()}
                </Badge>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => navigate({ college: "", subject: "", q: "", page: "1" })}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
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
