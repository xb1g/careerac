import Link from "next/link";

interface PlaybookCardProps {
  playbook: {
    id: string;
    cc_name: string;
    cc_abbreviation: string | null;
    target_name: string;
    target_abbreviation: string | null;
    target_major: string;
    transfer_year: number;
    outcome: string;
    verification_status: string;
  };
}

export function PlaybookCard({ playbook }: PlaybookCardProps) {
  const isVerified = playbook.verification_status === "verified";
  const cardClasses = isVerified
    ? "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
    : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:border-zinc-600";

  return (
    <Link
      href={`/playbooks/${playbook.id}`}
      data-testid="playbook-card"
      className={`group rounded-lg border p-4 transition-all hover:shadow-sm sm:p-5 ${cardClasses}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          {/* CC and target school */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300" data-testid="cc-name">
              {playbook.cc_abbreviation ?? playbook.cc_name}
            </span>
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate" data-testid="target-name">
              {playbook.target_abbreviation ?? playbook.target_name}
            </span>
          </div>

          {/* Major */}
          <p className="mt-1.5 text-base font-semibold text-zinc-900 dark:text-white truncate" data-testid="major">
            {playbook.target_major}
          </p>

          {/* Transfer year */}
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400" data-testid="transfer-year">
            Transferred {playbook.transfer_year}
          </p>
        </div>

        {/* Badge */}
        <div className="shrink-0">
          {isVerified ? (
            <span
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400"
              data-testid="verified-badge"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verified Transfer Story
            </span>
          ) : (
            <span
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400"
              data-testid="community-badge"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              Community Submission
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
