-- Migration 043: Comparison targets and per-user school comparison preferences

create table if not exists user_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid not null references institutions(id) on delete cascade,
  major_id uuid references majors(id) on delete set null,
  priority_order integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_targets_user_id on user_targets(user_id);
create index if not exists idx_user_targets_institution_id on user_targets(institution_id);
create unique index if not exists idx_user_targets_user_institution_major
  on user_targets(user_id, institution_id, coalesce(major_id, '00000000-0000-0000-0000-000000000000'::uuid));

alter table user_targets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_targets' and policyname = 'Users can view their own targets'
  ) then
    create policy "Users can view their own targets"
      on user_targets for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_targets' and policyname = 'Users can insert their own targets'
  ) then
    create policy "Users can insert their own targets"
      on user_targets for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_targets' and policyname = 'Users can update their own targets'
  ) then
    create policy "Users can update their own targets"
      on user_targets for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_targets' and policyname = 'Users can delete their own targets'
  ) then
    create policy "Users can delete their own targets"
      on user_targets for delete
      using (auth.uid() = user_id);
  end if;
end
$$;

alter table transfer_plans
  add column if not exists comparison_targets jsonb;
