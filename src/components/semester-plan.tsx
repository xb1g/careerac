import { TransferPlan, NoDataResponse, ParsedPlan } from "@/types/plan";
import CourseCard from "./course-card";

interface SemesterPlanProps {
  plan: ParsedPlan;
}

function isTransferPlan(plan: ParsedPlan): plan is TransferPlan {
  return !(plan as NoDataResponse).isNoData;
}

function SemesterGrid({ plan }: { plan: TransferPlan }) {
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
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="overall-total-units">
              {plan.totalUnits}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">total units</span>
          </div>
        </div>
      </div>

      {/* Semesters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="semester-grid">
        {plan.semesters.map((semester) => (
          <div key={semester.number} className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
            {/* Semester Header */}
            <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between" data-testid="semester-header">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100" data-testid="semester-label">
                {semester.label}
              </h3>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400" data-testid="semester-units">
                {semester.totalUnits} {semester.totalUnits === 1 ? "unit" : "units"}
              </span>
            </div>

            {/* Courses */}
            <div className="p-3 space-y-2">
              {semester.courses.map((course, idx) => (
                <CourseCard key={`${course.code}-${idx}`} course={course} />
              ))}
            </div>
          </div>
        ))}
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

export default function SemesterPlan({ plan }: SemesterPlanProps) {
  if (isTransferPlan(plan)) {
    return <SemesterGrid plan={plan} />;
  }

  return <NoDataMessage message={plan.message} />;
}
