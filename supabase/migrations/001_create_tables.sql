-- Migration 001: Create all tables
-- Institutions, courses, articulation agreements, prerequisites,
-- profiles, transfer plans, plan courses, failure events, playbooks

-- Enable UUID generation (built-in to PG 13+)
-- Note: uuid-ossp may not be available in all environments,
-- so we use gen_random_uuid() which is always available.

-- Institutions (community colleges and universities)
create table if not exists institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('cc', 'university')),
  state text not null,
  city text,
  abbreviation text,
  created_at timestamptz not null default now()
);

-- Courses (catalog entries)
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  code text not null,
  title text not null,
  units numeric not null default 3,
  description text,
  created_at timestamptz not null default now(),
  unique(institution_id, code)
);

-- Articulation agreements (transfer equivalencies)
create table if not exists articulation_agreements (
  id uuid primary key default gen_random_uuid(),
  cc_course_id uuid not null references courses(id) on delete cascade,
  university_course_id uuid not null references courses(id) on delete cascade,
  cc_institution_id uuid not null references institutions(id) on delete cascade,
  university_institution_id uuid not null references institutions(id) on delete cascade,
  major text,
  effective_year integer not null default extract(year from now()),
  notes text,
  created_at timestamptz not null default now()
);

-- Prerequisites
create table if not exists prerequisites (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  prerequisite_course_id uuid not null references courses(id) on delete cascade,
  is_corequisite boolean not null default false,
  created_at timestamptz not null default now(),
  unique(course_id, prerequisite_course_id)
);

-- User profiles (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

-- Transfer plans
create table if not exists transfer_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  cc_institution_id uuid not null references institutions(id) on delete cascade,
  target_institution_id uuid not null references institutions(id) on delete cascade,
  target_major text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed')),
  plan_data jsonb,
  chat_history jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Plan courses (individual course entries within a plan)
create table if not exists plan_courses (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references transfer_plans(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  semester_number integer not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled', 'waitlisted', 'failed')),
  alternative_for uuid references plan_courses(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Failure events
create table if not exists failure_events (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references transfer_plans(id) on delete cascade,
  plan_course_id uuid not null references plan_courses(id) on delete cascade,
  failure_type text not null check (failure_type in ('cancelled', 'waitlisted', 'failed')),
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- Playbooks (community transfer stories)
create table if not exists playbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cc_institution_id uuid not null references institutions(id) on delete cascade,
  target_institution_id uuid not null references institutions(id) on delete cascade,
  target_major text not null,
  transfer_year integer not null,
  outcome text not null check (outcome in ('transferred', 'in_progress', 'changed_direction')),
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  playbook_data jsonb,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_courses_institution on courses(institution_id);
create index if not exists idx_articulation_cc_course on articulation_agreements(cc_course_id);
create index if not exists idx_articulation_university_course on articulation_agreements(university_course_id);
create index if not exists idx_articulation_cc_institution on articulation_agreements(cc_institution_id);
create index if not exists idx_articulation_university_institution on articulation_agreements(university_institution_id);
create index if not exists idx_articulation_major on articulation_agreements(major);
create index if not exists idx_prerequisites_course on prerequisites(course_id);
create index if not exists idx_prerequisites_prerequisite on prerequisites(prerequisite_course_id);
create index if not exists idx_transfer_plans_user on transfer_plans(user_id);
create index if not exists idx_plan_courses_plan on plan_courses(plan_id);
create index if not exists idx_failure_events_plan on failure_events(plan_id);
create index if not exists idx_failure_events_plan_course on failure_events(plan_course_id);
create index if not exists idx_playbooks_user on playbooks(user_id);
create index if not exists idx_playbooks_cc on playbooks(cc_institution_id);
create index if not exists idx_playbooks_target on playbooks(target_institution_id);
create index if not exists idx_playbooks_major on playbooks(target_major);
create index if not exists idx_playbooks_verification on playbooks(verification_status, outcome);
