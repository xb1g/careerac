-- Migration 034: Materials Science & Engineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, San Diego, Santa Barbara
-- Major requirements: calculus, physics, chemistry, materials science, thermodynamics

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000034', 'Materials Science & Engineering', 'Engineering', 'Study of material properties, structure, processing, and performance. Bridges physics, chemistry, and engineering for advanced materials development.', 'BS', 180, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCSD', 'UCSB'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Materials Science & Engineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('r0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('r0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('r0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('r0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('r0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('r0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('r0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('r0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
  ('r0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('r0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics'),
  ('r0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'ENGR 18', 'Materials Science', 3, 'Structure and properties of engineering materials'),
  ('r0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('r0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('r0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I', 5, 'Structure, bonding, and reactions of organic compounds');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-materials-001', 'm0000000-0000-0000-0000-000000000034', 'a0000000-0000-0000-0000-000000000001', '
## UC Materials Science & Engineering Transfer Requirements

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
   - Matrices, crystal structures

5. **Differential Equations** (3 units) - MATH 34
   - ODEs for diffusion equations

#### Physics (15 units)
6. **Physics I: Mechanics** (5 units) - PHYS 21
   - Stress, strain, deformation

7. **Physics II: E&M** (5 units) - PHYS 22
   - Conductivity, magnetism

8. **Physics III: Waves/Modern** (5 units) - PHYS 23
   - Quantum mechanics intro
   - Critical for electronic materials

#### Chemistry (10 units)
9. **General Chemistry I** (5 units) - CHEM 11
   - Bonding, thermodynamics

10. **General Chemistry II** (5 units) - CHEM 12
    - Equilibrium, kinetics

11. **Organic Chemistry I** (5 units) - CHEM 21
    - Polymer chemistry foundation

#### Engineering (6 units)
12. **Materials Science** (3 units) - ENGR 18
    - Crystal structures, phase diagrams
    - Most important course!

13. **Statics** (3 units) - ENGR 12
    - Mechanical behavior

14. **Programming** (3 units) - CS 55
    - MATLAB or Python

### Recommended Additional Courses
- **Calculus III** (5 units) - MATH 30
- **Physics**: Solid State Physics if offered
- **Chemistry**: Physical Chemistry

### Total Units Required for Transfer: 55-60 semester units

### Materials Science Specializations at UC
- **Metals and Alloys**: Steel, aluminum, advanced alloys
- **Ceramics**: Structural, electronic ceramics
- **Polymers**: Plastics, composites, biopolymers
- **Semiconductors**: Electronic materials, chips
- **Nanomaterials**: 2D materials, nanotechnology
- **Biomaterials**: Medical implants, tissue engineering

### Career Paths
- Materials Engineer (semiconductor, aerospace)
- Metallurgist (automotive, manufacturing)
- Process Engineer (chemical industry)
- Research Scientist (national labs)
- Product Development (consumer goods)
- Professor (PhD required)

### Critical Success Factors
1. Take Materials Science course if available
2. Strong chemistry and physics foundation
3. Learn crystallography basics
4. Maintain 3.4+ GPA
5. UC Santa Barbara has top MSE program

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.6-3.9
- UCLA: 3.6-3.9
- UCSD: 3.5-3.8
- UCSB: 3.5-3.8
- UCI: 3.4-3.7
');
