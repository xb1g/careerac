-- Migration 060: Plan checkpoints for undo/restore

create table plan_checkpoints (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references transfer_plans(id) on delete cascade,
  plan_data jsonb not null,
  course_statuses jsonb not null default '[]'::jsonb,
  action_label text not null,
  created_at timestamptz not null default now()
);

create index idx_plan_checkpoints_plan_id on plan_checkpoints(plan_id);

-- RLS
alter table plan_checkpoints enable row level security;

create policy "users can view checkpoints for own plans"
  on plan_checkpoints for select
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_checkpoints.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can insert checkpoints for own plans"
  on plan_checkpoints for insert
  with check (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_checkpoints.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can delete checkpoints for own plans"
  on plan_checkpoints for delete
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_checkpoints.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );
