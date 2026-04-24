import { useState } from "react";

export interface RecoveryAlternative {
  code: string;
  title: string;
  units: number;
  transferEquivalency: string;
  reasoning: string;
}

interface RecoveryMessageProps {
  failedCourseCode: string;
  failedCourseTitle: string;
  status: "failed" | "cancelled" | "waitlisted";
  dependentCourses: string[];
  alternatives: RecoveryAlternative[];
  noAlternatives: boolean;
  onAcceptAlternative?: (alternative: RecoveryAlternative) => void;
  isAccepting?: boolean;
}

export default function RecoveryMessage({
  failedCourseCode,
  failedCourseTitle,
  status,
  dependentCourses,
  alternatives,
  noAlternatives,
  onAcceptAlternative,
  isAccepting = false,
}: RecoveryMessageProps) {
  const [acceptedCode, setAcceptedCode] = useState<string | null>(null);

  const statusLabel = status === "waitlisted" ? "waitlisted" : status === "cancelled" ? "cancelled" : "failed";
  const statusColor = status === "waitlisted"
    ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20"
    : status === "cancelled"
    ? "border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50"
    : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20";

  const handleAccept = (alternative: RecoveryAlternative) => {
    setAcceptedCode(alternative.code);
    onAcceptAlternative?.(alternative);
  };

  return (
    <div className={`rounded-lg border ${statusColor} px-4 py-3`}>
      {/* Failed course header */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-lg" aria-hidden="true">
          {status === "waitlisted" ? "⏳" : status === "cancelled" ? "✕" : "✗"}
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Course {statusLabel}: <span className="font-bold">{failedCourseCode}</span> — {failedCourseTitle}
          </p>
          {status === "waitlisted" && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              This course is on the waitlist. You might still get in, but let&apos;s prepare a backup plan.
            </p>
          )}
        </div>
      </div>

      {/* Downstream impact */}
      {dependentCourses.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            ⚠️ Affected downstream courses:
          </p>
          <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5" data-testid="dependent-courses-list">
            {dependentCourses.map((dep, idx) => (
              <li key={idx} className="flex items-center gap-1">
                <span className="text-amber-500">•</span>
                {dep}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternative suggestions */}
      {alternatives.length > 0 && (
        <div className="space-y-2" data-testid="recovery-alternatives">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            💡 Suggested alternatives:
          </p>
          {alternatives.map((alt, idx) => (
            <div
              key={idx}
              className={`rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 p-3 ${
                acceptedCode === alt.code ? "ring-2 ring-green-500" : ""
              }`}
              data-testid={`alternative-${alt.code}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {alt.code} — {alt.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {alt.units} units → {alt.transferEquivalency}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {alt.reasoning}
                  </p>
                </div>
                {onAcceptAlternative && acceptedCode !== alt.code && (
                  <button
                    onClick={() => handleAccept(alt)}
                    disabled={isAccepting}
                    className="shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid={`accept-${alt.code}`}
                  >
                    {isAccepting ? "Adding..." : "Accept"}
                  </button>
                )}
                {acceptedCode === alt.code && (
                  <span className="shrink-0 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-md">
                    ✓ Added
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No alternatives message */}
      {noAlternatives && alternatives.length === 0 && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-3" data-testid="no-alternatives-message">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No alternative courses found
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            We couldn&apos;t find suitable alternatives from our articulation data. We recommend consulting with an academic counselor to explore other options.
          </p>
        </div>
      )}
    </div>
  );
}
