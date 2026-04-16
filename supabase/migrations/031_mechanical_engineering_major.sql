-- Migration 031: Mechanical Engineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, Riverside, San Diego, Santa Barbara, Santa Cruz
-- Major requirements: calculus, physics, chemistry, materials, thermodynamics

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000031', 'Mechanical Engineering', 'Engineering', 'Design and analysis of mechanical systems, thermodynamics, fluid mechanics, and manufacturing processes. Broadest engineering discipline.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Mechanical Engineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('o0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('o0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('o0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('o0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('o0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('o0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('o0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('o0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
  ('o0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('o0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('o0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'ENGR 14', 'Dynamics', 3, 'Kinematics and kinetics of particles and rigid bodies'),
  ('o0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'ENGR 16', 'Circuits and Electronics', 3, 'Basic circuit analysis and digital electronics'),
  ('o0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'ENGR 18', 'Materials Science', 3, 'Structure and properties of engineering materials'),
  ('o0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('o0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'ENGR 22', 'Strength of Materials', 3, 'Stress, strain, and material deformation analysis') on conflict do nothing;

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-mech-001', 'm0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000001', '
## UC Mechanical Engineering Transfer Requirements

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
   - Core for mechanical engineering
   - Focus on mechanics, dynamics

7. **Physics II: E&M** (5 units) - PHYS 22
   - Basic circuits, magnetism

8. **Physics III: Waves/Modern** (5 units) - PHYS 23
   - Thermodynamics, waves, modern physics

#### Chemistry (5 units)
9. **General Chemistry I** (5 units) - CHEM 11
   - Materials science foundation

#### Engineering Mechanics (9-12 units)
10. **Statics** (3 units) - ENGR 12
    - Force systems, equilibrium
    - Most important course for ME!

11. **Dynamics** (3 units) - ENGR 14
    - Kinematics, kinetics
    - Prerequisite: Statics

12. **Strength of Materials** (3 units) - ENGR 22
    - Stress, strain, material behavior
    - Prerequisite: Statics

13. **Materials Science** (3 units) - ENGR 18
    - Properties of metals, composites

#### Additional (3-6 units)
14. **Circuits** (3 units) - ENGR 16
    - Mechatronics foundation

15. **Programming** (3 units) - CS 55
    - MATLAB or Python for analysis

### Recommended Additional Courses
- **Calculus III** (5 units) - MATH 30
- **Technical Drawing** (3 units)
  - CAD, SolidWorks, AutoCAD
- **Manufacturing** (3 units)
  - Machining, 3D printing basics

### Total Units Required for Transfer: 55-60 semester units

### Mechanical Engineering Specializations at UC
- **Thermodynamics/Fluids**: HVAC, power plants, aerospace
- **Mechanical Design**: Product design, robotics, mechanisms
- **Materials/Manufacturing**: Composites, 3D printing, nanotech
- **Mechatronics**: Robotics, controls, automation
- **Aerospace**: Aircraft, spacecraft propulsion
- **Biomechanical**: Medical devices, prosthetics

### Critical Success Factors
1. Excel in Statics - it''s the foundation of ME
2. Strong physics and math skills
3. Learn CAD software (SolidWorks, CATIA)
4. Maintain 3.4+ GPA for competitive campuses
5. Build projects: robots, mechanisms, drones

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.7-4.0
- UCLA: 3.6-3.9
- UCSD: 3.6-3.9
- UCSB: 3.5-3.8
- UCI: 3.5-3.8
- UCD: 3.4-3.7
') on conflict do nothing;
