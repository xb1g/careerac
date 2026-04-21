-- CSM (College of San Mateo) - Institution ID: c0000000-0000-0000-0000-000000000001
-- ECON
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'ECON 100', 'Principles of Macroeconomics', 3, 'CSU/UC transferable macroeconomics course covering national income, monetary policy, and economic growth'),
('c0000000-0000-0000-0000-000000000001', 'ECON 102', 'Principles of Microeconomics', 3, 'CSU/UC transferable microeconomics course covering supply/demand, market structures, and consumer behavior')
ON CONFLICT (institution_id, code) DO NOTHING;

-- PSYC
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'PSYC 105', 'Experimental Psychology', 3, 'CSU/UC transferable course in experimental psychology methods'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 106', 'Psychology of Prejudice and Discrimination', 3, 'CSU/UC transferable course examining psychological aspects of prejudice'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 110', 'Courtship, Marriage and the Family', 3, 'CSU/UC transferable course covering family relationships and development'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 120', 'Introduction to Research Methods', 3, 'CSU/UC transferable course in psychology research methodology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 121', 'Basic Statistical Concepts', 3, 'CSU/UC transferable statistics course for behavioral sciences'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 200', 'Developmental Psychology', 3, 'CSU/UC transferable course covering human development across the lifespan'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 201', 'Child Development', 3, 'CSU/UC transferable course focusing on child development'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 220', 'Introduction to Psychobiology', 3, 'CSU/UC transferable course in biological psychology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 225', 'Theories of Personality', 3, 'CSU/UC transferable course examining personality theories'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 230', 'Introduction to Cross-Cultural Psychology', 3, 'CSU/UC transferable course in cross-cultural psychology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 300', 'Social Psychology', 3, 'CSU/UC transferable course in social psychology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 301', 'Psychology of Human Relationships and Adjustment', 3, 'CSU/UC transferable course in interpersonal relationships'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 310', 'Positive Psychology', 3, 'CSU/UC transferable course in positive psychology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 320', 'Psychology of Wellness: The Mind-Body Connection', 3, 'CSU/UC transferable course in health psychology and wellness'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 330', 'Sports Psychology', 3, 'CSU/UC transferable course in sports and performance psychology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC 410', 'Abnormal Psychology', 3, 'CSU/UC transferable course in psychopathology'),
('c0000000-0000-0000-0000-000000000001', 'PSYC C1000', 'Introduction to Psychology', 3, 'CSU/UC transferable introductory psychology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- COMM
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'COMM 115', 'Survey of Human Communication', 3, 'CSU/UC transferable course in human communication theory'),
('c0000000-0000-0000-0000-000000000001', 'COMM 130', 'Interpersonal Communication', 3, 'CSU/UC transferable course in interpersonal communication'),
('c0000000-0000-0000-0000-000000000001', 'COMM 140', 'Small Group Communication', 3, 'CSU/UC transferable course in small group communication'),
('c0000000-0000-0000-0000-000000000001', 'COMM 150', 'Intercultural Communication', 3, 'CSU/UC transferable course in intercultural communication'),
('c0000000-0000-0000-0000-000000000001', 'COMM 170', 'Oral Interpretation I', 3, 'CSU/UC transferable course in oral interpretation of literature'),
('c0000000-0000-0000-0000-000000000001', 'COMM 171', 'Oral Interpretation II', 3, 'CSU/UC transferable advanced course in oral interpretation'),
('c0000000-0000-0000-0000-000000000001', 'COMM C1000', 'Public Speaking', 3, 'CSU/UC transferable public speaking course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- CIS
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'CIS 110', 'Introduction to Computer and Information Science', 3, 'CSU/UC transferable introduction to computer science'),
('c0000000-0000-0000-0000-000000000001', 'CIS 111', 'Introduction to Web Programming', 3, 'CSU/UC transferable web development course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 113', 'Ruby Programming', 4, 'CSU/UC transferable Ruby programming course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 114', 'JavaScript/Ajax Programming', 4, 'CSU/UC transferable JavaScript programming course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 117', 'Python Programming', 4, 'CSU/UC transferable Python programming course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 121', 'UNIX/Linux', 3, 'CSU/UC transferable UNIX/Linux operating system course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 124', 'Foundations of Data Science', 4, 'CSU/UC transferable data science foundations course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 127', 'HTML5 and CSS', 3, 'CSU/UC transferable web markup languages course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 128', 'Mobile Web App Development', 4, 'CSU/UC transferable mobile web development course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 129', 'Frameworks/Server-Side JavaScript', 3, 'CSU/UC transferable server-side JavaScript course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 132', 'Introduction to Databases', 3, 'CSU/UC transferable database concepts course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 133', 'NoSQL Databases', 3, 'CSU/UC transferable NoSQL databases course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 135', 'Android Programming', 4, 'CSU/UC transferable Android mobile development course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 137', 'iOS/Swift Programming', 4, 'CSU/UC transferable iOS mobile development course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 138', 'Internet of Things', 3, 'CSU/UC transferable IoT concepts course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 140', 'Big Data Analytics', 4, 'CSU/UC transferable big data analytics course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 145', 'Introduction to DevOps', 3, 'CSU/UC transferable DevOps practices course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 151', 'Computer Networking', 3, 'CSU/UC transferable computer networking course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 254', 'Introduction to Object-Oriented Program Design', 4, 'CSU/UC transferable OOP design course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 255', '(CS1) Programming Methods: Java', 4, 'CSU/UC transferable Java programming CS1 course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 256', '(CS2) Data Structures: Java', 4, 'CSU/UC transferable data structures Java CS2 course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 262', 'Discrete Mathematics for Computer Science', 3, 'CSU/UC transferable discrete math course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 264', 'Computer Organization and Systems Programming', 4, 'CSU/UC transferable computer organization course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 278', '(CS1) Programming Methods: C++', 4, 'CSU/UC transferable C++ programming CS1 course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 279', '(CS2) Data Structures: C++', 4, 'CSU/UC transferable data structures C++ CS2 course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 363', 'Enterprise Database Management', 4, 'CSU/UC transferable enterprise database course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 364', 'From Data Warehousing to Big Data', 4, 'CSU/UC transferable data warehousing course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 380', 'PHP Programming', 3, 'CSU/UC transferable PHP web development course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 400', 'Probability for Computing', 4, 'CSU/UC transferable probability for computer science course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 401', 'Introduction to Machine Learning', 4, 'CSU/UC transferable machine learning course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 402', 'Introduction to Artificial Intelligence', 4, 'CSU/UC transferable AI course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 479', 'Computer and Network Security', 3, 'CSU/UC transferable cybersecurity course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 482', 'Ethical Hacking', 3, 'CSU transferable ethical hacking course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 493', 'Cloud Security Fundamentals', 3, 'CSU transferable cloud security course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 500', 'Introduction to Cloud Computing', 4, 'CSU/UC transferable cloud computing course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 501', '(CS2) Data Structures: Python', 4, 'CSU/UC transferable Python data structures course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 502', 'Applied Python Programming', 4, 'CSU/UC transferable applied Python course'),
('c0000000-0000-0000-0000-000000000001', 'CIS 503', 'Data Visualization and Text Analysis in Python', 3, 'CSU/UC transferable data visualization course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- HIST
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'HIST 100', 'History of Western Civilization I', 3, 'CSU/UC transferable western civilization history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 101', 'History of Western Civilization II', 3, 'CSU/UC transferable western civilization history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 104', 'World History I', 3, 'CSU/UC transferable world history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 106', 'World History II: From 1500 to Present', 3, 'CSU/UC transferable world history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 201', 'United States History I', 3, 'CSU/UC transferable US history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 202', 'United States History II', 3, 'CSU/UC transferable US history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 260', 'Women In American History', 3, 'CSU/UC transferable women in American history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 261', 'Women in American History I', 3, 'CSU/UC transferable women in American history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 262', 'Women in American History II', 3, 'CSU/UC transferable women in American history course'),
('c0000000-0000-0000-0000-000000000001', 'HIST 310', 'California History', 3, 'CSU/UC transferable California history course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- SOCI
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'SOCI 100', 'Introduction to Sociology', 3, 'CSU/UC transferable introductory sociology course'),
('c0000000-0000-0000-0000-000000000001', 'SOCI 105', 'Social Problems', 3, 'CSU/UC transferable social problems course'),
('c0000000-0000-0000-0000-000000000001', 'SOCI 110', 'Courtship, Marriage and the Family', 3, 'CSU/UC transferable family sociology course'),
('c0000000-0000-0000-0000-000000000001', 'SOCI 121', 'Introduction to Research Methods', 3, 'CSU/UC transferable sociology research methods course'),
('c0000000-0000-0000-0000-000000000001', 'SOCI 141', 'Race and Ethnic Relations', 3, 'CSU/UC transferable race and ethnicity course'),
('c0000000-0000-0000-0000-000000000001', 'SOCI 160', 'Sociology of Sex and Gender', 3, 'CSU/UC transferable gender sociology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- Cañada College - Institution ID: c0000000-0000-0000-0000-000000000002
-- ECON
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'ECON 100', 'Principles of Macro Economics', 3, 'CSU/UC transferable macroeconomics principles course'),
('c0000000-0000-0000-0000-000000000002', 'ECON 102', 'Principles of Micro Economics', 3, 'CSU/UC transferable microeconomics principles course'),
('c0000000-0000-0000-0000-000000000002', 'ECON 230', 'Economic History of the United States', 3, 'CSU/UC transferable US economic history course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- PSYC
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'PSYC 106', 'Psychology of Prejudice and Discrimination', 3, 'CSU/UC transferable course examining psychological aspects of prejudice'),
('c0000000-0000-0000-0000-000000000002', 'PSYC 200', 'Developmental Psychology', 3, 'CSU/UC transferable lifespan development psychology course'),
('c0000000-0000-0000-0000-000000000002', 'PSYC 205', 'Social Science Research Methods', 3, 'CSU/UC transferable research methods course'),
('c0000000-0000-0000-0000-000000000002', 'PSYC 300', 'Social Psychology', 3, 'CSU/UC transferable social psychology course'),
('c0000000-0000-0000-0000-000000000002', 'PSYC 340', 'Introduction to Human Sexuality', 3, 'CSU/UC transferable human sexuality course'),
('c0000000-0000-0000-0000-000000000002', 'PSYC 410', 'Abnormal Psychology', 3, 'CSU/UC transferable psychopathology course'),
('c0000000-0000-0000-0000-000000000002', 'PSYC 695', 'Independent Study', 0.5, 'CSU transferable independent study in psychology'),
('c0000000-0000-0000-0000-000000000002', 'PSYC C1000', 'Introduction to Psychology', 3, 'CSU/UC transferable introductory psychology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- COMM
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'COMM 127', 'Argumentation and Debate', 3, 'CSU/UC transferable argumentation and debate course'),
('c0000000-0000-0000-0000-000000000002', 'COMM 130', 'Interpersonal Communication', 3, 'CSU/UC transferable interpersonal communication course'),
('c0000000-0000-0000-0000-000000000002', 'COMM 140', 'Small Group Communication', 3, 'CSU/UC transferable small group communication course'),
('c0000000-0000-0000-0000-000000000002', 'COMM 150', 'Intercultural Communication', 3, 'CSU/UC transferable intercultural communication course'),
('c0000000-0000-0000-0000-000000000002', 'COMM 180', 'Introduction to Communication Studies', 3, 'CSU/UC transferable introduction to communication studies'),
('c0000000-0000-0000-0000-000000000002', 'COMM 695', 'Independent Study', 0.5, 'CSU transferable communication independent study'),
('c0000000-0000-0000-0000-000000000002', 'COMM C1000', 'Introduction to Public Speaking', 3, 'CSU/UC transferable public speaking course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- CIS
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'CIS 118', 'Introduction to Computer Science', 4, 'CSU/UC transferable introduction to computer science'),
('c0000000-0000-0000-0000-000000000002', 'CIS 122', 'Introduction to Programming: Python', 3, 'CSU/UC transferable Python programming course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 242', 'Computer Architecture and Assembly Language', 3, 'CSU/UC transferable computer architecture course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 250', 'Introduction to Object Oriented Programming: C++', 3, 'CSU/UC transferable C++ OOP programming course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 252', 'Introduction to Data Structures - C++', 3, 'CSU/UC transferable data structures C++ course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 262', 'Discrete Mathematics for Computer Science', 3, 'CSU/UC transferable discrete mathematics course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 284', 'Introduction to Object Oriented Programming- Java', 3, 'CSU/UC transferable Java OOP programming course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 286', 'Introduction to Data Structures - Java', 3, 'CSU/UC transferable data structures Java course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 294', 'Introduction to Object Oriented Programming: Swift', 3, 'CSU/UC transferable Swift iOS programming course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 321', 'iPhone Programming: Swift', 3, 'CSU/UC transferable iPhone Swift development course'),
('c0000000-0000-0000-0000-000000000002', 'CIS 695', 'Independent Study', 0.5, 'CSU transferable computer science independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- HIST
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'HIST 100', 'History of Western Civilization I', 3, 'CSU/UC transferable western civilization history I'),
('c0000000-0000-0000-0000-000000000002', 'HIST 101', 'History of Western Civilization II', 3, 'CSU/UC transferable western civilization history II'),
('c0000000-0000-0000-0000-000000000002', 'HIST 104', 'World History I', 3, 'CSU/UC transferable world history I'),
('c0000000-0000-0000-0000-000000000002', 'HIST 106', 'World History II', 3, 'CSU/UC transferable world history II'),
('c0000000-0000-0000-0000-000000000002', 'HIST 201', 'U.S. History through 1877', 3, 'CSU/UC transferable US history to 1877'),
('c0000000-0000-0000-0000-000000000002', 'HIST 202', 'U.S. History from 1877 to the Present', 3, 'CSU/UC transferable US history from 1877'),
('c0000000-0000-0000-0000-000000000002', 'HIST 245', 'Race, Ethnicity and Immigration in the U.S.', 3, 'CSU/UC transferable race ethnicity immigration course'),
('c0000000-0000-0000-0000-000000000002', 'HIST 246', 'History of Latinos in the U.S.', 3, 'CSU/UC transferable Latino history course'),
('c0000000-0000-0000-0000-000000000002', 'HIST 247', 'Women in U.S. History', 3, 'CSU/UC transferable women in US history course'),
('c0000000-0000-0000-0000-000000000002', 'HIST 422', 'Modern Latin America', 3, 'CSU/UC transferable modern Latin America course'),
('c0000000-0000-0000-0000-000000000002', 'HIST 695', 'Independent Study', 0.5, 'CSU transferable history independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- SOCI
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'SOCI 100', 'Introduction to Sociology', 3, 'CSU/UC transferable introductory sociology course'),
('c0000000-0000-0000-0000-000000000002', 'SOCI 105', 'Social Problems', 3, 'CSU/UC transferable social problems course'),
('c0000000-0000-0000-0000-000000000002', 'SOCI 141', 'Ethnicity and Race in Society', 3, 'CSU/UC transferable ethnicity and race course'),
('c0000000-0000-0000-0000-000000000002', 'SOCI 205', 'Social Science Research Methods', 3, 'CSU/UC transferable research methods course'),
('c0000000-0000-0000-0000-000000000002', 'SOCI 695', 'Independent Study', 0.5, 'CSU transferable sociology independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- Skyline College - Institution ID: c0000000-0000-0000-0000-000000000003
-- ECON
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'ECON 100', 'Principles of Macro Economics', 3, 'CSU/UC transferable macroeconomics principles course'),
('c0000000-0000-0000-0000-000000000003', 'ECON 102', 'Principles of Microeconomics', 3, 'CSU/UC transferable microeconomics principles course'),
('c0000000-0000-0000-0000-000000000003', 'ECON 210', 'Economics of the Environment', 3, 'CSU/UC transferable environmental economics course'),
('c0000000-0000-0000-0000-000000000003', 'ECON 220', 'Introduction to International Economics', 3, 'CSU transferable international economics course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- PSYC
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'PSYC 105', 'Experimental Psychology', 3, 'CSU/UC transferable experimental psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 110', 'Courtship, Marriage and Family', 3, 'CSU/UC transferable family relationships course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 171', 'Quantitative Reasoning in Psychology', 3, 'CSU/UC transferable quantitative reasoning course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 200', 'Developmental Psychology', 3, 'CSU/UC transferable lifespan development psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 201', 'Child Development', 3, 'CSU/UC transferable child development course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 220', 'Introduction to Psychobiology', 3, 'CSU/UC transferable biological psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 230', 'Introduction to Cross-Cultural Psychology', 3, 'CSU/UC transferable cross-cultural psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 268', 'Black Psychology', 3, 'CSU/UC transferable Black psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 310', 'Positive Psychology', 3, 'CSU/UC transferable positive psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 330', 'Introduction to Sports Psychology', 3, 'CSU/UC transferable sports psychology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 340', 'Introduction to Human Sexuality', 3, 'CSU transferable human sexuality course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 410', 'Abnormal Psychology', 3, 'CSU/UC transferable psychopathology course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC 670', 'Vocational Cooperative Education in Psychology', 1, 'CSU transferable cooperative education course'),
('c0000000-0000-0000-0000-000000000003', 'PSYC C1000', 'Introduction to Psychology', 3, 'CSU/UC transferable introductory psychology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- COMM
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'COMM 127', 'Argumentation and Debate', 3, 'CSU/UC transferable argumentation and debate course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 127C', 'Argumentation and Debate', 3, 'CSU/UC transferable argumentation and debate course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 130', 'Interpersonal Communication', 3, 'CSU/UC transferable interpersonal communication course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 140', 'Small Group Communication', 3, 'CSU/UC transferable small group communication course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 150', 'Intercultural Communication', 3, 'CSU/UC transferable intercultural communication course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 160', 'Gender and Communication', 3, 'CSU/UC transferable gender communication course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 170', 'Oral Interpretation I', 3, 'CSU transferable oral interpretation course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 172', 'Forensics', 1, 'CSU/UC transferable forensics course'),
('c0000000-0000-0000-0000-000000000003', 'COMM 695', 'Independent Study in Communication Studies', 0.5, 'CSU transferable communication independent study'),
('c0000000-0000-0000-0000-000000000003', 'COMM B10', 'Health Communication', 3, 'Non-transferable health communication course'),
('c0000000-0000-0000-0000-000000000003', 'COMM C1000', 'Introduction to Public Speaking', 3, 'CSU/UC transferable public speaking course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- CIS
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'CIS 111', 'Introduction to Web Programming', 3, 'CSU/UC transferable web programming course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 122', 'Introduction to Programming: Python', 3, 'CSU/UC transferable Python programming course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 132', 'Introduction to Databases', 3, 'CSU/UC transferable database concepts course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 134', 'The Art of Coding: iOS App Development with Swift', 3, 'CSU/UC transferable iOS Swift development course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 242', 'Computer Architecture and Assembly Language', 3, 'CSU/UC transferable computer architecture course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 250', 'Introduction to Object-Oriented Programming: C++', 3, 'CSU/UC transferable C++ OOP course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 252', 'Introduction to Data Structures: C++', 3, 'CSU/UC transferable data structures C++ course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 257', 'Introduction to Microcontrollers with C/C++', 1, 'CSU/UC transferable microcontrollers course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 262', 'Discrete Mathematics for Computer Science', 3, 'CSU/UC transferable discrete math course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 274', 'Introduction to Object-Oriented Programming: Java', 4, 'CSU/UC transferable Java OOP course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 286', 'Introduction to Data Structures: Java', 3, 'CSU/UC transferable data structures Java course'),
('c0000000-0000-0000-0000-000000000003', 'CIS 695', 'Independent Study in Computer Information Science', 0.5, 'CSU transferable CIS independent study'),
('c0000000-0000-0000-0000-000000000003', 'CIS 890', 'Path to Coding Success', 0, 'Non-transferable introductory coding course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- HIST
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'HIST 100', 'History of Western Civilization I', 3, 'CSU/UC transferable western civilization I'),
('c0000000-0000-0000-0000-000000000003', 'HIST 101', 'History of Western Civilization II', 3, 'CSU/UC transferable western civilization II'),
('c0000000-0000-0000-0000-000000000003', 'HIST 104', 'World Civilizations I', 3, 'CSU/UC transferable world civilizations I'),
('c0000000-0000-0000-0000-000000000003', 'HIST 106', 'World Civilizations II', 3, 'CSU/UC transferable world civilizations II'),
('c0000000-0000-0000-0000-000000000003', 'HIST 108', 'Survey of American History', 3, 'CSU/UC transferable American history survey'),
('c0000000-0000-0000-0000-000000000003', 'HIST 109', 'Europe Since 1945', 3, 'CSU/UC transferable modern European history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 201', 'United States History I', 3, 'CSU/UC transferable US history I'),
('c0000000-0000-0000-0000-000000000003', 'HIST 202', 'United States History II', 3, 'CSU/UC transferable US history II'),
('c0000000-0000-0000-0000-000000000003', 'HIST 203', 'The United States Since 1945', 3, 'CSU/UC transferable modern US history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 235', 'History of Ethnic Groups in the United States', 3, 'CSU/UC transferable ethnic groups in US history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 240', 'History of Ethnic Groups in California', 3, 'CSU/UC transferable ethnic groups in California history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 244', 'African American History', 3, 'CSU/UC transferable African American history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 248', 'Women and the American Experience', 3, 'CSU/UC transferable women in American history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 310', 'California History', 3, 'CSU/UC transferable California history'),
('c0000000-0000-0000-0000-000000000003', 'HIST 335', 'History and Politics of the Middle East', 3, 'CSU/UC transferable Middle East history and politics'),
('c0000000-0000-0000-0000-000000000003', 'HIST 410', 'The Holocaust', 3, 'CSU/UC transferable Holocaust studies course'),
('c0000000-0000-0000-0000-000000000003', 'HIST 420', 'Survey of Latin American History', 3, 'CSU/UC transferable Latin American history course'),
('c0000000-0000-0000-0000-000000000003', 'HIST 429', 'History of Latin@s/x in the United States', 3, 'CSU/UC transferable Latina/o history course'),
('c0000000-0000-0000-0000-000000000003', 'HIST 435', 'History of the Philippines', 3, 'CSU/UC transferable Philippine history course'),
('c0000000-0000-0000-0000-000000000003', 'HIST 436', 'Filipinos in America', 3, 'CSU/UC transferable Filipino American history course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- SOCI
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'SOCI 100', 'Introduction to Sociology', 3, 'CSU/UC transferable introductory sociology course'),
('c0000000-0000-0000-0000-000000000003', 'SOCI 105', 'Social Problems', 3, 'CSU/UC transferable social problems course'),
('c0000000-0000-0000-0000-000000000003', 'SOCI 110', 'Courtship, Marriage and Family', 3, 'CSU/UC transferable family sociology course'),
('c0000000-0000-0000-0000-000000000003', 'SOCI 129', 'Introduction to Research Methods', 3, 'CSU/UC transferable sociology research methods course'),
('c0000000-0000-0000-0000-000000000003', 'SOCI 141', 'Race and Ethnicity', 3, 'CSU/UC transferable race and ethnicity course'),
('c0000000-0000-0000-0000-000000000003', 'SOCI 160', 'Sociology of Sex, Gender and Sexuality', 3, 'CSU/UC transferable gender sociology course'),
('c0000000-0000-0000-0000-000000000003', 'SOCI B10', 'Intersectionality and Citizenship', 3, 'Non-transferable intersectionality course')
ON CONFLICT (institution_id, code) DO NOTHING;
