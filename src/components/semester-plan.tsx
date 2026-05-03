import { type MouseEvent, useEffect, useRef, useState } from "react";
import {
  TransferPlan,
  NoDataResponse,
  ParsedPlan,
  CourseStatus,
  PlanCourse,
} from "@/types/plan";
import type { TranscriptCourse } from "@/types/transcript";
import CourseCard from "./course-card";

interface SemesterPlanProps {
  plan: ParsedPlan;
  onCourseClick?: (
    course: PlanCourse & { semesterNumber: number },
    currentStatus: CourseStatus,
    position?: { x: number; y: number },
  ) => void;
  /** Optional; reserved for future persistence hooks. */
  planId?: string | null;
  /** Completed courses to show as the first column */
  previousCourses?: TranscriptCourse[];
}

function isTransferPlan(plan: ParsedPlan): plan is TransferPlan {
  return !(plan as NoDataResponse).isNoData;
}

function getRemainingUnits(courses: PlanCourse[]) {
  return courses.reduce((total, course) => {
    return course.status === "completed" ? total : total + course.units;
  }, 0);
}

function useMobileTimeline() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);

    update();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return isMobile;
}

function CompletedCourseList({ courses }: { courses: TranscriptCourse[] }) {
  return (
    <>
      {courses.map((course, idx) => (
        <div
          key={`${course.code}-${idx}`}
          className="flex items-start justify-between gap-2 rounded-lg border border-emerald-100 bg-white px-3 py-2 dark:border-emerald-900/30 dark:bg-zinc-900/50"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {course.code}
              </span>
              {course.grade && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {course.grade}
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {course.title}
            </p>
          </div>
          <span className="shrink-0 text-[11px] text-zinc-400">
            {course.units}u
          </span>
        </div>
      ))}
    </>
  );
}

function SemesterCourseItem({
  course,
  semesterNumber,
  coveredSchoolCount,
  onCourseClick,
}: {
  course: PlanCourse;
  semesterNumber: number;
  coveredSchoolCount: number;
  onCourseClick?: SemesterPlanProps["onCourseClick"];
}) {
  const courseWithSemester = { ...course, semesterNumber };
  const card = (
    <CourseCard
      course={courseWithSemester}
      coveredSchoolCount={coveredSchoolCount}
    />
  );

  if (!onCourseClick) {
    return card;
  }

  return (
    <button
      type="button"
      className="block w-full rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onCourseClick(courseWithSemester, course.status || "planned", {
          x: event.clientX,
          y: event.clientY,
        });
      }}
    >
      {card}
    </button>
  );
}

