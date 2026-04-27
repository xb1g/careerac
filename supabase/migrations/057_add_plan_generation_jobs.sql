create table if not exists plan_generation_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  transcript_id uuid references transcripts(id) on delete set null,
  request_payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'generating', 'completed', 'failed')),
  error_message text,
  plan_id uuid references transfer_plans(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table plan_generation_jobs enable row level security;

create policy "Users can manage own plan generation jobs"
  on plan_generation_jobs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function update_plan_generation_jobs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_plan_generation_jobs_updated_at on plan_generation_jobs;

create trigger set_plan_generation_jobs_updated_at
  before update on plan_generation_jobs
  for each row
  execute function update_plan_generation_jobs_updated_at();
