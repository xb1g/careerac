-- Migration 061: Institution tuition table for cost-of-attendance data
-- Stores per-year tuition and living cost estimates per institution

create table if not exists institution_tuition (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  academic_year integer not null,
  student_type text not null check (student_type in ('international', 'resident')),
  student_level text not null check (student_level in ('undergraduate', 'graduate')),
  tuition_and_fees integer not null,
  living_expenses integer not null,
  total_cost integer not null,
  notes text,
  created_at timestamptz not null default now(),
  unique(institution_id, academic_year, student_type, student_level)
);

create index if not exists idx_tuition_institution on institution_tuition(institution_id);
create index if not exists idx_tuition_year_type on institution_tuition(academic_year, student_type);

alter table institution_tuition enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'institution_tuition'
    and policyname = 'Anyone can view tuition data'
  ) then
    create policy "Anyone can view tuition data"
      on institution_tuition for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'institution_tuition'
    and policyname = 'Only service role can manage tuition data'
  ) then
    create policy "Only service role can manage tuition data"
      on institution_tuition for all using (auth.role() = 'service_role');
  end if;
end
$$;
