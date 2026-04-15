-- Migration 026: Aerospace Engineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, San Diego
-- Major requirements: calculus, physics, chemistry, engineering fundamentals

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000026', 'Aerospace Engineering', 'Engineering', 'Design, analysis, and construction of aircraft and spacecraft. Covers aerodynamics, propulsion, structures, and control systems.', 'BS', 180, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Aerospace Engineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('i0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('i0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('i0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 30', 'Calculus III', 5, 'Sequences, series, and advanced integration'),
  ('i0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('i0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('i0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('i0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('i0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('i0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
  ('i0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('i0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('i0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'ENGR 14', 'Dynamics', 3, 'Kinematics and kinetics of particles and rigid bodies'),
  ('i0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'ENGR 16', 'Circuits and Electronics', 3, 'Basic circuit analysis and digital electronics'),
  ('i0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('i0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'ENGR 10', 'Introduction to Engineering', 1, 'Overview of engineering disciplines and design process');

-- ============================================================
-- COURSES - Aerospace Engineering (UCLA)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('j0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'MATH 31A', 'Differential and Integral Calculus', 4, 'Limits, derivatives, and applications'),
  ('j0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'MATH 31B', 'Integration and Infinite Series', 4, 'Techniques of integration and series'),
  ('j0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'MATH 31C', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integration'),
  ('j0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'MATH 32A', 'Linear Algebra', 4, 'Matrices, vector spaces, and linear transformations'),
  ('j0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'MATH 33A', 'Differential Equations', 4, 'Ordinary differential equations and applications'),
  ('j0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1A', 'Physics for Scientists and Engineers: Mechanics', 5, 'Mechanics, energy, momentum, and rotation'),
  ('j0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1B', 'Physics for Scientists and Engineers: Electricity and Magnetism', 5, 'Electric fields, circuits, and magnetism'),
  ('j0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1C', 'Physics for Scientists and Engineers: Waves, Optics, and Modern Physics', 5, 'Oscillations, waves, optics, and relativity'),
  ('j0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000001', 'CHEM 20A', 'General Chemistry I', 5, 'Atomic structure, bonding, and stoichiometry'),
  ('j0000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-000000000001', 'ENGR 82', 'Statics', 4, 'Force systems, equilibrium, and structural analysis'),
  ('j0000000-0000-0000-0000-00000000000b', 'b0000000-0000-0000-0000-000000000001', 'ENGR 83', 'Dynamics', 4, 'Kinematics and kinetics of particles and rigid bodies'),
  ('j0000000-0000-0000-0000-00000000000c', 'b0000000-0000-0000-0000-000000000001', 'ENGR 85A', 'Circuits and Signal Processing', 4, 'Circuit analysis and signal processing fundamentals'),
  ('j0000000-0000-0000-0000-00000000000d', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 31', 'Introduction to Computer Science I', 4, 'Programming fundamentals and software development'),
  ('j0000000-0000-0000-0000-00000000000e', 'b0000000-0000-0000-0000-000000000001', 'ENGR 1', 'Introduction to Engineering', 2, 'Overview of engineering disciplines and design process');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-aerospace-001', 'm0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000001', '
## UC Aerospace Engineering Transfer Requirements

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum strongly recommended

### Required Lower Division Courses (58-62 units)

#### Mathematics (20 units)
1. **Calculus I** (5 units) - MATH 28
   - Limits, derivatives, applications
   - Prerequisite: Precalculus

2. **Calculus II** (5 units) - MATH 29
   - Integration, series, applications
   - Prerequisite: Calculus I

3. **Multivariable Calculus** (5 units) - MATH 32
   - Vector calculus, partial derivatives
   - Prerequisite: Calculus II

4. **Linear Algebra** (3 units) - MATH 33
   - Matrices, vector spaces
   - Can be taken concurrently with Multivariable

5. **Differential Equations** (3 units) - MATH 34
   - ODEs, Laplace transforms
   - Prerequisite: Calculus II

#### Physics (15 units)
6. **Physics I: Mechanics** (5 units) - PHYS 21
   - Mechanics, energy, momentum
   - Corequisite: Calculus I

7. **Physics II: E&M** (5 units) - PHYS 22
   - Electricity, magnetism, circuits
   - Prerequisite: Physics I, Calculus II

8. **Physics III: Waves/Modern** (5 units) - PHYS 23
   - Waves, optics, modern physics
   - Prerequisite: Physics II

#### Chemistry (5 units)
9. **General Chemistry I** (5 units) - CHEM 11
   - Stoichiometry, bonding, thermodynamics

#### Engineering Core (13-17 units)
10. **Statics** (3 units) - ENGR 12
    - Force systems, equilibrium
    - Prerequisite: Physics I

11. **Dynamics** (3 units) - ENGR 14
    - Kinematics, kinetics
    - Prerequisite: Statics

12. **Circuits** (3 units) - ENGR 16
    - Circuit analysis, digital logic

13. **Programming** (3 units) - CS 55
    - Java/C++ programming

14. **Engineering Intro** (1 unit) - ENGR 10
    - Engineering disciplines overview

### Recommended Additional Courses
- **MATLAB Programming** (3 units)
- **Materials Science** (3 units)
- **Public Speaking** (3 units)

### Total Units Required for Transfer: 58-62 semester units

### Critical Success Factors
1. Complete all Math and Physics courses with B or better
2. Maintain 3.5+ GPA for competitive campuses (UCLA, UCSD, UCB)
3. Take Engineering courses at your CC if available
4. Join engineering clubs/competitions

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.7-4.0
- UCLA: 3.7-4.0
- UCSD: 3.6-3.9
- UCD: 3.5-3.8
- UCI: 3.5-3.8
');
