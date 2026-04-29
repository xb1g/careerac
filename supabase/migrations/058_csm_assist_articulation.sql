-- Migration: Add ASSIST articulation data for College of San Mateo → UC campuses (Computer Science)
-- Source: assist.org API, academic year 2025-2026
-- Generated: 2026-04-29T09:18:40.845Z

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-00000000000e', 'University of California, Irvine', 'university', 'CA', NULL, 'UCI')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-00000000000f', 'University of California, Santa Barbara', 'university', 'CA', NULL, 'UCSB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000010', 'University of California, Santa Cruz', 'university', 'CA', NULL, 'UCSC')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000011', 'University of California, Riverside', 'university', 'CA', NULL, 'UCR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000012', 'University of California, Merced', 'university', 'CA', NULL, 'UCM')
ON CONFLICT (id) DO NOTHING;

-- CC courses (College of San Mateo)
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000901', 'c0000000-0000-0000-0000-000000000001', 'CIS 117', 'Python Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000902', 'c0000000-0000-0000-0000-000000000001', 'CIS 502', 'Applied Python Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000903', 'c0000000-0000-0000-0000-000000000001', 'CIS 256', '(CS2) Data Structures: Java', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000904', 'c0000000-0000-0000-0000-000000000001', 'CIS 279', '(CS2) Data Structures: C ++', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000905', 'c0000000-0000-0000-0000-000000000001', 'CIS 264', 'Computer Organization and Systems Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000906', 'c0000000-0000-0000-0000-000000000001', 'MATH 275', 'Ordinary Differential Equations', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000907', 'c0000000-0000-0000-0000-000000000001', 'MATH 270', 'Linear Algebra', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000908', 'c0000000-0000-0000-0000-000000000001', 'MATH 251', 'Calculus with Analytic Geometry I', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000909', 'c0000000-0000-0000-0000-000000000001', 'MATH 252', 'Calculus with Analytic Geometry II', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000090a', 'c0000000-0000-0000-0000-000000000001', 'PHYS 270', 'Physics with Calculus III', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000090b', 'c0000000-0000-0000-0000-000000000001', 'CHEM 220', 'General Chemistry II', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000090c', 'c0000000-0000-0000-0000-000000000001', 'BIOL 220', 'General Botany', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000090d', 'c0000000-0000-0000-0000-000000000001', 'PHYS 260', 'Physics with Calculus II', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000090e', 'c0000000-0000-0000-0000-000000000001', 'PHYS 250', 'Physics with Calculus I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000090f', 'c0000000-0000-0000-0000-000000000001', 'MATH 253', 'Calculus with Analytic Geometry III', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000910', 'c0000000-0000-0000-0000-000000000001', 'CIS 262', 'Discrete Mathematics for Computer Science', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000911', 'c0000000-0000-0000-0000-000000000001', 'MATH 268', 'Discrete Mathematics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000912', 'c0000000-0000-0000-0000-000000000001', 'ENGL C1000', 'Academic Reading and Writing', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000913', 'c0000000-0000-0000-0000-000000000001', 'CIS 278', '(CS1) Programming Methods: C++', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000914', 'c0000000-0000-0000-0000-000000000001', 'CIS 255', '(CS1) Programming Methods: Java', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000915', 'c0000000-0000-0000-0000-000000000001', 'CHEM 231', 'Organic Chemistry I', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000916', 'c0000000-0000-0000-0000-000000000001', 'CHEM 210', 'General Chemistry I', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000917', 'c0000000-0000-0000-0000-000000000001', 'BIOL 230', 'Introductory Cell Biology', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000918', 'c0000000-0000-0000-0000-000000000001', 'BIOL 210', 'General Zoology', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000919', 'c0000000-0000-0000-0000-000000000001', 'COMM C1000', 'Introduction to Public Speaking', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000091a', 'c0000000-0000-0000-0000-000000000001', 'ENGR 260', 'Circuits and Devices', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000091b', 'c0000000-0000-0000-0000-000000000001', 'CIS 254', 'Introduction to Object-Oriented Program Design', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000091c', 'c0000000-0000-0000-0000-000000000001', 'ENGL 110', 'Composition, Literature, and Critical Thinking', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000091d', 'c0000000-0000-0000-0000-000000000001', 'ENGL C1000E', 'Academic Reading and Writing ', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000091e', 'c0000000-0000-0000-0000-000000000001', 'ACTG 121', 'Financial Accounting', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000091f', 'c0000000-0000-0000-0000-000000000001', 'ACTG 131', 'Managerial Accounting', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000920', 'c0000000-0000-0000-0000-000000000001', 'ENGR 270', 'Materials Science', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000921', 'c0000000-0000-0000-0000-000000000001', 'ENGR 230', 'Engineering Statics', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000922', 'c0000000-0000-0000-0000-000000000001', 'CIS 501', '(CS2) Data Structures: Python', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000923', 'c0000000-0000-0000-0000-000000000001', 'MATH 241', 'Applied Calculus I', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000924', 'c0000000-0000-0000-0000-000000000001', 'MATH 242', 'Applied Calculus II', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000925', 'c0000000-0000-0000-0000-000000000001', 'ECON 102', 'Principles of Microeconomics', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000926', 'c0000000-0000-0000-0000-000000000001', 'ECON 100', 'Principles of Macroeconomics', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000927', 'c0000000-0000-0000-0000-000000000001', 'ENGL C1001', 'Critical Thinking and Writing', 3)
ON CONFLICT (id) DO NOTHING;

