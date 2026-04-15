-- Migration 036: Cell Biology major based on UC Transfer Pathways data (legacy pathway)
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Merced, Riverside, San Diego, Santa Barbara, Santa Cruz
-- Note: This is a legacy pathway being consolidated into Biological Sciences for fall 2027
-- Major requirements: calculus, chemistry, biology, organic chemistry

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000036', 'Cell Biology', 'Biological Sciences', 'Study of cell structure, function, and processes. Foundation for molecular biology, genetics, and biomedical research. Legacy pathway - being consolidated into Biological Sciences for fall 2027.', 'BS', 120, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Cell Biology (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('t0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('t0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 54', 'Statistics', 4, 'Descriptive and inferential statistics'),
  ('t0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('t0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics'),
  ('t0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I', 5, 'Structure, bonding, and reactions of organic compounds'),
  ('t0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'CHEM 22', 'Organic Chemistry II', 5, 'Reaction mechanisms and spectroscopy'),
  ('t0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'BIOL 21', 'Cell Biology and Evolution', 5, 'Cell structure, genetics, and evolutionary biology'),
  ('t0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'BIOL 22', 'Genetics and Molecular Biology', 5, 'Molecular genetics, DNA replication, and gene expression'),
  ('t0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'BIOL 23', 'Organismal Biology', 5, 'Physiology, anatomy, and ecology'),
  ('t0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'PHYS 6', 'General Physics I', 4, 'Mechanics and thermodynamics'),
  ('t0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'PHYS 7', 'General Physics II', 4, 'Electricity, magnetism, and optics');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-cellbio-001', 'm0000000-0000-0000-0000-000000000036', 'a0000000-0000-0000-0000-000000000001', '
## UC Cell Biology Transfer Requirements (Legacy Pathway)

### IMPORTANT NOTE
This is a **legacy pathway** being consolidated into the new "Biological Sciences" pathway for fall 2027. Current students should be aware of this transition.

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum strongly recommended

### Required Lower Division Courses (50-55 units)

#### Mathematics (9-14 units)
1. **Calculus I** (5 units) - MATH 28
   - Required for some programs

2. **Calculus II** (5 units) - MATH 29
   - Recommended for biophysics focus

3. **Statistics** (4 units) - MATH 54
   - Essential for data analysis

#### Chemistry (15 units)
4. **General Chemistry I** (5 units) - CHEM 11
   - Stoichiometry, bonding, thermodynamics

5. **General Chemistry II** (5 units) - CHEM 12
   - Equilibrium, kinetics, electrochemistry

6. **Organic Chemistry I** (5 units) - CHEM 21
   - Structure, reactions, mechanisms

7. **Organic Chemistry II** (5 units) - CHEM 22
   - Spectroscopy, synthesis
   - Highly recommended

#### Biology (15 units)
8. **Cell Biology** (5 units) - BIOL 21
   - Cell structure, organelles, genetics
   - Core course for this major!

9. **Genetics/Molecular Biology** (5 units) - BIOL 22
   - DNA replication, transcription, translation
   - Essential for cell biology focus

10. **Organismal Biology** (5 units) - BIOL 23
    - Physiology, anatomy, evolution

#### Physics (8 units)
11. **General Physics I** (4 units) - PHYS 6
    - Non-calculus based acceptable
    - Or take calculus-based PHYS 21

12. **General Physics II** (4 units) - PHYS 7
    - E&M, optics, modern physics

### Recommended Additional Courses
- **Biochemistry** (5 units)
  - If available at your CC
- **Microbiology** (5 units)
  - Complements cell biology

### Total Units Required for Transfer: 50-55 semester units

### Career Paths
- Research Scientist (cell culture, microscopy)
- Biotechnologist (pharma, biotech)
- Genetic Counselor (with MS)
- Professor (PhD required)
- Medical Doctor (MD)

### Critical Success Factors
1. Excel in Cell Biology and Genetics courses
2. Take both Organic Chemistry I and II
3. Maintain 3.5+ GPA for competitive programs
4. Get lab research experience
5. Learn microscopy and cell culture basics

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.7-4.0
- UCLA: 3.6-3.9
- UCSD: 3.6-3.9
- UCD: 3.5-3.8
- UCI: 3.5-3.8

### Transition to Biological Sciences
For fall 2027 and beyond, Cell Biology will be part of the consolidated "Biological Sciences" pathway. Current students transferring before 2027 can still pursue this specific pathway.
');
