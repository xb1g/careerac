-- ============================================================
-- Orange Coast College - Course Data
-- Ready to apply once database schema is fixed
-- ============================================================
-- 
-- This file contains:
-- - 1 institution insert (Orange Coast College)
-- - 2820 course inserts (724 UC + 2096 CSU transferable)
--
-- Institution ID: a0000000-0000-0000-0000-000000000008
--
-- To apply manually:
-- 1. Fix migration 045 (remove short_name, location, description columns)
-- 2. Run: supabase db push --linked
-- OR
-- Run this file directly against your Supabase database

-- ============================================================

-- Institution
INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('a0000000-0000-0000-0000-000000000008', 'Orange Coast College', 'cc', 'CA', 'Costa Mesa', 'OCC');

-- See migration file for full course inserts:
-- supabase/migrations/046_add_occ_courses.sql
