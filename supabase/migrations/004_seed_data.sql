-- Migration 004: Seed data
-- California CC-to-university transfer paths with courses, articulation agreements,
-- prerequisites, and playbooks

-- ============================================================
-- INSTITUTIONS
-- ============================================================

-- Community Colleges
insert into institutions (id, name, type, state, city, abbreviation) values
  ('a0000000-0000-0000-0000-000000000001', 'Santa Monica College', 'cc', 'CA', 'Santa Monica', 'SMC'),
  ('a0000000-0000-0000-0000-000000000002', 'De Anza College', 'cc', 'CA', 'Cupertino', 'DA'),
  ('a0000000-0000-0000-0000-000000000003', 'Pasadena City College', 'cc', 'CA', 'Pasadena', 'PCC'),
  ('a0000000-0000-0000-0000-000000000004', 'Foothill College', 'cc', 'CA', 'Los Altos Hills', 'FC'),
  ('a0000000-0000-0000-0000-000000000005', 'Berkeley City College', 'cc', 'CA', 'Berkeley', 'BCC'),
  ('a0000000-0000-0000-0000-000000000006', 'Long Beach City College', 'cc', 'CA', 'Long Beach', 'LBCC'),
  ('a0000000-0000-0000-0000-000000000007', 'Los Angeles Pierce College', 'cc', 'CA', 'Woodland Hills', 'Pierce');

-- Universities
insert into institutions (id, name, type, state, city, abbreviation) values
  ('b0000000-0000-0000-0000-000000000001', 'University of California, Los Angeles', 'university', 'CA', 'Los Angeles', 'UCLA'),
  ('b0000000-0000-0000-0000-000000000002', 'San Jose State University', 'university', 'CA', 'San Jose', 'SJSU'),
  ('b0000000-0000-0000-0000-000000000003', 'University of Southern California', 'university', 'CA', 'Los Angeles', 'USC'),
  ('b0000000-0000-0000-0000-000000000004', 'University of California, Berkeley', 'university', 'CA', 'Berkeley', 'UCB'),
  ('b0000000-0000-0000-0000-000000000005', 'University of California, San Diego', 'university', 'CA', 'San Diego', 'UCSD'),
  ('b0000000-0000-0000-0000-000000000006', 'California State University, Long Beach', 'university', 'CA', 'Long Beach', 'CSULB');

