-- Migration 030: Electrical Engineering major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, Riverside, San Diego, Santa Barbara, Santa Cruz
-- Major requirements: calculus, physics, circuits, programming, signals

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000030', 'Electrical Engineering', 'Engineering', 'Design and analysis of electrical systems, circuits, signal processing, and electronics. Core of modern technology infrastructure.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Electrical Engineering (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('n0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('n0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('n0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('n0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('n0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
  ('n0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('n0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('n0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
  ('n0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('n0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
  ('n0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'ENGR 16', 'Circuits and Electronics', 3, 'Basic circuit analysis and digital electronics'),
  ('n0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('n0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'CS 56', 'C++ Programming', 3, 'Programming fundamentals in C++'),
  ('n0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'ENGR 20', 'Introduction to Digital Systems', 3, 'Digital logic, Boolean algebra, and circuit design'),
  ('n0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'MATH 7', 'Discrete Mathematics', 3, 'Logic, sets, combinatorics, and graph theory');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-electrical-001', 'm0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000001', '
## UC Electrical Engineering Transfer Requirements

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
   - Essential for circuit analysis, signals

5. **Differential Equations** (3 units) - MATH 34
   - Critical for signal processing, systems

#### Physics (15 units)
6. **Physics I: Mechanics** (5 units) - PHYS 21
   - Foundation for electromagnetics

7. **Physics II: E&M** (5 units) - PHYS 22
   - Core for electrical engineering
   - Emphasize Maxwell''s equations, circuits

8. **Physics III: Waves/Modern** (5 units) - PHYS 23
   - Waves, optics, quantum basics

#### Chemistry (5 units)
9. **General Chemistry I** (5 units) - CHEM 11
   - Materials science foundation

#### Programming and CS (6 units)
10. **Programming I** (3 units) - CS 55
    - Java or Python fundamentals

11. **Programming II** (3 units) - CS 56
    - C++ for embedded systems

12. **Discrete Mathematics** (3 units) - MATH 7
    - Logic, Boolean algebra
    - Critical for digital design

#### Engineering (6 units)
13. **Circuits** (3 units) - ENGR 16
    - Basic circuit analysis

14. **Digital Systems** (3 units) - ENGR 20
    - Digital logic, gates, FPGAs

### Recommended Additional Courses
- **Statics** (3 units) - ENGR 12
- **Materials Science** (3 units) - ENGR 18
- **Additional Physics**: Modern Physics emphasis

### Total Units Required for Transfer: 55-60 semester units

### Electrical Engineering Specializations at UC
- **Power Engineering**: Energy systems, grids, renewables
- **Signal Processing**: Audio, image, data compression
- **Communications**: Wireless, networking, 5G/6G
- **Electronics**: Circuits, VLSI, chip design
- **Control Systems**: Robotics, automation, AI
- **Computer Engineering**: Hardware-software integration

### Critical Success Factors
1. Strong performance in Physics II (E&M)
2. Master Linear Algebra - used everywhere in EE
3. Learn C/C++ and Python
4. Maintain 3.5+ GPA for competitive campuses
5. Build circuits/projects independently

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.7-4.0
- UCLA: 3.7-4.0
- UCSD: 3.6-3.9
- UCSB: 3.5-3.8
- UCI: 3.5-3.8
- UCD: 3.4-3.7
');
