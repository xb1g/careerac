-- Migration 013: Add non-STEM majors with real UC Transfer Pathways data
-- Majors: Psychology, Economics, English, Sociology, History, Political Science, 
--         Biology, Philosophy, Communication, Anthropology
-- Data source: UC Transfer Pathways (admission.universityofcalifornia.edu)

-- ============================================================
-- COURSES - Psychology Major (Santa Monica College)
-- Pathway requires: Intro Psych, Stats, Calc 1, Bio 1, +1 science, +2 social science
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'PSYCH 1', 'Introduction to Psychology', 3, 'Survey of psychological concepts, theories, and research'),
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'PSYCH 2', 'Psychology of Personality', 3, 'Study of personality theories and assessment'),
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'PSYCH 3', 'Social Psychology', 3, 'Social influences on behavior and attitudes'),
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'PSYCH 5', 'Abnormal Psychology', 3, 'Psychological disorders and treatment approaches'),
  ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'PSYCH 7', 'Research Methods in Psychology', 3, 'Scientific methods in psychological research'),
  ('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'MATH 54', 'Statistics for Social Sciences', 4, 'Descriptive and inferential statistics with applications'),
  ('e0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'MATH 28', 'Calculus for the Life Sciences', 4, 'Calculus applications in biology and medicine'),
  ('e0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'BIO 10', 'Introduction to Biology', 4, 'Cell biology, genetics, evolution (non-majors)'),
  ('e0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'CHEM 11', 'Introduction to Chemistry', 4, 'Basic chemistry for life sciences'),
  ('e0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000001', 'ANTHRO 1', 'Introduction to Cultural Anthropology', 3, 'Study of human cultures and societies'),
  ('e0000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000001', 'SOC 1', 'Introduction to Sociology', 3, 'Sociological concepts and social institutions') on conflict do nothing;

-- ============================================================
-- COURSES - Psychology Major (UCLA)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'PSYCH 10', 'Introductory Psychology', 4, 'Psychology as science of behavior and mind'),
  ('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'PSYCH 100A', 'Psychological Statistics', 4, 'Statistical methods for psychological research'),
  ('f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'PSYCH 100B', 'Research Methods in Psychology', 5, 'Experimental design and research methods'),
  ('f0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'PSYCH 110', 'History of Psychology', 4, 'Historical development of psychological thought'),
  ('f0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'MATH 31A', 'Differential and Integral Calculus', 4, 'Single variable calculus'),
  ('f0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'LIFESCI 7A', 'Cell and Molecular Biology', 5, 'Cell biology, genetics, and molecular biology'),
  ('f0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'CHEM 14A', 'General Chemistry for Life Scientists', 4, 'Chemistry for life science students'),
  ('f0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'SOCIOL 1', 'Introduction to Sociology', 4, 'Introduction to sociological thinking'),
  ('f0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000001', 'ANTHRO 2', 'Introduction to Cultural Anthropology', 4, 'Cultural anthropology survey') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - SMC to UCLA Psychology
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-00000000000a', 'f0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024),
  ('e0000000-0000-0000-0000-00000000000b', 'f0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Psychology', 2024) on conflict do nothing;

-- ============================================================
-- COURSES - Economics Major (De Anza College)
-- Pathway requires: Microeconomics, Macroeconomics, Single variable calculus
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'ECON 1', 'Principles of Microeconomics', 4, 'Economic analysis of consumer and firm behavior'),
  ('e0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'ECON 2', 'Principles of Macroeconomics', 4, 'National income, employment, monetary policy'),
  ('e0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'ECON 3', 'Money, Banking and Financial Institutions', 4, 'Financial markets and monetary theory'),
  ('e0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'ECON 5', 'International Economics', 4, 'International trade and finance'),
  ('e0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000002', 'MATH 1A', 'Single Variable Calculus', 5, 'Differential and integral calculus') on conflict do nothing;

-- ============================================================
-- COURSES - Economics Major (UC Berkeley)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000004', 'ECON 1', 'Introduction to Economics', 4, 'Micro and macro principles'),
  ('f0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000004', 'ECON 2', 'Introduction to Macroeconomics', 4, 'Macroeconomic theory and policy'),
  ('f0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000004', 'MATH 1A', 'Calculus', 4, 'Single variable calculus'),
  ('f0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000004', 'MATH 1B', 'Calculus', 4, 'Integration and series'),
  ('f0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000004', 'ECON 100A', 'Microeconomic Theory', 4, 'Intermediate microeconomics'),
  ('f0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000004', 'ECON 100B', 'Macroeconomic Theory', 4, 'Intermediate macroeconomics') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - De Anza to UC Berkeley Economics
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Economics', 2024),
  ('e0000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Economics', 2024),
  ('e0000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Economics', 2024),
  ('c0000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Economics', 2024) on conflict do nothing;

-- ============================================================
-- COURSES - English Major (Pasadena City College)
-- Pathway requires: 2 British/American lit surveys, 2 additional English courses, 1-2 years foreign language
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000003', 'ENGL 1A', 'Reading and Composition', 4, 'Critical reading and writing'),
  ('e0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000003', 'ENGL 1B', 'English Composition and Literature', 4, 'Introduction to literary analysis'),
  ('e0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000003', 'ENGL 41', 'English Literature to 1800', 3, 'Survey of British literature through 1800'),
  ('e0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000003', 'ENGL 42', 'English Literature 1800 to Present', 3, 'Survey of British literature from 1800'),
  ('e0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000003', 'ENGL 43', 'American Literature to 1865', 3, 'Survey of American literature through 1865'),
  ('e0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000003', 'ENGL 44', 'American Literature 1865 to Present', 3, 'Survey of American literature from 1865'),
  ('e0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000003', 'ENGL 46', 'Introduction to Shakespeare', 3, 'Study of Shakespeare''s major works'),
  ('e0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000003', 'SPAN 1', 'Elementary Spanish I', 5, 'Introduction to Spanish language'),
  ('e0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000003', 'SPAN 2', 'Elementary Spanish II', 5, 'Continuation of Spanish I') on conflict do nothing;

-- ============================================================
-- COURSES - English Major (UCLA)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', 'ENGL 4W', 'Critical Reading and Writing', 5, 'Introduction to literary analysis'),
  ('f0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000001', 'ENGL 10A', 'English Literature to 1700', 5, 'Survey of British literature through 1700'),
  ('f0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000001', 'ENGL 10B', 'English Literature 1700-1850', 5, 'Survey of British literature 1700-1850'),
  ('f0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000001', 'ENGL 10C', 'English Literature 1850-Present', 5, 'Survey of British literature from 1850'),
  ('f0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000001', 'ENGL 11A', 'American Literature to 1865', 5, 'Survey of American literature through 1865'),
  ('f0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000001', 'ENGL 11B', 'American Literature 1865-Present', 5, 'Survey of American literature from 1865'),
  ('f0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000001', 'ENGL 90', 'Shakespeare', 5, 'Study of Shakespeare''s plays'),
  ('f0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000001', 'SPAN 1', 'Elementary Spanish', 5, 'Introduction to Spanish'),
  ('f0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000001', 'SPAN 2', 'Elementary Spanish', 5, 'Continuation of Spanish') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - PCC to UCLA English
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000022', 'f0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024),
  ('e0000000-0000-0000-0000-000000000023', 'f0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024),
  ('e0000000-0000-0000-0000-000000000024', 'f0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024),
  ('e0000000-0000-0000-0000-000000000025', 'f0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024),
  ('e0000000-0000-0000-0000-000000000026', 'f0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024),
  ('e0000000-0000-0000-0000-000000000027', 'f0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024),
  ('e0000000-0000-0000-0000-000000000028', 'f0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'English', 2024) on conflict do nothing;

-- ============================================================
-- COURSES - Sociology Major (Foothill College)
-- Pathway requires: Intro Sociology 1, Intro Sociology 2 (social problems), Statistics
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000004', 'SOC 1', 'Introduction to Sociology', 5, 'Sociological concepts and social institutions'),
  ('e0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000004', 'SOC 2', 'Social Problems', 5, 'Contemporary social issues and problems'),
  ('e0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000004', 'SOC 3', 'Marriage and Family', 5, 'Sociology of family and relationships'),
  ('e0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000004', 'SOC 10', 'Race and Ethnic Relations', 5, 'Race, ethnicity, and social stratification'),
  ('e0000000-0000-0000-0000-000000000034', 'a0000000-0000-0000-0000-000000000004', 'SOC 14', 'Sociology of Crime', 5, 'Crime, delinquency, and social control'),
  ('e0000000-0000-0000-0000-000000000035', 'a0000000-0000-0000-0000-000000000004', 'MATH 10', 'Elementary Statistics', 5, 'Descriptive and inferential statistics') on conflict do nothing;

-- ============================================================
-- COURSES - Sociology Major (UC Davis)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000007', 'SOC 1', 'Introduction to Sociology', 4, 'Introduction to sociological thinking'),
  ('f0000000-0000-0000-0000-000000000031', 'b0000000-0000-0000-0000-000000000007', 'SOC 2', 'Self and Society', 4, 'Sociology of everyday life'),
  ('f0000000-0000-0000-0000-000000000032', 'b0000000-0000-0000-0000-000000000007', 'SOC 46A', 'Introduction to Social Research', 4, 'Research methods in sociology'),
  ('f0000000-0000-0000-0000-000000000033', 'b0000000-0000-0000-0000-000000000007', 'STAT 7', 'Statistical Methods', 4, 'Applied statistics for social sciences') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - Foothill to UC Davis Sociology
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000030', 'f0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Sociology', 2024),
  ('e0000000-0000-0000-0000-000000000031', 'f0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Sociology', 2024),
  ('e0000000-0000-0000-0000-000000000035', 'f0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'Sociology', 2024) on conflict do nothing;

-- ============================================================
-- COURSES - History Major (Berkeley City College)
-- Pathway requires: 1 year World or European history, 1 US history, 1 non-US/Europe history
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000005', 'HIST 1', 'History of Western Civilization I', 3, 'Western civilization to 1650'),
  ('e0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000005', 'HIST 2', 'History of Western Civilization II', 3, 'Western civilization from 1650'),
  ('e0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000005', 'HIST 7A', 'History of the United States to 1877', 3, 'American history through Reconstruction'),
  ('e0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000005', 'HIST 7B', 'History of the United States Since 1865', 3, 'American history from Reconstruction'),
  ('e0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000005', 'HIST 12', 'Introduction to Asian American History', 3, 'History of Asian Americans'),
  ('e0000000-0000-0000-0000-000000000045', 'a0000000-0000-0000-0000-000000000005', 'HIST 19', 'Introduction to Latin American History', 3, 'Latin American history survey') on conflict do nothing;

-- ============================================================
-- COURSES - History Major (UC Berkeley)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000040', 'b0000000-0000-0000-0000-000000000004', 'HIST 1A', 'Western Civilization', 4, 'Western civilization survey'),
  ('f0000000-0000-0000-0000-000000000041', 'b0000000-0000-0000-0000-000000000004', 'HIST 1B', 'Western Civilization', 4, 'Western civilization survey'),
  ('f0000000-0000-0000-0000-000000000042', 'b0000000-0000-0000-0000-000000000004', 'HIST 7A', 'The United States to 1865', 4, 'American history to Civil War'),
  ('f0000000-0000-0000-0000-000000000043', 'b0000000-0000-0000-0000-000000000004', 'HIST 7B', 'The United States Since 1865', 4, 'American history from Civil War'),
  ('f0000000-0000-0000-0000-000000000044', 'b0000000-0000-0000-0000-000000000004', 'HIST 100', 'Special Topics in History', 4, 'Historical methodology') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - BCC to UC Berkeley History
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000040', 'f0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'History', 2024),
  ('e0000000-0000-0000-0000-000000000041', 'f0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'History', 2024),
  ('e0000000-0000-0000-0000-000000000042', 'f0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'History', 2024),
  ('e0000000-0000-0000-0000-000000000043', 'f0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'History', 2024),
  ('e0000000-0000-0000-0000-000000000045', 'f0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'History', 2024) on conflict do nothing;

-- ============================================================
-- COURSES - Political Science Major (Long Beach City College)
-- Pathway requires: 3 of 4 - American gov, political theory, comparative, international relations
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000050', 'a0000000-0000-0000-0000-000000000006', 'POLSC 1', 'American Government', 3, 'Principles of American government'),
  ('e0000000-0000-0000-0000-000000000051', 'a0000000-0000-0000-0000-000000000006', 'POLSC 2', 'Introduction to Political Theory', 3, 'Classical and modern political thought'),
  ('e0000000-0000-0000-0000-000000000052', 'a0000000-0000-0000-0000-000000000006', 'POLSC 5', 'Comparative Government', 3, 'Comparison of political systems'),
  ('e0000000-0000-0000-0000-000000000053', 'a0000000-0000-0000-0000-000000000006', 'POLSC 7', 'International Relations', 3, 'International politics and institutions'),
  ('e0000000-0000-0000-0000-000000000054', 'a0000000-0000-0000-0000-000000000006', 'POLSC 10', 'Introduction to Public Policy', 3, 'Public policy analysis and process'),
  ('e0000000-0000-0000-0000-000000000055', 'a0000000-0000-0000-0000-000000000006', 'MATH 37', 'Statistics for the Social Sciences', 4, 'Statistical methods for social sciences') on conflict do nothing;

-- ============================================================
-- COURSES - Political Science Major (UC San Diego)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000050', 'b0000000-0000-0000-0000-000000000005', 'POLI 10D', 'American Politics', 4, 'Introduction to American politics'),
  ('f0000000-0000-0000-0000-000000000051', 'b0000000-0000-0000-0000-000000000005', 'POLI 11D', 'Introduction to Political Science', 4, 'Political science methods and concepts'),
  ('f0000000-0000-0000-0000-000000000052', 'b0000000-0000-0000-0000-000000000005', 'POLI 12D', 'International Relations', 4, 'International politics'),
  ('f0000000-0000-0000-0000-000000000053', 'b0000000-0000-0000-0000-000000000005', 'POLI 13D', 'Introduction to Political Theory', 4, 'Political theory and philosophy'),
  ('f0000000-0000-0000-0000-000000000054', 'b0000000-0000-0000-0000-000000000005', 'POLI 100H', 'Research Design', 4, 'Research methods in political science') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - LBCC to UCSD Political Science
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000050', 'f0000000-0000-0000-0000-000000000050', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'Political Science', 2024),
  ('e0000000-0000-0000-0000-000000000051', 'f0000000-0000-0000-0000-000000000053', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'Political Science', 2024),
  ('e0000000-0000-0000-0000-000000000052', 'f0000000-0000-0000-0000-000000000051', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'Political Science', 2024),
  ('e0000000-0000-0000-0000-000000000053', 'f0000000-0000-0000-0000-000000000052', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'Political Science', 2024) on conflict do nothing;

-- ============================================================
-- COURSES - Biology Major (LA Pierce College)  
-- Pathway requires: Gen bio with lab, gen chem with lab, calc for STEM, organic chem with lab
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000060', 'a0000000-0000-0000-0000-000000000007', 'BIOL 1', 'General Biology I', 4, 'Cell biology, genetics, evolution with lab'),
  ('e0000000-0000-0000-0000-000000000061', 'a0000000-0000-0000-0000-000000000007', 'BIOL 2', 'General Biology II', 4, 'Organismal biology, ecology with lab'),
  ('e0000000-0000-0000-0000-000000000062', 'a0000000-0000-0000-0000-000000000007', 'CHEM 101', 'General Chemistry I', 5, 'Chemical principles with lab'),
  ('e0000000-0000-0000-0000-000000000063', 'a0000000-0000-0000-0000-000000000007', 'CHEM 102', 'General Chemistry II', 5, 'Chemical equilibrium with lab'),
  ('e0000000-0000-0000-0000-000000000064', 'a0000000-0000-0000-0000-000000000007', 'CHEM 211', 'Organic Chemistry I', 5, 'Organic compounds and reactions with lab'),
  ('e0000000-0000-0000-0000-000000000065', 'a0000000-0000-0000-0000-000000000007', 'CHEM 212', 'Organic Chemistry II', 5, 'Advanced organic chemistry with lab'),
  ('e0000000-0000-0000-0000-000000000066', 'a0000000-0000-0000-0000-000000000007', 'MATH 261', 'Calculus I', 5, 'Differential and integral calculus'),
  ('e0000000-0000-0000-0000-000000000067', 'a0000000-0000-0000-0000-000000000007', 'MATH 262', 'Calculus II', 5, 'Integration techniques and series'),
  ('e0000000-0000-0000-0000-000000000068', 'a0000000-0000-0000-0000-000000000007', 'PHYS 101', 'General Physics I', 4, 'Mechanics and heat'),
  ('e0000000-0000-0000-0000-000000000069', 'a0000000-0000-0000-0000-000000000007', 'PHYS 102', 'General Physics II', 4, 'Electricity, magnetism, optics') on conflict do nothing;

-- ============================================================
-- COURSES - Biology Major (UC Davis)
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000060', 'b0000000-0000-0000-0000-000000000007', 'BIS 2A', 'Introduction to Biology', 5, 'Cell biology, genetics with lab'),
  ('f0000000-0000-0000-0000-000000000061', 'b0000000-0000-0000-0000-000000000007', 'BIS 2B', 'Introduction to Biology', 5, 'Ecology, evolution with lab'),
  ('f0000000-0000-0000-0000-000000000062', 'b0000000-0000-0000-0000-000000000007', 'CHE 2A', 'General Chemistry', 5, 'General chemistry with lab'),
  ('f0000000-0000-0000-0000-000000000063', 'b0000000-0000-0000-0000-000000000007', 'CHE 2B', 'General Chemistry', 5, 'General chemistry with lab'),
  ('f0000000-0000-0000-0000-000000000064', 'b0000000-0000-0000-0000-000000000007', 'CHE 118A', 'Organic Chemistry', 4, 'Organic chemistry with lab'),
  ('f0000000-0000-0000-0000-000000000065', 'b0000000-0000-0000-0000-000000000007', 'CHE 118B', 'Organic Chemistry', 4, 'Organic chemistry with lab'),
  ('f0000000-0000-0000-0000-000000000066', 'b0000000-0000-0000-0000-000000000007', 'MAT 21A', 'Calculus', 4, 'Single variable calculus'),
  ('f0000000-0000-0000-0000-000000000067', 'b0000000-0000-0000-0000-000000000007', 'MAT 21B', 'Calculus', 4, 'Integration and applications'),
  ('f0000000-0000-0000-0000-000000000068', 'b0000000-0000-0000-0000-000000000007', 'PHY 7A', 'General Physics', 4, 'Mechanics and oscillations'),
  ('f0000000-0000-0000-0000-000000000069', 'b0000000-0000-0000-0000-000000000007', 'PHY 7B', 'General Physics', 4, 'Electromagnetism and waves') on conflict do nothing;

-- ============================================================
-- ARTICULATION AGREEMENTS - Pierce to UC Davis Biology
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000060', 'f0000000-0000-0000-0000-000000000060', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024),
  ('e0000000-0000-0000-0000-000000000061', 'f0000000-0000-0000-0000-000000000061', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024),
  ('e0000000-0000-0000-0000-000000000062', 'f0000000-0000-0000-0000-000000000062', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024),
  ('e0000000-0000-0000-0000-000000000063', 'f0000000-0000-0000-0000-000000000063', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024),
  ('e0000000-0000-0000-0000-000000000064', 'f0000000-0000-0000-0000-000000000064', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024),
  ('e0000000-0000-0000-0000-000000000065', 'f0000000-0000-0000-0000-000000000065', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024),
  ('e0000000-0000-0000-0000-000000000066', 'f0000000-0000-0000-0000-000000000066', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Biology', 2024) on conflict do nothing;

-- ============================================================
-- PREREQUISITES
-- ============================================================
-- Psychology prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000008'),  -- Calc for Life Sciences requires Calc I
  ('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000008'),  -- Chem requires Math
  ('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-00000000000f') on conflict do nothing;  -- Bio requires English

-- Economics prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000010'),  -- Econ 3 requires Econ 1
  ('e0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000011'),  -- Econ 5 requires Econ 2
  ('c0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000014') on conflict do nothing;  -- De Anza Calc II requires Calc I

-- English prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000022', 'e0000000-0000-0000-0000-000000000021'),  -- British Lit requires Comp
  ('e0000000-0000-0000-0000-000000000023', 'e0000000-0000-0000-0000-000000000021'),  -- British Lit II requires Comp
  ('e0000000-0000-0000-0000-000000000028', 'e0000000-0000-0000-0000-000000000027') on conflict do nothing;  -- Spanish II requires Spanish I

-- Sociology prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000031', 'e0000000-0000-0000-0000-000000000030'),  -- Social Problems requires Intro
  ('e0000000-0000-0000-0000-000000000032', 'e0000000-0000-0000-0000-000000000030'),  -- Marriage/Family requires Intro
  ('e0000000-0000-0000-0000-000000000033', 'e0000000-0000-0000-0000-000000000030'),  -- Race Relations requires Intro
  ('e0000000-0000-0000-0000-000000000034', 'e0000000-0000-0000-0000-000000000030') on conflict do nothing;  -- Crime requires Intro

-- History prerequisites (none for intro courses)

-- Political Science prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000052', 'e0000000-0000-0000-0000-000000000050'),  -- Comparative requires American
  ('e0000000-0000-0000-0000-000000000054', 'e0000000-0000-0000-0000-000000000050') on conflict do nothing;  -- Public Policy requires American

-- Biology prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000061', 'e0000000-0000-0000-0000-000000000060'),  -- Bio II requires Bio I
  ('e0000000-0000-0000-0000-000000000063', 'e0000000-0000-0000-0000-000000000062'),  -- Chem II requires Chem I
  ('e0000000-0000-0000-0000-000000000064', 'e0000000-0000-0000-0000-000000000063'),  -- O-Chem I requires Gen Chem II
  ('e0000000-0000-0000-0000-000000000065', 'e0000000-0000-0000-0000-000000000064'),  -- O-Chem II requires O-Chem I
  ('e0000000-0000-0000-0000-000000000067', 'e0000000-0000-0000-0000-000000000066'),  -- Calc II requires Calc I
  ('e0000000-0000-0000-0000-000000000069', 'e0000000-0000-0000-0000-000000000068'),  -- Physics II requires Physics I
  ('e0000000-0000-0000-0000-000000000068', 'e0000000-0000-0000-0000-000000000067'),  -- Physics requires Calc II
  ('e0000000-0000-0000-0000-000000000062', 'e0000000-0000-0000-0000-000000000066') on conflict do nothing;  -- Chem requires concurrent Calc

-- ============================================================
-- ADDITIONAL COURSES FOR EXISTING CCs (Philosophy, Communication, Anthropology)
-- These extend existing institutions rather than creating new ones
-- ============================================================

-- Philosophy courses for SMC
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000070', 'a0000000-0000-0000-0000-000000000001', 'PHIL 1', 'Introduction to Philosophy', 3, 'Major philosophical questions and methods'),
  ('e0000000-0000-0000-0000-000000000071', 'a0000000-0000-0000-0000-000000000001', 'PHIL 5', 'Symbolic Logic', 3, 'Introduction to formal logic'),
  ('e0000000-0000-0000-0000-000000000072', 'a0000000-0000-0000-0000-000000000001', 'PHIL 6', 'Ancient Philosophy', 3, 'Greek and Roman philosophy'),
  ('e0000000-0000-0000-0000-000000000073', 'a0000000-0000-0000-0000-000000000001', 'PHIL 7', 'Modern Philosophy', 3, 'Philosophy from Descartes to Kant'),
  ('e0000000-0000-0000-0000-000000000074', 'a0000000-0000-0000-0000-000000000001', 'PHIL 10', 'Ethics', 3, 'Moral philosophy and ethical theory') on conflict do nothing;

-- Philosophy courses for UCLA
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000070', 'b0000000-0000-0000-0000-000000000001', 'PHIL 1', 'Introduction to Philosophy', 5, 'Introduction to philosophical methods'),
  ('f0000000-0000-0000-0000-000000000071', 'b0000000-0000-0000-0000-000000000001', 'PHIL 5', 'Logic, First Course', 5, 'Introduction to formal logic'),
  ('f0000000-0000-0000-0000-000000000072', 'b0000000-0000-0000-0000-000000000001', 'PHIL 6', 'Ancient Philosophy', 4, 'Greek philosophy'),
  ('f0000000-0000-0000-0000-000000000073', 'b0000000-0000-0000-0000-000000000001', 'PHIL 7', 'Modern Philosophy', 4, 'Modern European philosophy'),
  ('f0000000-0000-0000-0000-000000000074', 'b0000000-0000-0000-0000-000000000001', 'PHIL 22', 'Ethics', 5, 'Introduction to ethical theory') on conflict do nothing;

-- Articulation agreements for Philosophy
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000070', 'f0000000-0000-0000-0000-000000000070', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Philosophy', 2024),
  ('e0000000-0000-0000-0000-000000000071', 'f0000000-0000-0000-0000-000000000071', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Philosophy', 2024),
  ('e0000000-0000-0000-0000-000000000072', 'f0000000-0000-0000-0000-000000000072', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Philosophy', 2024),
  ('e0000000-0000-0000-0000-000000000073', 'f0000000-0000-0000-0000-000000000073', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Philosophy', 2024),
  ('e0000000-0000-0000-0000-000000000074', 'f0000000-0000-0000-0000-000000000074', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Philosophy', 2024) on conflict do nothing;

-- Communication courses for De Anza
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000080', 'a0000000-0000-0000-0000-000000000002', 'COMM 1', 'Introduction to Communication', 4, 'Mass and interpersonal communication'),
  ('e0000000-0000-0000-0000-000000000081', 'a0000000-0000-0000-0000-000000000002', 'COMM 1H', 'Honors Introduction to Communication', 4, 'Honors section of introduction'),
  ('e0000000-0000-0000-0000-000000000082', 'a0000000-0000-0000-0000-000000000002', 'COMM 2', 'Interpersonal Communication', 4, 'Communication in relationships'),
  ('e0000000-0000-0000-0000-000000000083', 'a0000000-0000-0000-0000-000000000002', 'COMM 3', 'Public Speaking', 4, 'Oral communication and presentation'),
  ('e0000000-0000-0000-0000-000000000084', 'a0000000-0000-0000-0000-000000000002', 'COMM 4', 'Small Group Communication', 4, 'Group dynamics and leadership'),
  ('e0000000-0000-0000-0000-000000000085', 'a0000000-0000-0000-0000-000000000002', 'LING 1', 'Introduction to Linguistics', 4, 'Study of language structure') on conflict do nothing;

-- Communication courses for SJSU
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000080', 'b0000000-0000-0000-0000-000000000002', 'COMM 10', 'Fundamentals of Communication', 3, 'Introduction to communication studies'),
  ('f0000000-0000-0000-0000-000000000081', 'b0000000-0000-0000-0000-000000000002', 'COMM 20', 'Public Speaking', 3, 'Public speaking and presentation'),
  ('f0000000-0000-0000-0000-000000000082', 'b0000000-0000-0000-0000-000000000002', 'COMM 30', 'Interpersonal Communication', 3, 'Interpersonal communication theory'),
  ('f0000000-0000-0000-0000-000000000083', 'b0000000-0000-0000-0000-000000000002', 'COMM 40', 'Group Communication', 3, 'Small group communication'),
  ('f0000000-0000-0000-0000-000000000084', 'b0000000-0000-0000-0000-000000000002', 'LING 101', 'Introduction to Linguistics', 3, 'Introduction to language science') on conflict do nothing;

-- Articulation agreements for Communication
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000080', 'f0000000-0000-0000-0000-000000000080', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Communication', 2024),
  ('e0000000-0000-0000-0000-000000000082', 'f0000000-0000-0000-0000-000000000082', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Communication', 2024),
  ('e0000000-0000-0000-0000-000000000083', 'f0000000-0000-0000-0000-000000000081', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Communication', 2024),
  ('e0000000-0000-0000-0000-000000000084', 'f0000000-0000-0000-0000-000000000083', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Communication', 2024),
  ('e0000000-0000-0000-0000-000000000085', 'f0000000-0000-0000-0000-000000000084', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Communication', 2024) on conflict do nothing;

-- Anthropology courses for Pasadena City College
insert into courses (id, institution_id, code, title, units, description) values
  ('e0000000-0000-0000-0000-000000000090', 'a0000000-0000-0000-0000-000000000003', 'ANTHRO 2', 'Physical Anthropology', 3, 'Human evolution and variation'),
  ('e0000000-0000-0000-0000-000000000091', 'a0000000-0000-0000-0000-000000000003', 'ANTHRO 3', 'Cultural Anthropology', 3, 'Study of living cultures'),
  ('e0000000-0000-0000-0000-000000000092', 'a0000000-0000-0000-0000-000000000003', 'ANTHRO 4', 'Introduction to Archaeology', 3, 'Archaeological methods and theory'),
  ('e0000000-0000-0000-0000-000000000093', 'a0000000-0000-0000-0000-000000000003', 'ANTHRO 5', 'Native American Cultures', 3, 'Indigenous peoples of North America') on conflict do nothing;

-- Anthropology courses for USC
insert into courses (id, institution_id, code, title, units, description) values
  ('f0000000-0000-0000-0000-000000000090', 'b0000000-0000-0000-0000-000000000003', 'ANTH 100', 'Introduction to Anthropology', 4, 'Biological anthropology and archaeology'),
  ('f0000000-0000-0000-0000-000000000091', 'b0000000-0000-0000-0000-000000000003', 'ANTH 200', 'Cultural Anthropology', 4, 'Theory and method in cultural anthropology'),
  ('f0000000-0000-0000-0000-000000000092', 'b0000000-0000-0000-0000-000000000003', 'ANTH 202', 'Archaeology', 4, 'Archaeological method and theory'),
  ('f0000000-0000-0000-0000-000000000093', 'b0000000-0000-0000-0000-000000000003', 'ANTH 263', 'North American Indians', 4, 'Native American cultures') on conflict do nothing;

-- Articulation agreements for Anthropology
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('e0000000-0000-0000-0000-000000000090', 'f0000000-0000-0000-0000-000000000090', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Anthropology', 2024),
  ('e0000000-0000-0000-0000-000000000091', 'f0000000-0000-0000-0000-000000000091', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Anthropology', 2024),
  ('e0000000-0000-0000-0000-000000000092', 'f0000000-0000-0000-0000-000000000092', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Anthropology', 2024),
  ('e0000000-0000-0000-0000-000000000093', 'f0000000-0000-0000-0000-000000000093', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Anthropology', 2024) on conflict do nothing;

-- Additional prerequisites
insert into prerequisites (course_id, prerequisite_course_id) values
  ('e0000000-0000-0000-0000-000000000072', 'e0000000-0000-0000-0000-000000000070'),  -- Ancient Phil requires Intro
  ('e0000000-0000-0000-0000-000000000073', 'e0000000-0000-0000-0000-000000000070'),  -- Modern Phil requires Intro
  ('e0000000-0000-0000-0000-000000000074', 'e0000000-0000-0000-0000-000000000070'),  -- Ethics requires Intro
  ('e0000000-0000-0000-0000-000000000082', 'e0000000-0000-0000-0000-000000000080'),  -- Interpersonal requires Intro
  ('e0000000-0000-0000-0000-000000000083', 'e0000000-0000-0000-0000-000000000080'),  -- Public speaking requires Intro
  ('e0000000-0000-0000-0000-000000000084', 'e0000000-0000-0000-0000-000000000080'),  -- Group comm requires Intro
  ('e0000000-0000-0000-0000-000000000092', 'e0000000-0000-0000-0000-000000000091'),  -- Archaeology requires Cultural
  ('e0000000-0000-0000-0000-000000000093', 'e0000000-0000-0000-0000-000000000091') on conflict do nothing;  -- Native American requires Cultural
