-- Migration 039: Repair invalid course UUIDs from migrations 015-022
--
-- These migrations used non-hex UUID-like IDs (g*/h* prefixes) for course rows.
-- This repair migration re-seeds the affected course rows with valid PostgreSQL
-- UUIDs generated via gen_random_uuid(), then rewrites articulation agreements
-- and prerequisite links to point at the repaired course IDs.

-- ============================================================
-- CHEMISTRY / UCLA
-- ============================================================
do $$
declare
  smc_chem11 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 11'), gen_random_uuid()) on conflict do nothing;
  smc_chem12 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 12'), gen_random_uuid()) on conflict do nothing;
  smc_chem13 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 13'), gen_random_uuid()) on conflict do nothing;
  smc_chem21 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 21'), gen_random_uuid()) on conflict do nothing;
  smc_chem22 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 22'), gen_random_uuid()) on conflict do nothing;
  smc_chem23 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 23'), gen_random_uuid()) on conflict do nothing;
  smc_phys21 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'PHYS 21'), gen_random_uuid()) on conflict do nothing;
  smc_phys22 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'PHYS 22'), gen_random_uuid()) on conflict do nothing;
  smc_phys23 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'PHYS 23'), gen_random_uuid()) on conflict do nothing;
  smc_math28 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 28'), gen_random_uuid()) on conflict do nothing;
  smc_math29 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 29'), gen_random_uuid()) on conflict do nothing;
  smc_math30 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 30'), gen_random_uuid()) on conflict do nothing;
  smc_math32 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 32'), gen_random_uuid()) on conflict do nothing;
  smc_math33 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 33'), gen_random_uuid()) on conflict do nothing;
  smc_math34 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 34'), gen_random_uuid()) on conflict do nothing;

  ucla_chem20a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'CHEM 20A'), gen_random_uuid()) on conflict do nothing;
  ucla_chem20b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'CHEM 20B'), gen_random_uuid()) on conflict do nothing;
  ucla_chem20c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'CHEM 20C'), gen_random_uuid()) on conflict do nothing;
  ucla_chem30a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'CHEM 30A'), gen_random_uuid()) on conflict do nothing;
  ucla_chem30b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'CHEM 30B'), gen_random_uuid()) on conflict do nothing;
  ucla_chem30c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'CHEM 30C'), gen_random_uuid()) on conflict do nothing;
  ucla_phys1a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'PHYSICS 1A'), gen_random_uuid()) on conflict do nothing;
  ucla_phys1b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'PHYSICS 1B'), gen_random_uuid()) on conflict do nothing;
  ucla_phys1c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'PHYSICS 1C'), gen_random_uuid()) on conflict do nothing;
  ucla_math31a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'MATH 31A'), gen_random_uuid()) on conflict do nothing;
  ucla_math31b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'MATH 31B'), gen_random_uuid()) on conflict do nothing;
  ucla_math31c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'MATH 31C'), gen_random_uuid()) on conflict do nothing;
  ucla_math32a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'MATH 32A'), gen_random_uuid()) on conflict do nothing;
  ucla_math33a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'MATH 33A'), gen_random_uuid()) on conflict do nothing;
  ucla_math33b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000001' and code = 'MATH 33B'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (smc_chem11, 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
    (smc_chem12, 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics with laboratory'),
    (smc_chem13, 'a0000000-0000-0000-0000-000000000001', 'CHEM 13', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and spectroscopy with laboratory'),
    (smc_chem21, 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I', 5, 'Structure, bonding, and reactions of organic compounds with laboratory'),
    (smc_chem22, 'a0000000-0000-0000-0000-000000000001', 'CHEM 22', 'Organic Chemistry II', 5, 'Reaction mechanisms and spectroscopy with laboratory'),
    (smc_chem23, 'a0000000-0000-0000-0000-000000000001', 'CHEM 23', 'Organic Chemistry III', 5, 'Advanced organic synthesis and analysis with laboratory'),
    (smc_phys21, 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
    (smc_phys22, 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
    (smc_phys23, 'a0000000-0000-0000-0000-000000000001', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
    (smc_math28, 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
    (smc_math29, 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
    (smc_math30, 'a0000000-0000-0000-0000-000000000001', 'MATH 30', 'Calculus III', 5, 'Sequences, series, and advanced integration'),
    (smc_math32, 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
    (smc_math33, 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
    (smc_math34, 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (ucla_chem20a, 'b0000000-0000-0000-0000-000000000001', 'CHEM 20A', 'General Chemistry I', 5, 'Atomic structure, bonding, and stoichiometry'),
    (ucla_chem20b, 'b0000000-0000-0000-0000-000000000001', 'CHEM 20B', 'General Chemistry II', 5, 'Thermochemistry, equilibrium, and kinetics'),
    (ucla_chem20c, 'b0000000-0000-0000-0000-000000000001', 'CHEM 20C', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and nuclear chemistry'),
    (ucla_chem30a, 'b0000000-0000-0000-0000-000000000001', 'CHEM 30A', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reaction fundamentals'),
    (ucla_chem30b, 'b0000000-0000-0000-0000-000000000001', 'CHEM 30B', 'Organic Chemistry II', 5, 'Mechanisms, synthesis, and spectroscopy'),
    (ucla_chem30c, 'b0000000-0000-0000-0000-000000000001', 'CHEM 30C', 'Organic Chemistry III', 5, 'Advanced synthesis, polymers, and bioorganic chemistry'),
    (ucla_phys1a, 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1A', 'Physics for Scientists and Engineers: Mechanics', 5, 'Mechanics, energy, momentum, and rotation'),
    (ucla_phys1b, 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1B', 'Physics for Scientists and Engineers: Electricity and Magnetism', 5, 'Electric fields, circuits, and magnetism'),
    (ucla_phys1c, 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1C', 'Physics for Scientists and Engineers: Waves, Optics, and Modern Physics', 5, 'Oscillations, waves, optics, and relativity'),
    (ucla_math31a, 'b0000000-0000-0000-0000-000000000001', 'MATH 31A', 'Differential and Integral Calculus', 4, 'Limits, derivatives, and applications'),
    (ucla_math31b, 'b0000000-0000-0000-0000-000000000001', 'MATH 31B', 'Integration and Infinite Series', 4, 'Techniques of integration and series'),
    (ucla_math31c, 'b0000000-0000-0000-0000-000000000001', 'MATH 31C', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integration'),
    (ucla_math32a, 'b0000000-0000-0000-0000-000000000001', 'MATH 32A', 'Linear Algebra', 4, 'Matrices, vector spaces, and linear transformations'),
    (ucla_math33a, 'b0000000-0000-0000-0000-000000000001', 'MATH 33A', 'Differential Equations', 4, 'Ordinary differential equations and applications'),
    (ucla_math33b, 'b0000000-0000-0000-0000-000000000001', 'MATH 33B', 'Differential Equations', 4, 'Systems, Laplace transforms, and advanced applications')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Chemistry'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000001'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000001';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (smc_chem11, ucla_chem20a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_chem12, ucla_chem20b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_chem13, ucla_chem20c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_chem21, ucla_chem30a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_chem22, ucla_chem30b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_chem23, ucla_chem30c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_phys21, ucla_phys1a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_phys22, ucla_phys1b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_phys23, ucla_phys1c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_math28, ucla_math31a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_math29, ucla_math31b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_math30, ucla_math31c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_math32, ucla_math31c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_math33, ucla_math32a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024),
    (smc_math34, ucla_math33a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Chemistry', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (smc_chem12, smc_chem13, smc_chem21, smc_chem22, smc_chem23, smc_phys21, smc_phys22, smc_phys23, smc_math28, smc_math29, smc_math30, smc_math32, smc_math33, smc_math34,
                      ucla_chem20b, ucla_chem20c, ucla_chem30a, ucla_chem30b, ucla_chem30c, ucla_phys1a, ucla_phys1b, ucla_phys1c, ucla_math31b, ucla_math31c, ucla_math32a, ucla_math33a, ucla_math33b)
     or prerequisite_course_id in (smc_chem11, smc_chem12, smc_chem13, smc_chem21, smc_chem22, smc_chem23, smc_phys21, smc_phys22, smc_phys23, smc_math28, smc_math29, smc_math30, smc_math32, smc_math33, smc_math34,
                                  ucla_chem20a, ucla_chem20b, ucla_chem20c, ucla_chem30a, ucla_chem30b, ucla_chem30c, ucla_phys1a, ucla_phys1b, ucla_phys1c, ucla_math31a, ucla_math31b, ucla_math31c, ucla_math32a, ucla_math33a, ucla_math33b) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (smc_chem12, smc_chem11),
    (smc_chem13, smc_chem12),
    (smc_chem21, smc_chem12),
    (smc_chem22, smc_chem21),
    (smc_chem23, smc_chem22),
    (smc_phys21, smc_math28),
    (smc_phys22, smc_phys21),
    (smc_phys22, smc_math29),
    (smc_phys23, smc_phys22),
    (smc_phys23, smc_math30),
    (smc_math29, smc_math28),
    (smc_math30, smc_math29),
    (smc_math32, smc_math30),
    (smc_math33, smc_math30),
    (smc_math34, smc_math32),
    (ucla_chem20b, ucla_chem20a),
    (ucla_chem20c, ucla_chem20b),
    (ucla_chem30a, ucla_chem20b),
    (ucla_chem30b, ucla_chem30a),
    (ucla_chem30c, ucla_chem30b),
    (ucla_phys1a, ucla_math31a),
    (ucla_phys1b, ucla_phys1a),
    (ucla_phys1b, ucla_math31b),
    (ucla_phys1c, ucla_phys1b),
    (ucla_phys1c, ucla_math31c),
    (ucla_math31b, ucla_math31a),
    (ucla_math31c, ucla_math31b),
    (ucla_math32a, ucla_math31c),
    (ucla_math33a, ucla_math31c),
    (ucla_math33b, ucla_math33a) on conflict do nothing;
end $$;

-- ============================================================
-- PHYSICS / UC BERKELEY
-- ============================================================
do $$
declare
  deanza_math1a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1A'), gen_random_uuid()) on conflict do nothing;
  deanza_math1b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1B'), gen_random_uuid()) on conflict do nothing;
  deanza_math1c uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1C'), gen_random_uuid()) on conflict do nothing;
  deanza_math22 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 22'), gen_random_uuid()) on conflict do nothing;
  deanza_math23 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 23'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4A'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4B'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4c uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4C'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4d uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4D'), gen_random_uuid()) on conflict do nothing;

  berkeley_math1a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 1A'), gen_random_uuid()) on conflict do nothing;
  berkeley_math1b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 1B'), gen_random_uuid()) on conflict do nothing;
  berkeley_math53 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 53'), gen_random_uuid()) on conflict do nothing;
  berkeley_math54 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 54'), gen_random_uuid()) on conflict do nothing;
  berkeley_phys7a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'PHYSICS 7A'), gen_random_uuid()) on conflict do nothing;
  berkeley_phys7b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'PHYSICS 7B'), gen_random_uuid()) on conflict do nothing;
  berkeley_phys7c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'PHYSICS 7C'), gen_random_uuid()) on conflict do nothing;
  berkeley_phys89 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'PHYSICS 89'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (deanza_math1a, 'a0000000-0000-0000-0000-000000000002', 'MATH 1A', 'Calculus I', 5, 'Differential and integral calculus of one variable'),
    (deanza_math1b, 'a0000000-0000-0000-0000-000000000002', 'MATH 1B', 'Calculus II', 5, 'Continuation of single-variable calculus with applications'),
    (deanza_math1c, 'a0000000-0000-0000-0000-000000000002', 'MATH 1C', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, and multiple integrals'),
    (deanza_math22, 'a0000000-0000-0000-0000-000000000002', 'MATH 22', 'Linear Algebra', 5, 'Matrices, vector spaces, determinants, and eigenvalues'),
    (deanza_math23, 'a0000000-0000-0000-0000-000000000002', 'MATH 23', 'Differential Equations', 5, 'Ordinary differential equations and applied modeling'),
    (deanza_phys4a, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4A', 'Physics for Scientists and Engineers I', 5, 'Calculus-based mechanics with laboratory'),
    (deanza_phys4b, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4B', 'Physics for Scientists and Engineers II', 5, 'Calculus-based electricity and magnetism with laboratory'),
    (deanza_phys4c, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4C', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and thermodynamics with laboratory'),
    (deanza_phys4d, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4D', 'Physics for Scientists and Engineers IV', 5, 'Introduction to modern physics with laboratory')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (berkeley_math1a, 'b0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Calculus', 4, 'Differential and integral calculus of one variable'),
    (berkeley_math1b, 'b0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Calculus', 4, 'Continuation of single-variable calculus'),
    (berkeley_math53, 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integrals'),
    (berkeley_math54, 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4, 'Matrices, vector spaces, and ordinary differential equations'),
    (berkeley_phys7a, 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7A', 'Physics for Scientists and Engineers: Mechanics', 4, 'Calculus-based mechanics with laboratory'),
    (berkeley_phys7b, 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7B', 'Physics for Scientists and Engineers: Electricity and Magnetism', 4, 'Calculus-based electricity and magnetism with laboratory'),
    (berkeley_phys7c, 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7C', 'Physics for Scientists and Engineers: Waves, Optics, and Thermodynamics', 4, 'Intermediate calculus-based physics with laboratory'),
    (berkeley_phys89, 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 89', 'Introduction to Modern Physics', 4, 'Modern physics concepts, including relativity and quantum theory')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Physics'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000002'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000004';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (deanza_math1a, berkeley_math1a, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_math1b, berkeley_math1b, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_math1c, berkeley_math53, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_math22, berkeley_math54, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_math23, berkeley_math54, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_phys4a, berkeley_phys7a, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_phys4b, berkeley_phys7b, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_phys4c, berkeley_phys7c, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024),
    (deanza_phys4d, berkeley_phys89, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Physics', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (deanza_math1a, deanza_math1b, deanza_math1c, deanza_math22, deanza_math23, deanza_phys4a, deanza_phys4b, deanza_phys4c, deanza_phys4d,
                      berkeley_math1a, berkeley_math1b, berkeley_math53, berkeley_math54, berkeley_phys7a, berkeley_phys7b, berkeley_phys7c, berkeley_phys89)
     or prerequisite_course_id in (deanza_math1a, deanza_math1b, deanza_math1c, deanza_math22, deanza_math23, deanza_phys4a, deanza_phys4b, deanza_phys4c, deanza_phys4d,
                                  berkeley_math1a, berkeley_math1b, berkeley_math53, berkeley_math54, berkeley_phys7a, berkeley_phys7b, berkeley_phys7c, berkeley_phys89) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (deanza_math1b, deanza_math1a),
    (deanza_math1c, deanza_math1b),
    (deanza_math22, deanza_math1c),
    (deanza_math23, deanza_math1c),
    (deanza_phys4a, deanza_math1a),
    (deanza_phys4b, deanza_phys4a),
    (deanza_phys4b, deanza_math1b),
    (deanza_phys4c, deanza_phys4b),
    (deanza_phys4c, deanza_math1c),
    (deanza_phys4d, deanza_phys4c),
    (deanza_phys4d, deanza_math23),
    (berkeley_math1b, berkeley_math1a),
    (berkeley_math53, berkeley_math1b),
    (berkeley_math54, berkeley_math53),
    (berkeley_phys7a, berkeley_math1a),
    (berkeley_phys7b, berkeley_phys7a),
    (berkeley_phys7b, berkeley_math1b),
    (berkeley_phys7c, berkeley_phys7b),
    (berkeley_phys7c, berkeley_math53),
    (berkeley_phys89, berkeley_phys7c),
    (berkeley_phys89, berkeley_math54) on conflict do nothing;
end $$;

-- ============================================================
-- MATHEMATICS / UC DAVIS
-- ============================================================
do $$
declare
  foothill_math1a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000004' and code = 'MATH 1A'), gen_random_uuid()) on conflict do nothing;
  foothill_math1b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000004' and code = 'MATH 1B'), gen_random_uuid()) on conflict do nothing;
  foothill_math1c uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000004' and code = 'MATH 1C'), gen_random_uuid()) on conflict do nothing;
  foothill_math2a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000004' and code = 'MATH 2A'), gen_random_uuid()) on conflict do nothing;
  foothill_math2b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000004' and code = 'MATH 2B'), gen_random_uuid()) on conflict do nothing;

  davis_math21a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000007' and code = 'MAT 21A'), gen_random_uuid()) on conflict do nothing;
  davis_math21b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000007' and code = 'MAT 21B'), gen_random_uuid()) on conflict do nothing;
  davis_math21c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000007' and code = 'MAT 21C'), gen_random_uuid()) on conflict do nothing;
  davis_math22a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000007' and code = 'MAT 22A'), gen_random_uuid()) on conflict do nothing;
  davis_math22b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000007' and code = 'MAT 22B'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (foothill_math1a, 'a0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Single Variable Calculus I', 5, 'Limits, derivatives, and applications of differential calculus'),
    (foothill_math1b, 'a0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Single Variable Calculus II', 5, 'Integration, techniques of integration, and applications'),
    (foothill_math1c, 'a0000000-0000-0000-0000-000000000004', 'MATH 1C', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, multiple integration, and vector calculus'),
    (foothill_math2a, 'a0000000-0000-0000-0000-000000000004', 'MATH 2A', 'Linear Algebra', 5, 'Matrices, systems of equations, vector spaces, and linear transformations'),
    (foothill_math2b, 'a0000000-0000-0000-0000-000000000004', 'MATH 2B', 'Differential Equations', 5, 'First-order and higher-order differential equations with applications')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (davis_math21a, 'b0000000-0000-0000-0000-000000000007', 'MAT 21A', 'Calculus', 4, 'Single variable calculus I'),
    (davis_math21b, 'b0000000-0000-0000-0000-000000000007', 'MAT 21B', 'Calculus', 4, 'Single variable calculus II'),
    (davis_math21c, 'b0000000-0000-0000-0000-000000000007', 'MAT 21C', 'Calculus', 4, 'Multivariable calculus'),
    (davis_math22a, 'b0000000-0000-0000-0000-000000000007', 'MAT 22A', 'Linear Algebra', 4, 'Matrices, vector spaces, and linear transformations'),
    (davis_math22b, 'b0000000-0000-0000-0000-000000000007', 'MAT 22B', 'Differential Equations', 4, 'Ordinary differential equations and applications')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Mathematics'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000004'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000007';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (foothill_math1a, davis_math21a, 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
    (foothill_math1b, davis_math21b, 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
    (foothill_math1c, davis_math21c, 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
    (foothill_math2a, davis_math22a, 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024),
    (foothill_math2b, davis_math22b, 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Mathematics', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (foothill_math1a, foothill_math1b, foothill_math1c, foothill_math2a, foothill_math2b, davis_math21a, davis_math21b, davis_math21c, davis_math22a, davis_math22b)
     or prerequisite_course_id in (foothill_math1a, foothill_math1b, foothill_math1c, foothill_math2a, foothill_math2b, davis_math21a, davis_math21b, davis_math21c, davis_math22a, davis_math22b) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (foothill_math1b, foothill_math1a),
    (foothill_math1c, foothill_math1b),
    (foothill_math2a, foothill_math1b),
    (foothill_math2b, foothill_math1c),
    (foothill_math2b, foothill_math2a),
    (davis_math21b, davis_math21a),
    (davis_math21c, davis_math21b),
    (davis_math22a, davis_math21b),
    (davis_math22b, davis_math21c),
    (davis_math22b, davis_math22a) on conflict do nothing;
end $$;

-- ============================================================
-- DATA SCIENCE / UC BERKELEY
-- ============================================================
do $$
declare
  pcc_data15 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'DATA 15'), gen_random_uuid()) on conflict do nothing;
  pcc_math5a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'MATH 5A'), gen_random_uuid()) on conflict do nothing;
  pcc_math5b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'MATH 5B'), gen_random_uuid()) on conflict do nothing;
  pcc_math5c uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'MATH 5C'), gen_random_uuid()) on conflict do nothing;
  pcc_math3 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'MATH 3'), gen_random_uuid()) on conflict do nothing;
  pcc_cis10 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'CIS 10'), gen_random_uuid()) on conflict do nothing;
  pcc_cis11 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000003' and code = 'CIS 11'), gen_random_uuid()) on conflict do nothing;

  berkeley_data8 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'DATA C8'), gen_random_uuid()) on conflict do nothing;
  berkeley_math1a_ds uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 1A'), gen_random_uuid()) on conflict do nothing;
  berkeley_math1b_ds uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 1B'), gen_random_uuid()) on conflict do nothing;
  berkeley_math53_ds uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 53'), gen_random_uuid()) on conflict do nothing;
  berkeley_math54_ds uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'MATH 54'), gen_random_uuid()) on conflict do nothing;
  berkeley_cs61a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'COMPSCI 61A'), gen_random_uuid()) on conflict do nothing;
  berkeley_cs61b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000004' and code = 'COMPSCI 61B'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (pcc_data15, 'a0000000-0000-0000-0000-000000000003', 'DATA 15', 'Introduction to Data Science and Statistics', 4, 'Foundations of data analysis, statistics, and computational thinking'),
    (pcc_math5a, 'a0000000-0000-0000-0000-000000000003', 'MATH 5A', 'Calculus I', 5, 'Differential calculus and single-variable applications'),
    (pcc_math5b, 'a0000000-0000-0000-0000-000000000003', 'MATH 5B', 'Calculus II', 5, 'Integral calculus, techniques of integration, and applications'),
    (pcc_math5c, 'a0000000-0000-0000-0000-000000000003', 'MATH 5C', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, multiple integration, and applications'),
    (pcc_math3, 'a0000000-0000-0000-0000-000000000003', 'MATH 3', 'Linear Algebra', 4, 'Matrices, systems of equations, vector spaces, and linear transformations'),
    (pcc_cis10, 'a0000000-0000-0000-0000-000000000003', 'CIS 10', 'Programming I: Python', 4, 'Introductory programming with Python, variables, conditionals, loops, and functions'),
    (pcc_cis11, 'a0000000-0000-0000-0000-000000000003', 'CIS 11', 'Programming II: Data Structures', 4, 'Object-oriented programming, recursion, arrays, and data structures')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (berkeley_data8, 'b0000000-0000-0000-0000-000000000004', 'DATA C8', 'Foundations of Data Science', 4, 'Introduction to data science, statistics, and computational methods'),
    (berkeley_math1a_ds, 'b0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Calculus I', 4, 'Differential calculus and applications'),
    (berkeley_math1b_ds, 'b0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Calculus II', 4, 'Integral calculus and applications'),
    (berkeley_math53_ds, 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4, 'Vectors, multivariable differentiation, and integration'),
    (berkeley_math54_ds, 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4, 'Linear algebra, matrices, and differential equations'),
    (berkeley_cs61a, 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61A', 'The Structure and Interpretation of Computer Programs', 4, 'Programming fundamentals, abstraction, and functional programming'),
    (berkeley_cs61b, 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61B', 'Data Structures', 4, 'Object-oriented programming, recursion, and data structures')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Data Science'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000003'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000004';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (pcc_data15, berkeley_data8, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
    (pcc_math5a, berkeley_math1a_ds, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
    (pcc_math5b, berkeley_math1b_ds, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
    (pcc_math5c, berkeley_math53_ds, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
    (pcc_math3, berkeley_math54_ds, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
    (pcc_cis10, berkeley_cs61a, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024),
    (pcc_cis11, berkeley_cs61b, 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Data Science', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (pcc_data15, pcc_math5a, pcc_math5b, pcc_math5c, pcc_math3, pcc_cis10, pcc_cis11, berkeley_data8, berkeley_math1a_ds, berkeley_math1b_ds, berkeley_math53_ds, berkeley_math54_ds, berkeley_cs61a, berkeley_cs61b)
     or prerequisite_course_id in (pcc_data15, pcc_math5a, pcc_math5b, pcc_math5c, pcc_math3, pcc_cis10, pcc_cis11, berkeley_data8, berkeley_math1a_ds, berkeley_math1b_ds, berkeley_math53_ds, berkeley_math54_ds, berkeley_cs61a, berkeley_cs61b) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (pcc_math5b, pcc_math5a),
    (pcc_math5c, pcc_math5b),
    (pcc_cis11, pcc_cis10),
    (berkeley_math1b_ds, berkeley_math1a_ds),
    (berkeley_math53_ds, berkeley_math1b_ds),
    (berkeley_math54_ds, berkeley_math1b_ds),
    (berkeley_cs61b, berkeley_cs61a) on conflict do nothing;
end $$;

-- ============================================================
-- ENVIRONMENTAL SCIENCE / UCSB
-- ============================================================
do $$
declare
  lbcc_math1a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'MATH 1A'), gen_random_uuid()) on conflict do nothing;
  lbcc_math1b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'MATH 1B'), gen_random_uuid()) on conflict do nothing;
  lbcc_phys2a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'PHYS 2A'), gen_random_uuid()) on conflict do nothing;
  lbcc_phys2b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'PHYS 2B'), gen_random_uuid()) on conflict do nothing;
  lbcc_bio1 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'BIO 1'), gen_random_uuid()) on conflict do nothing;
  lbcc_bio2 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'BIO 2'), gen_random_uuid()) on conflict do nothing;
  lbcc_chem1a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'CHEM 1A'), gen_random_uuid()) on conflict do nothing;
  lbcc_chem1b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'CHEM 1B'), gen_random_uuid()) on conflict do nothing;
  lbcc_chem2a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'CHEM 2A'), gen_random_uuid()) on conflict do nothing;
  lbcc_stat1 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'STAT 1'), gen_random_uuid()) on conflict do nothing;
  lbcc_econ1 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000006' and code = 'ECON 1'), gen_random_uuid()) on conflict do nothing;

  ucsb_math3a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3A'), gen_random_uuid()) on conflict do nothing;
  ucsb_math3b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3B'), gen_random_uuid()) on conflict do nothing;
  ucsb_phys6a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'PHYS 6A'), gen_random_uuid()) on conflict do nothing;
  ucsb_phys6b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'PHYS 6B'), gen_random_uuid()) on conflict do nothing;
  ucsb_biol1a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIOL 1A'), gen_random_uuid()) on conflict do nothing;
  ucsb_biol1b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIOL 1B'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem1a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1A'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem1b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1B'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem109a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 109A'), gen_random_uuid()) on conflict do nothing;
  ucsb_pstat5a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'PSTAT 5A'), gen_random_uuid()) on conflict do nothing;
  ucsb_econ1 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'ECON 1'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (lbcc_math1a, 'a0000000-0000-0000-0000-000000000006', 'MATH 1A', 'Calculus I', 5, 'Differential calculus for STEM majors'),
    (lbcc_math1b, 'a0000000-0000-0000-0000-000000000006', 'MATH 1B', 'Calculus II', 5, 'Integral calculus and series'),
    (lbcc_phys2a, 'a0000000-0000-0000-0000-000000000006', 'PHYS 2A', 'Physics for Scientists and Engineers I', 4, 'Mechanics with laboratory'),
    (lbcc_phys2b, 'a0000000-0000-0000-0000-000000000006', 'PHYS 2B', 'Physics for Scientists and Engineers II', 4, 'Electricity, magnetism, and optics with laboratory'),
    (lbcc_bio1, 'a0000000-0000-0000-0000-000000000006', 'BIO 1', 'General Biology I', 4, 'Cell biology, genetics, and evolution with laboratory'),
    (lbcc_bio2, 'a0000000-0000-0000-0000-000000000006', 'BIO 2', 'General Biology II', 4, 'Organismal biology, ecology, and diversity with laboratory'),
    (lbcc_chem1a, 'a0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'Chemical principles, stoichiometry, and laboratory'),
    (lbcc_chem1b, 'a0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and laboratory'),
    (lbcc_chem2a, 'a0000000-0000-0000-0000-000000000006', 'CHEM 2A', 'Organic Chemistry I', 5, 'Organic structure, nomenclature, and reactions with laboratory'),
    (lbcc_stat1, 'a0000000-0000-0000-0000-000000000006', 'STAT 1', 'Introduction to Statistics', 4, 'Descriptive and inferential statistics'),
    (lbcc_econ1, 'a0000000-0000-0000-0000-000000000006', 'ECON 1', 'Principles of Microeconomics', 3, 'Consumer and firm behavior, market structure, and efficiency')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (ucsb_math3a, 'b0000000-0000-0000-0000-000000000006', 'MATH 3A', 'Calculus with Applications I', 4, 'Single variable calculus'),
    (ucsb_math3b, 'b0000000-0000-0000-0000-000000000006', 'MATH 3B', 'Calculus with Applications II', 4, 'Continuation of single variable calculus'),
    (ucsb_phys6a, 'b0000000-0000-0000-0000-000000000006', 'PHYS 6A', 'Physics for Scientists and Engineers', 4, 'Mechanics with laboratory'),
    (ucsb_phys6b, 'b0000000-0000-0000-0000-000000000006', 'PHYS 6B', 'Physics for Scientists and Engineers', 4, 'Electricity and magnetism with laboratory'),
    (ucsb_biol1a, 'b0000000-0000-0000-0000-000000000006', 'BIOL 1A', 'Cell and Molecular Biology', 5, 'Introductory biology with laboratory'),
    (ucsb_biol1b, 'b0000000-0000-0000-0000-000000000006', 'BIOL 1B', 'Organismal Biology and Ecology', 5, 'Introductory biology with laboratory'),
    (ucsb_chem1a, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'General chemistry with laboratory'),
    (ucsb_chem1b, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'General chemistry with laboratory'),
    (ucsb_chem109a, 'b0000000-0000-0000-0000-000000000006', 'CHEM 109A', 'Organic Chemistry I', 5, 'Organic chemistry with laboratory'),
    (ucsb_pstat5a, 'b0000000-0000-0000-0000-000000000006', 'PSTAT 5A', 'Introduction to Statistics', 4, 'Statistical methods and data analysis'),
    (ucsb_econ1, 'b0000000-0000-0000-0000-000000000006', 'ECON 1', 'Introduction to Microeconomics', 4, 'Principles of microeconomic theory')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from prerequisites
  where course_id in (lbcc_math1a, lbcc_math1b, lbcc_phys2a, lbcc_phys2b, lbcc_bio1, lbcc_bio2, lbcc_chem1a, lbcc_chem1b, lbcc_chem2a, lbcc_stat1, lbcc_econ1,
                      ucsb_math3a, ucsb_math3b, ucsb_phys6a, ucsb_phys6b, ucsb_biol1a, ucsb_biol1b, ucsb_chem1a, ucsb_chem1b, ucsb_chem109a, ucsb_pstat5a, ucsb_econ1)
     or prerequisite_course_id in (lbcc_math1a, lbcc_math1b, lbcc_phys2a, lbcc_phys2b, lbcc_bio1, lbcc_bio2, lbcc_chem1a, lbcc_chem1b, lbcc_chem2a, lbcc_stat1, lbcc_econ1,
                                  ucsb_math3a, ucsb_math3b, ucsb_phys6a, ucsb_phys6b, ucsb_biol1a, ucsb_biol1b, ucsb_chem1a, ucsb_chem1b, ucsb_chem109a, ucsb_pstat5a, ucsb_econ1) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (lbcc_math1b, lbcc_math1a),
    (lbcc_phys2a, lbcc_math1a),
    (lbcc_phys2b, lbcc_phys2a),
    (lbcc_phys2b, lbcc_math1b),
    (lbcc_bio2, lbcc_bio1),
    (lbcc_chem1b, lbcc_chem1a),
    (lbcc_chem2a, lbcc_chem1b),
    (ucsb_math3b, ucsb_math3a),
    (ucsb_phys6a, ucsb_math3a),
    (ucsb_phys6b, ucsb_phys6a),
    (ucsb_biol1b, ucsb_biol1a),
    (ucsb_chem1b, ucsb_chem1a),
    (ucsb_chem109a, ucsb_chem1b) on conflict do nothing;
end $$;

-- ============================================================
-- BIOCHEMISTRY / UCSB
-- ============================================================
do $$
declare
  pierce_biol3 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'BIOL 3'), gen_random_uuid()) on conflict do nothing;
  pierce_biol4 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'BIOL 4'), gen_random_uuid()) on conflict do nothing;
  pierce_chem101 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'CHEM 101'), gen_random_uuid()) on conflict do nothing;
  pierce_chem102 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'CHEM 102'), gen_random_uuid()) on conflict do nothing;
  pierce_math261 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'MATH 261'), gen_random_uuid()) on conflict do nothing;
  pierce_math262 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'MATH 262'), gen_random_uuid()) on conflict do nothing;
  pierce_chem211 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'CHEM 211'), gen_random_uuid()) on conflict do nothing;
  pierce_chem212 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000007' and code = 'CHEM 212'), gen_random_uuid()) on conflict do nothing;

  ucsb_biol1a_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIOL 1A'), gen_random_uuid()) on conflict do nothing;
  ucsb_biol1b_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIOL 1B'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem1a_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1A'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem1b_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1B'), gen_random_uuid()) on conflict do nothing;
  ucsb_math3a_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3A'), gen_random_uuid()) on conflict do nothing;
  ucsb_math3b_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3B'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem109a_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 109A'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem109b_bc uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 109B'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (pierce_biol3, 'a0000000-0000-0000-0000-000000000007', 'BIOL 3', 'General Biology I', 4, 'Cell biology, genetics, evolution, and laboratory work'),
    (pierce_biol4, 'a0000000-0000-0000-0000-000000000007', 'BIOL 4', 'General Biology II', 4, 'Organismal biology, ecology, and laboratory work'),
    (pierce_chem101, 'a0000000-0000-0000-0000-000000000007', 'CHEM 101', 'General Chemistry I', 5, 'Chemical principles, stoichiometry, and laboratory work'),
    (pierce_chem102, 'a0000000-0000-0000-0000-000000000007', 'CHEM 102', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and laboratory work'),
    (pierce_math261, 'a0000000-0000-0000-0000-000000000007', 'MATH 261', 'Calculus I', 5, 'Differential calculus for STEM majors'),
    (pierce_math262, 'a0000000-0000-0000-0000-000000000007', 'MATH 262', 'Calculus II', 5, 'Integral calculus and applications for STEM majors'),
    (pierce_chem211, 'a0000000-0000-0000-0000-000000000007', 'CHEM 211', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reactions of organic compounds with laboratory work'),
    (pierce_chem212, 'a0000000-0000-0000-0000-000000000007', 'CHEM 212', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory work')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (ucsb_biol1a_bc, 'b0000000-0000-0000-0000-000000000006', 'BIOL 1A', 'Cell and Molecular Biology', 5, 'Introductory biology with laboratory'),
    (ucsb_biol1b_bc, 'b0000000-0000-0000-0000-000000000006', 'BIOL 1B', 'Organismal Biology and Ecology', 5, 'Introductory biology with laboratory'),
    (ucsb_chem1a_bc, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'General chemistry with laboratory'),
    (ucsb_chem1b_bc, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'General chemistry with laboratory'),
    (ucsb_math3a_bc, 'b0000000-0000-0000-0000-000000000006', 'MATH 3A', 'Calculus with Applications I', 4, 'Single variable calculus for STEM majors'),
    (ucsb_math3b_bc, 'b0000000-0000-0000-0000-000000000006', 'MATH 3B', 'Calculus with Applications II', 4, 'Continuation of single variable calculus for STEM majors'),
    (ucsb_chem109a_bc, 'b0000000-0000-0000-0000-000000000006', 'CHEM 109A', 'Organic Chemistry I', 5, 'Organic chemistry with laboratory'),
    (ucsb_chem109b_bc, 'b0000000-0000-0000-0000-000000000006', 'CHEM 109B', 'Organic Chemistry II', 5, 'Organic chemistry with laboratory')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Biochemistry'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000007'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000006';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (pierce_biol3, ucsb_biol1a_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_biol4, ucsb_biol1b_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_chem101, ucsb_chem1a_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_chem102, ucsb_chem1b_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_math261, ucsb_math3a_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_math262, ucsb_math3b_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_chem211, ucsb_chem109a_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024),
    (pierce_chem212, ucsb_chem109b_bc, 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000006', 'Biochemistry', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (pierce_biol3, pierce_biol4, pierce_chem101, pierce_chem102, pierce_math261, pierce_math262, pierce_chem211, pierce_chem212,
                      ucsb_biol1a_bc, ucsb_biol1b_bc, ucsb_chem1a_bc, ucsb_chem1b_bc, ucsb_math3a_bc, ucsb_math3b_bc, ucsb_chem109a_bc, ucsb_chem109b_bc)
     or prerequisite_course_id in (pierce_biol3, pierce_biol4, pierce_chem101, pierce_chem102, pierce_math261, pierce_math262, pierce_chem211, pierce_chem212,
                                  ucsb_biol1a_bc, ucsb_biol1b_bc, ucsb_chem1a_bc, ucsb_chem1b_bc, ucsb_math3a_bc, ucsb_math3b_bc, ucsb_chem109a_bc, ucsb_chem109b_bc) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (pierce_biol4, pierce_biol3),
    (pierce_chem102, pierce_chem101),
    (pierce_math262, pierce_math261),
    (pierce_chem211, pierce_chem102),
    (pierce_chem212, pierce_chem211),
    (ucsb_biol1b_bc, ucsb_biol1a_bc),
    (ucsb_chem1b_bc, ucsb_chem1a_bc),
    (ucsb_math3b_bc, ucsb_math3a_bc),
    (ucsb_chem109a_bc, ucsb_chem1b_bc),
    (ucsb_chem109b_bc, ucsb_chem109a_bc) on conflict do nothing;
end $$;

-- ============================================================
-- MOLECULAR BIOLOGY / UC IRVINE
-- ============================================================
do $$
declare
  smc_bio1a uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'BIO 1A'), gen_random_uuid()) on conflict do nothing;
  smc_bio1b uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'BIO 1B'), gen_random_uuid()) on conflict do nothing;
  smc_bio1c uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'BIO 1C'), gen_random_uuid()) on conflict do nothing;
  smc_chem11_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 11'), gen_random_uuid()) on conflict do nothing;
  smc_chem12_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 12'), gen_random_uuid()) on conflict do nothing;
  smc_chem13_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 13'), gen_random_uuid()) on conflict do nothing;
  smc_math28_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 28'), gen_random_uuid()) on conflict do nothing;
  smc_math29_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'MATH 29'), gen_random_uuid()) on conflict do nothing;
  smc_chem21_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 21'), gen_random_uuid()) on conflict do nothing;
  smc_chem22_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 22'), gen_random_uuid()) on conflict do nothing;
  smc_chem23_mb uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000001' and code = 'CHEM 23'), gen_random_uuid()) on conflict do nothing;

  uci_bio93 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIO SCI 93'), gen_random_uuid()) on conflict do nothing;
  uci_bio94 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIO SCI 94'), gen_random_uuid()) on conflict do nothing;
  uci_bio95 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'BIO SCI 95'), gen_random_uuid()) on conflict do nothing;
  uci_chem1a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1A'), gen_random_uuid()) on conflict do nothing;
  uci_chem1b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1B'), gen_random_uuid()) on conflict do nothing;
  uci_chem1c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 1C'), gen_random_uuid()) on conflict do nothing;
  uci_math2a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 2A'), gen_random_uuid()) on conflict do nothing;
  uci_math2b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 2B'), gen_random_uuid()) on conflict do nothing;
  uci_chem51a uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 51A'), gen_random_uuid()) on conflict do nothing;
  uci_chem51b uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 51B'), gen_random_uuid()) on conflict do nothing;
  uci_chem51c uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 51C'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (smc_bio1a, 'a0000000-0000-0000-0000-000000000001', 'BIO 1A', 'General Biology I with Lab', 4, 'Cell biology, molecular biology, genetics, and laboratory techniques'),
    (smc_bio1b, 'a0000000-0000-0000-0000-000000000001', 'BIO 1B', 'General Biology II with Lab', 4, 'Evolution, biodiversity, and organismal biology with laboratory'),
    (smc_bio1c, 'a0000000-0000-0000-0000-000000000001', 'BIO 1C', 'General Biology III with Lab', 4, 'Ecology, physiology, and advanced biological systems with laboratory'),
    (smc_chem11_mb, 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I with Lab', 5, 'Atomic structure, bonding, stoichiometry, and chemical calculations with laboratory'),
    (smc_chem12_mb, 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II with Lab', 5, 'Thermodynamics, equilibrium, kinetics, and acids and bases with laboratory'),
    (smc_chem13_mb, 'a0000000-0000-0000-0000-000000000001', 'CHEM 13', 'General Chemistry III with Lab', 5, 'Electrochemistry, coordination chemistry, and spectroscopy with laboratory'),
    (smc_math28_mb, 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I for STEM Majors', 5, 'Limits, derivatives, and applications for science majors'),
    (smc_math29_mb, 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II for STEM Majors', 5, 'Integration, techniques of integration, and applications for science majors'),
    (smc_chem21_mb, 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I with Lab', 5, 'Structure, bonding, nomenclature, and reaction fundamentals with laboratory'),
    (smc_chem22_mb, 'a0000000-0000-0000-0000-000000000001', 'CHEM 22', 'Organic Chemistry II with Lab', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory'),
    (smc_chem23_mb, 'a0000000-0000-0000-0000-000000000001', 'CHEM 23', 'Organic Chemistry III with Lab', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods with laboratory')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (uci_bio93, 'b0000000-0000-0000-0000-000000000006', 'BIO SCI 93', 'General Biology I', 4, 'Cell biology, molecular biology, genetics, and laboratory foundations'),
    (uci_bio94, 'b0000000-0000-0000-0000-000000000006', 'BIO SCI 94', 'General Biology II', 4, 'Evolution, biodiversity, and organismal biology'),
    (uci_bio95, 'b0000000-0000-0000-0000-000000000006', 'BIO SCI 95', 'General Biology III', 4, 'Ecology, physiology, and advanced biological systems'),
    (uci_chem1a, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1A', 'General Chemistry I', 5, 'Atomic structure, bonding, stoichiometry, and chemical calculations'),
    (uci_chem1b, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1B', 'General Chemistry II', 5, 'Thermodynamics, equilibrium, kinetics, and acids and bases'),
    (uci_chem1c, 'b0000000-0000-0000-0000-000000000006', 'CHEM 1C', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and spectroscopy'),
    (uci_math2a, 'b0000000-0000-0000-0000-000000000006', 'MATH 2A', 'Calculus for STEM Majors I', 5, 'Limits, derivatives, and applications for science majors'),
    (uci_math2b, 'b0000000-0000-0000-0000-000000000006', 'MATH 2B', 'Calculus for STEM Majors II', 5, 'Integration, techniques of integration, and applications for science majors'),
    (uci_chem51a, 'b0000000-0000-0000-0000-000000000006', 'CHEM 51A', 'Organic Chemistry I', 5, 'Structure, bonding, nomenclature, and reaction fundamentals'),
    (uci_chem51b, 'b0000000-0000-0000-0000-000000000006', 'CHEM 51B', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy'),
    (uci_chem51c, 'b0000000-0000-0000-0000-000000000006', 'CHEM 51C', 'Organic Chemistry III', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Molecular Biology'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000001'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000006';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (smc_bio1a, uci_bio93, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_bio1b, uci_bio94, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_bio1c, uci_bio95, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_chem11_mb, uci_chem1a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_chem12_mb, uci_chem1b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_chem13_mb, uci_chem1c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_math28_mb, uci_math2a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_math29_mb, uci_math2b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_chem21_mb, uci_chem51a, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_chem22_mb, uci_chem51b, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024),
    (smc_chem23_mb, uci_chem51c, 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Molecular Biology', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (smc_bio1a, smc_bio1b, smc_bio1c, smc_chem11_mb, smc_chem12_mb, smc_chem13_mb, smc_math28_mb, smc_math29_mb, smc_chem21_mb, smc_chem22_mb, smc_chem23_mb,
                      uci_bio93, uci_bio94, uci_bio95, uci_chem1a, uci_chem1b, uci_chem1c, uci_math2a, uci_math2b, uci_chem51a, uci_chem51b, uci_chem51c)
     or prerequisite_course_id in (smc_bio1a, smc_bio1b, smc_bio1c, smc_chem11_mb, smc_chem12_mb, smc_chem13_mb, smc_math28_mb, smc_math29_mb, smc_chem21_mb, smc_chem22_mb, smc_chem23_mb,
                                  uci_bio93, uci_bio94, uci_bio95, uci_chem1a, uci_chem1b, uci_chem1c, uci_math2a, uci_math2b, uci_chem51a, uci_chem51b, uci_chem51c) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (smc_bio1b, smc_bio1a),
    (smc_bio1c, smc_bio1b),
    (smc_chem12_mb, smc_chem11_mb),
    (smc_chem13_mb, smc_chem12_mb),
    (smc_math29_mb, smc_math28_mb),
    (smc_chem22_mb, smc_chem11_mb),
    (smc_chem23_mb, smc_chem22_mb),
    (uci_bio94, uci_bio93),
    (uci_bio95, uci_bio94),
    (uci_chem1b, uci_chem1a),
    (uci_chem1c, uci_chem1b),
    (uci_math2b, uci_math2a),
    (uci_chem51b, uci_chem51a),
    (uci_chem51c, uci_chem51b) on conflict do nothing;
end $$;

-- ============================================================
-- CHEMICAL ENGINEERING / UCSB
-- ============================================================
do $$
declare
  deanza_math1a_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1A'), gen_random_uuid()) on conflict do nothing;
  deanza_math1b_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1B'), gen_random_uuid()) on conflict do nothing;
  deanza_math1c_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1C'), gen_random_uuid()) on conflict do nothing;
  deanza_math1d_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1D'), gen_random_uuid()) on conflict do nothing;
  deanza_math1e_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1E'), gen_random_uuid()) on conflict do nothing;
  deanza_math1f_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'MATH 1F'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4a_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4A'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4b_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4B'), gen_random_uuid()) on conflict do nothing;
  deanza_phys4c_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'PHYS 4C'), gen_random_uuid()) on conflict do nothing;
  deanza_chem1a_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'CHEM 1A'), gen_random_uuid()) on conflict do nothing;
  deanza_chem1b_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'CHEM 1B'), gen_random_uuid()) on conflict do nothing;
  deanza_chem1c_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'CHEM 1C'), gen_random_uuid()) on conflict do nothing;
  deanza_chem12a_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'CHEM 12A'), gen_random_uuid()) on conflict do nothing;
  deanza_chem12b_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'CHEM 12B'), gen_random_uuid()) on conflict do nothing;
  deanza_chem12c_ce uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'CHEM 12C'), gen_random_uuid()) on conflict do nothing;
  deanza_engr14 uuid := coalesce((select id from courses where institution_id = 'a0000000-0000-0000-0000-000000000002' and code = 'ENGR 14'), gen_random_uuid()) on conflict do nothing;

  ucsb_math3a_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3A'), gen_random_uuid()) on conflict do nothing;
  ucsb_math3b_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3B'), gen_random_uuid()) on conflict do nothing;
  ucsb_math3c_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 3C'), gen_random_uuid()) on conflict do nothing;
  ucsb_math4a_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 4A'), gen_random_uuid()) on conflict do nothing;
  ucsb_math6a_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 6A'), gen_random_uuid()) on conflict do nothing;
  ucsb_math4b_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'MATH 4B'), gen_random_uuid()) on conflict do nothing;
  ucsb_phys6a_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'PHYS 6A'), gen_random_uuid()) on conflict do nothing;
  ucsb_phys6b_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'PHYS 6B'), gen_random_uuid()) on conflict do nothing;
  ucsb_phys6c_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'PHYS 6C'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem109a_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 109A'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem109b_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 109B'), gen_random_uuid()) on conflict do nothing;
  ucsb_chem109c_ce uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'CHEM 109C'), gen_random_uuid()) on conflict do nothing;
  ucsb_engr3 uuid := coalesce((select id from courses where institution_id = 'b0000000-0000-0000-0000-000000000006' and code = 'ENGR 3'), gen_random_uuid()) on conflict do nothing;
