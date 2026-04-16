-- Migration 019: Environmental Science major seed data
-- UC Transfer Pathways requirements:
--   - Single variable calculus (full sequence)
--   - Calculus-based physics (full sequence with lab)
--   - Introductory biology (full sequence with lab)
--   - General chemistry (full sequence with lab)
--   - Organic chemistry (one semester)
--   - Introductory statistics (one course)
--   - Principles of economics (microeconomics, one course)

-- ============================================================
-- COURSES - Long Beach City College (CC)
-- Institution ID: a0000000-0000-0000-0000-000000000006
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-000000000080', 'a0000000-0000-0000-0000-000000000006', 'MATH 1A', 'Calculus I', 5, 'Differential calculus for STEM majors'),
  ('g0000000-0000-0000-0000-000000000081', 'a0000000-0000-0000-0000-000000000006', 'MATH 1B', 'Calculus II', 5, 'Integral calculus and series'),
  ('g0000000-0000-0000-0000-000000000082', 'a0000000-0000-0000-0000-000000000006', 'PHYS 2A', 'Physics for Scientists and Engineers I', 4, 'Mechanics with laboratory'),
  ('g0000000-0000-0000-0000-000000000083', 'a0000000-0000-0000-0000-000000000006', 'PHYS 2B', 'Physics for Scientists and Engineers II', 4, 'Electricity, magnetism, and optics with laboratory'),
  ('g0000000-0000-0000-0000-000000000084', 'a0000000-0000-0000-0000-000000000006', 'BIO 1', 'General Biology I', 4, 'Cell biology, genetics, and evolution with laboratory'),
  ('g0000000-0000-0000-0000-000000000085', 'a0000000-0000-0000-0000-000000000006', 'BIO 2', 'General Biology II', 4, 'Organismal biology, ecology, and diversity with laboratory'),
  ('g0000000-0000-0000-0000-000000000086', 'a0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'Chemical principles, stoichiometry, and laboratory'),
  ('g0000000-0000-0000-0000-000000000087', 'a0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and laboratory'),
  ('g0000000-0000-0000-0000-000000000088', 'a0000000-0000-0000-0000-000000000006', 'CHEM 2A', 'Organic Chemistry I', 5, 'Organic structure, nomenclature, and reactions with laboratory'),
  ('g0000000-0000-0000-0000-000000000089', 'a0000000-0000-0000-0000-000000000006', 'STAT 1', 'Introduction to Statistics', 4, 'Descriptive and inferential statistics'),
  ('g0000000-0000-0000-0000-000000000090', 'a0000000-0000-0000-0000-000000000006', 'ECON 1', 'Principles of Microeconomics', 3, 'Consumer and firm behavior, market structure, and efficiency') on conflict do nothing;

-- ============================================================
-- COURSES - UC Santa Barbara (University)
-- Institution ID: b0000000-0000-0000-0000-000000000006
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-000000000080', 'b0000000-0000-0000-0000-000000000006', 'MATH 3A', 'Calculus with Applications I', 4, 'Single variable calculus'),
  ('h0000000-0000-0000-0000-000000000081', 'b0000000-0000-0000-0000-000000000006', 'MATH 3B', 'Calculus with Applications II', 4, 'Continuation of single variable calculus'),
  ('h0000000-0000-0000-0000-000000000082', 'b0000000-0000-0000-0000-000000000006', 'PHYS 6A', 'Physics for Scientists and Engineers', 4, 'Mechanics with laboratory'),
  ('h0000000-0000-0000-0000-000000000083', 'b0000000-0000-0000-0000-000000000006', 'PHYS 6B', 'Physics for Scientists and Engineers', 4, 'Electricity and magnetism with laboratory'),
  ('h0000000-0000-0000-0000-000000000084', 'b0000000-0000-0000-0000-000000000006', 'BIOL 1A', 'Cell and Molecular Biology', 5, 'Introductory biology with laboratory'),
  ('h0000000-0000-0000-0000-000000000085', 'b0000000-0000-0000-0000-000000000006', 'BIOL 1B', 'Organismal Biology and Ecology', 5, 'Introductory biology with laboratory'),
  ('h0000000-0000-0000-0000-000000000086', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'General chemistry with laboratory'),
  ('h0000000-0000-0000-0000-000000000087', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'General chemistry with laboratory'),
  ('h0000000-0000-0000-0000-000000000088', 'b0000000-0000-0000-0000-000000000006', 'CHEM 109A', 'Organic Chemistry I', 5, 'Organic chemistry with laboratory'),
  ('h0000000-0000-0000-0000-000000000089', 'b0000000-0000-0000-0000-000000000006', 'PSTAT 5A', 'Introduction to Statistics', 4, 'Statistical methods and data analysis'),
  ('h0000000-0000-0000-0000-000000000090', 'b0000000-0000-0000-0000-000000000006', 'ECON 1', 'Introduction to Microeconomics', 4, 'Principles of microeconomic theory') on conflict do nothing;

-- ============================================================
-- PREREQUISITES
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-000000000081', 'g0000000-0000-0000-0000-000000000080'),
  ('g0000000-0000-0000-0000-000000000082', 'g0000000-0000-0000-0000-000000000080'),
  ('g0000000-0000-0000-0000-000000000083', 'g0000000-0000-0000-0000-000000000082'),
  ('g0000000-0000-0000-0000-000000000083', 'g0000000-0000-0000-0000-000000000081'),
  ('g0000000-0000-0000-0000-000000000085', 'g0000000-0000-0000-0000-000000000084'),
  ('g0000000-0000-0000-0000-000000000087', 'g0000000-0000-0000-0000-000000000086'),
  ('g0000000-0000-0000-0000-000000000088', 'g0000000-0000-0000-0000-000000000087'),
  ('h0000000-0000-0000-0000-000000000081', 'h0000000-0000-0000-0000-000000000080'),
  ('h0000000-0000-0000-0000-000000000082', 'h0000000-0000-0000-0000-000000000080'),
  ('h0000000-0000-0000-0000-000000000083', 'h0000000-0000-0000-0000-000000000082'),
  ('h0000000-0000-0000-0000-000000000085', 'h0000000-0000-0000-0000-000000000084'),
  ('h0000000-0000-0000-0000-000000000087', 'h0000000-0000-0000-0000-000000000086'),
  ('h0000000-0000-0000-0000-000000000088', 'h0000000-0000-0000-0000-000000000087') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - LBCC to UCSB Environmental Science
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-000000000080', 'h0000000-0000-0000-0000-000000000080', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000081', 'h0000000-0000-0000-0000-000000000081', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000082', 'h0000000-0000-0000-0000-000000000082', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000083', 'h0000000-0000-0000-0000-000000000083', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000084', 'h0000000-0000-0000-0000-000000000084', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000085', 'h0000000-0000-0000-0000-000000000085', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000086', 'h0000000-0000-0000-0000-000000000086', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000087', 'h0000000-0000-0000-0000-000000000087', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000088', 'h0000000-0000-0000-0000-000000000088', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000089', 'h0000000-0000-0000-0000-000000000089', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024),
  ('g0000000-0000-0000-0000-000000000090', 'h0000000-0000-0000-0000-000000000090', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Environmental Science', 2024) on conflict do nothing;