-- University courses
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000928', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61A', 'The Structure and Interpretation of Computer Programs', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000929', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61B', 'Data Structures', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000092a', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61C', 'Machine Structures', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000092b', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 70', 'Discrete Mathematics and Probability Theory', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000092c', 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000092d', 'b0000000-0000-0000-0000-000000000004', 'MATH 51', 'Calculus I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000092e', 'b0000000-0000-0000-0000-000000000004', 'MATH 52', 'Calculus II', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000092f', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7C', 'Physics for Scientists and Engineers', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000930', 'b0000000-0000-0000-0000-000000000004', 'CHEM 1B', 'General Chemistry', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000931', 'b0000000-0000-0000-0000-000000000004', 'BIOLOGY 1B', 'General Biology (Plant Form & Function, Ecology, Evolution)', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000932', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7B', 'Physics for Scientists and Engineers', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000933', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7A', 'Physics for Scientists and Engineers', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000934', 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000935', 'b0000000-0000-0000-0000-000000000001', 'MATH 31A', 'Differential and Integral Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000936', 'b0000000-0000-0000-0000-000000000001', 'MATH 31B', 'Integration and Infinite Series', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000937', 'b0000000-0000-0000-0000-000000000001', 'MATH 32A', 'Calculus of Several Variables', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000938', 'b0000000-0000-0000-0000-000000000001', 'MATH 32B', 'Calculus of Several Variables', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000939', 'b0000000-0000-0000-0000-000000000001', 'MATH 33A', 'Linear Algebra and Applications', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000093a', 'b0000000-0000-0000-0000-000000000001', 'MATH 33B', 'Differential Equations', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000093b', 'b0000000-0000-0000-0000-000000000001', 'MATH 61', 'Introduction to Discrete Structures', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000093c', 'b0000000-0000-0000-0000-000000000001', 'ENGCOMP 3', 'English Composition, Rhetoric, and Language', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000093d', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 31', 'Introduction to Computer Science I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000093e', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 32', 'Introduction to Computer Science II', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000093f', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 33', 'Introduction to Computer Organization', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000940', 'b0000000-0000-0000-0000-000000000001', 'EC ENGR 100', 'Electrical and Electronic Circuits', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000941', 'b0000000-0000-0000-0000-000000000005', 'MATH 20D', 'Introduction to Differential Equations', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000942', 'b0000000-0000-0000-0000-000000000005', 'MATH 20B', 'Calculus for Science and Engineering', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000943', 'b0000000-0000-0000-0000-000000000005', 'MATH 18', 'Linear Algebra', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000944', 'b0000000-0000-0000-0000-000000000005', 'MATH 20E', 'Vector Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000945', 'b0000000-0000-0000-0000-000000000005', 'MATH 20C', 'Calculus and Analytic Geometry for Science and Engineering', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000946', 'b0000000-0000-0000-0000-000000000005', 'MATH 20A', 'Calculus for Science and Engineering', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000947', 'b0000000-0000-0000-0000-000000000005', 'CSE 11', 'Introduction to Programming and Computational Problem Solving - Accelerated Pace', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000948', 'b0000000-0000-0000-0000-000000000005', 'CSE 12', 'Basic Data Structures and Object-Oriented Design', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000949', 'b0000000-0000-0000-0000-000000000005', 'CSE 30', 'Computer Organization and Systems Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000094a', 'b0000000-0000-0000-0000-000000000005', 'PHYS 2A', 'Physics - Mechanics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000094b', 'b0000000-0000-0000-0000-000000000005', 'CHEM 41A', 'Organic Chemistry I: Structure and Reactivity', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000094c', 'b0000000-0000-0000-0000-000000000005', 'CHEM 6B', 'General Chemistry II', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000094d', 'b0000000-0000-0000-0000-000000000005', 'CHEM 6A', 'General Chemistry I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000094e', 'b0000000-0000-0000-0000-000000000005', 'BILD 3', 'Organismic and Evolutionary Biology', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000094f', 'b0000000-0000-0000-0000-000000000005', 'BILD 4', 'Introductory Biology Lab', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000950', 'b0000000-0000-0000-0000-000000000005', 'BILD 1', 'The Cell', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000951', 'b0000000-0000-0000-0000-000000000005', 'BILD 2', 'Multicellular Life', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000952', 'b0000000-0000-0000-0000-000000000005', 'PHYS 2B', 'Physics - Electricity and Magnetism', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000953', 'b0000000-0000-0000-0000-000000000005', 'CSE 20', 'Discrete Mathematics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000954', 'b0000000-0000-0000-0000-000000000005', 'ECE 35', 'Introduction to Analog Design', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000955', 'b0000000-0000-0000-0000-000000000005', 'ECE 45', 'Circuits and Systems', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000956', 'b0000000-0000-0000-0000-000000000005', 'PHYS 2C', 'Physics - Fluids, Waves, Thermodynamics, and Optics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000957', 'b0000000-0000-0000-0000-000000000005', 'ECE 15', 'Engineering Computation', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000958', 'b0000000-0000-0000-0000-000000000009', 'MAT 021B', 'Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000959', 'b0000000-0000-0000-0000-000000000009', 'MAT 021A', 'Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000095a', 'b0000000-0000-0000-0000-000000000009', 'PHY 009C', 'Classical Physics ', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000095b', 'b0000000-0000-0000-0000-000000000009', 'PHY 009B', 'Classical Physics ', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000095c', 'b0000000-0000-0000-0000-000000000009', 'PHY 009A', 'Classical Physics ', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000095d', 'b0000000-0000-0000-0000-000000000009', 'BIS 002A', 'Introduction to Biology: Essentials of Life on Earth', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000095e', 'b0000000-0000-0000-0000-000000000009', 'ECS 036C', 'Data Structures, Algorithms, & Programming ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000095f', 'b0000000-0000-0000-0000-000000000009', 'ECS 050', 'Computer Organization & Machine-Dependent Programming ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000960', 'b0000000-0000-0000-0000-000000000009', 'ECS 020', 'Discrete Mathematics For Computer Science ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000961', 'b0000000-0000-0000-0000-000000000009', 'ECS 036B', 'Software Development & Object-Oriented Programming in C++', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000962', 'b0000000-0000-0000-0000-000000000009', 'MAT 022A', 'Linear Algebra ', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000963', 'b0000000-0000-0000-0000-000000000009', 'CMN 001', 'Introduction to Public Speaking', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000964', 'b0000000-0000-0000-0000-000000000009', 'ENG 017', 'Circuits I ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000965', 'b0000000-0000-0000-0000-000000000009', 'MAT 022B', 'Differential Equations ', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000966', 'b0000000-0000-0000-0000-000000000009', 'ECS 034', 'Software Development in UNIX & C++', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000967', 'b0000000-0000-0000-0000-000000000009', 'ECS 032A', 'Introduction to Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000968', 'b0000000-0000-0000-0000-000000000009', 'CHE 002A', 'General Chemistry', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000969', 'b0000000-0000-0000-0000-000000000009', 'ENL 003', 'Introduction to Literature ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000096a', 'b0000000-0000-0000-0000-000000000009', 'UWP 001', 'Introduction to Academic Literacies ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000096b', 'b0000000-0000-0000-0000-000000000009', 'MGT 011A', 'Elementary Accounting ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000096c', 'b0000000-0000-0000-0000-000000000009', 'MGT 011B', 'Elementary Accounting ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000096d', 'b0000000-0000-0000-0000-000000000009', 'ENG 045', 'Properties of Materials ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000096e', 'b0000000-0000-0000-0000-000000000009', 'ENG 035', 'Statics ', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000096f', 'b0000000-0000-0000-0000-00000000000e', 'MATH 2B', 'Single-Variable Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000970', 'b0000000-0000-0000-0000-00000000000e', 'MATH 2A', 'Single-Variable Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000971', 'b0000000-0000-0000-0000-00000000000e', 'I&C SCI 45C', 'Programming in C/C++ as a Second Language', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000972', 'b0000000-0000-0000-0000-00000000000e', 'I&C SCI 46', 'Data Structure Implementation and Analysis', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000973', 'b0000000-0000-0000-0000-00000000000e', 'I&C SCI 51', 'Introductory Computer Organization', 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000974', 'b0000000-0000-0000-0000-00000000000e', 'I&C SCI 6B', 'Boolean Logic and Discrete Structures', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000975', 'b0000000-0000-0000-0000-00000000000e', 'I&C SCI 6D', 'Discrete Mathematics for Computer Science', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000976', 'b0000000-0000-0000-0000-00000000000e', 'MATH 3A', 'Introduction to Linear Algebra', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000977', 'b0000000-0000-0000-0000-00000000000e', 'MATH 3D', 'Elementary Differential Equations', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000978', 'b0000000-0000-0000-0000-00000000000e', 'MATH 2D', 'Multivariable Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000979', 'b0000000-0000-0000-0000-00000000000e', 'EECS 70A', 'NETWORK ANALYSIS I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000097a', 'b0000000-0000-0000-0000-00000000000e', 'EECS 12', 'Introduction to Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000097b', 'b0000000-0000-0000-0000-00000000000e', 'PHYSICS 7E', 'Classical Physics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000097c', 'b0000000-0000-0000-0000-00000000000e', 'EECS 22', 'Advanced C Programming', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000097d', 'b0000000-0000-0000-0000-00000000000e', 'EECS 20', 'Computer Systems and C Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000097e', 'b0000000-0000-0000-0000-00000000000e', 'EECS 70LA', 'Network Analysis I Laboratory', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000097f', 'b0000000-0000-0000-0000-00000000000e', 'EECS 40', 'Object-Oriented Systems and Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000980', 'b0000000-0000-0000-0000-00000000000e', 'PHYSICS 52A', 'Fundamentals of Experimental Physics', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000981', 'b0000000-0000-0000-0000-00000000000e', 'MATH 2E', 'Multivariable Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000982', 'b0000000-0000-0000-0000-00000000000e', 'I&C SCI 45J', 'Programming in Java as a Second Language', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000983', 'b0000000-0000-0000-0000-00000000000f', 'MATH 3B', 'Calculus with Applications, Second Course', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000984', 'b0000000-0000-0000-0000-00000000000f', 'MATH 4B', 'Differential Equations', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000985', 'b0000000-0000-0000-0000-00000000000f', 'MATH 4A', 'Linear Algebra with Applications', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000986', 'b0000000-0000-0000-0000-00000000000f', 'CMPSC 16', 'Problem Solving with Computers I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000987', 'b0000000-0000-0000-0000-00000000000f', 'CMPSC 24', 'Problem Solving with Computers II', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000988', 'b0000000-0000-0000-0000-00000000000f', 'CMPSC 40', 'Foundations of Computer Science', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000989', 'b0000000-0000-0000-0000-00000000000f', 'ECE 5', 'Introduction to Electrical & Computer Engineering', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000098a', 'b0000000-0000-0000-0000-00000000000f', 'MATH 6A', 'Vector Calculus with Applications, First Course', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000098b', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 7D', 'Basic Physics', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000098c', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 7A', 'Basic Physics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000098d', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 7B', 'Basic Physics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000098e', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 7C', 'Basic Physics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000098f', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 7L', 'Physics Laboratory', 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000990', 'b0000000-0000-0000-0000-00000000000f', 'CMPSC 64', 'Computer Organization and Logic Design', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000991', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 1', 'Basic Physics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000992', 'b0000000-0000-0000-0000-00000000000f', 'PHYS 2', 'Basic Physics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000993', 'b0000000-0000-0000-0000-00000000000f', 'MCDB 1B', 'Introductory Biology II - Physiology', 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000994', 'b0000000-0000-0000-0000-00000000000f', 'PSTAT 120A', 'Probability and Statistics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000995', 'b0000000-0000-0000-0000-000000000010', 'MATH 19A', ' Calculus for Science, Engineering, and Mathematics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000996', 'b0000000-0000-0000-0000-000000000010', 'MATH 19B', 'Calculus for Science, Engineering, and Mathematics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000997', 'b0000000-0000-0000-0000-000000000010', 'CSE 16', 'Applied Discrete Mathematics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000998', 'b0000000-0000-0000-0000-000000000010', 'AM 10', 'Linear Algebra for Engineers', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000999', 'b0000000-0000-0000-0000-000000000010', 'MATH 21', 'Linear Algebra', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000099a', 'b0000000-0000-0000-0000-000000000010', 'AM 30', 'Multivariate Calculus for Engineers', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000099b', 'b0000000-0000-0000-0000-000000000010', 'MATH 23A', 'Vector Calculus', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000099c', 'b0000000-0000-0000-0000-000000000010', 'MATH 11A', 'Calculus with Applications', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000099d', 'b0000000-0000-0000-0000-000000000010', 'MATH 11B', 'Calculus with Applications', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000099e', 'b0000000-0000-0000-0000-000000000010', 'CSE 13S', 'Computer Systems and C Programming', 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-00000000099f', 'b0000000-0000-0000-0000-000000000010', 'AM 20', 'Ordinary Differential Equations for Engineers', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a0', 'b0000000-0000-0000-0000-000000000010', 'PHYS 5A', 'Introduction to Physics I', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a1', 'b0000000-0000-0000-0000-000000000010', 'ECE 101', 'Introduction to Electronic Circuits', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a2', 'b0000000-0000-0000-0000-000000000010', 'ECE 101L', 'Introduction to Electronic Circuits Laboratory', 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a3', 'b0000000-0000-0000-0000-000000000010', 'MATH 24', 'Ordinary Differential Equations', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a4', 'b0000000-0000-0000-0000-000000000011', 'MATH 31', 'Applied Linear Algebra', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a5', 'b0000000-0000-0000-0000-000000000011', 'MATH 10A', 'Calculus of Several Variables', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a6', 'b0000000-0000-0000-0000-000000000011', 'CS 10A', 'Intro to Computer Science for Science, Mathematics, and Engineering I', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a7', 'b0000000-0000-0000-0000-000000000011', 'BUS 20', 'Financial Accounting and Reporting', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a8', 'b0000000-0000-0000-0000-000000000011', 'CS 10C', 'Intro to Data Structures and Algorithms', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009a9', 'b0000000-0000-0000-0000-000000000011', 'ECON 3', 'Intro to Microeconomics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009aa', 'b0000000-0000-0000-0000-000000000011', 'ECON 2', 'Intro to Macroeconomics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009ab', 'b0000000-0000-0000-0000-000000000011', 'CS 61', 'Machine Organization and Assembly Language Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009ac', 'b0000000-0000-0000-0000-000000000011', 'CS 10B', 'Intro to Computer Science for Science, Mathematics, and Engineering II', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009ad', 'b0000000-0000-0000-0000-000000000011', 'CS 11', 'Intro to Discrete Structures', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009ae', 'b0000000-0000-0000-0000-000000000011', 'PHYS 40C', 'General Physics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009af', 'b0000000-0000-0000-0000-000000000011', 'PHYS 40B', 'General Physics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b0', 'b0000000-0000-0000-0000-000000000011', 'PHYS 40A', 'General Physics', 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b1', 'b0000000-0000-0000-0000-000000000011', 'ME 10', 'Statics', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b2', 'b0000000-0000-0000-0000-000000000012', 'CSE 022', 'Introduction to Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b3', 'b0000000-0000-0000-0000-000000000012', 'ENGR 065', 'Circuit Theory', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b4', 'b0000000-0000-0000-0000-000000000012', 'WRI 001', 'Academic Writing', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b5', 'b0000000-0000-0000-0000-000000000012', 'WRI 010', 'College Reading and Composition', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b6', 'b0000000-0000-0000-0000-000000000012', 'MATH 022', 'Calculus II for Physical Sciences & Engineering', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b7', 'b0000000-0000-0000-0000-000000000012', 'MATH 021', 'Calculus I for Physical Sciences & Engineering', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b8', 'b0000000-0000-0000-0000-000000000012', 'MATH 023', 'Vector Calculus', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009b9', 'b0000000-0000-0000-0000-000000000012', 'MATH 024', 'Linear Algebra and Differential Equations', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009ba', 'b0000000-0000-0000-0000-000000000012', 'CSE 024', 'Advanced Programming', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009bb', 'b0000000-0000-0000-0000-000000000012', 'CSE 030', 'Data Structures', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009bc', 'b0000000-0000-0000-0000-000000000012', 'CSE 031', 'Computer Organization and Assembly Language', 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-0000000009bd', 'b0000000-0000-0000-0000-000000000012', 'CSE 015', 'Discrete Mathematics', 4)
ON CONFLICT (id) DO NOTHING;

