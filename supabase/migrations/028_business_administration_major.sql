-- Migration 028: Business Administration major based on UC Transfer Pathways data
-- Participating UC campuses: Berkeley, Davis, Irvine, Los Angeles, Riverside, San Diego, Santa Barbara
-- Major requirements: calculus, economics, accounting, statistics

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('m0000000-0000-0000-0000-000000000028', 'Business Administration', 'Business', 'Management, finance, marketing, and operations. Prepares students for careers in business leadership, consulting, and entrepreneurship.', 'BS', 120, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCR', 'UCSD', 'UCSB'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Business Administration (Santa Monica College)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('l0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus I', 5, 'Limits, derivatives, and applications for business and social sciences'),
  ('l0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'MATH 54', 'Statistics', 4, 'Descriptive and inferential statistics'),
  ('l0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ECON 1', 'Principles of Microeconomics', 3, 'Supply, demand, market structures, and consumer theory'),
  ('l0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'ECON 2', 'Principles of Macroeconomics', 3, 'GDP, inflation, unemployment, and fiscal policy'),
  ('l0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'ACCTG 1', 'Financial Accounting', 5, 'Accounting principles, financial statements, and reporting'),
  ('l0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'ACCTG 2', 'Managerial Accounting', 5, 'Cost accounting, budgeting, and decision analysis'),
  ('l0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'BUS 5', 'Business Law', 3, 'Legal environment of business and contracts'),
  ('l0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'BUS 32', 'Business Communication', 3, 'Professional writing and presentation skills'),
  ('l0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'ENGL 2', 'Critical Analysis and Intermediate Composition', 3, 'Analytical writing and research'),
  ('l0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'ENGL 1', 'Reading and Composition 1', 3, 'College-level academic writing');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('tp-business-001', 'm0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000001', '
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
');
