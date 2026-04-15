-- Migration 022: Chemical Engineering major seed data based on UC Transfer Pathways
-- Participating UC campuses: Santa Barbara
-- Major requirements covered:
--   - Calculus-based physics (full sequence with lab)
--   - Single variable calculus (full sequence)
--   - Multivariable calculus (one semester)
--   - Linear algebra (one course)
--   - Differential equations (one course)
--   - General chemistry (full sequence with lab)
--   - Organic chemistry (full sequence with lab)
--   - Programming (MATLAB recommended, one semester)

-- ============================================================
-- COURSES - Chemical Engineering Major (De Anza College)
-- Institution ID: a0000000-0000-0000-0000-000000000002
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-0000000000e0', 'a0000000-0000-0000-0000-000000000002', 'MATH 1A', 'Calculus I', 5, 'Limits, derivatives, and applications of single-variable calculus'),
  ('g0000000-0000-0000-0000-0000000000e1', 'a0000000-0000-0000-0000-000000000002', 'MATH 1B', 'Calculus II', 5, 'Integration, techniques of integration, and applications of single-variable calculus'),
  ('g0000000-0000-0000-0000-0000000000e2', 'a0000000-0000-0000-0000-000000000002', 'MATH 1C', 'Calculus III', 5, 'Sequences, series, and advanced integration in single-variable calculus'),
  ('g0000000-0000-0000-0000-0000000000e3', 'a0000000-0000-0000-0000-000000000002', 'MATH 1D', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, and multiple integrals'),
  ('g0000000-0000-0000-0000-0000000000e4', 'a0000000-0000-0000-0000-000000000002', 'MATH 1E', 'Linear Algebra', 5, 'Matrices, vector spaces, determinants, and linear transformations'),
  ('g0000000-0000-0000-0000-0000000000e5', 'a0000000-0000-0000-0000-000000000002', 'MATH 1F', 'Differential Equations', 5, 'First-order and linear differential equations with applications'),
  ('g0000000-0000-0000-0000-0000000000e6', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4A', 'Physics for Scientists and Engineers I', 5, 'Calculus-based mechanics with laboratory'),
  ('g0000000-0000-0000-0000-0000000000e7', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4B', 'Physics for Scientists and Engineers II', 5, 'Calculus-based electricity and magnetism with laboratory'),
  ('g0000000-0000-0000-0000-0000000000e8', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4C', 'Physics for Scientists and Engineers III', 5, 'Calculus-based waves, optics, and thermodynamics with laboratory'),
  ('g0000000-0000-0000-0000-0000000000e9', 'a0000000-0000-0000-0000-000000000002', 'CHEM 1A', 'General Chemistry I', 5, 'Atomic structure, bonding, stoichiometry, and laboratory work'),
  ('g0000000-0000-0000-0000-0000000000ea', 'a0000000-0000-0000-0000-000000000002', 'CHEM 1B', 'General Chemistry II', 5, 'Equilibrium, thermodynamics, and kinetics with laboratory work'),
  ('g0000000-0000-0000-0000-0000000000eb', 'a0000000-0000-0000-0000-000000000002', 'CHEM 1C', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and spectroscopy with laboratory work'),
  ('g0000000-0000-0000-0000-0000000000ec', 'a0000000-0000-0000-0000-000000000002', 'CHEM 12A', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reaction fundamentals with laboratory work'),
  ('g0000000-0000-0000-0000-0000000000ed', 'a0000000-0000-0000-0000-000000000002', 'CHEM 12B', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory work'),
  ('g0000000-0000-0000-0000-0000000000ee', 'a0000000-0000-0000-0000-000000000002', 'CHEM 12C', 'Organic Chemistry III', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods with laboratory work'),
  ('g0000000-0000-0000-0000-0000000000ef', 'a0000000-0000-0000-0000-000000000002', 'ENGR 14', 'Introduction to MATLAB for Engineers', 4, 'Programming concepts, numerical computation, and engineering problem solving in MATLAB');

-- ============================================================
-- COURSES - Chemical Engineering Major (UC Santa Barbara)
-- Institution ID: b0000000-0000-0000-0000-000000000006
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-0000000000e0', 'b0000000-0000-0000-0000-000000000006', 'MATH 3A', 'Calculus with Applications I', 4, 'Limits, derivatives, and applications of single-variable calculus'),
  ('h0000000-0000-0000-0000-0000000000e1', 'b0000000-0000-0000-0000-000000000006', 'MATH 3B', 'Calculus with Applications II', 4, 'Integration, techniques of integration, and applications of single-variable calculus'),
  ('h0000000-0000-0000-0000-0000000000e2', 'b0000000-0000-0000-0000-000000000006', 'MATH 3C', 'Calculus with Applications III', 4, 'Sequences, series, and advanced integration in single-variable calculus'),
  ('h0000000-0000-0000-0000-0000000000e3', 'b0000000-0000-0000-0000-000000000006', 'MATH 4A', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integrals'),
  ('h0000000-0000-0000-0000-0000000000e4', 'b0000000-0000-0000-0000-000000000006', 'MATH 6A', 'Linear Algebra', 4, 'Matrices, vector spaces, determinants, and linear transformations'),
  ('h0000000-0000-0000-0000-0000000000e5', 'b0000000-0000-0000-0000-000000000006', 'MATH 4B', 'Differential Equations', 4, 'First-order and linear differential equations with applications'),
  ('h0000000-0000-0000-0000-0000000000e6', 'b0000000-0000-0000-0000-000000000006', 'PHYS 6A', 'Physics for Scientists and Engineers I', 4, 'Calculus-based mechanics with laboratory'),
  ('h0000000-0000-0000-0000-0000000000e7', 'b0000000-0000-0000-0000-000000000006', 'PHYS 6B', 'Physics for Scientists and Engineers II', 4, 'Calculus-based electricity and magnetism with laboratory'),
  ('h0000000-0000-0000-0000-0000000000e8', 'b0000000-0000-0000-0000-000000000006', 'PHYS 6C', 'Physics for Scientists and Engineers III', 4, 'Calculus-based waves, optics, and thermodynamics with laboratory'),
  ('h0000000-0000-0000-0000-0000000000e9', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'Atomic structure, bonding, stoichiometry, and laboratory work'),
  ('h0000000-0000-0000-0000-0000000000ea', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'Equilibrium, thermodynamics, and kinetics with laboratory work'),
  ('h0000000-0000-0000-0000-0000000000eb', 'b0000000-0000-0000-0000-000000000006', 'CHEM 1C', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and spectroscopy with laboratory work'),
  ('h0000000-0000-0000-0000-0000000000ec', 'b0000000-0000-0000-0000-000000000006', 'CHEM 109A', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reaction fundamentals with laboratory work'),
  ('h0000000-0000-0000-0000-0000000000ed', 'b0000000-0000-0000-0000-000000000006', 'CHEM 109B', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory work'),
  ('h0000000-0000-0000-0000-0000000000ee', 'b0000000-0000-0000-0000-000000000006', 'CHEM 109C', 'Organic Chemistry III', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods with laboratory work'),
  ('h0000000-0000-0000-0000-0000000000ef', 'b0000000-0000-0000-0000-000000000006', 'ENGR 3', 'Introduction to MATLAB for Engineers', 4, 'Programming concepts, numerical computation, and engineering problem solving in MATLAB');

-- ============================================================
-- ARTICULATION AGREEMENTS - De Anza College to UC Santa Barbara
-- Major: Chemical Engineering | Effective year: 2024
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-0000000000e0', 'h0000000-0000-0000-0000-0000000000e0', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e1', 'h0000000-0000-0000-0000-0000000000e1', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e2', 'h0000000-0000-0000-0000-0000000000e2', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e3', 'h0000000-0000-0000-0000-0000000000e3', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e4', 'h0000000-0000-0000-0000-0000000000e4', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e5', 'h0000000-0000-0000-0000-0000000000e5', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e6', 'h0000000-0000-0000-0000-0000000000e6', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e7', 'h0000000-0000-0000-0000-0000000000e7', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e8', 'h0000000-0000-0000-0000-0000000000e8', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000e9', 'h0000000-0000-0000-0000-0000000000e9', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000ea', 'h0000000-0000-0000-0000-0000000000ea', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000eb', 'h0000000-0000-0000-0000-0000000000eb', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000ec', 'h0000000-0000-0000-0000-0000000000ec', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000ed', 'h0000000-0000-0000-0000-0000000000ed', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000ee', 'h0000000-0000-0000-0000-0000000000ee', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
  ('g0000000-0000-0000-0000-0000000000ef', 'h0000000-0000-0000-0000-0000000000ef', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024);

-- ============================================================
-- PREREQUISITES - De Anza College
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-0000000000e1', 'g0000000-0000-0000-0000-0000000000e0'),
  ('g0000000-0000-0000-0000-0000000000e2', 'g0000000-0000-0000-0000-0000000000e1'),
  ('g0000000-0000-0000-0000-0000000000e3', 'g0000000-0000-0000-0000-0000000000e2'),
  ('g0000000-0000-0000-0000-0000000000e4', 'g0000000-0000-0000-0000-0000000000e3'),
  ('g0000000-0000-0000-0000-0000000000e5', 'g0000000-0000-0000-0000-0000000000e3'),
  ('g0000000-0000-0000-0000-0000000000e5', 'g0000000-0000-0000-0000-0000000000e4'),
  ('g0000000-0000-0000-0000-0000000000e6', 'g0000000-0000-0000-0000-0000000000e0'),
  ('g0000000-0000-0000-0000-0000000000e7', 'g0000000-0000-0000-0000-0000000000e6'),
  ('g0000000-0000-0000-0000-0000000000e7', 'g0000000-0000-0000-0000-0000000000e1'),
  ('g0000000-0000-0000-0000-0000000000e8', 'g0000000-0000-0000-0000-0000000000e7'),
  ('g0000000-0000-0000-0000-0000000000e8', 'g0000000-0000-0000-0000-0000000000e2'),
  ('g0000000-0000-0000-0000-0000000000ea', 'g0000000-0000-0000-0000-0000000000e9'),
  ('g0000000-0000-0000-0000-0000000000eb', 'g0000000-0000-0000-0000-0000000000ea'),
  ('g0000000-0000-0000-0000-0000000000ec', 'g0000000-0000-0000-0000-0000000000ea'),
  ('g0000000-0000-0000-0000-0000000000ed', 'g0000000-0000-0000-0000-0000000000ec'),
  ('g0000000-0000-0000-0000-0000000000ee', 'g0000000-0000-0000-0000-0000000000ed');

-- ============================================================
-- PREREQUISITES - UC Santa Barbara
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('h0000000-0000-0000-0000-0000000000e1', 'h0000000-0000-0000-0000-0000000000e0'),
  ('h0000000-0000-0000-0000-0000000000e2', 'h0000000-0000-0000-0000-0000000000e1'),
  ('h0000000-0000-0000-0000-0000000000e3', 'h0000000-0000-0000-0000-0000000000e2'),
  ('h0000000-0000-0000-0000-0000000000e4', 'h0000000-0000-0000-0000-0000000000e3'),
  ('h0000000-0000-0000-0000-0000000000e5', 'h0000000-0000-0000-0000-0000000000e3'),
  ('h0000000-0000-0000-0000-0000000000e5', 'h0000000-0000-0000-0000-0000000000e4'),
  ('h0000000-0000-0000-0000-0000000000e6', 'h0000000-0000-0000-0000-0000000000e0'),
  ('h0000000-0000-0000-0000-0000000000e7', 'h0000000-0000-0000-0000-0000000000e6'),
  ('h0000000-0000-0000-0000-0000000000e7', 'h0000000-0000-0000-0000-0000000000e1'),
  ('h0000000-0000-0000-0000-0000000000e8', 'h0000000-0000-0000-0000-0000000000e7'),
  ('h0000000-0000-0000-0000-0000000000e8', 'h0000000-0000-0000-0000-0000000000e2'),
  ('h0000000-0000-0000-0000-0000000000ea', 'h0000000-0000-0000-0000-0000000000e9'),
  ('h0000000-0000-0000-0000-0000000000eb', 'h0000000-0000-0000-0000-0000000000ea'),
  ('h0000000-0000-0000-0000-0000000000ec', 'h0000000-0000-0000-0000-0000000000ea'),
  ('h0000000-0000-0000-0000-0000000000ed', 'h0000000-0000-0000-0000-0000000000ec'),
  ('h0000000-0000-0000-0000-0000000000ee', 'h0000000-0000-0000-0000-0000000000ed');