begin
  insert into courses (id, institution_id, code, title, units, description) values
    (deanza_math1a_ce, 'a0000000-0000-0000-0000-000000000002', 'MATH 1A', 'Calculus I', 5, 'Limits, derivatives, and applications of single-variable calculus'),
    (deanza_math1b_ce, 'a0000000-0000-0000-0000-000000000002', 'MATH 1B', 'Calculus II', 5, 'Integration, techniques of integration, and applications of single-variable calculus'),
    (deanza_math1c_ce, 'a0000000-0000-0000-0000-000000000002', 'MATH 1C', 'Calculus III', 5, 'Sequences, series, and advanced integration in single-variable calculus'),
    (deanza_math1d_ce, 'a0000000-0000-0000-0000-000000000002', 'MATH 1D', 'Multivariable Calculus', 5, 'Vectors, partial derivatives, and multiple integrals'),
    (deanza_math1e_ce, 'a0000000-0000-0000-0000-000000000002', 'MATH 1E', 'Linear Algebra', 5, 'Matrices, vector spaces, determinants, and linear transformations'),
    (deanza_math1f_ce, 'a0000000-0000-0000-0000-000000000002', 'MATH 1F', 'Differential Equations', 5, 'First-order and linear differential equations with applications'),
    (deanza_phys4a_ce, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4A', 'Physics for Scientists and Engineers I', 5, 'Calculus-based mechanics with laboratory'),
    (deanza_phys4b_ce, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4B', 'Physics for Scientists and Engineers II', 5, 'Calculus-based electricity and magnetism with laboratory'),
    (deanza_phys4c_ce, 'a0000000-0000-0000-0000-000000000002', 'PHYS 4C', 'Physics for Scientists and Engineers III', 5, 'Calculus-based waves, optics, and thermodynamics with laboratory'),
    (deanza_chem1a_ce, 'a0000000-0000-0000-0000-000000000002', 'CHEM 1A', 'General Chemistry I', 5, 'Atomic structure, bonding, stoichiometry, and laboratory work'),
    (deanza_chem1b_ce, 'a0000000-0000-0000-0000-000000000002', 'CHEM 1B', 'General Chemistry II', 5, 'Equilibrium, thermodynamics, and kinetics with laboratory work'),
    (deanza_chem1c_ce, 'a0000000-0000-0000-0000-000000000002', 'CHEM 1C', 'General Chemistry III', 5, 'Electrochemistry, coordination chemistry, and spectroscopy with laboratory work'),
    (deanza_chem12a_ce, 'a0000000-0000-0000-0000-000000000002', 'CHEM 12A', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reaction fundamentals with laboratory work'),
    (deanza_chem12b_ce, 'a0000000-0000-0000-0000-000000000002', 'CHEM 12B', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory work'),
    (deanza_chem12c_ce, 'a0000000-0000-0000-0000-000000000002', 'CHEM 12C', 'Organic Chemistry III', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods with laboratory work'),
    (deanza_engr14, 'a0000000-0000-0000-0000-000000000002', 'ENGR 14', 'Introduction to MATLAB for Engineers', 4, 'Programming concepts, numerical computation, and engineering problem solving in MATLAB')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  insert into courses (id, institution_id, code, title, units, description) values
    (ucsb_math3a_ce, 'b0000000-0000-0000-0000-000000000006', 'MATH 3A', 'Calculus with Applications I', 4, 'Limits, derivatives, and applications of single-variable calculus'),
    (ucsb_math3b_ce, 'b0000000-0000-0000-0000-000000000006', 'MATH 3B', 'Calculus with Applications II', 4, 'Integration, techniques of integration, and applications of single-variable calculus'),
    (ucsb_math3c_ce, 'b0000000-0000-0000-0000-000000000006', 'MATH 3C', 'Calculus with Applications III', 4, 'Sequences, series, and advanced integration in single-variable calculus'),
    (ucsb_math4a_ce, 'b0000000-0000-0000-0000-000000000006', 'MATH 4A', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integrals'),
    (ucsb_math6a_ce, 'b0000000-0000-0000-0000-000000000006', 'MATH 6A', 'Linear Algebra', 4, 'Matrices, vector spaces, determinants, and linear transformations'),
    (ucsb_math4b_ce, 'b0000000-0000-0000-0000-000000000006', 'MATH 4B', 'Differential Equations', 4, 'First-order and linear differential equations with applications'),
    (ucsb_phys6a_ce, 'b0000000-0000-0000-0000-000000000006', 'PHYS 6A', 'Physics for Scientists and Engineers I', 4, 'Calculus-based mechanics with laboratory'),
    (ucsb_phys6b_ce, 'b0000000-0000-0000-0000-000000000006', 'PHYS 6B', 'Physics for Scientists and Engineers II', 4, 'Calculus-based electricity and magnetism with laboratory'),
    (ucsb_phys6c_ce, 'b0000000-0000-0000-0000-000000000006', 'PHYS 6C', 'Physics for Scientists and Engineers III', 4, 'Calculus-based waves, optics, and thermodynamics with laboratory'),
    (ucsb_chem109a_ce, 'b0000000-0000-0000-0000-000000000006', 'CHEM 109A', 'Organic Chemistry I', 5, 'Structure, nomenclature, and reaction fundamentals with laboratory work'),
    (ucsb_chem109b_ce, 'b0000000-0000-0000-0000-000000000006', 'CHEM 109B', 'Organic Chemistry II', 5, 'Reaction mechanisms, synthesis, and spectroscopy with laboratory work'),
    (ucsb_chem109c_ce, 'b0000000-0000-0000-0000-000000000006', 'CHEM 109C', 'Organic Chemistry III', 5, 'Advanced synthesis, bioorganic chemistry, and analytical methods with laboratory work'),
    (ucsb_engr3, 'b0000000-0000-0000-0000-000000000006', 'ENGR 3', 'Introduction to MATLAB for Engineers', 4, 'Programming concepts, numerical computation, and engineering problem solving in MATLAB')
  on conflict (institution_id, code) do update set
    title = excluded.title,
    units = excluded.units,
    description = excluded.description;

  delete from articulation_agreements
  where major = 'Chemical Engineering'
    and cc_institution_id = 'a0000000-0000-0000-0000-000000000002'
    and university_institution_id = 'b0000000-0000-0000-0000-000000000006';

  insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
    (deanza_math1a_ce, ucsb_math3a_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_math1b_ce, ucsb_math3b_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_math1c_ce, ucsb_math3c_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_math1d_ce, ucsb_math4a_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_math1e_ce, ucsb_math6a_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_math1f_ce, ucsb_math4b_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_phys4a_ce, ucsb_phys6a_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_phys4b_ce, ucsb_phys6b_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_phys4c_ce, ucsb_phys6c_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_chem1a_ce, ucsb_chem109a_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_chem1b_ce, ucsb_chem109b_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_chem1c_ce, ucsb_chem109c_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_chem12a_ce, ucsb_chem109a_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_chem12b_ce, ucsb_chem109b_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_chem12c_ce, ucsb_chem109c_ce, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024),
    (deanza_engr14, ucsb_engr3, 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'Chemical Engineering', 2024) on conflict do nothing;

  delete from prerequisites
  where course_id in (deanza_math1a_ce, deanza_math1b_ce, deanza_math1c_ce, deanza_math1d_ce, deanza_math1e_ce, deanza_math1f_ce, deanza_phys4a_ce, deanza_phys4b_ce, deanza_phys4c_ce, deanza_chem1a_ce, deanza_chem1b_ce, deanza_chem1c_ce, deanza_chem12a_ce, deanza_chem12b_ce, deanza_chem12c_ce, deanza_engr14,
                      ucsb_math3a_ce, ucsb_math3b_ce, ucsb_math3c_ce, ucsb_math4a_ce, ucsb_math6a_ce, ucsb_math4b_ce, ucsb_phys6a_ce, ucsb_phys6b_ce, ucsb_phys6c_ce, ucsb_chem109a_ce, ucsb_chem109b_ce, ucsb_chem109c_ce, ucsb_engr3)
     or prerequisite_course_id in (deanza_math1a_ce, deanza_math1b_ce, deanza_math1c_ce, deanza_math1d_ce, deanza_math1e_ce, deanza_math1f_ce, deanza_phys4a_ce, deanza_phys4b_ce, deanza_phys4c_ce, deanza_chem1a_ce, deanza_chem1b_ce, deanza_chem1c_ce, deanza_chem12a_ce, deanza_chem12b_ce, deanza_chem12c_ce, deanza_engr14,
                                  ucsb_math3a_ce, ucsb_math3b_ce, ucsb_math3c_ce, ucsb_math4a_ce, ucsb_math6a_ce, ucsb_math4b_ce, ucsb_phys6a_ce, ucsb_phys6b_ce, ucsb_phys6c_ce, ucsb_chem109a_ce, ucsb_chem109b_ce, ucsb_chem109c_ce, ucsb_engr3) on conflict do nothing;

  insert into prerequisites (course_id, prerequisite_course_id) values
    (deanza_math1b_ce, deanza_math1a_ce),
    (deanza_math1c_ce, deanza_math1b_ce),
    (deanza_math1d_ce, deanza_math1c_ce),
    (deanza_math1e_ce, deanza_math1d_ce),
    (deanza_math1f_ce, deanza_math1d_ce),
    (deanza_math1f_ce, deanza_math1e_ce),
    (deanza_phys4a_ce, deanza_math1a_ce),
    (deanza_phys4b_ce, deanza_phys4a_ce),
    (deanza_phys4b_ce, deanza_math1b_ce),
    (deanza_phys4c_ce, deanza_phys4b_ce),
    (deanza_phys4c_ce, deanza_math1c_ce),
    (deanza_chem1b_ce, deanza_chem1a_ce),
    (deanza_chem1c_ce, deanza_chem1b_ce),
    (deanza_chem12b_ce, deanza_chem12a_ce),
    (deanza_chem12c_ce, deanza_chem12b_ce),
    (deanza_chem12c_ce, deanza_chem1c_ce),
    (ucsb_math3b_ce, ucsb_math3a_ce),
    (ucsb_math3c_ce, ucsb_math3b_ce),
    (ucsb_math4a_ce, ucsb_math3c_ce),
    (ucsb_math6a_ce, ucsb_math3c_ce),
    (ucsb_math4b_ce, ucsb_math4a_ce),
    (ucsb_phys6a_ce, ucsb_math3a_ce),
    (ucsb_phys6b_ce, ucsb_phys6a_ce),
    (ucsb_phys6b_ce, ucsb_math3b_ce),
    (ucsb_phys6c_ce, ucsb_phys6b_ce),
    (ucsb_phys6c_ce, ucsb_math4a_ce),
    (ucsb_chem109b_ce, ucsb_chem109a_ce),
    (ucsb_chem109c_ce, ucsb_chem109b_ce),
    (ucsb_engr3, ucsb_math3b_ce) on conflict do nothing;
end $$;