function SemesterTimeline({
  plan,
  onCourseClick,
  previousCourses,
}: {
  plan: TransferPlan;
  onCourseClick?: SemesterPlanProps["onCourseClick"];
  previousCourses?: TranscriptCourse[];
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#FAFAFA] px-3 py-4 dark:bg-zinc-900/50" data-testid="semester-grid" role="list">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        {previousCourses && previousCourses.length > 0 && (
          <section
            role="listitem"
            aria-label="Completed Courses"
            className="rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20"
          >
            <header className="flex items-center justify-between gap-2 rounded-t-xl border-b border-emerald-200 bg-emerald-50/80 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <h3 className="truncate text-sm font-bold tracking-tight text-emerald-800 dark:text-emerald-300">
                Completed
              </h3>
              <span className="inline-flex items-center whitespace-nowrap rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                {previousCourses.reduce((s, c) => s + c.units, 0)} units
              </span>
            </header>
            <div className="flex min-h-0 flex-col gap-2 p-3" data-testid="semester-column-body">
              <CompletedCourseList courses={previousCourses} />
            </div>
          </section>
        )}

        {plan.semesters.map((semester) => {
          const semesterRemainingUnits = getRemainingUnits(semester.courses);

          return (
            <section
              key={semester.number}
              role="listitem"
              aria-label={semester.label}
              className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <header
                className="flex items-center justify-between gap-2 rounded-t-xl border-b border-zinc-200 bg-white/90 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/80"
                data-testid="semester-header"
              >
                <h3
                  className="truncate text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
                  data-testid="semester-label"
                >
                  {semester.label}
                </h3>
                <span
                  className="inline-flex items-center whitespace-nowrap rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  data-testid="semester-units"
                >
                  {semesterRemainingUnits}{" "}
                  {semesterRemainingUnits === 1 ? "unit" : "units"} remaining
                </span>
              </header>

              <div className="flex min-h-0 flex-col gap-3 p-3" data-testid="semester-column-body">
                {semester.courses.map((course, idx) => (
                  <SemesterCourseItem
                    key={`${course.code}-${idx}`}
                    course={course}
                    semesterNumber={semester.number}
                    coveredSchoolCount={plan.coveredSchools?.length ?? 0}
                    onCourseClick={onCourseClick}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SemesterGrid({
  plan,
  onCourseClick,
  previousCourses,
}: {
  plan: TransferPlan;
  onCourseClick?: SemesterPlanProps["onCourseClick"];
  previousCourses?: TranscriptCourse[];
}) {
  const isMobile = useMobileTimeline();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [hasRightOverflow, setHasRightOverflow] = useState(false);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow native horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Ensure we don't hijack vertical scrolling for inner elements (like semester course lists)
      let target = e.target as HTMLElement | null;
      let isInsideVerticalScroll = false;

      while (target && target !== scrollEl) {
        if (target.scrollHeight > target.clientHeight) {
          const style = window.getComputedStyle(target);
          if (style.overflowY === "auto" || style.overflowY === "scroll") {
            const isAtTop = target.scrollTop <= 0;
            const isAtBottom =
              Math.abs(
                target.scrollHeight - target.clientHeight - target.scrollTop,
              ) < 1;

            if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
              isInsideVerticalScroll = true;
              break;
            }
          }
        }
        target = target.parentElement;
      }

      if (!isInsideVerticalScroll) {
        e.preventDefault();
        scrollEl.scrollLeft += e.deltaY;
      }
    };

    scrollEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      scrollEl.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Overflow fade logic
  useEffect(() => {
    const scrollEl = scrollRef.current;
    const gridEl = gridRef.current;
    if (!scrollEl) return;

    const update = () => {
      setHasRightOverflow(
        scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 4,
      );
    };

    update();
    scrollEl.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer =
      gridEl && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;
    if (observer && gridEl) observer.observe(gridEl);

    return () => {
      scrollEl.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [plan.semesters.length]);

  if (isMobile) {
    return (
      <SemesterTimeline
        plan={plan}
        onCourseClick={onCourseClick}
        previousCourses={previousCourses}
      />
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 min-h-0 flex-1 flex-col bg-[#FAFAFA] dark:bg-zinc-900/50">
      <div className="relative min-w-0 min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="h-full w-full overflow-x-auto overflow-y-auto"
          data-testid="semester-grid"
          role="list"
        >
          <div
            ref={gridRef}
            className="flex h-full min-h-0 gap-4 px-4 py-6 md:px-6 lg:px-6 snap-x snap-mandatory items-stretch"
          >
            {previousCourses && previousCourses.length > 0 && (
              <section
                role="listitem"
                aria-label="Completed Courses"
                className="flex h-full min-h-0 w-[70vw] shrink-0 snap-start flex-col rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20 sm:w-[280px]"
              >
                <header className="sticky top-0 z-1 px-4 py-3 border-b border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/40 backdrop-blur-sm rounded-t-xl flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-emerald-800 dark:text-emerald-300 truncate">
                    ✓ Completed
                  </h3>
                  <span className="inline-flex items-center rounded-md bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide whitespace-nowrap">
                    {previousCourses.reduce((s, c) => s + c.units, 0)} units
                  </span>
                </header>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
                  <CompletedCourseList courses={previousCourses} />
                </div>
              </section>
            )}
            {plan.semesters.map((semester) => {
              const semesterRemainingUnits = getRemainingUnits(semester.courses);

              return (
                <section
                  key={semester.number}
                  role="listitem"
                  aria-label={semester.label}
                  className="flex h-full min-h-0 w-[70vw] shrink-0 snap-start flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:w-[280px]"
                >
                  <header
                    className="sticky top-0 z-1 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm rounded-t-xl flex items-center justify-between gap-2"
                    data-testid="semester-header"
                  >
                    <h3
                      className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate"
                      data-testid="semester-label"
                    >
                      {semester.label}
                    </h3>
                    <span
                      className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide whitespace-nowrap"
                      data-testid="semester-units"
                    >
                      {semesterRemainingUnits}{" "}
                      {semesterRemainingUnits === 1 ? "unit" : "units"}{" "}
                      remaining
                    </span>
                  </header>

                  <div
                    className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3"
                    data-testid="semester-column-body"
                  >
                    {semester.courses.map((course, idx) => (
                      <SemesterCourseItem
                        key={`${course.code}-${idx}`}
                        course={course}
                        semesterNumber={semester.number}
                        coveredSchoolCount={plan.coveredSchools?.length ?? 0}
                        onCourseClick={onCourseClick}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/90 to-transparent dark:from-zinc-950/90 transition-opacity duration-200 ${hasRightOverflow ? "opacity-100" : "opacity-0"}`}
          data-testid="semester-grid-overflow-fade"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function NoDataMessage({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#FAFAFA] dark:bg-zinc-900/50"
      data-testid="no-data-message"
    >
      <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center mb-6 shadow-sm border border-amber-100/50 dark:border-amber-900/30">
        <svg
          className="w-10 h-10 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
        No Data Found
      </h3>
      <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-md">
        {message}
      </p>
    </div>
  );
}

export default function SemesterPlan({
  plan,
  onCourseClick,
  previousCourses,
}: SemesterPlanProps) {
  if (isTransferPlan(plan)) {
    return (
      <SemesterGrid
        plan={plan}
        onCourseClick={onCourseClick}
        previousCourses={previousCourses}
      />
    );
  }

  return <NoDataMessage message={(plan as NoDataResponse).message} />;
}
