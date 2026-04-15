-- Migration 017: Add Mathematics major articulation data based on UC Transfer Pathways
-- Major requirements:
--   - Single variable calculus (full sequence)
--   - Multivariable calculus (one semester)
--   - Differential equations (one course)
--   - Linear algebra (one course)

-- ============================================================
-- COURSES - Mathematics Major (Foothill College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Single Variable Calculus I', 5, 'Limits, derivatives, and applications of differential calculus'),
  ('g0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Single Variable Calculus II', 5, 'Integration, techniques of integration, and applications'),
  ('g0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000004', 'MATH 1C', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, multiple integration, and vector calculus'),
  ('g0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000004', 'MATH 2A', 'Linear Algebra', 5, 'Matrices, systems of equations, vector spaces, and linear transformations'),
  ('g0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000004', 'MATH 2B', 'Differential Equations', 5, 'First-order and higher-order differential equations with applications');

-- ============================================================
-- COURSES - Mathematics Major (UC Davis)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-000000000040', 'b0000000-0000-0000-0000-000000000007', 'MAT 21A', 'Calculus', 4, 'Single variable calculus I'),
  ('h0000000-0000-0000-0000-000000000041', 'b0000000-0000-0000-0000-000000000007', 'MAT 21B', 'Calculus', 4, 'Single variable calculus II'),
  ('h0000000-0000-0000-0000-000000000042', 'b0000000-0000-0000-0000-000000000007', 'MAT 21C', 'Calculus', 4, 'Multivariable calculus'),
  ('h0000000-0000-0000-0000-000000000043', 'b0000000-0000-0000-0000-000000000007', 'MAT 22A', 'Linear Algebra', 4, 'Matrices, vector spaces, and linear transformations'),
  ('h0000000-0000-0000-0000-000000000044', 'b0000000-0000-0000-0000-000000000007', 'MAT 22B', 'Differential Equations', 4, 'Ordinary differential equations and applications');

-- ============================================================
-- ARTICULATION AGREEMENTS - Foothill to UC Davis Mathematics
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-000000000040', 'h0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
  ('g0000000-0000-0000-0000-000000000041', 'h0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
  ('g0000000-0000-0000-0000-000000000042', 'h0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
  ('g0000000-0000-0000-0000-000000000043', 'h0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
  ('g0000000-0000-0000-0000-000000000044', 'h0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024);

-- ============================================================
-- PREREQUISITES
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-000000000041', 'g0000000-0000-0000-0000-000000000040'),
  ('g0000000-0000-0000-0000-000000000042', 'g0000000-0000-0000-0000-000000000041'),
  ('g0000000-0000-0000-0000-000000000043', 'g0000000-0000-0000-0000-000000000041'),
  ('g0000000-0000-0000-0000-000000000044', 'g0000000-0000-0000-0000-000000000042'),
  ('g0000000-0000-0000-0000-000000000044', 'g0000000-0000-0000-0000-000000000043'),
  ('h0000000-0000-0000-0000-000000000041', 'h0000000-0000-0000-0000-000000000040'),
  ('h0000000-0000-0000-0000-000000000042', 'h0000000-0000-0000-0000-000000000041'),
  ('h0000000-0000-0000-0000-000000000043', 'h0000000-0000-0000-0000-000000000041'),
  ('h0000000-0000-0000-0000-000000000044', 'h0000000-0000-0000-0000-000000000042'),
  ('h0000000-0000-0000-0000-000000000044', 'h0000000-0000-0000-0000-000000000043');
