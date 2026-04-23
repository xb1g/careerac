"use client";

import { useState } from "react";
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

function getSubjectArea(code: string): string {
  return code.split(" ")[0];
}

export default function CoursesClient({ colleges, coursesByCollege }: Props) {
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allCourses = Object.values(coursesByCollege).flat();
  const uniqueSubjects = [...new Set(allCourses.map((c) => getSubjectArea(c.code)))].sort();

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Course Browser
          </h1>
          <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-400 font-medium">
            Browse SMCCCD courses by college and subject area
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <div className="w-full">
            <label htmlFor="course-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                className="w-full pl-10 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="college-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              College
            </label>
            <select
              id="college-select"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Colleges</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject Area
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

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
                    {courses.map((course) => {
                      return (
                        <Card
                          key={course.id}
                          className="p-5 hover:shadow-md transition-shadow"
                        >
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
                      );
                    })}
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