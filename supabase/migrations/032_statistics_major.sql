-- Migration 032: Statistics major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Riverside, San Diego, Santa Barbara
-- Major requirements: calculus, linear algebra, statistics, programming

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000032', 'Statistics', 'Mathematics', 'Data analysis, probability theory, statistical inference, and computational methods. Foundation for data science and quantitative research.', 'BS', 120, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCR', 'UCSD', 'UCSB'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Statistics (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications'),
  ('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 29', 'Calculus II', 5, 'Integration, techniques, and applications'),
  ('p0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'MATH 32', 'Multivariable Calculus', 5, 'Vector calculus and partial derivatives'),
  ('p0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'MATH 33', 'Linear Algebra', 3, 'Matrices, vector spaces, and linear transformations'),
  ('p0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'MATH 54', 'Statistics', 4, 'Descriptive and inferential statistics'),
  ('p0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'CS 55', 'Java Programming', 3, 'Object-oriented programming fundamentals'),
  ('p0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'CS 57', 'Python Programming', 3, 'Python for data analysis'),
  ('p0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'MATH 11', 'Discrete Mathematics', 3, 'Logic, sets, combinatorics, and graph theory'),
  ('p0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'ECON 1', 'Principles of Microeconomics', 3, 'Supply, demand, market structures, and consumer theory');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-stat-001', 'm0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000000001', '
## UC Statistics Transfer Requirements

### Minimum GPA Requirements
- Overall UC-transferable GPA: 3.0 minimum
- Required courses GPA: 3.0 minimum strongly recommended

### Required Lower Division Courses (35-40 units)

#### Mathematics (18 units)
1. **Calculus I** (5 units) - MATH 28
   - Limits, derivatives, applications

2. **Calculus II** (5 units) - MATH 29
   - Integration, series, applications

3. **Multivariable Calculus** (5 units) - MATH 32
   - Vector calculus, partial derivatives

4. **Linear Algebra** (3 units) - MATH 33
   - Critical for statistical modeling

#### Statistics (4 units)
5. **Introduction to Statistics** (4 units) - MATH 54
   - Descriptive stats, probability, inference
   - Or take at UC (recommended)

#### Programming (6 units)
6. **Programming I** (3 units) - CS 55 or CS 57
   - Python or R strongly preferred
   - Java acceptable but Python better for stats

7. **Additional Programming** (3 units)
   - R programming or Python data analysis

#### Discrete Math (3 units)
8. **Discrete Mathematics** (3 units) - MATH 11
   - Probability foundations
   - Combinatorics, counting

### Recommended Additional Courses
- **Calculus III** (5 units) - MATH 30
  - Series, advanced integration
- **Economics** (3 units) - ECON 1
  - Microeconomics for applied stats
- **Biology** (5 units) - BIOL 21
  - For biostatistics track

### Total Units Required for Transfer: 35-40 semester units

### Statistics Specializations at UC
- **Statistical Theory**: Probability, inference, asymptotics
- **Applied Statistics**: Biostatistics, econometrics, social science
- **Computational Statistics**: ML, big data, simulation
- **Data Science**: ML, visualization, database systems
- **Actuarial Science**: Risk analysis, financial modeling

### Career Paths
- Data Scientist/Analyst
- Biostatistician (pharma, healthcare)
- Quantitative Analyst (finance)
- Actuary (insurance)
- Research Scientist (academia, government)

### Critical Success Factors
1. Strong foundation in Calculus II and Linear Algebra
2. Learn Python and R thoroughly
3. Take extra programming courses
4. Maintain 3.4+ GPA for competitive campuses
5. Build data analysis projects portfolio

### Competitive GPA Ranges (Recent Admits)
- UC Berkeley: 3.7-4.0
- UCLA: 3.6-3.9
- UCSD: 3.5-3.8
- UCD: 3.4-3.7
- UCSB: 3.4-3.7
');
