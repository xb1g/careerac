import { PlanCourse, CourseStatus } from "@/types/plan";

interface CourseCardProps {
  course: PlanCourse;
  onClick?: (course: PlanCourse) => void;
  /**
   * Total schools the parent plan covers. When > 1 and the course's
   * requiredBy is a proper subset, the card renders an asterisk and a
   * tooltip listing the requiring schools.
   */
  coveredSchoolCount?: number;
}

const statusStyles: Record<Exclude<CourseStatus, "planned">, { indicator: string; bg: string; textClass: string }> = {
  completed: {
    indicator: "border-l-emerald-500 dark:border-l-emerald-400 shadow-[inset_3px_0_0_0_rgba(16,185,129,0.1)]",
    bg: "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100/50 dark:border-emerald-500/20",
    textClass: "",
  },
  in_progress: {
    indicator: "border-l-blue-500 dark:border-l-blue-400 shadow-[inset_3px_0_0_0_rgba(59,130,246,0.1)]",
    bg: "bg-blue-50/50 dark:bg-blue-500/10 border-blue-100/50 dark:border-blue-500/20",
    textClass: "",
  },
  cancelled: {
    indicator: "border-l-zinc-400 dark:border-l-zinc-500 shadow-[inset_3px_0_0_0_rgba(161,161,170,0.1)]",
    bg: "bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-200/50 dark:border-zinc-700/50",
    textClass: "opacity-60 text-zinc-500",
  },
  waitlisted: {
    indicator: "border-l-amber-500 dark:border-l-amber-400 shadow-[inset_3px_0_0_0_rgba(245,158,11,0.1)]",
    bg: "bg-amber-50/50 dark:bg-amber-500/10 border-amber-100/50 dark:border-amber-500/20",
    textClass: "",
  },
  failed: {
    indicator: "border-l-rose-500 dark:border-l-rose-400 shadow-[inset_3px_0_0_0_rgba(244,63,94,0.1)]",
    bg: "bg-rose-50/50 dark:bg-rose-500/10 border-rose-100/50 dark:border-rose-500/20",
    textClass: "opacity-80 text-rose-900 dark:text-rose-200",
  },
};

export default function CourseCard({ course, onClick, coveredSchoolCount = 0 }: CourseCardProps) {
  const status = course.status || "planned";
  const isInteractive = !!onClick;
  const style = status !== "planned" ? statusStyles[status] : {
    indicator: "border-l-zinc-300 dark:border-l-zinc-600",
    bg: "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800",
    textClass: "",
  };

  const isSchoolSpecific =
    coveredSchoolCount > 1 &&
    Array.isArray(course.requiredBy) &&
    course.requiredBy.length > 0 &&
    course.requiredBy.length < coveredSchoolCount;

  const handleClick = () => {
    onClick?.(course);
  };

  return (
    <div
      className={`group relative flex flex-col gap-1.5 rounded-xl border border-l-[3px] ${style.bg} ${style.indicator} px-4 py-3 shadow-sm transition-all duration-200 ${
        isInteractive ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600" : ""
      } ${style.textClass} overflow-hidden`}
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider" data-testid="course-code">
              {course.code}
            </h4>
            {isSchoolSpecific && (
              <span className="flex flex-wrap gap-1" data-testid="course-required-by-pills">
                {course.requiredBy!.map((school) => (
                  <span
                    key={school}
                    className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-500/30"
                  >
                    {school}
                  </span>
                ))}
              </span>
            )}
            {status !== "planned" && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-400">
                {status.replace("_", " ")}
              </span>
            )}
          </div>
          <p className="text-[15px] font-medium leading-tight text-zinc-800 dark:text-zinc-300 mt-1" data-testid="course-title">
            {course.title}
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-end">
          <span className="inline-flex items-center rounded-md bg-zinc-100/80 dark:bg-zinc-800/80 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300" data-testid="course-units">
            {course.units} {course.units === 1 ? "Unit" : "Units"}
          </span>
        </div>
      </div>

      {(course.transferEquivalency || (course.prerequisites && course.prerequisites.length > 0) || course.notes) && (
        <div className="mt-1 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/50 pt-2">
          {course.transferEquivalency && (
            <div className="flex items-start gap-1.5" data-testid="course-equivalency">
              <svg className="w-3.5 h-3.5 mt-0.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Transfers as:</span> {course.transferEquivalency}
              </p>
            </div>
          )}

          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="flex items-start gap-1.5" data-testid="course-prerequisites">
              <svg className="w-3.5 h-3.5 mt-0.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-amber-700 dark:text-amber-400">Prereqs:</span> {course.prerequisites.join(", ")}
              </p>
            </div>
          )}

          {course.notes && (
            <p className="text-[13px] text-zinc-500 dark:text-zinc-500 italic mt-0.5" data-testid="course-notes">
              {course.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
