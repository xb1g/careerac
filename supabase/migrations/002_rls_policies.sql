-- Migration 002: RLS policies for all tables

-- Enable RLS on all tables
alter table institutions enable row level security;
alter table courses enable row level security;
alter table articulation_agreements enable row level security;
alter table prerequisites enable row level security;
alter table profiles enable row level security;
alter table transfer_plans enable row level security;
alter table plan_courses enable row level security;
alter table failure_events enable row level security;
alter table playbooks enable row level security;

-- institutions: readable by everyone
create policy "institutions are viewable by everyone"
  on institutions for select
  using (true);

-- courses: readable by everyone
create policy "courses are viewable by everyone"
  on courses for select
  using (true);

-- articulation_agreements: readable by everyone
create policy "articulation_agreements are viewable by everyone"
  on articulation_agreements for select
  using (true);

-- prerequisites: readable by everyone
create policy "prerequisites are viewable by everyone"
  on prerequisites for select
  using (true);

-- profiles: users can only view their own profile
create policy "users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- profiles: users can update their own profile
create policy "users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- profiles: users can insert their own profile
create policy "users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- transfer_plans: users can only access their own plans
create policy "users can view own plans"
  on transfer_plans for select
  using (auth.uid() = user_id);

create policy "users can insert own plans"
  on transfer_plans for insert
  with check (auth.uid() = user_id);

create policy "users can update own plans"
  on transfer_plans for update
  using (auth.uid() = user_id);

create policy "users can delete own plans"
  on transfer_plans for delete
  using (auth.uid() = user_id);

-- plan_courses: users can access courses in their own plans
create policy "users can view plan courses in own plans"
  on plan_courses for select
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_courses.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can insert plan courses in own plans"
  on plan_courses for insert
  with check (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_courses.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can update plan courses in own plans"
  on plan_courses for update
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_courses.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can delete plan courses in own plans"
  on plan_courses for delete
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = plan_courses.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

-- failure_events: users can access failure events in their own plans
create policy "users can view failure events in own plans"
  on failure_events for select
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = failure_events.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can insert failure events in own plans"
  on failure_events for insert
  with check (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = failure_events.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

create policy "users can update failure events in own plans"
  on failure_events for update
  using (
    exists (
      select 1 from transfer_plans
      where transfer_plans.id = failure_events.plan_id
      and transfer_plans.user_id = auth.uid()
    )
  );

-- playbooks: readable by everyone, writable only by owner
create policy "playbooks are viewable by everyone"
  on playbooks for select
  using (true);

create policy "users can insert own playbooks"
  on playbooks for insert
  with check (auth.uid() = user_id);

create policy "users can update own playbooks"
  on playbooks for update
  using (auth.uid() = user_id);

create policy "users can delete own playbooks"
  on playbooks for delete
  using (auth.uid() = user_id);
