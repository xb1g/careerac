"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  coursesByCollege: Record<string, Course[]>;
}

interface SearchableOption {
  value: string;
  label: string;
  hint?: string;
}

interface SearchableFilterProps {
  id: string;
  label: string;
  value: string;
  displayValue: string;
  placeholder: string;
  options: SearchableOption[];
  onInputChange: (value: string) => void;
  onSelect: (option: SearchableOption) => void;
  onClear: () => void;
}

function getSubjectArea(code: string): string {
  return code.split(" ")[0];
}

function SearchableFilter({
  id,
  label,
  value,
  displayValue,
  placeholder,
  options,
  onInputChange,
  onSelect,
  onClear,
}: SearchableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && options.length > 0;

  return (
    <div ref={wrapperRef} className="flex-1 min-w-[220px]">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={highlightIndex >= 0 ? `${listboxId}-option-${highlightIndex}` : undefined}
          aria-autocomplete="list"
          value={displayValue}
          placeholder={placeholder}
          onChange={(e) => {
            onInputChange(e.target.value);
            setHighlightIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (!showDropdown) {
              if (e.key === "ArrowDown" && options.length > 0) {
                e.preventDefault();
                setIsOpen(true);
                setHighlightIndex(0);
              }
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightIndex((current) => (current + 1) % options.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightIndex((current) => (current - 1 + options.length) % options.length);
            } else if (e.key === "Enter") {
              if (highlightIndex >= 0 && highlightIndex < options.length) {
                e.preventDefault();
                onSelect(options[highlightIndex]);
                setIsOpen(false);
                setHighlightIndex(-1);
              }
            } else if (e.key === "Escape") {
              e.preventDefault();
              setIsOpen(false);
              setHighlightIndex(-1);
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900"
        />

        {showDropdown && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={highlightIndex === index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(option);
                  setIsOpen(false);
                  setHighlightIndex(-1);
                }}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  highlightIndex === index
                    ? "bg-blue-50 text-zinc-900 dark:bg-blue-900/30 dark:text-zinc-100"
                    : "text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="font-medium">{option.label}</span>
                {option.hint && (
                  <span className="ml-2 text-zinc-500 dark:text-zinc-400">{option.hint}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {value !== "all" && value !== "All" && (
        <button
          type="button"
          onClick={() => {
            onClear();
            setIsOpen(false);
            setHighlightIndex(-1);
          }}
          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}

export default function CoursesClient({ colleges, coursesByCollege }: Props) {
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collegeQuery, setCollegeQuery] = useState<string>("");
  const [subjectQuery, setSubjectQuery] = useState<string>("");

  const allCourses = Object.values(coursesByCollege).flat();
  const uniqueSubjects = [...new Set(allCourses.map((c) => getSubjectArea(c.code)))].sort();

  const collegeOptions = useMemo<SearchableOption[]>(() => {
    const baseOptions = [
      { value: "all", label: "All Colleges" },
      ...colleges.map((college) => ({
        value: college.id,
        label: college.name,
        hint: college.abbreviation ?? undefined,
      })),
    ];

    const query = collegeQuery.trim().toLowerCase();
    if (!query) return baseOptions;

    return baseOptions.filter((option) =>
      option.label.toLowerCase().includes(query) || option.hint?.toLowerCase().includes(query),
    );
  }, [collegeQuery, colleges]);

  const subjectOptions = useMemo<SearchableOption[]>(() => {
    const baseOptions = [
      { value: "All", label: "All Subjects" },
      ...uniqueSubjects.map((subject) => ({
        value: subject,
        label: subject,
      })),
    ];

    const query = subjectQuery.trim().toLowerCase();
    if (!query) return baseOptions;

    return baseOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [subjectQuery, uniqueSubjects]);

  const selectedCollegeLabel =
    selectedCollege === "all"
      ? "All Colleges"
      : colleges.find((college) => college.id === selectedCollege)?.name ?? collegeQuery;
  const selectedSubjectLabel = selectedSubject === "All" ? "All Subjects" : selectedSubject;

  const filteredColleges =
    selectedCollege === "all"
      ? colleges
      : colleges.filter((c) => c.id === selectedCollege);

  const matchesSearch = (course: Course, query: string): boolean => {
    const q = query.toLowerCase();
    return (
      course.code.toLowerCase().includes(q) ||
      course.title.toLowerCase().includes(q) ||
      (course.description?.toLowerCase().includes(q) ?? false)
    );
  };

  const filteredCoursesByCollege: Record<string, Course[]> = {};
  for (const college of filteredColleges) {
    let courses = coursesByCollege[college.id] || [];
    if (selectedSubject !== "All") {
      courses = courses.filter((c) => getSubjectArea(c.code) === selectedSubject);
    }
    if (searchQuery) {
      courses = courses.filter((c) => matchesSearch(c, searchQuery));
    }
    if (courses.length > 0) {
      filteredCoursesByCollege[college.id] = courses;
    }
  }

  const totalCourses = Object.values(filteredCoursesByCollege).flat().length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Course Browser
          </h1>
          <p className="mt-2 text-[15px] font-medium text-gray-600 dark:text-gray-400">
            Browse California Community College courses by college and subject area
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <div className="w-full">
            <label htmlFor="course-search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="course-search"
                type="text"
                placeholder="Search by course code, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          </div>

          <SearchableFilter
            id="college-search"
            label="College"
            value={selectedCollege}
            displayValue={collegeQuery || selectedCollegeLabel}
            placeholder="Search colleges..."
            options={collegeOptions}
            onInputChange={(value) => {
              setCollegeQuery(value);
              if (!value.trim()) {
                setSelectedCollege("all");
              }
            }}
            onSelect={(option) => {
              setSelectedCollege(option.value);
              setCollegeQuery(option.label);
            }}
            onClear={() => {
              setSelectedCollege("all");
              setCollegeQuery("");
            }}
          />

          <SearchableFilter
            id="subject-search"
            label="Subject Area"
            value={selectedSubject}
            displayValue={subjectQuery || selectedSubjectLabel}
            placeholder="Search subject areas..."
            options={subjectOptions}
            onInputChange={(value) => {
              setSubjectQuery(value);
              if (!value.trim()) {
                setSelectedSubject("All");
              }
            }}
            onSelect={(option) => {
              setSelectedSubject(option.value);
              setSubjectQuery(option.label);
            }}
            onClear={() => {
              setSelectedSubject("All");
              setSubjectQuery("");
            }}
          />

          <div className="flex items-end">
            <Badge variant="default" className="px-4 py-2.5 text-sm font-medium">
              {totalCourses} courses
            </Badge>
          </div>
        </div>

        {Object.keys(filteredCoursesByCollege).length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No courses found matching your filters.
            </p>
          </Card>
        ) : (
          <div className="space-y-12">
            {filteredColleges.map((college) => {
              const courses = filteredCoursesByCollege[college.id];
              if (!courses || courses.length === 0) return null;

              return (
                <section key={college.id}>
                  <div className="mb-6 flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {college.name}
                    </h2>
                    {college.abbreviation && (
                      <Badge variant="default">{college.abbreviation}</Badge>
                    )}
                    <Badge variant="default">{courses.length} courses</Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course) => (
                      <Card
                        key={course.id}
                        className="p-5 transition-shadow hover:shadow-md"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {course.code}
                          </span>
                          <Badge variant="default" className="text-xs">
                            {course.units} {course.units === 1 ? "unit" : "units"}
                          </Badge>
                        </div>
                        <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {course.description}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
