-- Migration: Add ASSIST articulation data for Berkeley City College → UC campuses (Computer Science)
-- Source: assist.org API, academic year 2025-2026
-- Generated: 2026-04-29T09:53:51.860Z

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000014', 'University of California, Irvine', 'university', 'CA', NULL, 'UCI')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000015', 'University of California, Santa Barbara', 'university', 'CA', NULL, 'UCSB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000016', 'University of California, Santa Cruz', 'university', 'CA', NULL, 'UCSC')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000017', 'University of California, Riverside', 'university', 'CA', NULL, 'UCR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('b0000000-0000-0000-0000-000000000018', 'University of California, Merced', 'university', 'CA', NULL, 'UCM')
ON CONFLICT (id) DO NOTHING;

-- CC courses (Berkeley City College)
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b01', 'a0000000-0000-0000-0000-000000000005', 'CIS 25', 'Object-Orientated Programming Using C++', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b02', 'a0000000-0000-0000-0000-000000000005', 'CIS 27', 'Data Structure and Algorithms', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b03', 'a0000000-0000-0000-0000-000000000005', 'MATH 3F', 'Differential Equations', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b04', 'a0000000-0000-0000-0000-000000000005', 'MATH 3E', 'Linear Algebra', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b05', 'a0000000-0000-0000-0000-000000000005', 'MATH 3A', 'Calculus I', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b06', 'a0000000-0000-0000-0000-000000000005', 'MATH 3B', 'Calculus II', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b07', 'a0000000-0000-0000-0000-000000000005', 'MATH 3C', 'Calculus III', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b08', 'a0000000-0000-0000-0000-000000000005', 'PHYS 4A', 'General Physics with Calculus', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b09', 'a0000000-0000-0000-0000-000000000005', 'PHYS 4B', 'General Physics with Calculus', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b0a', 'a0000000-0000-0000-0000-000000000005', 'BIOL 1B', 'General Biology', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b0b', 'a0000000-0000-0000-0000-000000000005', 'CHEM 1B', 'General Chemistry', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b0c', 'a0000000-0000-0000-0000-000000000005', 'PHYS 4C', 'General Physics with Calculus', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b0d', 'a0000000-0000-0000-0000-000000000005', 'ENGL C1000', 'Academic Reading and Writing', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b0e', 'a0000000-0000-0000-0000-000000000005', 'CIS 6', 'Introduction to Computer Programming', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b0f', 'a0000000-0000-0000-0000-000000000005', 'CIS 20', 'Microcomputer Assembly Language', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b10', 'a0000000-0000-0000-0000-000000000005', 'CIS 36A', 'Java Programming Language I', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b11', 'a0000000-0000-0000-0000-000000000005', 'CHEM 12A', 'Organic Chemistry', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b12', 'a0000000-0000-0000-0000-000000000005', 'CHEM 1A', 'General Chemistry', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b13', 'a0000000-0000-0000-0000-000000000005', 'BIOL 1A', 'General Biology', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b14', 'a0000000-0000-0000-0000-000000000005', 'BUS 1A', 'Financial Accounting', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b15', 'a0000000-0000-0000-0000-000000000005', 'BUS 1B', 'Managerial Accounting', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b16', 'a0000000-0000-0000-0000-000000000005', 'COMM 3', 'Introduction to Human Communication', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b17', 'a0000000-0000-0000-0000-000000000005', 'ENGL 1B', 'Composition and Reading', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b18', 'a0000000-0000-0000-0000-000000000005', 'ENGL 44B', 'Masterpieces of World Literature', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b19', 'a0000000-0000-0000-0000-000000000005', 'MATH 11', 'Discrete Mathematics', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b1a', 'a0000000-0000-0000-0000-000000000005', 'MATH 16B', 'Calculus for Business and the Life and Social Sciences', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b1b', 'a0000000-0000-0000-0000-000000000005', 'MATH 16A', 'Calculus for Business and the Life and Social Sciences', 4)
ON CONFLICT (institution_id, code) DO NOTHING;

