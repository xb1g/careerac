import { TransferPlan, NoDataResponse, ParsedPlan, CourseStatus, PlanCourse, MultiUniversityPlan } from "@/types/plan";
import CourseCard from "./course-card";
import MultiUniversityView from "./multi-university-view";

interface SemesterPlanProps {
  plan: ParsedPlan;
  onCourseClick?: (course: PlanCourse & { semesterNumber: number }, currentStatus: CourseStatus) => void;
  /** Required for multi-university view card navigation. Omit for transient/pre-save states. */
  planId?: string | null;
}

function isMultiUniversityPlan(plan: ParsedPlan): plan is MultiUniversityPlan {
  return "isMultiUniversity" in plan && (plan as MultiUniversityPlan).isMultiUniversity === true;
}

function isTransferPlan(plan: ParsedPlan): plan is TransferPlan {
  return !isMultiUniversityPlan(plan) && !(plan as NoDataResponse).isNoData;
}

function SemesterGrid({ plan, onCourseClick }: { plan: TransferPlan; onCourseClick?: SemesterPlanProps["onCourseClick"] }) {
  // Calculate remaining units (excluding completed courses)
  const remainingUnits = plan.semesters.reduce((total, semester) => {
    return total + semester.courses.reduce((semTotal, course) => {
      return course.status === "completed" ? semTotal : semTotal + course.units;
    }, 0);
  }, 0);

  const completedUnits = plan.totalUnits - remainingUnits;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] dark:bg-zinc-900/50">
      {/* Plan Header */}
      <div className="px-6 py-5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2" data-testid="plan-header">
              {plan.ccName} 
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {plan.targetUniversity}
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              {plan.targetMajor}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tighter text-blue-600 dark:text-blue-500" data-testid="overall-remaining-units">
                {remainingUnits}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Units Left</span>
            </div>
            <div className="flex gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
              {completedUnits > 0 && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500" data-testid="overall-completed-units">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{completedUnits} Done</span>
                </div>
              )}
              <div data-testid="overall-total-units">
                {plan.totalUnits} Total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Columns */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden"
        data-testid="semester-grid"
        role="list"
      >
        <div className="flex gap-4 px-4 md:px-6 lg:px-8 py-6 min-h-full snap-x snap-mandatory">
          {plan.semesters.map((semester) => {
            const semesterRemainingUnits = semester.courses.reduce((total, course) => {
              return course.status === "completed" ? total : total + course.units;
            }, 0);

            return (
              <section
                key={semester.number}
                role="listitem"
                aria-label={semester.label}
                className="flex-shrink-0 w-[85vw] sm:w-[320px] lg:w-[300px] snap-start flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm"
              >
                {/* Column header */}
                <header
                  className="sticky top-0 z-[1] px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm rounded-t-xl flex items-center justify-between gap-2"
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
                    {semesterRemainingUnits} {semesterRemainingUnits === 1 ? "unit" : "units"} remaining
                  </span>
                </header>

                {/* Column body */}
                <div className="flex flex-col gap-3 p-3 overflow-y-auto min-h-[200px] flex-1">
                  {semester.courses.map((course, idx) => (
                    <CourseCard
                      key={`${course.code}-${idx}`}
                      course={{ ...course, semesterNumber: semester.number }}
                      onClick={onCourseClick ? (c) => onCourseClick(
                        { ...c, semesterNumber: semester.number },
                        c.status || "planned"
                      ) : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#FAFAFA] dark:bg-zinc-900/50" data-testid="no-data-message">
      <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center mb-6 shadow-sm border border-amber-100/50 dark:border-amber-900/30">
        <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

export default function SemesterPlan({ plan, onCourseClick, planId }: SemesterPlanProps) {
  if (isMultiUniversityPlan(plan)) {
    return <MultiUniversityView plan={plan} planId={planId} />;
  }

  if (isTransferPlan(plan)) {
    return <SemesterGrid plan={plan} onCourseClick={onCourseClick} />;
  }

  return <NoDataMessage message={(plan as NoDataResponse).message} />;
}
