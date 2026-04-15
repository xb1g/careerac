-- Migration 035: Environmental Engineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, Riverside, San Diego, Santa Barbara
-- Major requirements: calculus, physics, chemistry, biology, engineering fundamentals

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000035', 'Environmental Engineering', 'Engineering', 'Design of systems for water treatment, air quality, waste management, and sustainable infrastructure. Combines engineering with environmental science.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Environmental Engineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('s0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('s0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('s0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('s0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('s0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('s0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('s0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('s0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('s0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics'),
  ('s0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I', 5, 'Structure, bonding, and reactions of organic compounds'),
  ('s0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'BIOL 21', 'Cell Biology and Evolution', 5, 'Cell structure, genetics, and evolutionary biology'),
  ('s0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('s0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'ENVR 1', 'Environmental Science', 3, 'Ecology, conservation, and environmental issues'),
  ('s0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'GEOL 1', 'Physical Geology', 3, 'Earth materials, structures, and processes'),
  ('s0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-env-001', 'm0000000-0000-0000-0000-000000000035', 'a0000000-0000-0000-0000-000000000001', '
## UC Environmental Engineering Transfer Requirements

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
   - ODEs for reaction kinetics

#### Physics (10 units)
6. **Physics I: Mechanics** (5 units) - PHYS 21
   - Fluid mechanics foundation

7. **Physics II: E&M** (5 units) - PHYS 22
   - For water treatment systems

#### Chemistry (10 units)
8. **General Chemistry I** (5 units) - CHEM 11
   - Stoichiometry, equilibrium

9. **General Chemistry II** (5 units) - CHEM 12
   - Thermodynamics, kinetics

10. **Organic Chemistry I** (5 units) - CHEM 21
    - For contaminant chemistry

#### Biology (5 units)
11. **Cell Biology** (5 units) - BIOL 21
    - Microbiology for wastewater

#### Environmental Science (6-9 units)
12. **Environmental Science** (3 units) - ENVR 1
    - Core concepts, sustainability

13. **Physical Geology** (3 units) - GEOL 1
    - Hydrogeology foundation

14. **Statics** (3 units) - ENGR 12
    - Structural design for systems

### Recommended Additional Courses
- **Microbiology** (5 units)
  - For biological treatment processes
- **Fluid Mechanics** (3 units)
  - If available at CC
- **Economics** (3 units) - ECON 1
  - For environmental policy

### Total Units Required for Transfer: 55-60 semester units

### Environmental Engineering Specializations at UC
- **Water Quality**: Treatment, distribution, wastewater
- **Air Quality**: Emissions control, atmospheric modeling
- **Solid Waste**: Landfills, recycling, resource recovery
- **Environmental Chemistry**: Contaminant fate, remediation
- **Sustainability**: Green design, renewable energy systems
- **Hydrogeology**: Groundwater, contaminant transport

### Career Paths
- Water/Wastewater Engineer
- Air Quality Specialist
- Environmental Consultant
- Sustainability Engineer
- Remediation Engineer
- Regulatory Compliance (EPA, state agencies)
- Professor/Researcher (PhD)

### Critical Success Factors
1. Strong chemistry background essential
2. Take Environmental Science early
3. Maintain 3.4+ GPA
4. Get lab experience if possible
5. UC Davis and UC Berkeley have top programs

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.6-3.9
- UC Davis: 3.5-3.8
- UCLA: 3.5-3.8
- UCSD: 3.4-3.7
- UCSB: 3.4-3.7
');
