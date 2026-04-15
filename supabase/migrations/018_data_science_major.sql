-- Migration 018: Add Data Science major transfer courses
-- UC Transfer Pathways participating campuses: Berkeley, Davis, Irvine, Los Angeles, Merced,
-- Riverside, San Diego, Santa Barbara, Santa Cruz
-- This seed focuses on the requested Pasadena City College -> UC Berkeley articulation.

-- ============================================================
-- COURSES - Data Science Major (Pasadena City College)
-- Major requirements covered: intro data science/statistics, single-variable calculus sequence,
-- multivariable calculus, linear algebra, and two programming courses.
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-000000000060', 'a0000000-0000-0000-0000-000000000003', 'DATA 15', 'Introduction to Data Science and Statistics', 4, 'Foundations of data analysis, statistics, and computational thinking'),
  ('g0000000-0000-0000-0000-000000000061', 'a0000000-0000-0000-0000-000000000003', 'MATH 5A', 'Calculus I', 5, 'Differential calculus and single-variable applications'),
  ('g0000000-0000-0000-0000-000000000062', 'a0000000-0000-0000-0000-000000000003', 'MATH 5B', 'Calculus II', 5, 'Integral calculus, techniques of integration, and applications'),
  ('g0000000-0000-0000-0000-000000000063', 'a0000000-0000-0000-0000-000000000003', 'MATH 5C', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, multiple integration, and applications'),
  ('g0000000-0000-0000-0000-000000000064', 'a0000000-0000-0000-0000-000000000003', 'MATH 3', 'Linear Algebra', 4, 'Matrices, systems of equations, vector spaces, and linear transformations'),
  ('g0000000-0000-0000-0000-000000000065', 'a0000000-0000-0000-0000-000000000003', 'CIS 10', 'Programming I: Python', 4, 'Introductory programming with Python, variables, conditionals, loops, and functions'),
  ('g0000000-0000-0000-0000-000000000066', 'a0000000-0000-0000-0000-000000000003', 'CIS 11', 'Programming II: Data Structures', 4, 'Object-oriented programming, recursion, arrays, and data structures');

-- ============================================================
-- COURSES - Data Science Major (UC Berkeley)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-000000000060', 'b0000000-0000-0000-0000-000000000004', 'DATA C8', 'Foundations of Data Science', 4, 'Introduction to data science, statistics, and computational methods'),
  ('h0000000-0000-0000-0000-000000000061', 'b0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Calculus I', 4, 'Differential calculus and applications'),
  ('h0000000-0000-0000-0000-000000000062', 'b0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Calculus II', 4, 'Integral calculus and applications'),
  ('h0000000-0000-0000-0000-000000000063', 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4, 'Vectors, multivariable differentiation, and integration'),
  ('h0000000-0000-0000-0000-000000000064', 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4, 'Linear algebra, matrices, and differential equations'),
  ('h0000000-0000-0000-0000-000000000065', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61A', 'The Structure and Interpretation of Computer Programs', 4, 'Programming fundamentals, abstraction, and functional programming'),
  ('h0000000-0000-0000-0000-000000000066', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61B', 'Data Structures', 4, 'Object-oriented programming, recursion, and data structures');

-- ============================================================
-- ARTICULATION AGREEMENTS - Pasadena City College to UC Berkeley
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-000000000060', 'h0000000-0000-0000-0000-000000000060', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
  ('g0000000-0000-0000-0000-000000000061', 'h0000000-0000-0000-0000-000000000061', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
  ('g0000000-0000-0000-0000-000000000062', 'h0000000-0000-0000-0000-000000000062', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
  ('g0000000-0000-0000-0000-000000000063', 'h0000000-0000-0000-0000-000000000063', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
  ('g0000000-0000-0000-0000-000000000064', 'h0000000-0000-0000-0000-000000000064', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
  ('g0000000-0000-0000-0000-000000000065', 'h0000000-0000-0000-0000-000000000065', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
  ('g0000000-0000-0000-0000-000000000066', 'h0000000-0000-0000-0000-000000000066', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024);

-- ============================================================
-- PREREQUISITE RELATIONSHIPS
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-000000000062', 'g0000000-0000-0000-0000-000000000061'),  -- Calc II requires Calc I
  ('g0000000-0000-0000-0000-000000000063', 'g0000000-0000-0000-0000-000000000062'),  -- Multivariable requires Calc II
  ('g0000000-0000-0000-0000-000000000066', 'g0000000-0000-0000-0000-000000000065'),  -- Programming II requires Programming I
  ('h0000000-0000-0000-0000-000000000062', 'h0000000-0000-0000-0000-000000000061'),  -- Berkeley Calc II requires Calc I
  ('h0000000-0000-0000-0000-000000000063', 'h0000000-0000-0000-0000-000000000062'),  -- Berkeley Multivariable requires Calc II
  ('h0000000-0000-0000-0000-000000000064', 'h0000000-0000-0000-0000-000000000062'),  -- Linear algebra requires Calc II
  ('h0000000-0000-0000-0000-000000000066', 'h0000000-0000-0000-0000-000000000065');  -- CS 61B requires CS 61A
