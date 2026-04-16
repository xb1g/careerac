-- Migration 020: Biochemistry major seed data based on UC Transfer Pathways
-- Participating UC campuses: UCLA, Riverside, Davis, Irvine, Santa Barbara, Santa Cruz, Berkeley
-- Major requirements covered:
--   - General biology with lab (full introductory sequence)
--   - General chemistry with lab (one-year sequence)
--   - Calculus for STEM majors (one-year sequence)
--   - Organic chemistry with lab (one-year sequence)

-- ============================================================
-- COURSES - Biochemistry Major (LA Pierce College)
-- Institution ID: a0000000-0000-0000-0000-000000000007
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-0000000000a0', 'a0000000-0000-0000-0000-000000000007', 'BIOL 3', 'General Biology I', 4, 'Cell biology, genetics, evolution, and laboratory work'),
  ('g0000000-0000-0000-0000-0000000000a1', 'a0000000-0000-0000-0000-000000000007', 'BIOL 4', 'General Biology II', 4, 'Organismal biology, ecology, and laboratory work'),
  ('g0000000-0000-0000-0000-0000000000a2', 'a0000000-0000-0000-0000-000000000007', 'CHEM 101', 'General Chemistry I', 5, 'Chemical principles, stoichiometry, and laboratory work'),
  ('g0000000-0000-0000-0000-0000000000a3', 'a0000000-0000-0000-0000-000000000007', 'CHEM 102', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and laboratory work'),
  ('g0000000-0000-0000-0000-0000000000a4', 'a0000000-0000-0000-0000-000000000007', 'MATH 261', 'Calculus I', 5, 'Differential calculus for STEM majors'),
  ('g0000000-0000-0000-0000-0000000000a5', 'a0000000-0000-0000-0000-000000000007', 'MATH 262', 'Calculus II', 5, 'Integral calculus and applications for STEM majors'),
  ('g0000000-0000-0000-0000-0000000000a6', 'a0000000-0000-0000-0000-000000000007', 'CHEM 211', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reactions of organic compounds with laboratory work'),
  ('g0000000-0000-0000-0000-0000000000a7', 'a0000000-0000-0000-0000-000000000007', 'CHEM 212', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory work') on conflict do nothing;

-- ============================================================
-- COURSES - Biochemistry Major (UC Santa Barbara)
-- Institution ID: b0000000-0000-0000-0000-000000000006
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-0000000000a0', 'b0000000-0000-0000-0000-000000000006', 'BIOL 1A', 'Cell and Molecular Biology', 5, 'Introductory biology with laboratory'),
  ('h0000000-0000-0000-0000-0000000000a1', 'b0000000-0000-0000-0000-000000000006', 'BIOL 1B', 'Organismal Biology and Ecology', 5, 'Introductory biology with laboratory'),
  ('h0000000-0000-0000-0000-0000000000a2', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'General chemistry with laboratory'),
  ('h0000000-0000-0000-0000-0000000000a3', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'General chemistry with laboratory'),
  ('h0000000-0000-0000-0000-0000000000a4', 'b0000000-0000-0000-0000-000000000006', 'MATH 3A', 'Calculus with Applications I', 4, 'Single variable calculus for STEM majors'),
  ('h0000000-0000-0000-0000-0000000000a5', 'b0000000-0000-0000-0000-000000000006', 'MATH 3B', 'Calculus with Applications II', 4, 'Continuation of single variable calculus for STEM majors'),
  ('h0000000-0000-0000-0000-0000000000a6', 'b0000000-0000-0000-0000-000000000006', 'CHEM 109A', 'Organic Chemistry I', 5, 'Organic chemistry with laboratory'),
  ('h0000000-0000-0000-0000-0000000000a7', 'b0000000-0000-0000-0000-000000000006', 'CHEM 109B', 'Organic Chemistry II', 5, 'Organic chemistry with laboratory') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - LA Pierce College to UCSB
-- Major: Biochemistry | Effective year: 2024
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-0000000000a0', 'h0000000-0000-0000-0000-0000000000a0', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a1', 'h0000000-0000-0000-0000-0000000000a1', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a2', 'h0000000-0000-0000-0000-0000000000a2', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a3', 'h0000000-0000-0000-0000-0000000000a3', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a4', 'h0000000-0000-0000-0000-0000000000a4', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a5', 'h0000000-0000-0000-0000-0000000000a5', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a6', 'h0000000-0000-0000-0000-0000000000a6', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
  ('g0000000-0000-0000-0000-0000000000a7', 'h0000000-0000-0000-0000-0000000000a7', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024) on conflict do nothing;

-- ============================================================
-- PREREQUISITES
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-0000000000a1', 'g0000000-0000-0000-0000-0000000000a0'),
  ('g0000000-0000-0000-0000-0000000000a3', 'g0000000-0000-0000-0000-0000000000a2'),
  ('g0000000-0000-0000-0000-0000000000a5', 'g0000000-0000-0000-0000-0000000000a4'),
  ('g0000000-0000-0000-0000-0000000000a6', 'g0000000-0000-0000-0000-0000000000a3'),
  ('g0000000-0000-0000-0000-0000000000a7', 'g0000000-0000-0000-0000-0000000000a6'),
  ('h0000000-0000-0000-0000-0000000000a1', 'h0000000-0000-0000-0000-0000000000a0'),
  ('h0000000-0000-0000-0000-0000000000a3', 'h0000000-0000-0000-0000-0000000000a2'),
  ('h0000000-0000-0000-0000-0000000000a5', 'h0000000-0000-0000-0000-0000000000a4'),
  ('h0000000-0000-0000-0000-0000000000a6', 'h0000000-0000-0000-0000-0000000000a3'),
  ('h0000000-0000-0000-0000-0000000000a7', 'h0000000-0000-0000-0000-0000000000a6') on conflict do nothing;
