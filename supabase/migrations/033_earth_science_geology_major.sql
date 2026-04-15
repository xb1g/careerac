-- Migration 033: Earth Science/Geology major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Los Angeles, Merced, Riverside, San Diego, Santa Barbara, Santa Cruz
-- Major requirements: calculus, physics, chemistry, geology courses

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000033', 'Earth Science/Geology', 'Physical Sciences', 'Study of Earth systems including rocks, minerals, plate tectonics, natural resources, and environmental geology. Fieldwork intensive.', 'BS', 120, array['UCB', 'UCD', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Earth Science/Geology (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('q0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('q0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('q0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'PHYS 21', 'Physics for Scientists and Engineers I', 5, 'Mechanics and motion with laboratory'),
  ('q0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'PHYS 22', 'Physics for Scientists and Engineers II', 5, 'Electricity and magnetism with laboratory'),
  ('q0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('q0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics'),
  ('q0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'GEOL 1', 'Physical Geology', 3, 'Earth materials, structures, and processes'),
  ('q0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'GEOL 2', 'Historical Geology', 3, 'Earth history, evolution, and geologic time scale'),
  ('q0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'GEOL 3', 'Mineralogy', 3, 'Crystallography, mineral identification, and classification'),
  ('q0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'GEOL 4', 'Petrology', 3, 'Igneous, sedimentary, and metamorphic rocks'),
  ('q0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'GEOG 1', 'Physical Geography', 3, 'Landforms, climate, and ecosystems'),
  ('q0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'BIO 21', 'Environmental Science', 3, 'Ecology, conservation, and environmental issues'),
  ('q0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'MATH 54', 'Statistics', 4, 'Descriptive and inferential statistics');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-geology-001', 'm0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000001', '
## UC Earth Science/Geology Transfer Requirements

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum

### Required Lower Division Courses (45-50 units)

#### Mathematics (10 units)
1. **Calculus I** (5 units) - MATH 28
   - Essential for geophysics track

2. **Calculus II** (5 units) - MATH 29
   - Required for advanced geophysics

#### Physics (10 units)
3. **Physics I: Mechanics** (5 units) - PHYS 21
   - Important for geophysics

4. **Physics II: E&M** (5 units) - PHYS 22
   - For geophysical methods

#### Chemistry (10 units)
5. **General Chemistry I** (5 units) - CHEM 11
   - Mineral chemistry foundation

6. **General Chemistry II** (5 units) - CHEM 12
   - Geochemical processes

#### Geology Core (12 units)
7. **Physical Geology** (3 units) - GEOL 1
   - Rocks, minerals, structures
   - Essential introductory course

8. **Historical Geology** (3 units) - GEOL 2
   - Earth history, time scale

9. **Mineralogy** (3 units) - GEOL 3
   - Crystal systems, identification

10. **Petrology** (3 units) - GEOL 4
    - Rock classification, formation

#### Additional (6-8 units)
11. **Physical Geography** (3 units) - GEOG 1
    - Landscapes, climate systems

12. **Statistics** (4 units) - MATH 54
    - Data analysis for fieldwork

### Recommended Additional Courses
- **Environmental Science** (3 units) - BIO 21
  - For environmental geology track
- **Biology** (5 units) - BIOL 21
  - For paleontology interest

### Total Units Required for Transfer: 45-50 semester units

### Geology Specializations at UC
- **Petrology/Mineralogy**: Rock formation, mineral resources
- **Structural Geology**: Deformation, tectonics, mapping
- **Sedimentology/Stratigraphy**: Depositional environments
- **Geophysics**: Seismology, gravity, magnetics
- **Geochemistry**: Isotopes, fluid chemistry
- **Paleontology**: Fossils, evolution, stratigraphy
- **Hydrogeology**: Groundwater, water resources

### Career Paths
- Petroleum Geologist (oil/gas industry)
- Environmental Consultant
- Geotechnical Engineer (with MS)
- Seismologist (USGS, research)
- Mining Geologist
- Professor/Researcher (PhD required)
- Park Ranger/Interpreter

### Critical Success Factors
1. Take Physical Geology and Chemistry early
2. Maintain 3.2+ GPA
3. Participate in field trips/outings
4. Learn GIS and mapping software
5. UC Santa Cruz has excellent field program

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.5-3.8
- UCLA: 3.4-3.7
- UCSD: 3.3-3.6
- UCSB: 3.3-3.6
- UCSC: 3.2-3.5 (strong field program)
');
