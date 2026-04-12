import { PlanCourse, CourseStatus } from "@/types/plan";

interface CourseCardProps {
  course: PlanCourse;
  onClick?: (course: PlanCourse) => void;
}

const statusStyles: Record<Exclude<CourseStatus, "planned">, { border: string; badge: string; badgeText: string; icon: string; textEffect: string }> = {
  completed: {
    border: "border-green-400 dark:border-green-600",
    badge: "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-700",
    badgeText: "text-green-800 dark:text-green-200",
    icon: "✓",
    textEffect: "",
  },
  in_progress: {
    border: "border-blue-400 dark:border-blue-600",
    badge: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700",
    badgeText: "text-blue-800 dark:text-blue-200",
    icon: "◐",
    textEffect: "",
  },
  cancelled: {
    border: "border-zinc-300 dark:border-zinc-600",
    badge: "bg-zinc-100 dark:bg-zinc-700/50 border-zinc-200 dark:border-zinc-600",
    badgeText: "text-zinc-700 dark:text-zinc-200",
    icon: "✕",
    textEffect: "line-through opacity-60",
  },
  waitlisted: {
    border: "border-amber-400 dark:border-amber-600",
    badge: "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700",
    badgeText: "text-amber-800 dark:text-amber-200",
    icon: "⏳",
    textEffect: "",
  },
  failed: {
    border: "border-red-400 dark:border-red-600",
    badge: "bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-700",
    badgeText: "text-red-800 dark:text-red-200",
    icon: "✗",
    textEffect: "line-through opacity-60",
  },
};

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const status = course.status || "planned";
  const isInteractive = !!onClick;
  const style = status !== "planned" ? statusStyles[status] : null;

  const handleClick = () => {
    onClick?.(course);
  };

  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border ${style?.border || "border-zinc-200 dark:border-zinc-700"} bg-white dark:bg-zinc-800 p-3 shadow-sm ${
        isInteractive ? "cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-shadow" : ""
      } ${style?.textEffect || ""}`}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${course.code}: ${course.title}${status !== "planned" ? ` - Status: ${status.replace("_", " ")}` : ""}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      data-testid={`course-card-${course.code}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate" data-testid="course-code">
              {course.code}
            </h4>
            {style && (
              <span className="shrink-0 text-xs" aria-hidden="true">
                {style.icon}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5" data-testid="course-title">
            {course.title}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          {/* Status badge - visible for non-planned statuses */}
          {style && (
            <span
              className={`inline-flex items-center gap-1 rounded-full ${style.badge} px-2 py-0.5 text-xs font-medium ${style.badgeText}`}
              data-testid="course-status-badge"
            >
              <span aria-hidden="true">{style.icon}</span>
              <span>{status.replace("_", " ")}</span>
            </span>
          )}
          <span className={`shrink-0 inline-flex items-center rounded-full ${
            status === "completed"
              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : status === "failed" || status === "cancelled"
              ? "bg-zinc-100 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400"
              : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
          } px-2 py-0.5 text-xs font-medium`} data-testid="course-units">
            {course.units} {course.units === 1 ? "unit" : "units"}
          </span>
        </div>
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
