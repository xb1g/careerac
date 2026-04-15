-- Migration 037: Biological Sciences major based on UC Transfer Pathways data (NEW consolidated pathway)
-- Participating UC campuses: All UC campuses (new for fall 2027)
-- Note: This NEW pathway consolidates Biology, Biochemistry, Cell Biology, and Molecular Biology
-- Major requirements: comprehensive biology, chemistry, math foundation

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000037', 'Biological Sciences', 'Biological Sciences', 'NEW consolidated pathway for fall 2027. Integrates Biology, Biochemistry, Cell Biology, and Molecular Biology into a unified curriculum. Flexible foundation for all life science careers.', 'BS', 120, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Biological Sciences (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('u0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('u0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('u0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 54', 'Statistics', 4, 'Descriptive and inferential statistics for biology'),
  ('u0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'General Chemistry I', 5, 'Introductory chemical principles with laboratory'),
  ('u0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'CHEM 12', 'General Chemistry II', 5, 'Chemical equilibrium, thermodynamics, and kinetics'),
  ('u0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'CHEM 21', 'Organic Chemistry I', 5, 'Structure, bonding, and reactions of organic compounds'),
  ('u0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'CHEM 22', 'Organic Chemistry II', 5, 'Reaction mechanisms and spectroscopy'),
  ('u0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'BIOL 21', 'Foundations of Biology I: Cells, Genetics, Evolution', 5, 'Cell structure, genetics, and evolutionary biology'),
  ('u0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'BIOL 22', 'Foundations of Biology II: Molecular Biology', 5, 'DNA, RNA, proteins, gene expression and regulation'),
  ('u0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'BIOL 23', 'Foundations of Biology III: Organismal Biology', 5, 'Physiology, anatomy, ecology, and biodiversity'),
  ('u0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'PHYS 6', 'General Physics I', 4, 'Mechanics and thermodynamics'),
  ('u0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'PHYS 7', 'General Physics II', 4, 'Electricity, magnetism, and optics'),
  ('u0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'BIOL 24', 'Biochemistry', 5, 'Biomolecules, metabolism, and molecular biology');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-biosci-001', 'm0000000-0000-0000-0000-000000000037', 'a0000000-0000-0000-0000-000000000001', '
## UC Biological Sciences Transfer Requirements (NEW for Fall 2027)

### IMPORTANT: NEW Consolidated Pathway
This is the **NEW unified pathway** starting fall 2027, consolidating:
- Biology
- Biochemistry  
- Cell Biology
- Molecular Biology

All four previous pathways are now integrated into this comprehensive Biological Sciences pathway.

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum strongly recommended
- Competitive applicants: 3.5+ GPA

### Required Lower Division Courses (55-60 units)

#### Mathematics (9-14 units)
1. **Calculus I** (5 units) - MATH 28
   - Required foundation

2. **Calculus II** (5 units) - MATH 29
   - Required for some concentrations

3. **Statistics** (4 units) - MATH 54
   - Essential for biological data analysis
   - All concentrations require statistics

#### Chemistry (15-20 units)
4. **General Chemistry I** (5 units) - CHEM 11
   - Stoichiometry, bonding, thermodynamics

5. **General Chemistry II** (5 units) - CHEM 12
   - Equilibrium, kinetics, electrochemistry

6. **Organic Chemistry I** (5 units) - CHEM 21
   - Structure, reactions, mechanisms

7. **Organic Chemistry II** (5 units) - CHEM 22
   - Spectroscopy, synthesis, biomolecules
   - Strongly recommended for all concentrations

#### Biology Core (15 units)
8. **Foundations I: Cells, Genetics, Evolution** (5 units) - BIOL 21
   - Cell structure, genetics, evolution
   - Gateway course for all concentrations

9. **Foundations II: Molecular Biology** (5 units) - BIOL 22
   - DNA replication, transcription, translation
   - Gene regulation and expression

10. **Foundations III: Organismal Biology** (5 units) - BIOL 23
    - Physiology, anatomy, ecology
    - Biodiversity and systems

#### Physics (8 units)
11. **General Physics I** (4 units) - PHYS 6
    - Mechanics, thermodynamics

12. **General Physics II** (4 units) - PHYS 7
    - E&M, optics, modern physics

#### Biochemistry (5 units)
13. **Biochemistry** (5 units) - BIOL 24 or CHEM 25
    - Biomolecules, metabolism
    - Required for biochemistry concentration

### Concentrations Available at UC
Within Biological Sciences, students can specialize in:
- **Cell & Developmental Biology**
- **Ecology & Evolutionary Biology**
- **Genetics & Genomics**
- **Molecular Biology**
- **Biochemistry**  
- **Neurobiology**
- **Microbiology & Immunology**

### Career Paths
- Medical Doctor (MD/DO)
- Dentist (DDS/DMD)
- Research Scientist (PhD)
- Biotechnologist (industry)
- Genetic Counselor (MS)
- Pharmaceutical Scientist
- Conservation Biologist
- Professor/Educator (PhD)

### Critical Success Factors
1. Complete full Chemistry sequence (Gen Chem + Organic Chem)
2. Take all three Foundations of Biology courses
3. Maintain 3.5+ GPA for competitive programs
4. Get research experience in a lab
5. Consider which concentration interests you most

### Competitive GPA Ranges (Expected for Fall 2027)
- UC Berkeley: 3.7-4.0
- UCLA: 3.7-4.0
- UCSD: 3.6-3.9
- UCD: 3.5-3.8
- UCI: 3.5-3.8

### Transition Information
- Students transferring fall 2027+ will enter under this new pathway
- Previous pathways (Biology, Biochem, Cell Bio, Molecular Bio) will be grandfathered
- All four pathways lead to the same career outcomes
- More flexibility to explore different concentrations before declaring
');