-- Articulation agreements
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a01', 'd0000000-0000-0000-0000-000000000901', 'd0000000-0000-0000-0000-000000000928', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a02', 'd0000000-0000-0000-0000-000000000902', 'd0000000-0000-0000-0000-000000000928', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, 'Must complete an additional university course after transfer to satisfy this requirement')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a03', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-000000000929', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, 'Must complete an additional university course after transfer to satisfy this requirement')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a04', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-000000000929', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, 'Must complete an additional university course after transfer to satisfy this requirement')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a05', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-00000000092a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a06', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-00000000092c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a07', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-00000000092c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a08', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-00000000092d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a09', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-00000000092e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a0a', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000092f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical & Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a0b', 'd0000000-0000-0000-0000-00000000090b', 'd0000000-0000-0000-0000-000000000930', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical & Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a0c', 'd0000000-0000-0000-0000-00000000090c', 'd0000000-0000-0000-0000-000000000931', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical & Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a0d', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-000000000932', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical & Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a0e', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-000000000933', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical & Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a0f', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000934', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical & Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a10', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000935', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a11', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-000000000936', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a12', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000937', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a13', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000938', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a14', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000939', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a15', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-00000000093a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a16', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-00000000093b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a17', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-00000000093b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a18', 'd0000000-0000-0000-0000-000000000912', 'd0000000-0000-0000-0000-00000000093c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a19', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-00000000093d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a1a', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-00000000093e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a1b', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-00000000093f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science/B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a1c', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-000000000941', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a1d', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000941', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a1e', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-000000000942', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a1f', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000943', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a20', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000944', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a21', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000945', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a22', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000946', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a23', 'd0000000-0000-0000-0000-000000000914', 'd0000000-0000-0000-0000-000000000947', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a24', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-000000000948', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a25', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-000000000949', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a26', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000094a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a27', 'd0000000-0000-0000-0000-000000000915', 'd0000000-0000-0000-0000-00000000094b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a28', 'd0000000-0000-0000-0000-000000000916', 'd0000000-0000-0000-0000-00000000094c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a29', 'd0000000-0000-0000-0000-00000000090b', 'd0000000-0000-0000-0000-00000000094c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a2a', 'd0000000-0000-0000-0000-000000000916', 'd0000000-0000-0000-0000-00000000094d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a2b', 'd0000000-0000-0000-0000-000000000917', 'd0000000-0000-0000-0000-00000000094e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a2c', 'd0000000-0000-0000-0000-00000000090c', 'd0000000-0000-0000-0000-00000000094e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a2d', 'd0000000-0000-0000-0000-000000000918', 'd0000000-0000-0000-0000-00000000094e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a2e', 'd0000000-0000-0000-0000-000000000917', 'd0000000-0000-0000-0000-00000000094f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a2f', 'd0000000-0000-0000-0000-00000000090c', 'd0000000-0000-0000-0000-00000000094f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a30', 'd0000000-0000-0000-0000-000000000918', 'd0000000-0000-0000-0000-00000000094f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a31', 'd0000000-0000-0000-0000-000000000918', 'd0000000-0000-0000-0000-000000000950', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a32', 'd0000000-0000-0000-0000-000000000917', 'd0000000-0000-0000-0000-000000000950', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a33', 'd0000000-0000-0000-0000-00000000090c', 'd0000000-0000-0000-0000-000000000950', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a34', 'd0000000-0000-0000-0000-00000000090c', 'd0000000-0000-0000-0000-000000000951', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a35', 'd0000000-0000-0000-0000-000000000917', 'd0000000-0000-0000-0000-000000000951', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a36', 'd0000000-0000-0000-0000-000000000918', 'd0000000-0000-0000-0000-000000000951', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a37', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-000000000952', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a38', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-000000000953', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a39', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-000000000953', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a3a', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-000000000956', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a3b', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000958', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a3c', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-000000000958', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a3d', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000959', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a3e', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000095a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a3f', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000095a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a40', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000095a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a41', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000095b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a42', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000095b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a43', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000095b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a44', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000095c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a45', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000095c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a46', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000095c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a47', 'd0000000-0000-0000-0000-000000000917', 'd0000000-0000-0000-0000-00000000095d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a48', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-00000000095e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a49', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-00000000095e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a4a', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-00000000095f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a4b', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-000000000960', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a4c', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-000000000960', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a4d', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-000000000961', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a4e', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000962', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a4f', 'd0000000-0000-0000-0000-000000000919', 'd0000000-0000-0000-0000-000000000963', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a50', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-000000000964', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a51', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-000000000965', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a52', 'd0000000-0000-0000-0000-00000000091b', 'd0000000-0000-0000-0000-000000000967', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a53', 'd0000000-0000-0000-0000-000000000916', 'd0000000-0000-0000-0000-000000000968', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a54', 'd0000000-0000-0000-0000-00000000091c', 'd0000000-0000-0000-0000-000000000969', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a55', 'd0000000-0000-0000-0000-000000000912', 'd0000000-0000-0000-0000-00000000096a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a56', 'd0000000-0000-0000-0000-00000000091d', 'd0000000-0000-0000-0000-00000000096a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a57', 'd0000000-0000-0000-0000-00000000091e', 'd0000000-0000-0000-0000-00000000096b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a58', 'd0000000-0000-0000-0000-00000000091f', 'd0000000-0000-0000-0000-00000000096c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a59', 'd0000000-0000-0000-0000-000000000920', 'd0000000-0000-0000-0000-00000000096d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a5a', 'd0000000-0000-0000-0000-000000000921', 'd0000000-0000-0000-0000-00000000096e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a5b', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-00000000096f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a5c', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000970', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a5d', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-000000000971', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a5e', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-000000000972', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a5f', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-000000000973', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a60', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-000000000974', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a61', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-000000000975', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a62', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-000000000975', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a63', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000976', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a64', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-000000000977', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science and Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a65', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000978', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science and Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a66', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-000000000979', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Science and Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a67', 'd0000000-0000-0000-0000-000000000901', 'd0000000-0000-0000-0000-00000000097a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a68', 'd0000000-0000-0000-0000-00000000091b', 'd0000000-0000-0000-0000-00000000097a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a69', 'd0000000-0000-0000-0000-000000000914', 'd0000000-0000-0000-0000-00000000097a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a6a', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-00000000097a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a6b', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000097b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a6c', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-00000000097c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a6d', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-00000000097c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a6e', 'd0000000-0000-0000-0000-000000000922', 'd0000000-0000-0000-0000-00000000097c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a6f', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-00000000097d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a70', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-00000000097e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a71', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-00000000097f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a72', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-000000000980', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a73', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-000000000981', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a74', 'd0000000-0000-0000-0000-000000000914', 'd0000000-0000-0000-0000-000000000982', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000e', 'Software Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a75', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000976', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a76', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-000000000983', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a77', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-000000000984', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a78', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000985', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a79', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-000000000986', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a7a', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-000000000987', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a7b', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-000000000988', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a7c', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-000000000988', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a7d', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-000000000989', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a7e', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-00000000098a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a7f', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000098b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a80', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000098b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a81', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000098b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a82', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000098c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a83', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000098d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a84', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000098d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a85', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000098e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a86', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-00000000098e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a87', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-00000000098f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a88', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-00000000098f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a89', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-000000000990', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a8a', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-000000000991', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a8b', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-000000000992', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a8c', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-000000000992', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a8d', 'd0000000-0000-0000-0000-000000000918', 'd0000000-0000-0000-0000-000000000993', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a8e', 'd0000000-0000-0000-0000-00000000090c', 'd0000000-0000-0000-0000-000000000993', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a8f', 'd0000000-0000-0000-0000-000000000917', 'd0000000-0000-0000-0000-000000000993', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-00000000000f', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a90', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-000000000995', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a91', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-000000000996', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a92', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-000000000948', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a93', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-000000000997', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a94', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-000000000997', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a95', 'd0000000-0000-0000-0000-000000000922', 'd0000000-0000-0000-0000-000000000949', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, 'Minimum grade required: B or better')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a96', 'd0000000-0000-0000-0000-000000000902', 'd0000000-0000-0000-0000-000000000949', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, 'Minimum grade required: B or better')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a97', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-000000000949', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, 'Minimum grade required: B or better')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a98', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-000000000949', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, 'Minimum grade required: B or better')
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a99', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000998', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a9a', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-000000000999', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.A.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a9b', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-00000000099a', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a9c', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-00000000099b', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a9d', 'd0000000-0000-0000-0000-000000000923', 'd0000000-0000-0000-0000-00000000099c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a9e', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-00000000099c', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000a9f', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-00000000099d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa0', 'd0000000-0000-0000-0000-000000000924', 'd0000000-0000-0000-0000-00000000099d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa1', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-00000000099e', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa2', 'd0000000-0000-0000-0000-000000000901', 'd0000000-0000-0000-0000-000000000953', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Science Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa3', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-00000000099f', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Engineering B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa4', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-0000000009a0', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Engineering Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa5', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-0000000009a1', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Engineering Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa6', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-0000000009a2', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Engineering Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa7', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-0000000009a3', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'Computer Engineering Minor', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa8', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-0000000009a4', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aa9', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-0000000009a5', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aaa', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-0000000009a6', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aab', 'd0000000-0000-0000-0000-00000000091b', 'd0000000-0000-0000-0000-0000000009a6', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aac', 'd0000000-0000-0000-0000-00000000091e', 'd0000000-0000-0000-0000-0000000009a7', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aad', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-0000000009a8', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aae', 'd0000000-0000-0000-0000-000000000925', 'd0000000-0000-0000-0000-0000000009a9', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aaf', 'd0000000-0000-0000-0000-000000000926', 'd0000000-0000-0000-0000-0000000009aa', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab0', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-0000000009ab', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab1', 'd0000000-0000-0000-0000-000000000914', 'd0000000-0000-0000-0000-0000000009ac', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab2', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-0000000009ac', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab3', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-0000000009ac', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab4', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-0000000009ad', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab5', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-0000000009ad', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science with Business Applications B.S.', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab6', 'd0000000-0000-0000-0000-00000000090d', 'd0000000-0000-0000-0000-0000000009ae', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab7', 'd0000000-0000-0000-0000-00000000090a', 'd0000000-0000-0000-0000-0000000009af', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab8', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-0000000009af', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ab9', 'd0000000-0000-0000-0000-00000000090e', 'd0000000-0000-0000-0000-0000000009b0', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Science', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aba', 'd0000000-0000-0000-0000-000000000921', 'd0000000-0000-0000-0000-0000000009b1', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'Computer Engineering', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000abb', 'd0000000-0000-0000-0000-00000000091b', 'd0000000-0000-0000-0000-0000000009b2', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000abc', 'd0000000-0000-0000-0000-000000000901', 'd0000000-0000-0000-0000-0000000009b2', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000abd', 'd0000000-0000-0000-0000-00000000091a', 'd0000000-0000-0000-0000-0000000009b3', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000abe', 'd0000000-0000-0000-0000-000000000912', 'd0000000-0000-0000-0000-0000000009b4', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000abf', 'd0000000-0000-0000-0000-00000000091d', 'd0000000-0000-0000-0000-0000000009b4', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac0', 'd0000000-0000-0000-0000-00000000091c', 'd0000000-0000-0000-0000-0000000009b5', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac1', 'd0000000-0000-0000-0000-000000000927', 'd0000000-0000-0000-0000-0000000009b5', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac2', 'd0000000-0000-0000-0000-000000000909', 'd0000000-0000-0000-0000-0000000009b6', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac3', 'd0000000-0000-0000-0000-000000000908', 'd0000000-0000-0000-0000-0000000009b7', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac4', 'd0000000-0000-0000-0000-00000000090f', 'd0000000-0000-0000-0000-0000000009b8', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac5', 'd0000000-0000-0000-0000-000000000907', 'd0000000-0000-0000-0000-0000000009b9', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac6', 'd0000000-0000-0000-0000-000000000906', 'd0000000-0000-0000-0000-0000000009b9', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac7', 'd0000000-0000-0000-0000-000000000913', 'd0000000-0000-0000-0000-0000000009ba', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac8', 'd0000000-0000-0000-0000-000000000903', 'd0000000-0000-0000-0000-0000000009bb', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000ac9', 'd0000000-0000-0000-0000-000000000904', 'd0000000-0000-0000-0000-0000000009bb', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'ELECTRICAL ENGINEERING, Computer Engineering Emphasis', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000aca', 'd0000000-0000-0000-0000-000000000905', 'd0000000-0000-0000-0000-0000000009bc', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'COMPUTER SCIENCE AND ENGINEERING, B.S. ', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000acb', 'd0000000-0000-0000-0000-000000000910', 'd0000000-0000-0000-0000-0000000009bd', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'COMPUTER SCIENCE AND ENGINEERING, B.S. ', 2025, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES
  ('e0000000-0000-0000-0000-000000000acc', 'd0000000-0000-0000-0000-000000000911', 'd0000000-0000-0000-0000-0000000009bd', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'COMPUTER SCIENCE AND ENGINEERING, B.S. ', 2025, NULL)
ON CONFLICT (id) DO NOTHING;