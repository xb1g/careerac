import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
    .eq("verification_status", "verified")
    .maybeSingle();

  if (error) {
    console.error("Error fetching playbook:", error);
    return null;
  }

  if (!data) return null;

  const row = data as PlaybookDetailRow;

  return {
    id: row.id,
    cc_name: row.cc_institution?.name ?? "Unknown",
    cc_abbreviation: row.cc_institution?.abbreviation ?? null,
    target_name: row.target_institution?.name ?? "Unknown",
    target_abbreviation: row.target_institution?.abbreviation ?? null,
    target_major: row.target_major,
    transfer_year: row.transfer_year,
    outcome: row.outcome,
    verification_status: row.verification_status,
    playbook_data: row.playbook_data,
  };
}

function buildHeadline(playbook: PlaybookDetail) {
  return `${playbook.cc_abbreviation ?? playbook.cc_name} to ${playbook.target_abbreviation ?? playbook.target_name} ${playbook.target_major} transfer playbook`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const playbook = await getPlaybook(id);

  if (!playbook) return { title: "Playbook not found | CareerAC" };

  const headline = buildHeadline(playbook);

  return {
    title: `${headline} | CareerAC`,
    description: `Verified transfer story from ${playbook.cc_name} to ${playbook.target_name} for ${playbook.target_major}.`,
    keywords: ["UCLA transfer", "SMC to Berkeley", `${playbook.cc_name} transfer`, `${playbook.target_name} transfer`, playbook.target_major],
    openGraph: {
      title: `${headline} | CareerAC`,
      description: `Verified transfer story from ${playbook.cc_name} to ${playbook.target_name} for ${playbook.target_major}.`,
      type: "article",
    },
  };
}

export default async function PlaybookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playbook = await getPlaybook(id);

  if (!playbook) notFound();

  const isVerified = playbook.verification_status === "verified";
  const playbookData = playbook.playbook_data as PlaybookData | null;
  const semesters = playbookData?.semesters ?? [];
  const failureEvents = playbookData?.failure_events ?? [];
  const tips = playbookData?.tips ?? [];
  const headline = buildHeadline(playbook);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline,
            description: `Verified transfer story from ${playbook.cc_name} to ${playbook.target_name} for ${playbook.target_major}.`,
            keywords: ["UCLA transfer", "SMC to Berkeley", playbook.target_major],
            about: [
              { "@type": "Thing", name: `${playbook.cc_name} to ${playbook.target_name}` },
              { "@type": "Thing", name: playbook.target_major },
            ],
          }),
        }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/playbooks" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Playbooks
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-700 dark:text-zinc-300" data-testid="detail-cc">{playbook.cc_abbreviation ?? playbook.cc_name}</span>
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-medium text-zinc-700 dark:text-zinc-300" data-testid="detail-target">{playbook.target_abbreviation ?? playbook.target_name}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl" data-testid="detail-major">{playbook.target_major}</h1>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400" data-testid="detail-year">Transferred in {playbook.transfer_year}</p>
            </div>

            <div className="flex-shrink-0">
              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400" data-testid="verified-badge">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Outcome</h2>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white" data-testid="outcome">
            {playbook.outcome === "transferred" && "Successfully transferred"}
            {playbook.outcome === "in_progress" && "Currently in progress"}
            {playbook.outcome === "changed_direction" && "Changed direction"}
          </p>
        </div>

        {failureEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Challenges & Recovery
            </h2>
            <div className="space-y-4">
              {failureEvents.map((event, index) => (
                <div key={index} className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/30" data-testid="failure-event">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${event.failure_type === "failed" ? "bg-red-100 text-red-700 ring-red-700/10 dark:bg-red-900/50 dark:text-red-400 dark:ring-red-600/30" : event.failure_type === "cancelled" ? "bg-orange-100 text-orange-700 ring-orange-700/10 dark:bg-orange-900/50 dark:text-orange-400 dark:ring-orange-600/30" : "bg-yellow-100 text-yellow-700 ring-yellow-700/10 dark:bg-yellow-900/50 dark:text-yellow-400 dark:ring-yellow-600/30"}`} data-testid="failure-type">
                        {event.failure_type === "failed" && "Failed"}
                        {event.failure_type === "cancelled" && "Cancelled"}
                        {event.failure_type === "waitlisted" && "Waitlisted"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-zinc-900 dark:text-white" data-testid="failure-course">{event.course_code}</h3>
                      {event.reason && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400" data-testid="failure-reason">{event.reason}</p>}
                      {event.resolution && (
                        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/50 dark:bg-emerald-900/20">
                          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Resolution
                          </p>
                          <p className="text-sm text-emerald-700 dark:text-emerald-300" data-testid="failure-resolution">{event.resolution}</p>
                        </div>
                      )}
                      {event.lessons_learned && <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400" data-testid="failure-lessons">💡 {event.lessons_learned}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Semester-by-Semester Path</h2>
          <div className="space-y-6" data-testid="semester-list">
            {semesters.map((semester) => (
              <div key={semester.number} className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900" data-testid="semester">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <h3 className="font-medium text-zinc-900 dark:text-white" data-testid="semester-title">Semester {semester.number}</h3>
                  {semester.total_units && <span className="text-sm text-zinc-500 dark:text-zinc-400" data-testid="semester-units">{semester.total_units} units</span>}
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {semester.courses?.map((course, courseIndex) => (
                    <div key={courseIndex} className="px-4 py-3" data-testid="course-entry">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400" data-testid="course-code">{course.course_code}</span>
                            {course.grade && (
                              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${course.grade.startsWith("A") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : course.grade.startsWith("B") ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`} data-testid="course-grade">
                                {course.grade}
                              </span>
                            )}
                            {course.status === "in_progress" && <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">In Progress</span>}
                            {course.status === "planned" && <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Planned</span>}
                          </div>
                          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400" data-testid="course-title">{course.title}</p>
                          {course.note && <p className="mt-1 text-xs italic text-zinc-500 dark:text-zinc-500">Note: {course.note}</p>}
                        </div>
                        <span className="flex-shrink-0 text-sm text-zinc-400 dark:text-zinc-500">{course.units} {course.units === 1 ? "unit" : "units"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {tips.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
              <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              Tips from this Student
            </h2>
            <ul className="space-y-2">
              {tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Want to build your own plan?</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Join CareerAC to create a personalized transfer plan and track every semester.</p>
          <Link href="/auth/signup" className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500">
            Join CareerAC to create your plan
          </Link>
        </div>
      </div>
    </>
  );
}
