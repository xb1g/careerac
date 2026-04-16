-- Migration 044: Create majors table and add Art major support
-- This migration creates the majors table and transfer_pathways table
-- Then populates them with existing data and adds Art major

-- ============================================================
-- CREATE MAJORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS majors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT,
    degree_type TEXT,
    total_units INTEGER,
    supported_uc_campuses TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CREATE TRANSFER_PATHWAYS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS transfer_pathways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    major_id UUID REFERENCES majors(id) ON DELETE CASCADE,
    description TEXT,
    common_lower_division_requirements TEXT[] DEFAULT '{}',
    recommended_cc_courses TEXT[] DEFAULT '{}',
    uc_specific_notes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INSERT EXISTING MAJORS (derived from articulation_agreements)
-- ============================================================
INSERT INTO majors (id, name, category, description, degree_type, total_units, supported_uc_campuses)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Computer Science', 'STEM', 'Study of computation, algorithms, programming, and software engineering. Prepares students for careers in software development, AI, data science, and technology.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000002', 'Software Engineering', 'STEM', 'Engineering approach to software development, focusing on design, testing, and maintenance of large software systems.', 'BS', 120, ARRAY['UCI', 'UCLA', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000003', 'Psychology', 'Social Sciences', 'Scientific study of behavior and mental processes. Foundation for careers in mental health, research, human resources, and education.', 'BA', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000004', 'Economics', 'Social Sciences', 'Study of production, distribution, and consumption of goods and services. Prepares students for finance, consulting, policy, and research careers.', 'BA', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000005', 'Biology', 'Biological Sciences', 'Study of living organisms, from molecular biology to ecosystems. Foundation for medicine, research, biotechnology, and environmental science.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000006', 'Business Administration', 'Business', 'Management, finance, marketing, and operations. Prepares students for careers in business leadership, consulting, and entrepreneurship.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCR', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000007', 'Chemistry', 'STEM', 'Study of matter, its properties, and reactions. Foundation for medicine, research, pharmaceuticals, and materials science.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000008', 'Physics', 'STEM', 'Study of matter, energy, and fundamental forces. Foundation for engineering, research, and technology careers.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000009', 'Mathematics', 'STEM', 'Study of numbers, structures, patterns, and logical reasoning. Foundation for finance, technology, research, and education.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000010', 'Data Science', 'STEM', 'Interdisciplinary study of data analysis, statistics, and computation. Prepares students for careers in analytics, ML, and business intelligence.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000011', 'Environmental Science', 'STEM', 'Study of environmental systems and sustainability. Foundation for careers in conservation, policy, and environmental consulting.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCR', 'UCSD', 'UCSB', 'UCSC']),
    ('10000000-0000-0000-0000-000000000012', 'Biochemistry', 'Biological Sciences', 'Study of chemical processes in living organisms. Foundation for medicine, pharmaceuticals, and research.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000013', 'Molecular Biology', 'Biological Sciences', 'Study of biology at the molecular level. Foundation for genetics, biotechnology, and research careers.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000014', 'Aerospace Engineering', 'Engineering', 'Design and development of aircraft and spacecraft. Prepares students for careers in aviation and space industries.', 'BS', 120, ARRAY['UCB', 'UCLA', 'UCSD']),
    ('10000000-0000-0000-0000-000000000015', 'Bioengineering', 'Engineering', 'Application of engineering principles to biological systems. Foundation for medical devices and biotechnology.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD']),
    ('10000000-0000-0000-0000-000000000016', 'Chemical Engineering', 'Engineering', 'Design and operation of chemical processes. Prepares students for careers in energy, materials, and manufacturing.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCLA', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000017', 'Civil Engineering', 'Engineering', 'Design and construction of infrastructure. Prepares students for careers in construction and public works.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD']),
    ('10000000-0000-0000-0000-000000000018', 'Electrical Engineering', 'Engineering', 'Study of electricity, electronics, and electromagnetism. Foundation for technology and energy careers.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000019', 'Mechanical Engineering', 'Engineering', 'Design and manufacturing of mechanical systems. Prepares students for careers in automotive, aerospace, and robotics.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000020', 'Statistics', 'STEM', 'Study of data collection, analysis, and interpretation. Foundation for data science and research careers.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD']),
    ('10000000-0000-0000-0000-000000000021', 'Earth Science/Geology', 'STEM', 'Study of Earth processes and materials. Foundation for careers in environmental science, energy, and research.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCLA', 'UCSD', 'UCSB']),
    ('10000000-0000-0000-0000-000000000022', 'Materials Science', 'Engineering', 'Study of material properties and applications. Foundation for nanotechnology and advanced materials.', 'BS', 120, ARRAY['UCB', 'UCLA', 'UCSD']),
    ('10000000-0000-0000-0000-000000000023', 'Environmental Engineering', 'Engineering', 'Engineering solutions for environmental challenges. Prepares students for sustainability careers.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA']),
    ('10000000-0000-0000-0000-000000000024', 'Cell Biology', 'Biological Sciences', 'Study of cell structure and function. Foundation for molecular biology and biomedical research.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD']),
    ('10000000-0000-0000-0000-000000000025', 'Biological Sciences', 'Biological Sciences', 'Consolidated pathway integrating biology, biochemistry, and molecular biology for fall 2027.', 'BS', 120, ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCM', 'UCR', 'UCSD', 'UCSB', 'UCSC'])
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- ADD ART MAJOR
-- ============================================================
INSERT INTO majors (id, name, category, description, degree_type, total_units, supported_uc_campuses)
VALUES (
    '42000000-0000-0000-0000-000000000042',
    'Art',
    'Arts',
    'Studio Art and fine arts foundation. Develops creative practice, visual thinking, and portfolio for careers in visual arts, design, and creative industries.',
    'BFA/BA',
    120,
    ARRAY['UCB', 'UCD', 'UCI', 'UCLA', 'UCR', 'UCSD', 'UCSB', 'UCSC']
)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- ADD ART COURSES - Santa Monica College
-- ============================================================
INSERT INTO courses (id, institution_id, code, title, units, description)
VALUES
    ('42000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'ART 1', '2D Design', 3, 'Introduction to two-dimensional design principles: line, shape, texture, value, and color'),
    ('42000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'ART 2', '3D Design', 3, 'Introduction to three-dimensional design principles: form, space, volume, and structure'),
    ('42000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ART 4', 'Drawing I', 3, 'Fundamental drawing techniques: line, form, value, composition, and perspective'),
    ('42000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'ART 5', 'Drawing II', 3, 'Advanced drawing with emphasis on figure drawing and expressive techniques'),
    ('42000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'ART 10', 'Art History: Prehistoric to Gothic', 3, 'Survey of Western art from prehistoric through Medieval periods'),
    ('42000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'ART 11', 'Art History: Renaissance to Modern', 3, 'Survey of Western art from Renaissance through Modern periods'),
    ('42000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'ART 20', 'Beginning Painting', 3, 'Introduction to painting techniques, color theory, and composition'),
    ('42000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'ART 21', 'Intermediate Painting', 3, 'Development of personal style and advanced painting techniques')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- ADD ART COURSES - Pasadena City College
-- ============================================================
INSERT INTO courses (id, institution_id, code, title, units, description)
VALUES
    ('42000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', 'ART 1A', 'Drawing and Composition', 3, 'Fundamentals of drawing: line, value, form, and composition'),
    ('42000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000003', 'ART 1B', 'Figure Drawing', 3, 'Drawing the human figure with emphasis on anatomy and gesture'),
    ('42000000-0000-0000-0000-00000000000b', 'a0000000-0000-0000-0000-000000000003', 'ART 2A', '2D Design and Color', 3, 'Design principles and color theory in two-dimensional media'),
    ('42000000-0000-0000-0000-00000000000c', 'a0000000-0000-0000-0000-000000000003', 'ART 3A', '3D Design', 3, 'Three-dimensional design with various materials and techniques'),
    ('42000000-0000-0000-0000-00000000000d', 'a0000000-0000-0000-0000-000000000003', 'ART 6', 'Art History I', 3, 'Ancient art through Medieval period'),
    ('42000000-0000-0000-0000-00000000000e', 'a0000000-0000-0000-0000-000000000003', 'ART 7', 'Art History II', 3, 'Renaissance through Modern art'),
    ('42000000-0000-0000-0000-00000000000f', 'a0000000-0000-0000-0000-000000000003', 'ART 11A', 'Painting I', 3, 'Introduction to painting: color mixing, composition, and technique')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- ADD ART COURSES - Long Beach City College
-- ============================================================
INSERT INTO courses (id, institution_id, code, title, units, description)
VALUES
    ('42000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000006', 'ART 11', 'Introduction to Art', 3, 'Survey of visual arts: drawing, painting, sculpture, and design'),
    ('42000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000006', 'ART 12', '2D Design', 3, 'Two-dimensional design: elements and principles'),
    ('42000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000006', 'ART 13', '3D Design', 3, 'Three-dimensional design with various materials'),
    ('42000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000006', 'ART 20A', 'Drawing I', 3, 'Basic drawing techniques and media'),
    ('42000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000006', 'ART 20B', 'Drawing II', 3, 'Intermediate drawing with emphasis on figure drawing'),
    ('42000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000006', 'ART 30A', 'Painting I', 3, 'Fundamentals of painting: color, composition, technique'),
    ('42000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000006', 'ART 40A', 'Art History: Ancient to Medieval', 3, 'Art history survey from ancient through Medieval periods')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- ADD UC ART COURSES - UCLA
-- ============================================================
INSERT INTO courses (id, institution_id, code, title, units, description)
VALUES
    ('42000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', 'ART 11A', 'Drawing and Composition', 5, 'Fundamental drawing and two-dimensional design'),
    ('42000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000001', 'ART 11B', 'Figure Drawing', 5, 'Drawing the human figure from observation'),
    ('42000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000001', 'ART 13', 'Color Theory', 5, 'Theory and practice of color in art and design'),
    ('42000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000001', 'ART 15', 'Painting I', 5, 'Introduction to painting techniques and concepts'),
    ('42000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000001', 'ART 31A', '3D Media: Form and Space', 5, 'Three-dimensional design and sculpture fundamentals'),
    ('42000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000001', 'AHIS 11', 'Art History: Ancient to Medieval', 5, 'Survey of art history from ancient civilizations through Medieval period'),
    ('42000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000001', 'AHIS 12', 'Art History: Renaissance to Modern', 5, 'Survey of art history from Renaissance through Modern period')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- ADD UC ART COURSES - UC Berkeley
-- ============================================================
INSERT INTO courses (id, institution_id, code, title, units, description)
VALUES
    ('42000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000004', 'ART 8', 'Introduction to Visual Thinking', 4, 'Fundamental concepts of visual communication and design'),
    ('42000000-0000-0000-0000-000000000031', 'b0000000-0000-0000-0000-000000000004', 'ART 12', 'Drawing', 4, 'Basic drawing techniques and visual representation'),
    ('42000000-0000-0000-0000-000000000032', 'b0000000-0000-0000-0000-000000000004', 'ART 14', 'Painting', 4, 'Introduction to painting: color, form, and expression'),
    ('42000000-0000-0000-0000-000000000033', 'b0000000-0000-0000-0000-000000000004', 'ART 16', 'Sculpture', 4, 'Three-dimensional form and spatial design'),
    ('42000000-0000-0000-0000-000000000034', 'b0000000-0000-0000-0000-000000000004', 'HISTART 11', 'Introduction to Western Art', 4, 'Survey of Western art from ancient to contemporary periods')
ON CONFLICT (institution_id, code) DO NOTHING;

-- ============================================================
-- ADD ARTICULATION AGREEMENTS - SMC to UCLA
-- ============================================================
INSERT INTO articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year)
VALUES
    ('42000000-0000-0000-0000-000000000001', '42000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000002', '42000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000003', '42000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000004', '42000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000005', '42000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000006', '42000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000007', '42000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000008', '42000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADD ARTICULATION AGREEMENTS - PCC to UC
-- ============================================================
INSERT INTO articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year)
VALUES
    ('42000000-0000-0000-0000-000000000009', '42000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-00000000000b', '42000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
    ('42000000-0000-0000-0000-00000000000c', '42000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-00000000000d', '42000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-00000000000e', '42000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-00000000000f', '42000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADD ARTICULATION AGREEMENTS - LBCC to UC
-- ============================================================
INSERT INTO articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year)
VALUES
    ('42000000-0000-0000-0000-000000000013', '42000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000012', '42000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000014', '42000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000015', '42000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
    ('42000000-0000-0000-0000-000000000016', '42000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADD TRANSFER PATHWAY FOR ART
-- ============================================================
INSERT INTO transfer_pathways (major_id, description, common_lower_division_requirements, recommended_cc_courses, uc_specific_notes)
VALUES (
    (SELECT id FROM majors WHERE name = 'Art'),
    'Art/Studio Art transfer pathway focuses on building a strong foundation in 2D and 3D design, drawing, art history, and beginning studio work. Portfolio development is key for BFA programs.',
    ARRAY[
        '2D Design (3 units)',
        '3D Design (3 units)',
        'Drawing I and II (6 units)',
        'Art History: Ancient to Modern (6 units)',
        'Beginning Painting (3 units)',
        'Additional studio work (6-9 units)'
    ],
    ARRAY[
        'ART 1: 2D Design',
        'ART 2: 3D Design',
        'ART 4: Drawing I',
        'ART 5: Drawing II (figure drawing recommended)',
        'ART 10/11: Art History sequence',
        'ART 20: Beginning Painting',
        'Additional art electives for portfolio'
    ],
    '{
        "UCLA": "Art 11A/B preferred; strong portfolio critical for studio admission",
        "UCB": "Art 8 and 12 fulfill requirements; emphasis on conceptual development",
        "UC Irvine": "Strong portfolio required; art history fulfills GE requirements",
        "UC Davis": "Comprehensive art program; portfolio review for upper division",
        "General": "Portfolio of 10-20 pieces typically required for BFA programs"
    }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADD PLAYBOOK FOR ART TRANSFER
-- ============================================================
INSERT INTO playbooks (id, institution_id, verified, verified_by, major, pathway_description, courses, advice, timeline, outcome)
VALUES (
    'playbook-art-001',
    'a0000000-0000-0000-0000-000000000001',
    true,
    'CareerAC Team',
    'Art',
    'Santa Monica College → UCLA Art/Studio Art',
    '[
        {"course_code": "ART 1", "title": "2D Design", "units": 3, "grade": "A", "semester": "Fall 2022"},
        {"course_code": "ART 4", "title": "Drawing I", "units": 3, "grade": "A", "semester": "Fall 2022"},
        {"course_code": "ART 10", "title": "Art History I", "units": 3, "grade": "A-", "semester": "Fall 2022"},
        {"course_code": "ART 2", "title": "3D Design", "units": 3, "grade": "A", "semester": "Spring 2023"},
        {"course_code": "ART 5", "title": "Drawing II", "units": 3, "grade": "A", "semester": "Spring 2023"},
        {"course_code": "ART 11", "title": "Art History II", "units": 3, "grade": "A", "semester": "Spring 2023"},
        {"course_code": "ART 20", "title": "Beginning Painting", "units": 3, "grade": "A-", "semester": "Fall 2023"},
        {"course_code": "ART 21", "title": "Intermediate Painting", "units": 3, "grade": "A", "semester": "Spring 2024"}
    ]'::jsonb,
    '[
        "Build your portfolio early - take extra studio classes beyond minimum requirements",
        "Focus on figure drawing - it is the most important skill for art school admission",
        "Document your work professionally as you complete each project",
        "Attend SMC art department portfolio review sessions",
        "Apply to UCLA Art department as soon as possible for priority consideration",
        "Consider supplementing with community art classes for additional portfolio pieces"
    ]'::jsonb,
    '[
        {"semester": "Fall 2022", "milestone": "Foundation courses: 2D Design, Drawing I, Art History I"},
        {"semester": "Spring 2023", "milestone": "Continue foundations: 3D Design, Drawing II, Art History II"},
        {"semester": "Fall 2023", "milestone": "Begin studio work: Painting I, additional drawing"},
        {"semester": "Spring 2024", "milestone": "Advanced studio: Painting II, portfolio preparation"},
        {"semester": "Fall 2024", "milestone": "Apply to UC art programs, finalize portfolio"}
    ]'::jsonb,
    'Successfully transferred to UCLA Art/Studio Art program. Portfolio of 15 pieces accepted. Now pursuing BFA with emphasis in painting and interdisciplinary practice.'
)
ON CONFLICT DO NOTHING;
