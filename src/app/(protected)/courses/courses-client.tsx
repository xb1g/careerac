"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition, useState, useRef, useEffect, useId, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
}

function Combobox({ options, value, onChange, placeholder, disabled, emptyText }: ComboboxProps) {
  const selected = options.find((o) => o.value === value);
  const selectedLabel = selected?.label ?? "";
  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
        setQuery(selectedLabel);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, selectedLabel]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === selectedLabel.toLowerCase()) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q),
    );
  }, [options, query, selectedLabel]);

  const select = (opt: ComboboxOption) => {
    setQuery(opt.label);
    setOpen(false);
    setHighlight(-1);
    onChange(opt.value);
  };

  const clear = () => {
    setQuery("");
    setHighlight(-1);
    onChange("");
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={highlight >= 0 ? `${listboxId}-${highlight}` : undefined}
        aria-autocomplete="list"
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => Math.min(h + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && open && highlight >= 0 && highlight < filtered.length) {
            e.preventDefault();
            select(filtered[highlight]);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setHighlight(-1);
            setQuery(selectedLabel);
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-9 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear"
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <svg
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {open && !disabled && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              {emptyText ?? "No matches"}
            </li>
          ) : (
            filtered.map((opt, index) => (
              <li
                key={opt.value}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={highlight === index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(opt);
                }}
                onMouseEnter={() => setHighlight(index)}
                className={`cursor-pointer px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ${
                  highlight === index
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {opt.hint && (
                  <span className="ml-2 text-gray-500 dark:text-gray-400">{opt.hint}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

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

  const collegeOptions = useMemo<ComboboxOption[]>(
    () =>
      colleges.map((c) => ({
        value: c.id,
        label: c.name,
        hint: c.abbreviation ?? undefined,
      })),
    [colleges],
  );
  const subjectOptions = useMemo<ComboboxOption[]>(
    () => subjects.map((s) => ({ value: s, label: s })),
    [subjects],
  );

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
          {/* College + Subject dropdowns */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                College
              </span>
              <Combobox
                options={collegeOptions}
                value={selectedCollege}
                onChange={(v) =>
                  navigate({ college: v, subject: "", q: "", page: "1" })
                }
                placeholder="Search for a college..."
                emptyText="No colleges match"
              />
            </div>
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </span>
              <Combobox
                options={subjectOptions}
                value={selectedSubject}
                onChange={(v) => navigate({ subject: v, page: "1" })}
                placeholder={
                  selectedCollege
                    ? "All subjects (type to filter)..."
                    : "Select a college first"
                }
                disabled={!selectedCollege}
                emptyText="No subjects match"
              />
            </div>
          </div>

          {/* Large search bar */}
          {selectedCollege && (
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </span>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
                    placeholder="Search by course code or title..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  {liveQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="default" className="px-3 py-2 text-sm font-medium">
                    {totalCount.toLocaleString()}
                  </Badge>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => navigate({ college: "", subject: "", q: "", page: "1" })}
                      className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Clear all
                    </button>
                  )}
                </div>
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