-- University courses
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b1c', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 61B', 'Data Structures', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b1d', 'b0000000-0000-0000-0000-000000000004', 'COMPSCI 70', 'Discrete Mathematics and Probability Theory', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b1e', 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b1f', 'b0000000-0000-0000-0000-000000000004', 'MATH 51', 'Calculus I', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b20', 'b0000000-0000-0000-0000-000000000004', 'MATH 52', 'Calculus II', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b21', 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b22', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7A', 'Physics for Scientists and Engineers', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b23', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7B', 'Physics for Scientists and Engineers', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b24', 'b0000000-0000-0000-0000-000000000004', 'BIOLOGY 1B', 'General Biology (Plant Form & Function, Ecology, Evolution)', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b25', 'b0000000-0000-0000-0000-000000000004', 'CHEM 1B', 'General Chemistry', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b26', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7C', 'Physics for Scientists and Engineers', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b27', 'b0000000-0000-0000-0000-000000000001', 'MATH 31A', 'Differential and Integral Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b28', 'b0000000-0000-0000-0000-000000000001', 'MATH 31B', 'Integration and Infinite Series', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b29', 'b0000000-0000-0000-0000-000000000001', 'MATH 32A', 'Calculus of Several Variables', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b2a', 'b0000000-0000-0000-0000-000000000001', 'MATH 32B', 'Calculus of Several Variables', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b2b', 'b0000000-0000-0000-0000-000000000001', 'MATH 33A', 'Linear Algebra and Applications', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b2c', 'b0000000-0000-0000-0000-000000000001', 'MATH 33B', 'Differential Equations', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b2d', 'b0000000-0000-0000-0000-000000000001', 'MATH 61', 'Introduction to Discrete Structures', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b2e', 'b0000000-0000-0000-0000-000000000001', 'ENGCOMP 3', 'English Composition, Rhetoric, and Language', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b2f', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 31', 'Introduction to Computer Science I', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b30', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 32', 'Introduction to Computer Science II', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b31', 'b0000000-0000-0000-0000-000000000001', 'COM SCI 33', 'Introduction to Computer Organization', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b32', 'b0000000-0000-0000-0000-000000000005', 'MATH 20D', 'Introduction to Differential Equations', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b33', 'b0000000-0000-0000-0000-000000000005', 'MATH 20B', 'Calculus for Science and Engineering', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b34', 'b0000000-0000-0000-0000-000000000005', 'MATH 18', 'Linear Algebra', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b35', 'b0000000-0000-0000-0000-000000000005', 'MATH 20E', 'Vector Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b36', 'b0000000-0000-0000-0000-000000000005', 'MATH 20C', 'Calculus and Analytic Geometry for Science and Engineering', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b37', 'b0000000-0000-0000-0000-000000000005', 'MATH 20A', 'Calculus for Science and Engineering', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b38', 'b0000000-0000-0000-0000-000000000005', 'CSE 11', 'Introduction to Programming and Computational Problem Solving - Accelerated Pace', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b39', 'b0000000-0000-0000-0000-000000000005', 'CSE 12', 'Basic Data Structures and Object-Oriented Design', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b3a', 'b0000000-0000-0000-0000-000000000005', 'PHYS 2A', 'Physics - Mechanics', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b3b', 'b0000000-0000-0000-0000-000000000005', 'CHEM 41A', 'Organic Chemistry I: Structure and Reactivity', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b3c', 'b0000000-0000-0000-0000-000000000005', 'CHEM 6B', 'General Chemistry II', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b3d', 'b0000000-0000-0000-0000-000000000005', 'CHEM 6A', 'General Chemistry I', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b3e', 'b0000000-0000-0000-0000-000000000005', 'BILD 3', 'Organismic and Evolutionary Biology', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b3f', 'b0000000-0000-0000-0000-000000000005', 'BILD 4', 'Introductory Biology Lab', 2)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b40', 'b0000000-0000-0000-0000-000000000005', 'BILD 1', 'The Cell', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b41', 'b0000000-0000-0000-0000-000000000005', 'ECE 35', 'Introduction to Analog Design', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b42', 'b0000000-0000-0000-0000-000000000005', 'ECE 45', 'Circuits and Systems', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b43', 'b0000000-0000-0000-0000-000000000005', 'PHYS 2B', 'Physics - Electricity and Magnetism', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b44', 'b0000000-0000-0000-0000-000000000005', 'PHYS 2C', 'Physics - Fluids, Waves, Thermodynamics, and Optics', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b45', 'b0000000-0000-0000-0000-000000000005', 'ECE 15', 'Engineering Computation', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b46', 'b0000000-0000-0000-0000-000000000005', 'BILD 2', 'Multicellular Life', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b47', 'b0000000-0000-0000-0000-000000000009', 'MAT 022A', 'Linear Algebra ', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b48', 'b0000000-0000-0000-0000-000000000009', 'MAT 022B', 'Differential Equations ', 3)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b49', 'b0000000-0000-0000-0000-000000000009', 'MGT 011A', 'Elementary Accounting ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b4a', 'b0000000-0000-0000-0000-000000000009', 'MGT 011B', 'Elementary Accounting ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b4b', 'b0000000-0000-0000-0000-000000000009', 'PHY 009B', 'Classical Physics ', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b4c', 'b0000000-0000-0000-0000-000000000009', 'PHY 009A', 'Classical Physics ', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b4d', 'b0000000-0000-0000-0000-000000000009', 'PHY 009C', 'Classical Physics ', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b4e', 'b0000000-0000-0000-0000-000000000009', 'CMN 001', 'Introduction to Public Speaking', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b4f', 'b0000000-0000-0000-0000-000000000009', 'MAT 021B', 'Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b50', 'b0000000-0000-0000-0000-000000000009', 'MAT 021C', 'Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b51', 'b0000000-0000-0000-0000-000000000009', 'MAT 021A', 'Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b52', 'b0000000-0000-0000-0000-000000000009', 'MAT 021D', 'Vector Analysis ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b53', 'b0000000-0000-0000-0000-000000000009', 'ENL 003', 'Introduction to Literature ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b54', 'b0000000-0000-0000-0000-000000000009', 'UWP 001', 'Introduction to Academic Literacies ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b55', 'b0000000-0000-0000-0000-000000000009', 'COM 003', 'Major Works of the Modern World', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b56', 'b0000000-0000-0000-0000-000000000009', 'ECS 020', 'Discrete Mathematics For Computer Science ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b57', 'b0000000-0000-0000-0000-000000000009', 'ECS 036C', 'Data Structures, Algorithms, & Programming ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b58', 'b0000000-0000-0000-0000-000000000009', 'ECS 036A', 'Programming & Problem Solving ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b59', 'b0000000-0000-0000-0000-000000000009', 'ECS 036B', 'Software Development & Object-Oriented Programming in C++', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b5a', 'b0000000-0000-0000-0000-000000000009', 'ECS 050', 'Computer Organization & Machine-Dependent Programming ', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b5b', 'b0000000-0000-0000-0000-000000000009', 'ECS 034', 'Software Development in UNIX & C++', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b5c', 'b0000000-0000-0000-0000-000000000009', 'ECS 032A', 'Introduction to Programming', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b5d', 'b0000000-0000-0000-0000-000000000009', 'CHE 002A', 'General Chemistry', 5)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b5e', 'b0000000-0000-0000-0000-000000000014', 'MATH 2B', 'Single-Variable Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b5f', 'b0000000-0000-0000-0000-000000000014', 'MATH 2A', 'Single-Variable Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b60', 'b0000000-0000-0000-0000-000000000014', 'I&C SCI 51', 'Introductory Computer Organization', 6)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b61', 'b0000000-0000-0000-0000-000000000014', 'MATH 3A', 'Introduction to Linear Algebra', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b62', 'b0000000-0000-0000-0000-000000000014', 'MATH 3D', 'Elementary Differential Equations', 4)
ON CONFLICT (institution_id, code) DO NOTHING;
INSERT INTO courses (id, institution_id, code, title, units) VALUES
  ('d0000000-0000-0000-0000-000000000b63', 'b0000000-0000-0000-0000-000000000014', 'MATH 2D', 'Multivariable Calculus', 4)
