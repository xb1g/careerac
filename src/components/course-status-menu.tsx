import { useEffect, useRef } from "react";
import { CourseStatus } from "@/types/plan";

const STATUS_OPTIONS: { value: CourseStatus; label: string; dot: string }[] = [
  { value: "planned",     label: "Planned",     dot: "bg-zinc-300 dark:bg-zinc-600" },
  { value: "completed",   label: "Completed",   dot: "bg-emerald-500" },
  { value: "in_progress", label: "In Progress", dot: "bg-blue-500" },
  { value: "waitlisted",  label: "Waitlisted",  dot: "bg-amber-500" },
  { value: "cancelled",   label: "Cancelled",   dot: "bg-zinc-400" },
  { value: "failed",      label: "Failed",      dot: "bg-rose-500" },
];

export { STATUS_OPTIONS as COURSE_STATUS_OPTIONS };

interface CourseStatusMenuProps {
  currentStatus?: CourseStatus;
  onSelect: (status: CourseStatus) => void;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number } | null;
}

export default function CourseStatusMenu({
  currentStatus = "planned",
  onSelect,
  isOpen,
  onClose,
  position,
}: CourseStatusMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Position near click, clamped to viewport
  const menuWidth = window.innerWidth < 640 ? Math.min(window.innerWidth - 16, 192) : 160;
  const style: React.CSSProperties = position
    ? {
        top: Math.max(72, Math.min(position.y, window.innerHeight - 250)),
        left: Math.max(8, Math.min(position.x, window.innerWidth - menuWidth - 8)),
      }
    : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-[calc(100vw-1rem)] max-w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 sm:w-40"
      style={style}
      role="listbox"
      aria-label="Course status"
      data-testid="course-status-menu"
    >
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => { onSelect(opt.value); onClose(); }}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
            opt.value === currentStatus ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"
          }`}
          role="option"
          aria-selected={opt.value === currentStatus}
          data-testid={`status-option-${opt.value}`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
          {opt.label}
          {opt.value === currentStatus && (
            <svg className="w-3.5 h-3.5 ml-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
