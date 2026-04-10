import { PlanCourse } from "@/types/plan";

interface CourseCardProps {
  course: PlanCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 shadow-sm" role="article" aria-label={`${course.code}: ${course.title}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate" data-testid="course-code">
            {course.code}
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5" data-testid="course-title">
            {course.title}
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300" data-testid="course-units">
          {course.units} {course.units === 1 ? "unit" : "units"}
        </span>
      </div>

      {course.transferEquivalency && (
        <div className="mt-1" data-testid="course-equivalency">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">Transfer to:</span> {course.transferEquivalency}
          </p>
        </div>
      )}

      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mt-1" data-testid="course-prerequisites">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(", ")}
          </p>
        </div>
      )}

      {course.notes && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 italic">
          {course.notes}
        </p>
      )}
    </div>
  );
}
