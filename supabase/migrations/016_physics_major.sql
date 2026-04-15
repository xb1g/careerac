-- Migration 016: Add Physics major data based on UC Transfer Pathways
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced,
-- Riverside, San Diego, Santa Barbara, Santa Cruz
-- Seeded here: De Anza College -> UC Berkeley

-- ============================================================
-- COURSES - Physics Major (De Anza College)
-- Transfer pathway requires calculus-based physics through modern physics,
-- plus the full calculus sequence, multivariable calculus, linear algebra,
-- and differential equations.
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('g0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000002', 'MATH 1A', 'Calculus I', 5, 'Differential and integral calculus of one variable'),
  ('g0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000002', 'MATH 1B', 'Calculus II', 5, 'Continuation of single-variable calculus with applications'),
  ('g0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000002', 'MATH 1C', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, and multiple integrals'),
  ('g0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000002', 'MATH 22', 'Linear Algebra', 5, 'Matrices, vector spaces, determinants, and eigenvalues'),
  ('g0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000002', 'MATH 23', 'Differential Equations', 5, 'Ordinary differential equations and applied modeling'),
  ('g0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4A', 'Physics for Scientists and Engineers I', 5, 'Calculus-based mechanics with laboratory'),
  ('g0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4B', 'Physics for Scientists and Engineers II', 5, 'Calculus-based electricity and magnetism with laboratory'),
  ('g0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4C', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and thermodynamics with laboratory'),
  ('g0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4D', 'Physics for Scientists and Engineers IV', 5, 'Introduction to modern physics with laboratory');

-- ============================================================
-- COURSES - Physics Major (UC Berkeley)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('h0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Calculus', 4, 'Differential and integral calculus of one variable'),
  ('h0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Calculus', 4, 'Continuation of single-variable calculus'),
  ('h0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integrals'),
  ('h0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4, 'Matrices, vector spaces, and ordinary differential equations'),
  ('h0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7A', 'Physics for Scientists and Engineers: Mechanics', 4, 'Calculus-based mechanics with laboratory'),
  ('h0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7B', 'Physics for Scientists and Engineers: Electricity and Magnetism', 4, 'Calculus-based electricity and magnetism with laboratory'),
  ('h0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7C', 'Physics for Scientists and Engineers: Waves, Optics, and Thermodynamics', 4, 'Intermediate calculus-based physics with laboratory'),
  ('h0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 89', 'Introduction to Modern Physics', 4, 'Modern physics concepts, including relativity and quantum theory');

-- ============================================================
-- ARTICULATION AGREEMENTS - De Anza to UC Berkeley Physics
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('g0000000-0000-0000-0000-000000000020', 'h0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000021', 'h0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000022', 'h0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000023', 'h0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000024', 'h0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000025', 'h0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000026', 'h0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000027', 'h0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
  ('g0000000-0000-0000-0000-000000000028', 'h0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024);

-- ============================================================
-- PREREQUISITES - De Anza College
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('g0000000-0000-0000-0000-000000000021', 'g0000000-0000-0000-0000-000000000020'),  -- Calc II requires Calc I
  ('g0000000-0000-0000-0000-000000000022', 'g0000000-0000-0000-0000-000000000021'),  -- Multivariable requires Calc II
  ('g0000000-0000-0000-0000-000000000023', 'g0000000-0000-0000-0000-000000000022'),  -- Linear algebra after multivariable/calc foundation
  ('g0000000-0000-0000-0000-000000000024', 'g0000000-0000-0000-0000-000000000022'),  -- Differential equations requires Calc III
  ('g0000000-0000-0000-0000-000000000025', 'g0000000-0000-0000-0000-000000000020'),  -- Physics I requires Calculus I
  ('g0000000-0000-0000-0000-000000000026', 'g0000000-0000-0000-0000-000000000025'),  -- Physics II requires Physics I
  ('g0000000-0000-0000-0000-000000000026', 'g0000000-0000-0000-0000-000000000021'),  -- Physics II requires Calculus II
  ('g0000000-0000-0000-0000-000000000027', 'g0000000-0000-0000-0000-000000000026'),  -- Physics III requires Physics II
  ('g0000000-0000-0000-0000-000000000027', 'g0000000-0000-0000-0000-000000000022'),  -- Physics III requires Multivariable Calculus
  ('g0000000-0000-0000-0000-000000000028', 'g0000000-0000-0000-0000-000000000027'),  -- Physics IV requires Physics III
  ('g0000000-0000-0000-0000-000000000028', 'g0000000-0000-0000-0000-000000000024');  -- Physics IV requires Differential Equations

-- ============================================================
-- PREREQUISITES - UC Berkeley
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('h0000000-0000-0000-0000-000000000021', 'h0000000-0000-0000-0000-000000000020'),  -- Calc II requires Calc I
  ('h0000000-0000-0000-0000-000000000022', 'h0000000-0000-0000-0000-000000000021'),  -- Multivariable requires Calc II
  ('h0000000-0000-0000-0000-000000000023', 'h0000000-0000-0000-0000-000000000022'),  -- Linear algebra/diff eq requires multivariable
  ('h0000000-0000-0000-0000-000000000024', 'h0000000-0000-0000-0000-000000000020'),  -- Physics 7A requires Calculus I
  ('h0000000-0000-0000-0000-000000000025', 'h0000000-0000-0000-0000-000000000024'),  -- Physics 7B requires Physics 7A
  ('h0000000-0000-0000-0000-000000000025', 'h0000000-0000-0000-0000-000000000021'),  -- Physics 7B requires Calculus II
  ('h0000000-0000-0000-0000-000000000026', 'h0000000-0000-0000-0000-000000000025'),  -- Physics 7C requires Physics 7B
  ('h0000000-0000-0000-0000-000000000026', 'h0000000-0000-0000-0000-000000000022'),  -- Physics 7C requires Multivariable Calculus
  ('h0000000-0000-0000-0000-000000000027', 'h0000000-0000-0000-0000-000000000026'),  -- Modern Physics requires Physics 7C
  ('h0000000-0000-0000-0000-000000000027', 'h0000000-0000-0000-0000-000000000023');  -- Modern Physics requires Linear Algebra and Differential Equations
