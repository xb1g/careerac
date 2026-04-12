import { createClient } from "@/utils/supabase/server";
import { PlaybookCard } from "@/components/playbook-card";
import { PlaybookFilters } from "@/components/playbook-filters";
import Link from "next/link";

interface PlaybookWithDetails {
  id: string;
  cc_name: string;
  cc_abbreviation: string | null;
  target_name: string;
  target_abbreviation: string | null;
  target_major: string;
  transfer_year: number;
  outcome: string;
  verification_status: string;
}

interface InstitutionRef {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface PlaybookRow {
  id: string;
  target_major: string;
  transfer_year: number;
  outcome: string;
  verification_status: string;
  cc_institution: InstitutionRef | null;
  target_institution: InstitutionRef | null;
}

interface FilterOptionRow {
  cc_institution?: InstitutionRef | null;
  target_institution?: InstitutionRef | null;
  target_major?: string | null;
}

async function getPlaybooks(filters?: {
  cc_id?: string;
  target_id?: string;
  major?: string;
}): Promise<PlaybookWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("playbooks")
    .select(
      `
      id,
      target_major,
      transfer_year,
      outcome,
      verification_status,
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
    .order("created_at", { ascending: false });

  if (filters?.cc_id) {
    query = query.eq("cc_institution_id", filters.cc_id);
  }
  if (filters?.target_id) {
    query = query.eq("target_institution_id", filters.target_id);
  }
  if (filters?.major) {
    query = query.eq("target_major", filters.major);
  }

  const { data, error } = await query.returns<PlaybookRow[]>();

  if (error) {
    console.error("Error fetching playbooks:", error);
    return [];
  }

  return (data ?? []).map((pb) => ({
    id: pb.id,
    cc_name: pb.cc_institution?.name ?? "Unknown",
    cc_abbreviation: pb.cc_institution?.abbreviation ?? null,
    target_name: pb.target_institution?.name ?? "Unknown",
    target_abbreviation: pb.target_institution?.abbreviation ?? null,
    target_major: pb.target_major,
    transfer_year: pb.transfer_year,
    outcome: pb.outcome,
    verification_status: pb.verification_status,
  }));
}

async function getFilterOptions(): Promise<{
  ccs: { id: string; name: string; abbreviation: string | null }[];
  targets: { id: string; name: string; abbreviation: string | null }[];
  majors: string[];
}> {
  const supabase = await createClient();

  // Get unique CCs from playbooks
  const { data: ccData } = await supabase
    .from("playbooks")
    .select(
      `
      cc_institution:cc_institution_id (
        id,
        name,
        abbreviation
      )
    `
    )
    .returns<FilterOptionRow[]>();

  // Get unique targets from playbooks
  const { data: targetData } = await supabase
    .from("playbooks")
    .select(
      `
      target_institution:target_institution_id (
        id,
        name,
        abbreviation
      )
    `
    )
    .returns<FilterOptionRow[]>();

  // Get unique majors from playbooks
  const { data: majorData } = await supabase
    .from("playbooks")
    .select("target_major")
    .returns<{ target_major: string | null }[]>();

  // Deduplicate
  const ccMap = new Map<string, { id: string; name: string; abbreviation: string | null }>();
  for (const item of ccData ?? []) {
    const inst = item.cc_institution;
    if (inst && !ccMap.has(inst.id)) {
      ccMap.set(inst.id, { id: inst.id, name: inst.name, abbreviation: inst.abbreviation });
    }
  }

  const targetMap = new Map<string, { id: string; name: string; abbreviation: string | null }>();
  for (const item of targetData ?? []) {
    const inst = item.target_institution;
    if (inst && !targetMap.has(inst.id)) {
      targetMap.set(inst.id, { id: inst.id, name: inst.name, abbreviation: inst.abbreviation });
    }
  }

  const majorSet = new Set<string>();
  for (const item of majorData ?? []) {
    if (item.target_major) {
      majorSet.add(item.target_major);
    }
  }

  return {
    ccs: Array.from(ccMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    targets: Array.from(targetMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    majors: Array.from(majorSet).sort(),
  };
}

interface PlaybooksPageProps {
  searchParams: Promise<{ cc?: string; target?: string; major?: string }>;
}

export default async function PlaybooksPage({ searchParams }: PlaybooksPageProps) {
  const params = await searchParams;
  const filters = {
    cc_id: params?.cc,
    target_id: params?.target,
    major: params?.major,
  };

  const [playbooks, filterOptions] = await Promise.all([
    getPlaybooks(filters),
    getFilterOptions(),
  ]);

  const hasActiveFilters = !!(params?.cc || params?.target || params?.major);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Community Playbooks
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Learn from transfer students who&apos;ve walked the path before you.
        </p>
      </div>

      {/* Filters */}
      <PlaybookFilters
        options={filterOptions}
        currentFilters={{
          cc: params?.cc ?? "",
          target: params?.target ?? "",
          major: params?.major ?? "",
        }}
      />

      {/* Share Your Story CTA */}
      <div className="mb-6 mt-6 flex justify-end">
        <Link
          href="/playbooks/submit"
          data-testid="share-story-cta"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Share Your Story
        </Link>
      </div>

      {/* Playbook Cards */}
      {playbooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-12 text-center" data-testid="empty-state">
          <div className="mx-auto h-12 w-12 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 20.25-5.625-5.625m0 0a4.125 4.125 0 1 0-5.85-5.85 4.125 4.125 0 0 0 5.85 5.85ZM13.5 6.75a3.375 3.375 0 1 0-6.75 0 3.375 3.375 0 0 0 6.75 0Z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {hasActiveFilters ? "No playbooks found" : "No playbooks yet"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results."
              : "Be the first to share your transfer story and help future students!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="playbook-list">
          {playbooks.map((playbook) => (
            <PlaybookCard key={playbook.id} playbook={playbook} />
          ))}
        </div>
      )}
    </div>
  );
}
