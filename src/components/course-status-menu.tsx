import { CourseStatus } from "@/types/plan";

export interface CourseStatusOption {
  value: CourseStatus;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const COURSE_STATUS_OPTIONS: CourseStatusOption[] = [
  {
    value: "completed",
    label: "Completed",
    icon: "✓",
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Course finished with a passing grade",
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: "◐",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Currently taking this course",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: "✕",
    color: "text-zinc-700 dark:text-zinc-300",
    bgColor: "bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800",
    borderColor: "border-zinc-200 dark:border-zinc-700",
    description: "Course was cancelled by the institution",
  },
  {
    value: "waitlisted",
    label: "Waitlisted",
    icon: "⏳",
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50",
    borderColor: "border-amber-200 dark:border-amber-800",
    description: "On the waitlist for this course",
  },
  {
    value: "failed",
    label: "Failed",
    icon: "✗",
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50",
    borderColor: "border-red-200 dark:border-red-800",
    description: "Course was not passed",
  },
];

interface CourseStatusMenuProps {
  currentStatus?: CourseStatus;
  onSelect: (status: CourseStatus) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseStatusMenu({
  currentStatus = "planned",
  onSelect,
  isOpen,
  onClose,
}: CourseStatusMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Course status menu">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/20 border-0 cursor-pointer"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close status menu"
      />

      {/* Menu */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Update Course Status
          </h3>
        </div>

        <div className="p-2" data-testid="course-status-menu">
          {COURSE_STATUS_OPTIONS.map((option) => {
            const isSelected = option.value === currentStatus;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${option.bgColor} ${
                  isSelected ? `ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-zinc-900` : ""
                }`}
                data-testid={`status-option-${option.value}`}
                aria-pressed={isSelected}
              >
                {/* Icon - non-color indicator */}
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${option.color} ${option.borderColor} border`}
                  aria-hidden="true"
                >
                  {option.icon}
                </span>

                {/* Label and description */}
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm font-medium ${option.color}`} data-testid={`status-label-${option.value}`}>
                    {option.label}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {option.description}
                  </span>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <span className="flex-shrink-0 text-blue-600 dark:text-blue-400" aria-label="Currently selected">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