ON CONFLICT (institution_id, code) DO NOTHING;

-- Articulation agreements (subqueries resolve course IDs by institution+code)
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c01', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 25' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='COMPSCI 61B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c02', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 27' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='COMPSCI 61B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c03', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3F' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='MATH 54' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c04', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3E' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='MATH 54' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c05', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='MATH 51' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c06', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='MATH 52' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c07', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering & Computer Sciences', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='MATH 53' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c08', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering & Computer Sciences', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='PHYSICS 7A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c09', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering & Computer Sciences', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='PHYSICS 7B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c0a', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering & Computer Sciences', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='BIOLOGY 1B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c0b', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering & Computer Sciences', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CHEM 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='CHEM 1B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c0c', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering & Computer Sciences', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000004' AND code='PHYSICS 7C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c0d', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='MATH 31A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c0e', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='MATH 31B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c0f', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='MATH 32A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c10', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='MATH 32B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c11', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3E' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='MATH 33A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c12', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3F' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='MATH 33B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c13', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='ENGL C1000' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='ENGCOMP 3' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c14', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 6' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='COM SCI 31' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c15', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 25' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='COM SCI 31' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c16', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 25' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='COM SCI 32' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c17', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 27' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='COM SCI 32' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c18', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 6' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='COM SCI 32' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c19', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'Computer Science and Engineering/B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 20' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000001' AND code='COM SCI 33' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c1a', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3F' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='MATH 20D' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c1b', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='MATH 20B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c1c', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3E' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='MATH 18' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c1d', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='MATH 20C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c1e', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='MATH 20A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c1f', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 36A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='CSE 11' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c20', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mathematics/Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 27' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='CSE 12' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c21', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='PHYS 2A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c22', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CHEM 12A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='CHEM 41A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c23', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CHEM 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='CHEM 6B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c24', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CHEM 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='CHEM 6B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c25', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CHEM 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='CHEM 6A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c26', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 3' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c27', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 3' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c28', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 4' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c29', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 4' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c2a', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 1' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c2b', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science with a Specialization in Bioinformatics B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 1' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c2c', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'ECE: Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='PHYS 2B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c2d', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'ECE: Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='PHYS 2C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c2e', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'ECE: Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='PHYS 2C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c2f', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'ECE: Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='PHYS 2C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c30', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 2' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c31', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'CSE: Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BIOL 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000005' AND code='BILD 2' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c32', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3E' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 022A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c33', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3F' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 022B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c34', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BUS 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MGT 011A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c35', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='BUS 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MGT 011B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c36', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c37', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c38', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c39', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c3a', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c3b', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c3c', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c3d', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c3e', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='PHYS 4B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='PHY 009C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c3f', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='COMM 3' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='CMN 001' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c40', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 021B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c41', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 021B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c42', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 021C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c43', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 021C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c44', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 021A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c45', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='MAT 021D' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c46', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='ENGL 1B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ENL 003' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c47', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='ENGL C1000' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='UWP 001' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c48', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='ENGL 44B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='COM 003' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c49', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 11' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ECS 020' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c4a', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 27' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ECS 036C' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c4b', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 25' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ECS 036B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c4c', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 36A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ECS 036B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c4d', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Science B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 20' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ECS 050' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c4e', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 6' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='ECS 032A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c4f', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'Computer Science & Engineering B.S.', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CHEM 1A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000009' AND code='CHE 002A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c50', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 2B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c51', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 16B' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 2B' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c52', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 2A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c53', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 16A' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 2A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c54', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='CIS 20' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='I&C SCI 51' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c55', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3E' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 3A' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c56', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science and Engineering', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3F' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 3D' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;
INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)
  SELECT 'e0000000-0000-0000-0000-000000000c57', cc.id, uni.id, 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000014', 'Computer Science and Engineering', 2025, NULL
  FROM (SELECT id FROM courses WHERE institution_id='a0000000-0000-0000-0000-000000000005' AND code='MATH 3C' LIMIT 1) cc,
       (SELECT id FROM courses WHERE institution_id='b0000000-0000-0000-0000-000000000014' AND code='MATH 2D' LIMIT 1) uni
ON CONFLICT (id) DO NOTHING;