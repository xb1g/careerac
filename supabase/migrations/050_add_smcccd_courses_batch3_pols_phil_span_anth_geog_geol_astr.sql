-- Migration: 050_add_smcccd_courses_batch3_pols_phil_span_anth_geog_geol_astr.sql
-- Desc: POLS, PHIL, SPAN, ANTH, GEOG, GEOL, ASTR for CSM, Canada, Skyline
-- Generated: 2026-04-20

-- ============================================================
-- CSM - Political Science (7 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'POLS 100', 'Introduction to Political Science', 3, 'CSU/UC transferable political science course'),
('c0000000-0000-0000-0000-000000000001', 'POLS 110', 'Introduction to Comparative Government and Politics', 3, 'CSU/UC transferable comparative government course'),
('c0000000-0000-0000-0000-000000000001', 'POLS 130', 'Introduction to International Relations', 3, 'CSU/UC transferable international relations course'),
('c0000000-0000-0000-0000-000000000001', 'POLS 150', 'Introduction to Political Theory and Thought', 3, 'CSU/UC transferable political theory course'),
('c0000000-0000-0000-0000-000000000001', 'POLS 210', 'American Politics', 3, 'CSU/UC transferable American politics course'),
('c0000000-0000-0000-0000-000000000001', 'POLS 310', 'California State and Local Government', 3, 'CSU/UC transferable state and local government course'),
('c0000000-0000-0000-0000-000000000001', 'POLS C1000', 'Introduction to American Government and Politics', 3, 'CSU/UC transferable American government course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Philosophy (8 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'PHIL 100', 'Introduction to Philosophy', 3, 'CSU/UC transferable philosophy course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 103', 'Critical Thinking and Argumentative Writing', 3, 'CSU/UC transferable critical thinking course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 160', 'History of Ancient Philosophy', 3, 'CSU/UC transferable ancient philosophy course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 175', 'History of Modern Philosophy', 3, 'CSU/UC transferable modern philosophy course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 200', 'Introduction to Logic', 3, 'CSU/UC transferable logic course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 210', 'Symbolic Logic and Argumentative Writing', 3, 'CSU/UC transferable symbolic logic course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 244', 'Introduction to Ethics: Contemporary Social and Moral Issues', 3, 'CSU/UC transferable ethics course'),
('c0000000-0000-0000-0000-000000000001', 'PHIL 300', 'Introduction to World Religions', 3, 'CSU/UC transferable world religions course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Spanish (7 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'SPAN 110', 'Elementary Spanish', 5, 'CSU/UC transferable elementary Spanish course'),
('c0000000-0000-0000-0000-000000000001', 'SPAN 112', 'Elementary Spanish II', 3, 'CSU/UC transferable elementary Spanish course'),
('c0000000-0000-0000-0000-000000000001', 'SPAN 120', 'Advanced Elementary Spanish', 5, 'CSU/UC transferable advanced elementary Spanish course'),
('c0000000-0000-0000-0000-000000000001', 'SPAN 122', 'Advanced Elementary Spanish II', 3, 'CSU/UC transferable advanced elementary Spanish course'),
('c0000000-0000-0000-0000-000000000001', 'SPAN 131', 'Intermediate Spanish I', 3, 'CSU/UC transferable intermediate Spanish course'),
('c0000000-0000-0000-0000-000000000001', 'SPAN 132', 'Intermediate Spanish II', 3, 'CSU/UC transferable intermediate Spanish course'),
('c0000000-0000-0000-0000-000000000001', 'SPAN 140', 'Advanced Intermediate Spanish', 3, 'CSU/UC transferable advanced intermediate Spanish course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Anthropology (5 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'ANTH 110', 'Cultural Anthropology', 3, 'CSU/UC transferable cultural anthropology course'),
('c0000000-0000-0000-0000-000000000001', 'ANTH 125', 'Biological Anthropology', 3, 'CSU/UC transferable biological anthropology course'),
('c0000000-0000-0000-0000-000000000001', 'ANTH 127', 'Biological Anthropology Laboratory', 1, 'CSU/UC transferable biological anthropology lab course'),
('c0000000-0000-0000-0000-000000000001', 'ANTH 180', 'Magic, Science and Religion', 3, 'CSU/UC transferable anthropology course'),
('c0000000-0000-0000-0000-000000000001', 'ANTH 350', 'Introduction to Archaeology and World Prehistory', 3, 'CSU/UC transferable archaeology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Geography (3 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'GEOG 100', 'Physical Geography', 3, 'CSU/UC transferable physical geography course'),
('c0000000-0000-0000-0000-000000000001', 'GEOG 110', 'Cultural Geography', 3, 'CSU/UC transferable cultural geography course'),
('c0000000-0000-0000-0000-000000000001', 'GEOG 150', 'World Regional Geography', 3, 'CSU/UC transferable world regional geography course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Geology (2 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'GEOL 100', 'Survey of Geology', 3, 'CSU/UC transferable geology course'),
('c0000000-0000-0000-0000-000000000001', 'GEOL 101', 'Geology Laboratory', 1, 'CSU/UC transferable geology lab course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- CSM - Astronomy (6 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'ASTR 100', 'Introduction to Astronomy', 3, 'CSU/UC transferable astronomy course'),
('c0000000-0000-0000-0000-000000000001', 'ASTR 101', 'Astronomy Laboratory', 1, 'CSU/UC transferable astronomy lab course'),
('c0000000-0000-0000-0000-000000000001', 'ASTR 103', 'Observational Astronomy Lab', 1, 'CSU/UC transferable observational astronomy lab course'),
('c0000000-0000-0000-0000-000000000001', 'ASTR 115', 'The Solar System', 3, 'CSU/UC transferable solar system course'),
('c0000000-0000-0000-0000-000000000001', 'ASTR 125', 'Stars, Galaxies, and Cosmology', 3, 'CSU/UC transferable stars and galaxies course'),
('c0000000-0000-0000-0000-000000000001', 'ASTR 210', 'Fundamentals of Astrophysics', 4, 'CSU/UC transferable astrophysics course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Political Science (6 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'POLS 103', 'Critical Thinking and Political Analysis', 3, 'CSU/UC transferable critical thinking and political analysis course'),
('c0000000-0000-0000-0000-000000000002', 'POLS 130', 'Introduction to International Relations', 3, 'CSU/UC transferable international relations course'),
('c0000000-0000-0000-0000-000000000002', 'POLS 150', 'Introduction to Political Theory', 3, 'CSU/UC transferable political theory course'),
('c0000000-0000-0000-0000-000000000002', 'POLS 170', 'Introduction to Comparative Politics', 3, 'CSU/UC transferable comparative politics course'),
('c0000000-0000-0000-0000-000000000002', 'POLS 310', 'California State and Local Government', 3, 'CSU/UC transferable state and local government course'),
('c0000000-0000-0000-0000-000000000002', 'POLS C1000', 'American Government and Politics', 3, 'CSU/UC transferable American government course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Philosophy (10 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'PHIL 100', 'Introduction to Philosophy', 3, 'CSU/UC transferable philosophy course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 103', 'Critical Thinking and Argumentative Writing', 3, 'CSU/UC transferable critical thinking course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 160', 'History of Philosophy: Ancient and Medieval', 3, 'CSU/UC transferable ancient and medieval philosophy course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 175', 'Modern Philosophy', 3, 'CSU/UC transferable modern philosophy course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 190', 'Contemporary Philosophy', 3, 'CSU/UC transferable contemporary philosophy course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 200', 'Introduction to Logic', 3, 'CSU/UC transferable logic course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 240', 'Introduction to Ethics', 3, 'CSU/UC transferable ethics course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 300', 'Introduction to World Religions', 3, 'CSU/UC transferable world religions course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 312', 'Introduction to Philosophy of Religion', 3, 'CSU/UC transferable philosophy of religion course'),
('c0000000-0000-0000-0000-000000000002', 'PHIL 695', 'Independent Study', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Spanish (13 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'SPAN 110', 'Elementary Spanish', 5, 'CSU/UC transferable elementary Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 111', 'Elementary Spanish I', 3, 'CSU/UC transferable elementary Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 112', 'Elementary Spanish II', 3, 'CSU/UC transferable elementary Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 120', 'Advanced Elementary Spanish', 5, 'CSU/UC transferable advanced elementary Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 121', 'Advanced Elementary Spanish I', 3, 'CSU/UC transferable advanced elementary Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 122', 'Advanced Elementary Spanish II', 3, 'CSU/UC transferable advanced elementary Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 130', 'Intermediate Spanish', 4, 'CSU/UC transferable intermediate Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 140', 'Advanced Intermediate Spanish', 4, 'CSU/UC transferable advanced intermediate Spanish course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 145', 'Spanish Conversation through Film', 3, 'CSU/UC transferable Spanish conversation course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 162', 'Latino Literature II', 3, 'CSU/UC transferable Latino literature course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 220', 'Spanish for Heritage Speakers I', 4, 'CSU/UC transferable Spanish for heritage speakers course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 230', 'Spanish for Heritage Speakers II', 4, 'CSU/UC transferable Spanish for heritage speakers course'),
('c0000000-0000-0000-0000-000000000002', 'SPAN 695', 'Independent Study', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Anthropology (5 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'ANTH 110', 'Cultural Anthropology', 3, 'CSU/UC transferable cultural anthropology course'),
('c0000000-0000-0000-0000-000000000002', 'ANTH 125', 'Biological Anthropology', 3, 'CSU/UC transferable biological anthropology course'),
('c0000000-0000-0000-0000-000000000002', 'ANTH 126', 'Biological Anthropology Laboratory', 1, 'CSU/UC transferable biological anthropology lab course'),
('c0000000-0000-0000-0000-000000000002', 'ANTH 200', 'Ethnographic Film', 3, 'CSU/UC transferable ethnographic film course'),
('c0000000-0000-0000-0000-000000000002', 'ANTH 351', 'Archaeology', 3, 'CSU/UC transferable archaeology course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Geography (5 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'GEOG 100', 'Physical Geography', 3, 'CSU/UC transferable physical geography course'),
('c0000000-0000-0000-0000-000000000002', 'GEOG 101', 'Physical Geography Lab', 1, 'CSU/UC transferable physical geography lab course'),
('c0000000-0000-0000-0000-000000000002', 'GEOG 110', 'Cultural Geography', 3, 'CSU/UC transferable cultural geography course'),
('c0000000-0000-0000-0000-000000000002', 'GEOG 150', 'World Regional Geography', 3, 'CSU/UC transferable world regional geography course'),
('c0000000-0000-0000-0000-000000000002', 'GEOG 695', 'Independent Study', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Geology (4 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'GEOL 100', 'Introduction to Geology', 3, 'CSU/UC transferable geology course'),
('c0000000-0000-0000-0000-000000000002', 'GEOL 101', 'Geology Laboratory', 1, 'CSU/UC transferable geology lab course'),
('c0000000-0000-0000-0000-000000000002', 'GEOL 121', 'Earth Science', 4, 'CSU/UC transferable earth science course'),
('c0000000-0000-0000-0000-000000000002', 'GEOL 695', 'Independent Study', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Canada - Astronomy (3 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'ASTR 100', 'Introduction to Astronomy', 3, 'CSU/UC transferable astronomy course'),
('c0000000-0000-0000-0000-000000000002', 'ASTR 101', 'Astronomy Laboratory', 1, 'CSU/UC transferable astronomy lab course'),
('c0000000-0000-0000-0000-000000000002', 'ASTR 695', 'Independent Study', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Political Science (6 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'POLS 115', 'Introduction to Comparative Government and Politics', 3, 'CSU/UC transferable comparative government course'),
('c0000000-0000-0000-0000-000000000003', 'POLS 130', 'Introduction to International Relations', 3, 'CSU/UC transferable international relations course'),
('c0000000-0000-0000-0000-000000000003', 'POLS 210', 'American Politics', 3, 'CSU/UC transferable American politics course'),
('c0000000-0000-0000-0000-000000000003', 'POLS 280', 'Introduction to Political Philosophy', 3, 'CSU/UC transferable political philosophy course'),
('c0000000-0000-0000-0000-000000000003', 'POLS 310', 'California State and Local Government', 3, 'CSU/UC transferable state and local government course'),
('c0000000-0000-0000-0000-000000000003', 'POLS C1000', 'American Government and Politics', 3, 'CSU/UC transferable American government course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Philosophy (10 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'PHIL 100', 'Introduction to Philosophy', 3, 'CSU/UC transferable philosophy course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 103', 'Critical Thinking and Argumentative Writing', 3, 'CSU/UC transferable critical thinking course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 160', 'History of Ancient Philosophy', 3, 'CSU/UC transferable ancient philosophy course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 200', 'Introduction to Logic', 3, 'CSU/UC transferable logic course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 210', 'Symbolic Logic and Argumentative Writing', 3, 'CSU/UC transferable symbolic logic course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 240', 'Introduction to Ethics', 3, 'CSU/UC transferable ethics course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 280', 'Introduction to Political Philosophy', 3, 'CSU/UC transferable political philosophy course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 300', 'Introduction to World Religions', 3, 'CSU/UC transferable world religions course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 312', 'Introduction to Philosophy of Religion', 3, 'CSU/UC transferable philosophy of religion course'),
('c0000000-0000-0000-0000-000000000003', 'PHIL 320', 'Asian Philosophy', 3, 'CSU/UC transferable Asian philosophy course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Spanish (8 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'SPAN 110', 'Elementary Spanish', 5, 'CSU/UC transferable elementary Spanish course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 120', 'Advanced Elementary Spanish', 5, 'CSU/UC transferable advanced elementary Spanish course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 130', 'Intermediate Spanish', 4, 'CSU/UC transferable intermediate Spanish course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 140', 'Advanced Intermediate Spanish', 4, 'CSU/UC transferable advanced intermediate Spanish course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 160', 'Readings in Literature in Spanish', 5, 'CSU/UC transferable Spanish literature course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 220', 'Spanish for Spanish Speakers I', 5, 'CSU/UC transferable Spanish for Spanish speakers course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 230', 'Spanish for Spanish Speakers II', 5, 'CSU/UC transferable Spanish for Spanish speakers course'),
('c0000000-0000-0000-0000-000000000003', 'SPAN 695', 'Independent Study in Spanish', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Anthropology (9 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'ANTH 110', 'Cultural Anthropology', 3, 'CSU/UC transferable cultural anthropology course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 125', 'Biological Anthropology', 3, 'CSU/UC transferable biological anthropology course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 127', 'Biological Anthropology Laboratory', 1, 'CSU/UC transferable biological anthropology lab course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 150', 'Introduction to Archaeology: Bones, Beads and the Basics of Material Culture', 3, 'CSU/UC transferable archaeology course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 155', 'Human Prehistory: Discovering Ancient Civilizations', 3, 'CSU/UC transferable human prehistory course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 165', 'Sex and Gender: Cross-Cultural Perspectives', 3, 'CSU/UC transferable anthropology course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 170', 'Anthropology of Death: Cross-Cultural Perspectives', 3, 'CSU/UC transferable anthropology course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 180', 'Magic, Witchcraft and Religion', 3, 'CSU/UC transferable anthropology course'),
('c0000000-0000-0000-0000-000000000003', 'ANTH 360', 'American Indians of North America', 3, 'CSU/UC transferable American Indians course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Geography (6 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'GEOG 100', 'Physical Geography', 3, 'CSU/UC transferable physical geography course'),
('c0000000-0000-0000-0000-000000000003', 'GEOG 101', 'Physical Geography Lab', 1, 'CSU/UC transferable physical geography lab course'),
('c0000000-0000-0000-0000-000000000003', 'GEOG 106', 'Weather and Climate', 4, 'CSU/UC transferable weather and climate course'),
('c0000000-0000-0000-0000-000000000003', 'GEOG 110', 'Cultural Geography', 3, 'CSU/UC transferable cultural geography course'),
('c0000000-0000-0000-0000-000000000003', 'GEOG 150', 'World Regional Geography', 3, 'CSU/UC transferable world regional geography course'),
('c0000000-0000-0000-0000-000000000003', 'GEOG 300', 'Geographic Information Science', 3, 'CSU/UC transferable GIS course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Geology (6 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'GEOL 100', 'Survey of Geology', 3, 'CSU/UC transferable geology course'),
('c0000000-0000-0000-0000-000000000003', 'GEOL 105', 'Environmental Earth Science', 3, 'CSU/UC transferable environmental earth science course'),
('c0000000-0000-0000-0000-000000000003', 'GEOL 106', 'Weather and Climate', 4, 'CSU/UC transferable weather and climate geology course'),
('c0000000-0000-0000-0000-000000000003', 'GEOL 210', 'General Geology', 4, 'CSU/UC transferable general geology course'),
('c0000000-0000-0000-0000-000000000003', 'GEOL 220', 'Historical Geology', 4, 'CSU/UC transferable historical geology course'),
('c0000000-0000-0000-0000-000000000003', 'GEOL 695', 'Independent Study in Geology', 0.5, 'CSU transferable independent study course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- Skyline - Astronomy (2 courses)
-- ============================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'ASTR 100', 'Introduction to Astronomy', 3, 'CSU/UC transferable astronomy course'),
('c0000000-0000-0000-0000-000000000003', 'ASTR 101', 'Astronomy Laboratory', 1, 'CSU/UC transferable astronomy lab course')
ON CONFLICT (institution_id, code) DO NOTHING;
