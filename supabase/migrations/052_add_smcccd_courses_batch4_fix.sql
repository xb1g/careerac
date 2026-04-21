-- Migration: 052_add_smcccd_courses_batch4_fix.sql
-- Desc: ETHN, ESL/ESOL, FITN, KINE, FILM, DRAM for CSM, Canada, Skyline
-- This migration fixes the UUID format issue from 051
-- Using RFC 4122 compliant UUIDs

-- ============================================================
-- CSM - Ethnic Studies (14 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'ETHN 101', 'Latin American and Indigenous Peoples History and Culture', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 103', 'Asian Americans and US Institutions', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 104', 'Asian Pacific Islanders in United States History and Culture', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 105', 'African American History and Culture', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 106', 'Oceania & the Arts', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 107', 'Introduction to Native American Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 108', 'Rethinking Race, Gender, and Nation', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 109', 'Borders and Crossings', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 110', 'Latinx Communities and U.S. Institutions', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 122', 'Black Leadership Theory', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 123', 'Black Leadership Practicum', 3, 'CSU transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 265', 'Evolution of Hip Hop Culture: A Socio-Economic And Political Perspective', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 288', 'African-American Cinema', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 300', 'Introduction to La Raza Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000001', 'ETHN 585', 'Ethnicity in Cinema', 3, 'CSU/UC transferable ethnic studies course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - English Second Language (35 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'ESL 400', 'Critical Reading and Writing for Multilingual Students', 5, 'CSU/UC transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 401', 'Advanced Englishes through World Cultures', 4, 'CSU/UC transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 810', 'Phonics for Multilingual Speakers', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 825', 'Writing for Multilingual Students I', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 826', 'Writing for Multilingual Students II', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 827', 'Writing for Multilingual Students III', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 828', 'Writing for Multilingual Students IV', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 835', 'ESL for Parents of Elementary School Children', 2, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 845', 'Listening and Speaking I', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 846', 'Listening and Speaking II', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 847', 'Listening and Speaking III', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 848', 'Listening and Speaking IV for Multilingual Students: Advanced', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 849', 'Intermediate Listening and Speaking Workshop', 0.5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 855', 'Reading for Multilingual Students I', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 856', 'Reading for Multilingual Students II', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 857', 'Reading for Multilingual Students III', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 858', 'Reading for Multilingual Students IV', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 865', 'Advanced Listening and Speaking Workshop', 0.5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 887', 'Pronunciation of English Consonants and Vowels', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 888', 'Pronunciation of English Stress, Rhythm and Intonation', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 895', 'Intermediate Reading Improvement for Multilingual Students', 0.5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 897', 'Intermediate Vocabulary for Multilingual Students', 1, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 898', 'Comprehensive Grammar Review for Multilingual Students', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 899', 'Advanced Reading Improvement for Multilingual Students', 0.5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 907', 'Independent Writing Study-Intermediate ESL', 1, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 908', 'Independent Writing Study-Advanced ESL', 1, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 925', 'Writing for Multilingual Students I (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 926', 'Writing for Multilingual Students II (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 927', 'Writing for Multilingual Students III (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 945', 'Listening and Speaking I (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 946', 'Listening and Speaking II (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 947', 'Listening and Speaking III (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 955', 'Reading for Multilingual Students I (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 956', 'Reading for Multilingual Students II (Noncredit)', 0, 'Non-credit ESL course'),
('c0000000-0000-0000-0000-000000000001', 'ESL 957', 'Reading for Multilingual Students III (Noncredit)', 0, 'Non-credit ESL course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Fitness (32 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'FITN 116.1', 'Body Conditioning I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 116.2', 'Body Conditioning II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 116.3', 'Body Conditioning III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 116.4', 'Body Conditioning IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 134', 'Track and Trail Aerobics', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 201.1', 'Weight Training I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 201.2', 'Weight Training II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 201.3', 'Weight Training III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 201.4', 'Weight Training IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 220', 'Weight Conditioning for Varsity Football', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 225', 'Athletic Conditioning', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 226', 'Plyometric Conditioning', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 301.1', 'Indoor Cycling I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 301.2', 'Indoor Cycling II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 301.3', 'Indoor Cycling III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 301.4', 'Indoor Cycling IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 332.1', 'Stretching and Flexibility I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 332.2', 'Stretching and Flexibility II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 332.3', 'Stretching and Flexibility III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 332.4', 'Stretching and Flexibility IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 334.1', 'Yoga I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 334.2', 'Yoga II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 334.3', 'Yoga III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 334.4', 'Yoga IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 335.1', 'Pilates I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 335.2', 'Pilates II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 335.3', 'Pilates III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 335.4', 'Pilates IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 336.1', 'Restorative Yoga I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 336.2', 'Restorative Yoga II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 336.3', 'Restorative Yoga III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000001', 'FITN 336.4', 'Restorative Yoga IV', 1, 'CSU/UC transferable fitness course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Kinesiology (22 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'KINE 101', 'Introduction to Kinesiology', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 102', 'Introduction to Coaching Principles', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 103', 'Social Issues in Sport', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 106', 'Introduction to Sports Management', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 107', 'Women in Sports', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 119', 'First Aid/Adult & Pediatric CPR', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 125', 'Pilates Mat Instructor Training', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 126', 'Pilates Reformer Instructor Training', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 127', 'Pilates Apparatus Instructor Training', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 135', 'Academic Skill Development for Intercollegiate Athletes I', 2, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 136', 'Academic Skill Development for Intercollegiate Athletes II', 2, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 190', 'Baseball Theory: Defense', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 191', 'Baseball Theory: Offense', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 200', 'Yoga History and Culture', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 201', 'Yoga Pedagogy Lecture', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 202', 'Yoga Asana Studies', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 203', 'Yoga Pedagogy Research 1', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 204', 'Advanced Yoga Pedagogy & Philosophy', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 205', 'Advanced Yoga Asana', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 206', 'Yoga Pedagogy Research 2', 2, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 300', 'Anatomy of Motion', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000001', 'KINE 301', 'Introduction to Personal Training', 3, 'CSU transferable kinesiology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Film (14 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'FILM 100', 'Introduction to Film', 3, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 120', 'Film History I', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 121', 'Film History II', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 122', 'Film History Focus', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 123', 'Documentary Film: Studies and Practice', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 130', 'Film Directors', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 135', 'Film Genres', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 140', 'Contemporary World Cinema', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 145', 'Watching Quality Television', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 153', 'Screenwriting', 3, 'CSU transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 154', 'Expanded Scriptwriting Skills', 3, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 200', 'Women and Film', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 215', 'Film and New Digital Media', 4, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000001', 'FILM 277', 'Film and Literature', 3, 'CSU transferable film course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Ethnic Studies (8 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'ETHN 103', 'Asian American Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 105', 'African American History and Culture', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 107', 'Introduction to Native American Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 108', 'Rethinking Race, Gender, and Nation', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 109', 'Borders and Crossings', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 130', 'Introduction to Latinx Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 265', 'Evolution of Hip Hop Culture: A Socio-Economic and Political Perspective', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000002', 'ETHN 288', 'African-American Cinema', 3, 'CSU/UC transferable ethnic studies course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - English as a Second Language (13 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'ESL 400', 'Composition for Multilingual Students', 5, 'CSU/UC transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 800', 'ESL Preparatory Course', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 808', 'Intensive Grammar Review', 3, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 836', 'English Pronunciation', 2, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 837', 'Intermediate Vocabulary Development', 2, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 911', 'Reading and Listening-Speaking I', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 912', 'Reading and Listening-Speaking II', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 913', 'Reading and Listening - Speaking III', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 914', 'Reading and Listening - Speaking IV', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 921', 'Grammar and Writing I', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 922', 'Grammar and Writing II', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 923', 'Grammar and Writing III', 5, 'Non-transferable ESL course'),
('c0000000-0000-0000-0000-000000000002', 'ESL 924', 'Grammar and Writing IV', 5, 'Non-transferable ESL course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Fitness (36 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'FITN 112', 'Cross-Training', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 117', 'Fitness Assessment, Strength and Conditioning', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 118', 'Beginning Fitness Center', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 119', 'Intermediate Fitness Center', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 122', 'Total Body Burn', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 128.1', 'Core Strength and Functional Training I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 128.2', 'Core Strength and Functional Training II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 128.3', 'Core Strength and Functional Training III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 128.4', 'Core Strength and Functional Training IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 152', 'Basketball Conditioning', 1.5, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 153', 'Soccer Conditioning', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 154', 'Volleyball Conditioning', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 210', 'Varsity Weight Conditioning', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 227.1', 'TRX Suspension Training I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 227.2', 'TRX Suspension Training II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 227.3', 'TRX Suspension Training III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 227.4', 'TRX Suspension Training IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 235', 'Boot Camp', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 301.1', 'Spinning I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 301.2', 'Spinning II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 301.3', 'Spinning III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 304.1', 'Walking Fitness I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 304.2', 'Walking Fitness II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 304.3', 'Walking Fitness III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 304.4', 'Walking Fitness IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 308.1', 'Hiking and Trekking for Fitness I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 332.1', 'Flexibility and Stretching I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 332.2', 'Flexibility and Stretching II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 334.1', 'Yoga I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 334.2', 'Yoga II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 334.3', 'Yoga III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 334.4', 'Yoga IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 335.1', 'Pilates I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 335.2', 'Pilates II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 335.3', 'Pilates III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000002', 'FITN 335.4', 'Pilates IV', 1, 'CSU/UC transferable fitness course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Kinesiology (6 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'KINE 101', 'Introduction to Kinesiology', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000002', 'KINE 105', 'Stress Management', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000002', 'KINE 109', 'Lifetime Fitness and Nutrition', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000002', 'KINE 119', 'First Aid/Adult and Pediatric CPR/AED', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000002', 'KINE 137', 'Student-Athlete Skills for Success, First Year', 1, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000002', 'KINE 138', 'Student-Athlete Skills for Success, Second Year', 1, 'CSU transferable kinesiology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Theatre Arts / Drama (13 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'DRAM 101', 'History of Theatre', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 140', 'Introduction to the Theatre', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 150', 'Script Analysis', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 151', 'Introduction to Shakespeare I', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 200', 'Acting I: Acting For the Stage and the Camera', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 201', 'Acting II', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 233', 'Introduction to New Play Development', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 300.1', 'Rehearsal and Performance I', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 300.2', 'Rehearsal and Performance II', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 300.3', 'Rehearsal and Performance III', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 300.4', 'Rehearsal and Performance IV', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 305', 'Technical Production I', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000002', 'DRAM 695', 'Independent Study', 3, 'CSU transferable drama course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Ethnic Studies (12 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'ETHN 101', 'Latin American and Indigenous Peoples History and Culture', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 103', 'Asian Americans and US Institutions', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 105', 'African American History and Culture', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 107', 'Introduction to Native American Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 108', 'Rethinking Race, Gender, and Nation', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 109', 'Borders and Crossings', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 120', 'Introduction to Black Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 130', 'Introduction to Latina/o/x Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 140', 'Introduction to Asian and Pacific Islander American Studies', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 142', 'Filipina/o/x Community Issues', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 265', 'Evolution of Hip Hop Culture: A Socio-Economic and Political Perspective', 3, 'CSU/UC transferable ethnic studies course'),
('c0000000-0000-0000-0000-000000000003', 'ETHN 288', 'African American Cinema', 3, 'CSU/UC transferable ethnic studies course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - English for Speakers of Other Languages (13 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'ESOL 400', 'Critical Reading & Writing for Multilingual Speakers', 5, 'CSU/UC transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 530', 'English for Speakers of Other Languages III (Noncredit)', 0, 'Non-credit ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 553', 'Intermediate ESL Listening & Speaking (Noncredit)', 0, 'Non-credit ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 573', 'Intermediate ESL Grammar (Noncredit)', 0, 'Non-credit ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 802', 'Intermediate Conversational English', 2, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 820', 'English for Speakers of Other Languages II', 6, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 830', 'English for Speakers of Other Languages III', 6, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 840', 'English for Speakers of Other Languages IV', 6, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 853', 'Intermediate ESL Listening & Speaking', 4, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 854', 'High-Intermediate ESL Listening & Speaking', 4, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 873', 'Intermediate ESL Grammar', 3, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 874', 'High-Intermediate ESL Grammar', 3, 'Non-transferable ESOL course'),
('c0000000-0000-0000-0000-000000000003', 'ESOL 875', 'Advanced ESL Grammar and Editing', 3, 'Non-transferable ESOL course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Kinesiology Fitness (47 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'FITN 106', 'Varsity Conditioning', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 107', 'Intercollegiate Fitness', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 112.1', 'Cross Training I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 112.2', 'Cross Training II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 112.3', 'Cross Training III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 112.4', 'Cross Training IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 116.1', 'Body Conditioning I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 116.2', 'Body Conditioning II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 116.3', 'Body Conditioning III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 116.4', 'Body Conditioning IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 199.1', 'Interactive Cardiovascular Fitness I', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 199.2', 'Interactive Cardiovascular Fitness II', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 201.1', 'Weight Training I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 201.2', 'Weight Training II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 201.3', 'Weight Training III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 201.4', 'Weight Training IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 219.1', 'Core Fitness Training I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 219.2', 'Core Fitness Training II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 219.3', 'Core Fitness Training III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 219.4', 'Core Fitness Training IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 301.1', 'Indoor Cycling I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 301.2', 'Indoor Cycling II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 301.3', 'Indoor Cycling III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 301.4', 'Indoor Cycling IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 304.1', 'Walking Fitness I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 304.2', 'Walking Fitness II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 304.3', 'Walking Fitness III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 304.4', 'Walking Fitness IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 305.1', 'Cardiovascular Development - Running Emphasis I', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 305.2', 'Cardiovascular Development - Running Emphasis II', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 305.3', 'Cardiovascular Development - Running Emphasis III', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 305.4', 'Cardiovascular Development - Running Emphasis IV', 2, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 332.1', 'Stretching and Flexibility I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 332.2', 'Stretching and Flexibility II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 332.3', 'Stretching and Flexibility III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 332.4', 'Stretching and Flexibility IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 334.1', 'Yoga I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 334.2', 'Yoga II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 334.3', 'Yoga III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 334.4', 'Yoga IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 335.1', 'Pilates I', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 335.2', 'Pilates II', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 335.3', 'Pilates III', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 335.4', 'Pilates IV', 1, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 400.1', 'Fitness Academy I', 3, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 400.2', 'Fitness Academy II', 3, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 400.3', 'Fitness Academy III', 3, 'CSU/UC transferable fitness course'),
('c0000000-0000-0000-0000-000000000003', 'FITN 400.4', 'Fitness Academy IV', 3, 'CSU/UC transferable fitness course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Kinesiology (7 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'KINE 101', 'Introduction to Kinesiology', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000003', 'KINE 301', 'Introduction to Personal Training', 3, 'CSU transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000003', 'KINE 302', 'Introduction to Sport Nutrition', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000003', 'KINE 305', 'Health-Related Fitness and Wellness', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000003', 'KINE 330', 'Introduction to Sports Psychology', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000003', 'KINE 510', 'Sport, Movement and Film', 3, 'CSU/UC transferable kinesiology course'),
('c0000000-0000-0000-0000-000000000003', 'KINE 695', 'Independent Study in Kinesiology', 3, 'CSU transferable kinesiology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Film (2 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'FILM 100', 'Introduction to Film', 3, 'CSU/UC transferable film course'),
('c0000000-0000-0000-0000-000000000003', 'FILM 123', 'Documentary Film: Studies and Practice', 4, 'CSU/UC transferable film course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Drama (19 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'DRAM 140', 'Introduction to Theatre', 3, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 200', 'Acting I', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 201', 'Acting II', 3, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 208', 'Acting Practicum I (Acting Laboratory)', 2, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 209', 'Acting Practicum II (Acting Laboratory)', 2, 'CSU/UC transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 300.1', 'Rehearsal and Production: Drama I', 3, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 300.2', 'Rehearsal and Production: Drama II', 3, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 300.3', 'Rehearsal and Production: Drama III', 3, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 300.4', 'Rehearsal and Production: Drama IV', 3, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 301.1', 'Rehearsal and Production: Musical Theater I', 2, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 301.2', 'Rehearsal and Production: Musical Theater II', 2, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 301.3', 'Rehearsal and Production: Musical Theater III', 2, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 301.4', 'Rehearsal and Production: Musical Theater IV', 2, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 302.1', 'Technical Theater in Production I', 1, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 302.2', 'Technical Theater in Production II', 1, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 302.3', 'Technical Theater in Production III', 1, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 302.4', 'Technical Theater in Production IV', 1, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 312', 'Introduction to Stage Lighting', 3, 'CSU transferable drama course'),
('c0000000-0000-0000-0000-000000000003', 'DRAM 313', 'Stagecraft', 3, 'CSU/UC transferable drama course')
ON CONFLICT (institution_id, code) DO NOTHING;
