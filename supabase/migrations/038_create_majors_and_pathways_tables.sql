-- Migration 038: Create majors and transfer_pathways tables
-- These tables support the canonical major catalog and institution-specific
-- transfer pathway requirements referenced by migrations 026-037.

-- Majors catalog
create table if not exists majors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  degree_type text,
  total_units_required integer,
  participating_uc_campuses text[],
  created_at timestamptz not null default now()
);

-- Transfer pathway requirements for a major at a specific institution
create table if not exists transfer_pathways (
  id uuid primary key default gen_random_uuid(),
  major_id uuid not null references majors(id) on delete cascade,
  institution_id uuid not null references institutions(id) on delete cascade,
  requirements text,
  created_at timestamptz not null default now()
);

-- Indexes for common lookups
create index if not exists idx_majors_name on majors(name);
create index if not exists idx_transfer_pathways_major_id on transfer_pathways(major_id);
create index if not exists idx_transfer_pathways_institution_id on transfer_pathways(institution_id);

-- Table comments
comment on table majors is 'Canonical major metadata used to organize transfer pathways and degree information.';
comment on table transfer_pathways is 'Markdown transfer requirements for a major at a specific institution.';
