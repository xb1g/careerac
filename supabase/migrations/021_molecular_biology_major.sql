-- Migration 021: Molecular Biology major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Riverside,
-- San Diego, Santa Barbara, Santa Cruz
-- Major requirements covered:
--   - General biology with lab (full introductory sequence)
--   - General chemistry with lab (one-year sequence)
--   - Calculus for STEM majors (one-year sequence)
--   - Organic chemistry with lab (one-year sequence)

-- ============================================================
-- COURSES - Molecular Biology Major (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-0000000000c0', 'a0000000-0000-0000-0000-000000000001', 'BIO 1A', 'General Biology I with Lab', 4, 'Cell biology, molecular biology, genetics, and laboratory techniques'),
  ('g0000000-0000-0000-0000-0000000000c1', 'a0000000-0000-0000-0000-000000000001', 'BIO 1B', 'General Biology II with Lab', 4, 'Evolution, biodiversity, and organismal biology with laboratory'),
  ('g0000000-0000-0000-0000-0000000000c2', 'a0000000-0000-0000-0000-000000000001', 'BIO 1C', 'General Biology III with Lab', 4, 'Ecology, physiology, and advanced biological systems with laboratory'),
  ('g0000000-0000-0000-0000-0000000000c3', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I with Lab', 5, 'Atomic structure, bonding, stoichiometry, and chemical calculations with laboratory'),
  ('g0000000-0000-0000-0000-0000000000c4', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II with Lab', 5, 'Thermodynamics, equilibrium, kinetics, and acids and bases with laboratory'),
  ('g0000000-0000-0000-0000-0000000000c5', 'a0000000-0000-0000-0000-000000000001', 'CHEM 13', 'General Chemistry III with Lab', 5, 'Electrochemistry, coordination chemistry, and spectroscopy with laboratory'),
  ('g0000000-0000-0000-0000-0000000000c6', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I for STEM Majors', 5, 'Limits, derivatives, and applications for science majors'),
  ('g0000000-0000-0000-0000-0000000000c7', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II for STEM Majors', 5, 'Integration, techniques of integration, and applications for science majors'),
  ('g0000000-0000-0000-0000-0000000000c8', 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I with Lab', 5, 'Structure, bonding, nomenclature, and reaction fundamentals with laboratory'),
  ('g0000000-0000-0000-0000-0000000000c9', 'a0000000-0000-0000-0000-000000000001', 'CHEM 22', 'Organic Chemistry II with Lab', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory'),
  ('g0000000-0000-0000-0000-0000000000ca', 'a0000000-0000-0000-0000-000000000001', 'CHEM 23', 'Organic Chemistry III with Lab', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods with laboratory');

-- ============================================================
-- COURSES - Molecular Biology Major (UC Irvine)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-0000000000c0', 'b0000000-0000-0000-0000-000000000006', 'BIO SCI 93', 'General Biology I', 4, 'Cell biology, molecular biology, genetics, and laboratory foundations'),
  ('h0000000-0000-0000-0000-0000000000c1', 'b0000000-0000-0000-0000-000000000006', 'BIO SCI 94', 'General Biology II', 4, 'Evolution, biodiversity, and organismal biology'),
  ('h0000000-0000-0000-0000-0000000000c2', 'b0000000-0000-0000-0000-000000000006', 'BIO SCI 95', 'General Biology III', 4, 'Ecology, physiology, and advanced biological systems'),
  ('h0000000-0000-0000-0000-0000000000c3', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'Atomic structure, bonding, stoichiometry, and chemical calculations'),
  ('h0000000-0000-0000-0000-0000000000c4', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'Thermodynamics, equilibrium, kinetics, and acids and bases'),
  ('h0000000-0000-0000-0000-0000000000c5', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1C', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and spectroscopy'),
  ('h0000000-0000-0000-0000-0000000000c6', 'b0000000-0000-0000-0000-000000000006', 'MATH 2A', 'Calculus for STEM Majors I', 5, 'Limits, derivatives, and applications for science majors'),
  ('h0000000-0000-0000-0000-0000000000c7', 'b0000000-0000-0000-0000-000000000006', 'MATH 2B', 'Calculus for STEM Majors II', 5, 'Integration, techniques of integration, and applications for science majors'),
  ('h0000000-0000-0000-0000-0000000000c8', 'b0000000-0000-0000-0000-000000000006', 'CHEM 51A', 'Organic Chemistry I', 5, 'Structure, bonding, nomenclature, and reaction fundamentals'),
  ('h0000000-0000-0000-0000-0000000000c9', 'b0000000-0000-0000-0000-000000000006', 'CHEM 51B', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy'),
  ('h0000000-0000-0000-0000-0000000000ca', 'b0000000-0000-0000-0000-000000000006', 'CHEM 51C', 'Organic Chemistry III', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods');

-- ============================================================
-- ARTICULATION AGREEMENTS - Santa Monica College to UC Irvine
-- Major: Molecular Biology | Effective year: 2024
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-0000000000c0', 'h0000000-0000-0000-0000-0000000000c0', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c1', 'h0000000-0000-0000-0000-0000000000c1', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c2', 'h0000000-0000-0000-0000-0000000000c2', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c3', 'h0000000-0000-0000-0000-0000000000c3', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c4', 'h0000000-0000-0000-0000-0000000000c4', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c5', 'h0000000-0000-0000-0000-0000000000c5', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c6', 'h0000000-0000-0000-0000-0000000000c6', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c7', 'h0000000-0000-0000-0000-0000000000c7', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c8', 'h0000000-0000-0000-0000-0000000000c8', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000c9', 'h0000000-0000-0000-0000-0000000000c9', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
  ('g0000000-0000-0000-0000-0000000000ca', 'h0000000-0000-0000-0000-0000000000ca', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024);

-- ============================================================
-- PREREQUISITE RELATIONSHIPS
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-0000000000c1', 'g0000000-0000-0000-0000-0000000000c0'),
  ('g0000000-0000-0000-0000-0000000000c2', 'g0000000-0000-0000-0000-0000000000c1'),
  ('g0000000-0000-0000-0000-0000000000c4', 'g0000000-0000-0000-0000-0000000000c3'),
  ('g0000000-0000-0000-0000-0000000000c5', 'g0000000-0000-0000-0000-0000000000c4'),
  ('g0000000-0000-0000-0000-0000000000c7', 'g0000000-0000-0000-0000-0000000000c6'),
  ('g0000000-0000-0000-0000-0000000000c8', 'g0000000-0000-0000-0000-0000000000c4'),
  ('g0000000-0000-0000-0000-0000000000c9', 'g0000000-0000-0000-0000-0000000000c8'),
  ('g0000000-0000-0000-0000-0000000000ca', 'g0000000-0000-0000-0000-0000000000c9'),
  ('h0000000-0000-0000-0000-0000000000c1', 'h0000000-0000-0000-0000-0000000000c0'),
  ('h0000000-0000-0000-0000-0000000000c2', 'h0000000-0000-0000-0000-0000000000c1'),
  ('h0000000-0000-0000-0000-0000000000c4', 'h0000000-0000-0000-0000-0000000000c3'),
  ('h0000000-0000-0000-0000-0000000000c5', 'h0000000-0000-0000-0000-0000000000c4'),
  ('h0000000-0000-0000-0000-0000000000c7', 'h0000000-0000-0000-0000-0000000000c6'),
  ('h0000000-0000-0000-0000-0000000000c8', 'h0000000-0000-0000-0000-0000000000c4'),
  ('h0000000-0000-0000-0000-0000000000c9', 'h0000000-0000-0000-0000-0000000000c8'),
  ('h0000000-0000-0000-0000-0000000000ca', 'h0000000-0000-0000-0000-0000000000c9');
