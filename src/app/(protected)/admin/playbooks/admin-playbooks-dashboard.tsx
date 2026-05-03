"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type VerificationStatus = "pending" | "verified" | "rejected";

interface InstitutionRef {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface PlaybookSemester {
  number: number;
  courses?: Array<{
    course_code: string;
    title: string;
    units: number;
    grade?: string;
    note?: string;
  }>;
}

interface PlaybookFailureEvent {
  course_code: string;
  failure_type: string;
  reason?: string;
  resolution?: string;
  lessons_learned?: string;
}

interface PlaybookData {
  semesters?: PlaybookSemester[];
  failure_events?: PlaybookFailureEvent[];
  tips?: string[];
}

export interface AdminPlaybookRecord {
  id: string;
  user_id: string;
  target_major: string;
  transfer_year: number;
  outcome: string;
  verification_status: VerificationStatus;
  playbook_data: unknown;
  created_at: string;
  cc_institution: InstitutionRef | null;
  target_institution: InstitutionRef | null;
}

function formatOutcome(outcome: string) {
  if (outcome === "transferred") return "Transferred";
  if (outcome === "in_progress") return "In Progress";
  if (outcome === "changed_direction") return "Changed Direction";
  return outcome;
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  const badgeClasses =
    status === "verified"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400"
      : status === "rejected"
        ? "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400"
        : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClasses}`}>
      {status === "verified" ? "Verified" : status === "rejected" ? "Rejected" : "Pending"}
    </span>
  );
}

function PlaybookDetails({ playbookData }: { playbookData: unknown }) {
  const data = (playbookData ?? {}) as PlaybookData;
  const semesters = data.semesters ?? [];
  const failures = data.failure_events ?? [];
  const tips = data.tips ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Semester timeline</h4>
        {semesters.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No semester details submitted.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {semesters.map((semester) => (
              <div key={semester.number} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Semester {semester.number}</p>
                <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {(semester.courses ?? []).map((course) => (
                    <li key={`${semester.number}-${course.course_code}`}>
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">{course.course_code}</span>{" "}
                      — {course.title} ({course.units} units)
                      {course.grade ? ` · Grade ${course.grade}` : ""}
                      {course.note ? ` · ${course.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Challenges</h4>
        {failures.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No failure or recovery events submitted.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            {failures.map((failure, index) => (
              <li key={`${failure.course_code}-${index}`} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/60">
                <span className="font-medium text-zinc-800 dark:text-zinc-100">{failure.course_code}</span>
                {` · ${failure.failure_type}`}
                {failure.reason ? ` · ${failure.reason}` : ""}
                {failure.resolution ? ` · Resolved: ${failure.resolution}` : ""}
                {!failure.resolution && failure.lessons_learned ? ` · Lesson: ${failure.lessons_learned}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      {tips.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Tips</h4>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            {tips.map((tip, index) => (
              <li key={`${tip}-${index}`}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PendingPlaybookCard({
  playbook,
  onModerate,
  isLoading,
}: {
  playbook: AdminPlaybookRecord;
  onModerate: (id: string, action: "verify" | "reject") => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={playbook.verification_status} />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Submitted {new Date(playbook.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-white">
            {(playbook.cc_institution?.abbreviation ?? playbook.cc_institution?.name ?? "Unknown CC") +
              " → " +
              (playbook.target_institution?.abbreviation ?? playbook.target_institution?.name ?? "Unknown School")}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {playbook.target_major} · {formatOutcome(playbook.outcome)} · {playbook.transfer_year}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => void onModerate(playbook.id, "verify")}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={() => void onModerate(playbook.id, "reject")}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40 sm:w-auto"
          >
            Reject
          </button>
        </div>
      </div>

      <div className="mt-6">
        <PlaybookDetails playbookData={playbook.playbook_data} />
      </div>
    </article>
  );
}

export default function AdminPlaybooksDashboard({
  pendingPlaybooks,
  historyPlaybooks,
}: {
  pendingPlaybooks: AdminPlaybookRecord[];
  historyPlaybooks: AdminPlaybookRecord[];
}) {
  const router = useRouter();
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groupedHistory = useMemo(
    () => ({
      verified: historyPlaybooks.filter((playbook) => playbook.verification_status === "verified"),
      rejected: historyPlaybooks.filter((playbook) => playbook.verification_status === "rejected"),
    }),
    [historyPlaybooks],
  );

  async function handleModeration(id: string, action: "verify" | "reject") {
    setActiveRequest(`${id}:${action}`);
    setError(null);

    try {
      const response = await fetch(`/api/admin/playbooks/${id}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `Failed to ${action} playbook`);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} playbook`);
    } finally {
      setActiveRequest(null);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Pending review</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Review community submissions before they appear as verified transfer stories.
            </p>
          </div>
          <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {pendingPlaybooks.length} pending
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        {pendingPlaybooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            No pending playbooks right now.
          </div>
        ) : (
          <div className="space-y-6">
            {pendingPlaybooks.map((playbook) => (
              <PendingPlaybookCard
                key={playbook.id}
                playbook={playbook}
                onModerate={handleModeration}
                isLoading={activeRequest === `${playbook.id}:verify` || activeRequest === `${playbook.id}:reject`}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Moderation history</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Recently approved and rejected playbooks.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {([
            ["Verified", groupedHistory.verified],
            ["Rejected", groupedHistory.rejected],
          ] as const).map(([label, playbooks]) => (
            <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{label}</h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{playbooks.length}</span>
              </div>

              {playbooks.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">No {label.toLowerCase()} playbooks yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {playbooks.map((playbook) => (
                    <li key={playbook.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {(playbook.cc_institution?.abbreviation ?? playbook.cc_institution?.name ?? "Unknown CC") +
                              " → " +
                              (playbook.target_institution?.abbreviation ?? playbook.target_institution?.name ?? "Unknown School")}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {playbook.target_major} · {formatOutcome(playbook.outcome)} · {new Date(playbook.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={playbook.verification_status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
