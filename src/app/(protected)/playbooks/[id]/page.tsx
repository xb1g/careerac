import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PlaybookDetail {
  id: string;
  cc_name: string;
  cc_abbreviation: string | null;
  target_name: string;
  target_abbreviation: string | null;
  target_major: string;
  transfer_year: number;
  outcome: string;
  verification_status: string;
  playbook_data: unknown;
  created_at: string;
}

interface InstitutionRef {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface PlaybookDetailRow {
  id: string;
  target_major: string;
  transfer_year: number;
  outcome: string;
  verification_status: string;
  playbook_data: unknown;
  created_at: string;
  cc_institution: InstitutionRef | null;
  target_institution: InstitutionRef | null;
}

interface PlaybookSemester {
  number: number;
  total_units?: number;
  courses?: Array<{
    course_code: string;
    title: string;
    units: number;
    grade?: string;
    status?: string;
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

async function getPlaybook(id: string): Promise<PlaybookDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("playbooks")
    .select(
      `
      id,
      target_major,
      transfer_year,
      outcome,
      verification_status,
      playbook_data,
      created_at,
      cc_institution:cc_institution_id (
        id,
        name,
        abbreviation
      ),
      target_institution:target_institution_id (
        id,
        name,
        abbreviation
      )
    `
    )
    .eq("id", id)
    .maybeSingle()
    .returns<PlaybookDetailRow>();

  if (error) {
    console.error("Error fetching playbook:", error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    cc_name: data.cc_institution?.name ?? "Unknown",
    cc_abbreviation: data.cc_institution?.abbreviation ?? null,
    target_name: data.target_institution?.name ?? "Unknown",
    target_abbreviation: data.target_institution?.abbreviation ?? null,
    target_major: data.target_major,
    transfer_year: data.transfer_year,
    outcome: data.outcome,
    verification_status: data.verification_status,
    playbook_data: data.playbook_data,
    created_at: data.created_at,
  };
}

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playbook = await getPlaybook(id);

  if (!playbook) {
    notFound();
  }

  const isVerified =
    playbook.verification_status === "verified" &&
    playbook.outcome === "transferred";

  const playbookData = playbook.playbook_data as PlaybookData | null;
  const semesters = playbookData?.semesters ?? [];
  const failureEvents = playbookData?.failure_events ?? [];
  const tips = playbookData?.tips ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/playbooks"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Playbooks
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="font-medium text-zinc-700 dark:text-zinc-300" data-testid="detail-cc">
                {playbook.cc_abbreviation ?? playbook.cc_name}
              </span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-medium text-zinc-700 dark:text-zinc-300" data-testid="detail-target">
                {playbook.target_abbreviation ?? playbook.target_name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white" data-testid="detail-major">
              {playbook.target_major}
            </h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400" data-testid="detail-year">
              Transferred in {playbook.transfer_year}
            </p>
          </div>

          {/* Badge */}
          <div className="flex-shrink-0">
            {isVerified ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20"
                data-testid="verified-badge"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20"
                data-testid="inspiration-badge"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                Inspiration only
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Outcome */}
      <div className="mb-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
          Outcome
        </h2>
        <p className="text-lg font-semibold text-zinc-900 dark:text-white" data-testid="outcome">
          {playbook.outcome === "transferred" && "Successfully transferred"}
          {playbook.outcome === "in_progress" && "Currently in progress"}
          {playbook.outcome === "changed_direction" && "Changed direction"}
        </p>
      </div>

      {/* Failure Events */}
      {failureEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            Challenges & Recovery
          </h2>
          <div className="space-y-4">
            {failureEvents.map((event, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 p-4"
                data-testid="failure-event"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        event.failure_type === "failed"
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 ring-red-700/10 dark:ring-red-600/30"
                          : event.failure_type === "cancelled"
                          ? "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 ring-orange-700/10 dark:ring-orange-600/30"
                          : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 ring-yellow-700/10 dark:ring-yellow-600/30"
                      }`}
                      data-testid="failure-type"
                    >
                      {event.failure_type === "failed" && "Failed"}
                      {event.failure_type === "cancelled" && "Cancelled"}
                      {event.failure_type === "waitlisted" && "Waitlisted"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 dark:text-white" data-testid="failure-course">
                      {event.course_code}
                    </h3>
                    {event.reason && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400" data-testid="failure-reason">
                        {event.reason}
                      </p>
                    )}
                    {event.resolution && (
                      <div className="mt-3 p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Resolution
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300" data-testid="failure-resolution">
                          {event.resolution}
                        </p>
                      </div>
                    )}
                    {event.lessons_learned && (
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 italic" data-testid="failure-lessons">
                        💡 {event.lessons_learned}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semester-by-Semester Path */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Semester-by-Semester Path
        </h2>
        <div className="space-y-6" data-testid="semester-list">
          {semesters.map((semester) => (
            <div
              key={semester.number}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden"
              data-testid="semester"
            >
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                <h3 className="font-medium text-zinc-900 dark:text-white" data-testid="semester-title">
                  Semester {semester.number}
                </h3>
                {semester.total_units && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400" data-testid="semester-units">
                    {semester.total_units} units
                  </span>
                )}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {semester.courses?.map((course, courseIndex) => (
                  <div key={courseIndex} className="px-4 py-3" data-testid="course-entry">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400" data-testid="course-code">
                            {course.course_code}
                          </span>
                          {course.grade && (
                            <span
                              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${
                                course.grade.startsWith("A")
                                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                  : course.grade.startsWith("B")
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                  : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              }`}
                              data-testid="course-grade"
                            >
                              {course.grade}
                            </span>
                          )}
                          {course.status === "in_progress" && (
                            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                              In Progress
                            </span>
                          )}
                          {course.status === "planned" && (
                            <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                              Planned
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400" data-testid="course-title">
                          {course.title}
                        </p>
                        {course.note && (
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 italic">
                            Note: {course.note}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                        {course.units} {course.units === 1 ? "unit" : "units"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Tips from this Student
          </h2>
          <ul className="space-y-2">
            {tips.map((tip: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share Your Story CTA */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-6 text-center">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Have a similar path to share?
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Help other students by documenting your transfer journey.
        </p>
        <Link
          href="/playbooks/submit"
          className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          Share Your Story
        </Link>
      </div>
    </div>
  );
}
