-- Migration 029: Civil Engineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, Riverside, San Diego, Santa Barbara
-- Major requirements: calculus, physics, chemistry, engineering mechanics, materials

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000029', 'Civil Engineering', 'Engineering', 'Design and construction of infrastructure including structures, transportation, water resources, and environmental systems.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Civil Engineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('m0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('m0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('m0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('m0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('m0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('m0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('m0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('m0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
  ('m0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('m0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('m0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'ENGR 14', 'Dynamics', 3, 'Kinematics and kinetics of particles and rigid bodies'),
  ('m0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'ENGR 16', 'Circuits and Electronics', 3, 'Basic circuit analysis and digital electronics'),
  ('m0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'ENGR 18', 'Materials Science', 3, 'Structure and properties of engineering materials'),
  ('m0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('m0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'GEOL 1', 'Physical Geology', 3, 'Earth materials, structures, and processes') on conflict do nothing;

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-civil-001', 'm0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000001', '
## UC Civil Engineering Transfer Requirements

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum strongly recommended

### Required Lower Division Courses (55-60 units)

#### Mathematics (21 units)
1. **Calculus I** (5 units) - MATH 28
   - Limits, derivatives, applications

2. **Calculus II** (5 units) - MATH 29
   - Integration, series, applications

3. **Multivariable Calculus** (5 units) - MATH 32
   - Vector calculus, partial derivatives

4. **Linear Algebra** (3 units) - MATH 33
   - Matrices, vector spaces

5. **Differential Equations** (3 units) - MATH 34
   - ODEs, Laplace transforms

#### Physics (15 units)
6. **Physics I: Mechanics** (5 units) - PHYS 21
   - Statics foundation for structures

7. **Physics II: E&M** (5 units) - PHYS 22
   - Electricity, magnetism

8. **Physics III: Waves/Modern** (5 units) - PHYS 23
   - Waves, optics, modern physics

#### Chemistry (5 units)
9. **General Chemistry I** (5 units) - CHEM 11
   - For materials and environmental applications

#### Engineering Mechanics (6 units)
10. **Statics** (3 units) - ENGR 12
    - Essential for structural analysis
    - Prerequisite: Physics I

11. **Dynamics** (3 units) - ENGR 14
    - For structural dynamics
    - Prerequisite: Statics

#### Materials and Additional (6-9 units)
12. **Materials Science** (3 units) - ENGR 18
    - Properties of concrete, steel, composites

13. **Circuits** (3 units) - ENGR 16
    - Basic electrical for civil systems

14. **Programming** (3 units) - CS 55
    - MATLAB or Python for analysis

### Recommended Additional Courses
- **Physical Geology** (3 units) - GEOL 1
  - Important for geotechnical engineering
- **Environmental Science** (3 units)
  - For water resources focus
- **Technical Drawing/CAD** (3 units)
  - AutoCAD, Revit fundamentals

### Total Units Required for Transfer: 55-60 semester units

### Civil Engineering Specializations at UC
- **Structural Engineering**: Buildings, bridges, dams
- **Geotechnical Engineering**: Soils, foundations
- **Transportation Engineering**: Highways, traffic systems
- **Water Resources**: Hydrology, environmental systems
- **Construction Management**: Project planning, cost estimation

### Critical Success Factors
1. Strong foundation in Statics and Physics I
2. Maintain 3.4+ GPA for competitive campuses
3. Take Materials Science if available
4. Get exposure to CAD software
5. Consider FE (Fundamentals of Engineering) exam prep

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.6-3.9
- UCLA: 3.6-3.9
- UCSD: 3.5-3.8
- UCI: 3.4-3.7
- UCD: 3.4-3.7
') on conflict do nothing;
