import { TransferPlan, NoDataResponse, ParsedPlan, CourseStatus, PlanCourse } from "@/types/plan";
import CourseCard from "./course-card";

interface SemesterPlanProps {
  plan: ParsedPlan;
  onCourseClick?: (course: PlanCourse & { semesterNumber: number }, currentStatus: CourseStatus) => void;
}

function isTransferPlan(plan: ParsedPlan): plan is TransferPlan {
  return !(plan as NoDataResponse).isNoData;
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
    <div className="flex flex-col h-full">
      {/* Plan Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100" data-testid="plan-header">
              {plan.ccName} → {plan.targetUniversity}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {plan.targetMajor}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="overall-remaining-units">
                {remainingUnits}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">remaining</span>
            </div>
            {completedUnits > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-0.5" data-testid="overall-completed-units">
                <span className="font-medium">{completedUnits}</span> completed
              </div>
            )}
            <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5" data-testid="overall-total-units">
              {plan.totalUnits} total
            </div>
          </div>
        </div>
      </div>

      {/* Semesters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="semester-grid">
        {plan.semesters.map((semester) => {
          // Calculate semester units excluding completed courses
          const semesterRemainingUnits = semester.courses.reduce((total, course) => {
            return course.status === "completed" ? total : total + course.units;
          }, 0);

          return (
            <div key={semester.number} className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
              {/* Semester Header */}
              <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between" data-testid="semester-header">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100" data-testid="semester-label">
                  {semester.label}
                </h3>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400" data-testid="semester-units">
                  {semesterRemainingUnits} {semesterRemainingUnits === 1 ? "unit" : "units"} remaining
                </span>
              </div>

              {/* Courses */}
              <div className="p-3 space-y-2">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center" data-testid="no-data-message">
      <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        No Data Found
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
        {message}
      </p>
    </div>
  );
}

export default function SemesterPlan({ plan, onCourseClick }: SemesterPlanProps) {
  if (isTransferPlan(plan)) {
    return <SemesterGrid plan={plan} onCourseClick={onCourseClick} />;
  }

  return <NoDataMessage message={plan.message} />;
}