-- ============================================================
-- COURSES - Santa Monica College (CC)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CS 1', 'Introduction to Computer Science I', 4, 'Programming fundamentals in C++'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'CS 2', 'Introduction to Computer Science II', 4, 'Data structures and algorithms in C++'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'CS 3', 'Intermediate Data Structures in Java', 4, 'Data structures and algorithms in Java'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'CS 4', 'Assembly Language and Machine Organization', 4, 'Computer architecture and assembly language'),
  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'CS 6', 'Discrete Structures for Computer Science', 4, 'Logic, sets, relations, combinatorics, graphs'),
  ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'CS 22', 'Discrete Structures for Computer Science', 3, 'Supplemental instruction for CS 6'),
  ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'CS 8', 'Introduction to Computer Programming for Scientists', 4, 'Programming in Python for scientific computing'),
  ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'MATH 1', 'Calculus and Analytic Geometry I', 5, 'Differential calculus'),
  ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'MATH 2', 'Calculus and Analytic Geometry II', 5, 'Integral calculus'),
  ('c0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'MATH 3', 'Multivariable Calculus', 5, 'Calculus of functions of several variables'),
  ('c0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'MATH 4', 'Linear Algebra and Differential Equations', 5, 'Matrices, systems of equations, differential equations'),
  ('c0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'MATH 7', 'Statistics', 4, 'Descriptive and inferential statistics'),
  ('c0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'PHYS 1', 'Physics for Scientists and Engineers I', 4, 'Mechanics, waves, thermodynamics'),
  ('c0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'PHYS 2', 'Physics for Scientists and Engineers II', 4, 'Electricity, magnetism, optics'),
  ('c0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'ENGL 1', 'College Composition', 3, 'Argumentative and analytical writing'),
  ('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'ENGL 2', 'Critical Thinking and Argumentation', 3, 'Advanced composition and critical reading');

-- ============================================================
-- COURSES - UCLA (University)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'CS 31', 'Introduction to Computer Science I', 4, 'Programming fundamentals in C++'),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'CS 32', 'Introduction to Computer Science II', 4, 'Object-oriented programming in C++'),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'CS 33', 'Computer Organization', 4, 'Digital logic, assembly, machine architecture'),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'CS 35L', 'Software Construction', 4, 'Software engineering practices, tools, and testing'),
  ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'CS 41', 'Algorithms', 4, 'Design and analysis of algorithms'),
  ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'CS 111', 'Operating Systems Principles', 4, 'Process management, memory, I/O, file systems'),
  ('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'CS 118', 'Computer Network Fundamentals', 4, 'Network protocols, architecture, and security'),
  ('d0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'CS 131', 'Programming Languages', 4, 'Language design, parsing, semantics'),
  ('d0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000001', 'MATH 31A', 'Differential and Integral Calculus', 4, 'Single variable calculus'),
  ('d0000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-000000000001', 'MATH 31B', 'Integration and Infinite Series', 4, 'Techniques of integration, sequences, series'),
  ('d0000000-0000-0000-0000-00000000000b', 'b0000000-0000-0000-0000-000000000001', 'MATH 32A', 'Calculus of Several Variables', 4, 'Multivariable calculus'),
  ('d0000000-0000-0000-0000-00000000000c', 'b0000000-0000-0000-0000-000000000001', 'MATH 33A', 'Linear Algebra', 4, 'Vectors, matrices, linear transformations'),
  ('d0000000-0000-0000-0000-00000000000d', 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1A', 'Physics for Scientists and Engineers', 4, 'Mechanics'),
  ('d0000000-0000-0000-0000-00000000000e', 'b0000000-0000-0000-0000-000000000001', 'PHYSICS 1B', 'Physics for Scientists and Engineers', 4, 'Electricity and magnetism'),
  ('d0000000-0000-0000-0000-00000000000f', 'b0000000-0000-0000-0000-000000000001', 'ENGCOMP 3', 'English Composition', 4, 'Analytical and argumentative writing');

-- ============================================================
-- COURSES - De Anza College (CC)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'CS 1B', 'Advanced Data Structures in C++', 5, 'Advanced data structures and algorithms'),
  ('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'CS 2B', 'Object-Oriented Data Structures in C++', 5, 'OOP and advanced data structures'),
  ('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'CS 2C', 'Advanced Programming Methodology in Java', 5, 'Advanced Java programming'),
  ('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000002', 'MATH 1A', 'Single Variable Calculus', 5, 'Differential and integral calculus'),
  ('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000002', 'MATH 1B', 'Integration and Infinite Series', 5, 'Integration techniques and series'),
  ('c0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000002', 'MATH 1C', 'Multivariable Calculus', 5, 'Functions of several variables'),
  ('c0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000002', 'MATH 2A', 'Linear Algebra', 5, 'Vector spaces and linear transformations'),
  ('c0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000002', 'MATH 2B', 'Differential Equations', 5, 'First and higher order differential equations'),
  ('c0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4A', 'Physics for Scientists and Engineers: Mechanics', 5, 'Classical mechanics'),
  ('c0000000-0000-0000-0000-00000000001a', 'a0000000-0000-0000-0000-000000000002', 'PHYS 4B', 'Physics for Scientists and Engineers: Electricity and Magnetism', 5, 'Electromagnetism'),
  ('c0000000-0000-0000-0000-00000000001b', 'a0000000-0000-0000-0000-000000000002', 'ENGL 1A', 'Reading and Composition', 4, 'Critical reading and writing');

-- ============================================================
-- COURSES - SJSU (University)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('d0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002', 'CS 46A', 'Introduction to Programming', 3, 'Programming fundamentals in Python'),
  ('d0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002', 'CS 46B', 'Foundations of Software Engineering', 3, 'Software design and development'),
  ('d0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002', 'CS 46C', 'Program Design and Analysis', 3, 'Data structures and algorithm analysis'),
  ('d0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000002', 'CS 126', 'Introduction to Computer Systems', 3, 'Computer organization and assembly'),
  ('d0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000002', 'MATH 30', 'Calculus I', 4, 'Differential calculus'),
  ('d0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000002', 'MATH 31', 'Calculus II', 4, 'Integral calculus'),
  ('d0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000002', 'MATH 32', 'Calculus III', 4, 'Multivariable calculus'),
  ('d0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000002', 'MATH 34', 'Linear Algebra', 3, 'Matrix theory and linear systems'),
  ('d0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000002', 'MATH 39', 'Ordinary Differential Equations', 3, 'First and second order ODEs'),
  ('d0000000-0000-0000-0000-00000000001a', 'b0000000-0000-0000-0000-000000000002', 'PHYS 2A', 'Physics for Scientists and Engineers I', 4, 'Mechanics'),
  ('d0000000-0000-0000-0000-00000000001b', 'b0000000-0000-0000-0000-000000000002', 'PHYS 2B', 'Physics for Scientists and Engineers II', 4, 'Electricity and magnetism'),
  ('d0000000-0000-0000-0000-00000000001c', 'b0000000-0000-0000-0000-000000000002', 'ENGL 1A', 'Reading and Composition', 3, 'Critical reading and composition'),
  ('d0000000-0000-0000-0000-00000000001d', 'b0000000-0000-0000-0000-000000000002', 'ENGL 1B', 'Reading and Composition', 3, 'Advanced composition');

-- ============================================================
-- COURSES - Pasadena City College (CC)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('c0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000003', 'CS 1', 'Introduction to Computer Science I', 4, 'Programming fundamentals'),
  ('c0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000003', 'CS 2', 'Advanced Programming', 4, 'Data structures and algorithms'),
  ('c0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000003', 'CS 3', 'Computer Organization', 3, 'Digital systems and architecture'),
  ('c0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000003', 'CS 4', 'Discrete Mathematics', 3, 'Logic, sets, counting'),
  ('c0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000003', 'MATH 180', 'Calculus I', 5, 'Differential calculus'),
  ('c0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000003', 'MATH 181', 'Calculus II', 5, 'Integral calculus'),
  ('c0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000003', 'MATH 250', 'Linear Algebra', 3, 'Matrix algebra and vector spaces'),
  ('c0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000003', 'PHYS 101', 'General Physics I', 4, 'Mechanics'),
  ('c0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000003', 'BUS 101', 'Introduction to Business', 3, 'Business fundamentals'),
  ('c0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000003', 'BUS 201', 'Business Statistics', 3, 'Statistical methods for business'),
  ('c0000000-0000-0000-0000-00000000002a', 'a0000000-0000-0000-0000-000000000003', 'ENGL 101', 'English Composition', 3, 'Freshman composition');

-- ============================================================
-- COURSES - USC (University)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('d0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000003', 'CSCI 103L', 'Introduction to Programming', 4, 'Programming fundamentals in C++'),
  ('d0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000003', 'CSCI 104', 'Data Structures and Object-Oriented Design', 4, 'Advanced C++ and data structures'),
  ('d0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000003', 'CSCI 201L', 'Systems and Programming', 4, 'Computer systems and software engineering'),
  ('d0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003', 'CSCI 270', 'Algorithm Analysis', 4, 'Algorithm design and complexity'),
  ('d0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000003', 'MATH 125', 'Calculus I', 4, 'Single variable calculus'),
  ('d0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000003', 'MATH 126', 'Calculus II', 4, 'Multivariable calculus'),
  ('d0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000003', 'MATH 225', 'Linear Algebra', 3, 'Matrix theory'),
  ('d0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000003', 'PHYS 151', 'Mechanics', 4, 'Classical mechanics'),
  ('d0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000003', 'PHYS 152', 'Electricity and Magnetism', 4, 'Electromagnetism'),
  ('d0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000003', 'WRIT 150', 'Critical Writing', 3, 'Academic writing'),
  ('d0000000-0000-0000-0000-00000000002a', 'b0000000-0000-0000-0000-000000000003', 'BUAD 215', 'Business Law', 3, 'Legal environment of business');

-- ============================================================
-- COURSES - UC Berkeley (University)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('d0000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000004', 'CS 61A', 'Structure and Interpretation of Computer Programs', 4, 'Programming in Python and Scheme'),
  ('d0000000-0000-0000-0000-000000000031', 'b0000000-0000-0000-0000-000000000004', 'CS 61B', 'Data Structures', 4, 'Data structures in Java'),
  ('d0000000-0000-0000-0000-000000000032', 'b0000000-0000-0000-0000-000000000004', 'CS 61C', 'Machine Structures', 4, 'Computer architecture and C'),
  ('d0000000-0000-0000-0000-000000000033', 'b0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Calculus', 4, 'Single variable calculus'),
  ('d0000000-0000-0000-0000-000000000034', 'b0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Calculus', 4, 'Integration and series'),
  ('d0000000-0000-0000-0000-000000000035', 'b0000000-0000-0000-0000-000000000004', 'MATH 53', 'Multivariable Calculus', 4, 'Functions of several variables'),
  ('d0000000-0000-0000-0000-000000000036', 'b0000000-0000-0000-0000-000000000004', 'MATH 54', 'Linear Algebra and Differential Equations', 4, 'Matrix algebra and ODEs'),
  ('d0000000-0000-0000-0000-000000000037', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7A', 'Physics for Scientists and Engineers', 4, 'Mechanics'),
  ('d0000000-0000-0000-0000-000000000038', 'b0000000-0000-0000-0000-000000000004', 'PHYSICS 7B', 'Physics for Scientists and Engineers', 4, 'Waves, electricity, and magnetism'),
  ('d0000000-0000-0000-0000-000000000039', 'b0000000-0000-0000-0000-000000000004', 'ENG W1', 'Composition and Reading', 4, 'Analytical writing');

-- ============================================================
-- PREREQUISITES - SMC courses
-- ============================================================
insert into prerequisites (course_id, prerequisite_course_id) values
  ('c0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),  -- CS 2 requires CS 1
  ('c0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002'),  -- CS 3 requires CS 2
  ('c0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002'),  -- CS 4 requires CS 2
  ('c0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000008'),  -- MATH 2 requires MATH 1
  ('c0000000-0000-0000-0000-00000000000a', 'c0000000-0000-0000-0000-000000000009'),  -- MATH 3 requires MATH 2
  ('c0000000-0000-0000-0000-00000000000b', 'c0000000-0000-0000-0000-000000000009'),  -- MATH 4 requires MATH 2
  ('c0000000-0000-0000-0000-00000000000e', 'c0000000-0000-0000-0000-00000000000d'),  -- PHYS 2 requires PHYS 1
  ('c0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-00000000000f');  -- ENGL 2 requires ENGL 1

-- ============================================================
-- ARTICULATION AGREEMENTS - SMC to UCLA CS
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-00000000000a', 'd0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-00000000000b', 'd0000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-00000000000d', 'd0000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-00000000000e', 'd0000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-00000000000f', 'd0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Computer Science', 2024);

-- ============================================================
-- ARTICULATION AGREEMENTS - De Anza to SJSU SE
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-000000000019', 'd0000000-0000-0000-0000-00000000001a', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-00000000001a', 'd0000000-0000-0000-0000-00000000001b', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024),
  ('c0000000-0000-0000-0000-00000000001b', 'd0000000-0000-0000-0000-00000000001c', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Software Engineering', 2024);

-- ============================================================
-- ARTICULATION AGREEMENTS - PCC to USC Business
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000021', 'd0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000024', 'd0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000025', 'd0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000026', 'd0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000027', 'd0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000028', 'd0000000-0000-0000-0000-00000000002a', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-000000000029', 'd0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024),
  ('c0000000-0000-0000-0000-00000000002a', 'd0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Business Administration', 2024);

-- ============================================================
-- ARTICULATION AGREEMENTS - SMC to UC Berkeley EECS
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024),
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024),
  ('c0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024),
  ('c0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000034', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024),
  ('c0000000-0000-0000-0000-00000000000d', 'd0000000-0000-0000-0000-000000000037', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024),
  ('c0000000-0000-0000-0000-00000000000f', 'd0000000-0000-0000-0000-000000000039', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024);

-- ============================================================
-- PLAYBOOKS (seeded with a test user - will be linked after auth setup)
-- Note: These use a placeholder user_id that will need to be updated
-- ============================================================

-- Placeholder user for seed data (will be created when a real user signs up)
-- We'll use a dummy UUID - in production, playbooks are tied to real users
-- For seed data, we insert playbooks with a placeholder that gets updated later
-- Actually, playbooks require user_id FK to auth.users, so we can't insert without a real user.
-- We'll create the playbooks after the user exists, or use a dummy approach.
-- 
-- Since auth.users can't be directly inserted, we'll use a workaround:
-- The playbooks will be inserted in a separate step after a test user is created.
-- For now, we'll prepare the playbook_data JSON.

-- Playbook 1: SMC -> UCLA CS (Verified, transferred)
-- Semesters at SMC:
--   Semester 1: CS 1 (Intro to CS I), MATH 1 (Calc I), ENGL 1 (College Composition)
--   Semester 2: CS 2 (Intro to CS II), MATH 2 (Calc II), PHYS 1 (Physics I)
--   Semester 3: CS 3 (Data Structures in Java), MATH 3 (Multivariable Calc), PHYS 2 (Physics II)
--   Semester 4: CS 4 (Assembly), MATH 4 (Linear Algebra), ENGL 2 (Critical Thinking)
--   Semester 5: CS 6 (Discrete Structures), CS 8 (Python)
-- Failure: CS 3 was failed once, retook and passed
-- Outcome: transferred, verification: verified

-- Playbook 2: SMC -> UCLA CS (Verified, transferred)
-- Semesters at SMC:
--   Semester 1: CS 1, MATH 1
--   Semester 2: CS 2, MATH 2, ENGL 1
--   Semester 3: CS 3, MATH 3, PHYS 1
--   Semester 4: CS 4, MATH 4, ENGL 2
-- Failure: MATH 3 was cancelled (section cancelled), took summer session
-- Outcome: transferred, verification: verified

-- Playbook 3: De Anza -> SJSU SE (Unverified, in_progress)
-- Semesters at De Anza:
--   Semester 1: CS 1B, MATH 1A, ENGL 1A
--   Semester 2: CS 2B, MATH 1B, PHYS 4A
--   Semester 3: CS 2C, MATH 1C, PHYS 4B
--   Semester 4: MATH 2A, MATH 2B (in progress)
-- Outcome: in_progress, verification: pending

-- Playbook 4: PCC -> USC Business (Verified, transferred)
-- Semesters at PCC:
--   Semester 1: CS 1, MATH 180 (Calc I), ENGL 101
--   Semester 2: CS 2, MATH 181 (Calc II), BUS 101
--   Semester 3: MATH 250 (Linear Algebra), BUS 201, PHYS 101
--   Semester 4: CS 3, CS 4
-- Outcome: transferred, verification: verified

-- We need to create these playbooks. Since they need a real user_id,
-- we'll use the same placeholder UUID. In practice, these would be
-- created by real users. For testing purposes, we'll insert them
-- after creating the seed user.

-- ============================================================
-- Additional CC courses for breadth (LBCC, Pierce, Foothill, BCC)
-- ============================================================

-- Long Beach City College courses
insert into courses (id, institution_id, code, title, units, description) values
  ('c0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000006', 'CS 1', 'Introduction to Computer Science', 4, 'Programming fundamentals'),
  ('c0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000006', 'CS 2', 'Data Structures', 4, 'Advanced data structures'),
  ('c0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000000006', 'MATH 26', 'Calculus I', 5, 'Differential calculus'),
  ('c0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000006', 'ENGL 101', 'English Composition', 3, 'Freshman English');

-- LA Pierce College courses
insert into courses (id, institution_id, code, title, units, description) values
  ('c0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000007', 'CS 101', 'Computer Science Fundamentals', 4, 'Intro to programming'),
  ('c0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000007', 'MATH 141', 'Calculus I', 4, 'Single variable calculus'),
  ('c0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000007', 'ENGL 101', 'Composition', 3, 'Academic writing');

-- Articulation: LBCC to CSULB CS
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000030', 'd0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000031', 'd0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000032', 'd0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000033', 'd0000000-0000-0000-0000-00000000001c', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024);

-- Articulation: Pierce to UCSD CS
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000040', 'd0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000041', 'd0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000042', 'd0000000-0000-0000-0000-000000000039', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005', 'Computer Science', 2024);

-- Additional articulation paths for breadth (6+ CC-to-university paths)
-- SMC -> CSULB CS
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Computer Science', 2024);

-- De Anza -> UC Berkeley EECS
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024),
  ('c0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Electrical Engineering and Computer Sciences', 2024);

-- PCC -> UCSD CS
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('c0000000-0000-0000-0000-000000000020', 'd0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 'Computer Science', 2024),
  ('c0000000-0000-0000-0000-000000000024', 'd0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 'Computer Science', 2024);
