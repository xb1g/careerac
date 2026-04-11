-- Migration 007: Make institution IDs nullable in transfer_plans
--
-- Problem: When AI generates a plan, the institution name from the response
-- might not match any institution in the database. The code was falling back
-- to empty strings "" which violated the NOT NULL + FK constraint on
-- cc_institution_id and target_institution_id.
--
-- Fix: Allow NULL values so plans can be saved even when institution
-- resolution fails. The institution data is useful but not required.

-- Drop existing FK constraints
alter table transfer_plans
  drop constraint if exists transfer_plans_cc_institution_id_fkey,
  drop constraint if exists transfer_plans_target_institution_id_fkey;

-- Make columns nullable
alter table transfer_plans
  alter column cc_institution_id drop not null,
  alter column target_institution_id drop not null;

-- Re-add FK constraints (now allowing NULL)
alter table transfer_plans
  add constraint transfer_plans_cc_institution_id_fkey
    foreign key (cc_institution_id) references institutions(id) on delete set null,
  add constraint transfer_plans_target_institution_id_fkey
    foreign key (target_institution_id) references institutions(id) on delete set null;
