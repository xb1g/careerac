import { PlanCourse, CourseStatus } from "@/types/plan";

interface CourseCardProps {
  course: PlanCourse;
  onClick?: (course: PlanCourse) => void;
  coveredSchoolCount?: number;
}

const statusDot: Record<CourseStatus, string> = {
  planned: "bg-zinc-300 dark:bg-zinc-600",
  completed: "bg-emerald-500",
  in_progress: "bg-blue-500",
  cancelled: "bg-zinc-400",
  waitlisted: "bg-amber-500",
  failed: "bg-rose-500",
};

const cardBg: Record<CourseStatus, string> = {
  planned: "bg-white dark:bg-zinc-900 border-zinc-200/70 dark:border-zinc-800",
  completed: "bg-emerald-50/40 dark:bg-emerald-500/5 border-emerald-200/50 dark:border-emerald-800/30",
  in_progress: "bg-blue-50/40 dark:bg-blue-500/5 border-blue-200/50 dark:border-blue-800/30",
  cancelled: "bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200/50 dark:border-zinc-700/40",
  waitlisted: "bg-amber-50/40 dark:bg-amber-500/5 border-amber-200/50 dark:border-amber-800/30",
  failed: "bg-rose-50/40 dark:bg-rose-500/5 border-rose-200/50 dark:border-rose-800/30",
};

const statusAccent: Record<CourseStatus, string> = {
  planned: "",
  completed: "border-l-4 border-l-emerald-500",
  in_progress: "border-l-4 border-l-blue-500",
  cancelled: "border-l-4 border-l-zinc-400 text-zinc-500 dark:text-zinc-400 opacity-80",
  waitlisted: "border-l-4 border-l-amber-500",
  failed: "border-l-4 border-l-rose-500 text-rose-900 dark:text-rose-100 opacity-80",
};

const statusLabel: Record<CourseStatus, string> = {
  planned: "planned",
  completed: "completed",
  in_progress: "in progress",
  cancelled: "cancelled",
  waitlisted: "waitlisted",
  failed: "failed",
};

const statusBadge: Record<CourseStatus, string> = {
  planned: "",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  cancelled: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  waitlisted: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  failed: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function CourseCard({ course, onClick, coveredSchoolCount = 0 }: CourseCardProps) {
  const status = course.status || "planned";
  const isInteractive = !!onClick;

  const isSchoolSpecific =
    coveredSchoolCount > 1 &&
    Array.isArray(course.requiredBy) &&
    course.requiredBy.length > 0 &&
    course.requiredBy.length < coveredSchoolCount;

  return (
    <div
      className={`group rounded-xl border ${cardBg[status]} ${statusAccent[status]} px-2.5 py-2 transition-all duration-150 ${
        isInteractive ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""
      }`}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${course.code}: ${course.title}${status !== "planned" ? ` - ${status.replace("_", " ")}` : ""}`}
      onClick={() => onClick?.(course)}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.(course);
        }
      }}
      data-testid={`course-card-${course.code}`}
    >
      {/* Top row: dot + code + units */}
      <div className="flex min-w-0 items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[status]}`} aria-hidden="true" />
        <span className="truncate text-[13px] font-bold text-zinc-900 dark:text-zinc-100 tracking-wide" data-testid="course-code">
          {course.code}
        </span>
        {status !== "planned" && (
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadge[status]}`}
            data-testid="course-status-badge"
          >
            {statusLabel[status]}
          </span>
        )}
        <span className="ml-auto text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tabular-nums" data-testid="course-units">
          {course.units}u
        </span>
      </div>

      {/* Title */}
      <p className="text-[13px] leading-snug text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2" data-testid="course-title">
        {course.title}
      </p>

      {/* Transfer equivalency — compact */}
      {course.transferEquivalency && (
        <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1.5 truncate" data-testid="course-equivalency">
          → {course.transferEquivalency}
        </p>
      )}

      {/* School-specific pills */}
      {isSchoolSpecific && (
        <div className="flex flex-wrap gap-1 mt-1.5" data-testid="course-required-by-pills">
          {course.requiredBy!.map((school) => (
            <span
              key={school}
              className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400"
            >
              {school}
            </span>
          ))}
        </div>
      )}

      {/* Prerequisites — inline, subtle */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 truncate" data-testid="course-prerequisites">
          Prereq: {course.prerequisites.join(", ")}
        </p>
      )}
    </div>
  );
}
