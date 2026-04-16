-- Migration 040: Repair invalid UUID-backed seed data for majors 026-031
--
-- This migration re-seeds the affected major/course/pathway rows using
-- gen_random_uuid() and institution lookups by abbreviation so no invalid UUID
-- literals remain in the repair SQL.

-- ============================================================
-- MAJORS
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses)
select gen_random_uuid(), v.name, v.category, v.description, v.degree_type, v.total_units_required, v.participating_uc_campuses
from (
  values
    ('Aerospace Engineering', 'Engineering', 'Design, analysis, and construction of aircraft and spacecraft. Covers aerodynamics, propulsion, structures, and control systems.', 'BS', 180, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD']),
    ('Bioengineering', 'Engineering', 'Application of engineering principles to biological systems. Covers biomechanics, biomaterials, tissue engineering, and medical devices.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSC']),
    ('Business Administration', 'Business', 'Management, finance, marketing, and operations. Prepares students for careers in business leadership, consulting, and entrepreneurship.', 'BS', 120, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCR', 'UCSD', 'UCSB']),
    ('Civil Engineering', 'Engineering', 'Design and construction of infrastructure including structures, transportation, water resources, and environmental systems.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB']),
    ('Electrical Engineering', 'Engineering', 'Design and analysis of electrical systems, circuits, signal processing, and electronics. Core of modern technology infrastructure.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('Mechanical Engineering', 'Engineering', 'Design and analysis of mechanical systems, thermodynamics, fluid mechanics, and manufacturing processes. Broadest engineering discipline.', 'BS', 185, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
) as v(name, category, description, degree_type, total_units_required, participating_uc_campuses)
where not exists (
  select 1 from majors m where m.name = v.name
) on conflict do nothing;

-- ============================================================
-- COURSES
-- ============================================================
insert into courses (id, institution_id, code, title, units, description)
select gen_random_uuid(), i.id, v.code, v.title, v.units, v.description
from (
  values
    ('SMC', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
    ('SMC', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
    ('SMC', 'MATH 30', 'Calculus III', 5, 'Sequences, series, and advanced integration'),
    ('SMC', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
    ('SMC', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
    ('SMC', 'MATH 34', 'Differential Equations', 3, 'First-order and linear differential equations'),
    ('SMC', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
    ('SMC', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
    ('SMC', 'PHYS 23', 'Physics for Scientists and Engineers III', 5, 'Waves, optics, and modern physics with laboratory'),
    ('SMC', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
    ('SMC', 'ENGR 12', 'Statics', 3, 'Force systems, equilibrium, and structural analysis'),
    ('SMC', 'ENGR 14', 'Dynamics', 3, 'Kinematics and kinetics of particles and rigid bodies'),
    ('SMC', 'ENGR 16', 'Circuits and Electronics', 3, 'Basic circuit analysis and digital electronics'),
    ('SMC', 'ENGR 18', 'Materials Science', 3, 'Structure and properties of engineering materials'),
    ('SMC', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
    ('SMC', 'ENGR 10', 'Introduction to Engineering', 1, 'Overview of engineering disciplines and design process'),

    ('UCLA', 'MATH 31A', 'Differential and Integral Calculus', 4, 'Limits, derivatives, and applications'),
    ('UCLA', 'MATH 31B', 'Integration and Infinite Series', 4, 'Techniques of integration and series'),
    ('UCLA', 'MATH 31C', 'Multivariable Calculus', 4, 'Vectors, partial derivatives, and multiple integration'),
    ('UCLA', 'MATH 32A', 'Linear Algebra', 4, 'Matrices, vector spaces, and linear transformations'),
    ('UCLA', 'MATH 33A', 'Differential Equations', 4, 'Ordinary differential equations and applications'),
    ('UCLA', 'PHYSICS 1A', 'Physics for Scientists and Engineers: Mechanics', 5, 'Mechanics, energy, momentum, and rotation'),
    ('UCLA', 'PHYSICS 1B', 'Physics for Scientists and Engineers: Electricity and Magnetism', 5, 'Electric fields, circuits, and magnetism'),
    ('UCLA', 'PHYSICS 1C', 'Physics for Scientists and Engineers: Waves, Optics, and Modern Physics', 5, 'Oscillations, waves, optics, and relativity'),
    ('UCLA', 'CHEM 20A', 'General Chemistry I', 5, 'Atomic structure, bonding, and stoichiometry'),
    ('UCLA', 'ENGR 82', 'Statics', 4, 'Force systems, equilibrium, and structural analysis'),
    ('UCLA', 'ENGR 83', 'Dynamics', 4, 'Kinematics and kinetics of particles and rigid bodies'),
    ('UCLA', 'ENGR 85A', 'Circuits and Signal Processing', 4, 'Circuit analysis and signal processing fundamentals'),
    ('UCLA', 'COM SCI 31', 'Introduction to Computer Science I', 4, 'Programming fundamentals and software development'),
    ('UCLA', 'ENGR 1', 'Introduction to Engineering', 2, 'Overview of engineering disciplines and design process')
) as v(institution_abbreviation, code, title, units, description)
join institutions i on i.abbreviation = v.institution_abbreviation
where not exists (
  select 1 from courses c
  where c.institution_id = i.id
    and c.code = v.code
) on conflict do nothing;

-- ============================================================
-- TRANSFER PATHWAYS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements)
select gen_random_uuid(), m.id, i.id, v.requirements
from (
  values
    ('Aerospace Engineering', 'SMC', $$
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
$$),
    ('Bioengineering', 'SMC', $$
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
$$),
    ('Business Administration', 'SMC', $$
## UC Business Administration Transfer Requirements

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.2 minimum (highly competitive)
- Haas School (UCB): 3.8-4.0 required
- Required courses GPA: 3.5+ strongly recommended

### Required Lower Division Courses (35-40 units)

#### Mathematics (9 units)
1. **Calculus I** (5 units) - MATH 28
   - Business calculus, derivatives, optimization
   - UC Berkeley Haas requires regular Calculus I

2. **Statistics** (4 units) - MATH 54
   - Descriptive stats, probability, hypothesis testing
   - Critical for business analytics

#### Economics (6 units)
3. **Microeconomics** (3 units) - ECON 1
   - Supply, demand, market structures
   - Must be calculus-based for some campuses

4. **Macroeconomics** (3 units) - ECON 2
   - GDP, inflation, monetary policy

#### Accounting (10 units)
5. **Financial Accounting** (5 units) - ACCTG 1
   - GAAP, financial statements, accounting cycle

6. **Managerial Accounting** (5 units) - ACCTG 2
   - Cost behavior, budgeting, variance analysis

#### Business Core (6 units)
7. **Business Law** (3 units) - BUS 5
   - Contracts, torts, business organizations

8. **Business Communication** (3 units) - BUS 32
   - Professional writing and presentations

#### English Composition (6 units)
9. **English Composition I** (3 units) - ENGL 1
   - Academic writing, research skills

10. **English Composition II** (3 units) - ENGL 2
    - Critical analysis, argumentation

### Recommended Additional Courses
- **Introduction to Business** (3 units) - BUS 1
- **Marketing Principles** (3 units) - MKTG 1
- **Financial Management** (3 units) - FIN 1
- **Organizational Behavior** (3 units) - MGMT 1

### Total Units Required for Transfer: 35-40 semester units

### Critical Success Factors
1. Maintain 3.7+ GPA for competitive admission
2. Get B or better in all Accounting and Economics courses
3. Join business clubs, compete in case competitions
4. Get internships or work experience
5. UC Berkeley Haas: requires separate application after admission

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley (Haas): 3.85-4.0 (most competitive)
- UCLA: 3.7-3.95
- UCSD: 3.6-3.9
- UCI: 3.5-3.8
- UCSB: 3.5-3.8
- UCD: 3.4-3.7

### Campus-Specific Notes
- **UC Berkeley Haas**: Apply to Haas in sophomore year; requires essays, resume, interviews
- **UCLA**: Anderson School is graduate only; undergrad business is Economics-Business
- **UC Irvine**: Merage School has strong entrepreneurship focus
$$),
    ('Civil Engineering', 'SMC', $$
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
$$),
    ('Electrical Engineering', 'SMC', $$
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
$$),
    ('Mechanical Engineering', 'SMC', $$
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
$$)
) as v(major_name, institution_abbreviation, requirements)
join majors m on m.name = v.major_name
join institutions i on i.abbreviation = v.institution_abbreviation
where not exists (
  select 1 from transfer_pathways tp
  where tp.major_id = m.id
    and tp.institution_id = i.id
) on conflict do nothing;

-- NOTE: migrations 026-031 do not contain articulation_agreements or
-- prerequisites rows, so no repair updates are needed for those tables here.
