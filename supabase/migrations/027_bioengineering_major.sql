-- Migration 027: Bioengineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, Riverside, San Diego, Santa Cruz
-- Major requirements: calculus, physics, chemistry, biology, engineering fundamentals

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000027', 'Bioengineering', 'Engineering', 'Application of engineering principles to biological systems. Covers biomechanics, biomaterials, tissue engineering, and medical devices.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSC'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Bioengineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('k0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('k0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('k0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('k0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('k0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('k0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('k0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('k0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('k0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics'),
  ('k0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I', 5, 'Structure, bonding, and reactions of organic compounds'),
  ('k0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'BIOL 21', 'Cell Biology and Evolution', 5, 'Cell structure, genetics, and evolutionary biology'),
  ('k0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'BIOL 22', 'Genetics and Molecular Biology', 5, 'Molecular genetics, DNA replication, and gene expression'),
  ('k0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('k0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('k0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'PSYCH 1', 'General Psychology', 3, 'Introduction to psychological science') on conflict do nothing;

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-bioeng-001', 'm0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000001', '
## UC Bioengineering Transfer Requirements

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum strongly recommended

### Required Lower Division Courses (55-60 units)

#### Mathematics (18 units)
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

5. **Differential Equations** (3 units) - MATH 34
   - ODEs, Laplace transforms

#### Physics (10 units)
6. **Physics I: Mechanics** (5 units) - PHYS 21
   - Mechanics, energy, momentum
   - Corequisite: Calculus I

7. **Physics II: E&M** (5 units) - PHYS 22
   - Electricity, magnetism, circuits
   - Prerequisite: Physics I, Calculus II

#### Chemistry (10 units)
8. **General Chemistry I** (5 units) - CHEM 11
   - Stoichiometry, bonding, thermodynamics

9. **General Chemistry II** (5 units) - CHEM 12
   - Equilibrium, kinetics, electrochemistry

10. **Organic Chemistry I** (5 units) - CHEM 21
    - Structure, reactions, mechanisms

#### Biology (10 units)
11. **Cell Biology** (5 units) - BIOL 21
    - Cell structure, genetics, evolution

12. **Molecular Biology** (5 units) - BIOL 22
    - DNA, RNA, protein synthesis, gene regulation

#### Engineering (6 units)
13. **Statics** (3 units) - ENGR 12
    - Force systems, equilibrium

14. **Programming** (3 units) - CS 55
    - MATLAB or Java programming

### Recommended Additional Courses
- **Calculus III** (5 units) - MATH 30
- **Physics III** (5 units) - PHYS 23
- **Organic Chemistry II** (5 units) - CHEM 22
- **Psychology** (3 units) - PSYCH 1

### Total Units Required for Transfer: 55-60 semester units

### Critical Success Factors
1. Complete all Math, Physics, Chemistry with B or better
2. Take Biology sequence early
3. Maintain 3.5+ GPA for competitive campuses
4. Get research experience if possible

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.7-4.0
- UCLA: 3.7-4.0
- UCSD: 3.6-3.9
- UCD: 3.5-3.8
- UCI: 3.5-3.8
') on conflict do nothing;
