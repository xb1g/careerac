import { TransferPlan, NoDataResponse, ParsedPlan, CourseStatus, PlanCourse } from "@/types/plan";
import CourseCard from "./course-card";

interface SemesterPlanProps {
  plan: ParsedPlan;
  onCourseClick?: (course: PlanCourse & { semesterNumber: number }, currentStatus: CourseStatus) => void;
  /** Optional; reserved for future persistence hooks. */
  planId?: string | null;
}

function isTransferPlan(plan: ParsedPlan): plan is TransferPlan {
  return !(plan as NoDataResponse).isNoData;
}

function SemesterGrid({ plan, onCourseClick }: { plan: TransferPlan; onCourseClick?: SemesterPlanProps["onCourseClick"] }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#FAFAFA] dark:bg-zinc-900/50">
      <div
        className="min-h-0 flex-1 overflow-x-auto overflow-y-auto"
        data-testid="semester-grid"
        role="list"
      >
        <div className="flex h-full min-h-0 gap-4 px-4 py-6 md:px-6 lg:px-8 snap-x snap-mandatory items-stretch">
          {plan.semesters.map((semester) => {
            const semesterRemainingUnits = semester.courses.reduce((total, course) => {
              return course.status === "completed" ? total : total + course.units;
            }, 0);

            return (
              <section
                key={semester.number}
                role="listitem"
                aria-label={semester.label}
                className="flex h-full min-h-0 w-[85vw] shrink-0 snap-start flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:w-[320px] lg:w-75"
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
                    {semesterRemainingUnits} {semesterRemainingUnits === 1 ? "unit" : "units"} remaining
                  </span>
                </header>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3" data-testid="semester-column-body">
                  {semester.courses.map((course, idx) => (
                    <CourseCard
                      key={`${course.code}-${idx}`}
                      course={{ ...course, semesterNumber: semester.number }}
                      coveredSchoolCount={plan.coveredSchools?.length ?? 0}
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

export default function SemesterPlan({ plan, onCourseClick }: SemesterPlanProps) {
  if (isTransferPlan(plan)) {
    return <SemesterGrid plan={plan} onCourseClick={onCourseClick} />;
  }

  return <NoDataMessage message={(plan as NoDataResponse).message} />;
}
