-- Migration 042: Art / Studio Art major based on UC lower-division studio preparation patterns
-- Note: UC does not publish a dedicated Transfer Pathway page for Studio Art like some other majors.
-- This migration uses common lower-division preparation patterns seen across UC art departments:
-- drawing, 2D design, 3D design, color theory, art history surveys, and portfolio-oriented studio work.

-- ============================================================
-- MAJOR DEFINITION
-- ============================================================
insert into majors (id, name, category, description, degree_type, total_units_required, participating_uc_campuses) values
  ('42000000-0000-0000-0000-000000000042', 'Art', 'Studio Art', 'Fine arts foundation for careers in visual arts, design, and creative industries.', 'BFA/BA', 120, array['UCB', 'UCD', 'UCI', 'UCLA', 'UCSD', 'UCSB'])
on conflict (id) do nothing;

-- ============================================================
-- COURSES - Art / Studio Art (Santa Monica College)
-- Common studio-art foundation sequence
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42100000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'ART 1', 'Drawing I', 3, 'Introduction to observational drawing, line, value, composition, and perspective'),
  ('42100000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'ART 2', 'Two-Dimensional Design', 3, 'Studio foundations in visual organization, composition, and design principles'),
  ('42100000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ART 3', 'Three-Dimensional Design', 3, 'Studio foundations in form, space, structure, and material exploration'),
  ('42100000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'ART 4', 'Color Theory', 3, 'Color systems, interaction, harmony, and applied studio exercises'),
  ('42100000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'ART 10', 'Art History Survey I', 3, 'Survey of global art from prehistory through the Renaissance'),
  ('42100000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'ART 11', 'Art History Survey II', 3, 'Survey of global art from the Renaissance to contemporary practice'),
  ('42100000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'ART 20', 'Painting I', 3, 'Beginning painting with composition, color, and material techniques');

-- ============================================================
-- COURSES - Art / Studio Art (Pasadena City College)
-- Strong Southern California transfer feeder with robust foundation curriculum
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42200000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'ART 1A', 'Drawing and Composition I', 3, 'Foundational drawing with composition, proportion, perspective, and value'),
  ('42200000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'ART 2', 'Two-Dimensional Design', 3, 'Visual design principles using line, shape, texture, and composition'),
  ('42200000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'ART 3', 'Three-Dimensional Design', 3, 'Studio investigation of volume, space, structure, and spatial composition'),
  ('42200000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'ART 4', 'Color Concepts', 3, 'Application of color relationships, interaction, and theory in studio projects'),
  ('42200000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'ART 10', 'History of Western Art I', 3, 'Ancient through medieval art history survey'),
  ('42200000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'ART 11', 'History of Western Art II', 3, 'Renaissance through contemporary art history survey'),
  ('42200000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'ART 20', 'Painting I', 3, 'Introduction to painting media, color, surface, and pictorial structure');

-- ============================================================
-- COURSES - Art / Studio Art (Long Beach City College)
-- Representative community college studio-art sequence
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42300000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'ART 1', 'Drawing I', 3, 'Fundamental studio drawing with line, value, perspective, and composition'),
  ('42300000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'ART 2', 'Two-Dimensional Design', 3, 'Elements and principles of two-dimensional studio design'),
  ('42300000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', 'ART 3', 'Three-Dimensional Design', 3, 'Three-dimensional form, structure, materials, and spatial design'),
  ('42300000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'ART 4', 'Color Theory', 3, 'Color systems and perceptual relationships for visual art practice'),
  ('42300000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'ART 10', 'Art History Survey I', 3, 'Survey of major artistic traditions from prehistory to the Renaissance'),
  ('42300000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'ART 11', 'Art History Survey II', 3, 'Survey of major artistic traditions from the Renaissance to the present'),
  ('42300000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000006', 'ART 20', 'Painting I', 3, 'Beginning painting with acrylic or oil media, color, and composition');

-- ============================================================
-- COURSES - UCLA Art / Art History prep references
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42400000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ART 11A', 'Drawing Fundamentals', 4, 'Foundational drawing, composition, observation, and studio process'),
  ('42400000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'ART 11B', 'Two-Dimensional Design Fundamentals', 4, 'Foundational two-dimensional design concepts and execution'),
  ('42400000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'ART 12', 'Three-Dimensional Design Fundamentals', 4, 'Foundational three-dimensional design and form studies'),
  ('42400000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'ART HIS 10A', 'Art History: Ancient to Renaissance', 5, 'Historical survey of major visual cultures from antiquity through the Renaissance'),
  ('42400000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'ART HIS 10B', 'Art History: Renaissance to Contemporary', 5, 'Historical survey of major visual cultures from the Renaissance to today'),
  ('42400000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'ART 13', 'Color and Painting Foundations', 4, 'Studio practice in color application and introductory painting');

-- ============================================================
-- COURSES - UC Berkeley Art Practice / History of Art prep references
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42500000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'ART 12', 'Foundation Drawing', 4, 'Drawing-based studio fundamentals emphasizing observation and composition'),
  ('42500000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'ART 13', 'Foundation Two-Dimensional Design', 4, 'Visual organization and formal strategies in two-dimensional work'),
  ('42500000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'ART 14', 'Foundation Three-Dimensional Design', 4, 'Three-dimensional design processes, structure, and materials'),
  ('42500000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'HISTART 11', 'Introduction to Western Art I', 4, 'Survey of Western art from antiquity through the late medieval period'),
  ('42500000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'HISTART 12', 'Introduction to Western Art II', 4, 'Survey of Western art from the Renaissance through contemporary practice'),
  ('42500000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 'ART 23', 'Beginning Painting', 4, 'Foundational painting studio with color, surface, and image construction');

-- ============================================================
-- COURSES - UC Irvine Art / Art History prep references
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42600000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'ART 20A', 'Drawing and Representation', 4, 'Drawing foundations focused on observation, structure, and representation'),
  ('42600000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000009', 'ART 21A', 'Design and Color', 4, 'Studio foundations in 2D design, color interaction, and composition'),
  ('42600000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000009', 'ART 22A', 'Three-Dimensional Form', 4, 'Studio foundations in material, space, structure, and 3D composition'),
  ('42600000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000009', 'ARTHIS 40A', 'History of Art I', 4, 'Survey of ancient through early modern art and visual culture'),
  ('42600000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000009', 'ARTHIS 40B', 'History of Art II', 4, 'Survey of modern and contemporary art and visual culture'),
  ('42600000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'ART 30A', 'Painting Foundations', 4, 'Introductory painting with emphasis on composition, color, and studio process');

-- ============================================================
-- COURSES - UC Davis Art Studio / Art History prep references
-- ============================================================
insert into courses (id, institution_id, code, title, units, description) values
  ('42700000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'ART 001', 'Drawing and Composition', 4, 'Foundational drawing and pictorial composition'),
  ('42700000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 'ART 002', 'Design', 4, 'Elements and principles of design for studio art practice'),
  ('42700000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007', 'ART 003', 'Three-Dimensional Design', 4, 'Three-dimensional form, construction, and spatial investigation'),
  ('42700000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 'AHI 001', 'Survey of Western Art I', 4, 'Art history survey from antiquity through the Renaissance'),
  ('42700000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000007', 'AHI 002', 'Survey of Western Art II', 4, 'Art history survey from the Renaissance to the present'),
  ('42700000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000007', 'ART 020', 'Painting', 4, 'Foundational painting methods and pictorial problem-solving');

-- ============================================================
-- TRANSFER PATHWAY REQUIREMENTS
-- Based on common UC studio-art lower-division preparation expectations
-- ============================================================
insert into transfer_pathways (id, major_id, institution_id, requirements) values
  ('42800000-0000-0000-0000-000000000042', '42000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000001', '
## UC Art / Studio Art Transfer Preparation

### UC Pathway Note
UC does not publish a single statewide Transfer Pathway page for Studio Art comparable to majors like Business or Mathematics. Transfer preparation is typically campus-specific, but the most common lower-division pattern is highly consistent across UC art departments.

### Recommended Lower-Division Preparation (18-24 units)

#### Studio Foundations
1. **Drawing I** (3 units) - ART 1
   - Observational drawing, value, perspective, and composition

2. **Two-Dimensional Design** (3 units) - ART 2
   - Core foundation in formal visual organization

3. **Three-Dimensional Design** (3 units) - ART 3
   - Form, structure, material exploration, and space

4. **Color Theory / Color Concepts** (3 units) - ART 4
   - Color relationships, harmony, interaction, and applied studio work

#### Art History
5. **Art History Survey I** (3 units) - ART 10
   - Ancient through Renaissance visual cultures

6. **Art History Survey II** (3 units) - ART 11
   - Renaissance through contemporary art and visual culture

#### Recommended Portfolio-Building Studio Courses
7. **Painting I** (3 units) - ART 20
8. **Life Drawing, Printmaking, Ceramics, Sculpture, or Digital Art** (3-6 units recommended)

### Portfolio Expectations
- Most selective studio-art programs expect a portfolio showing technical control, experimentation, and sustained studio practice.
- Drawing, design, and color work should appear early in the portfolio.
- Strong applicants usually show both foundation work and 1-2 developing areas of emphasis such as painting, illustration, sculpture, ceramics, or digital media.

### Strong Preparation Signals
1. Complete the full foundation sequence before transfer
2. Finish both art history surveys before application review
3. Build a portfolio across multiple media, not only one class project type
4. Participate in critiques, exhibitions, or student showcases
5. Keep course loads balanced so studio classes have enough work time outside class

### Campus Notes
- **UCLA**: Portfolio quality and rigorous foundation work matter heavily
- **UC Berkeley**: Art Practice and History of Art preparation both benefit from art history completion
- **UC Irvine**: Strong emphasis on fundamentals plus conceptual development
- **UC Davis**: Foundation drawing, design, and art history are common prep anchors

### Competitive GPA Guidance
- Minimum UC-transferable GPA: 3.0
- More competitive studio-art applicants often present 3.3-3.7 plus a strong portfolio
');

-- ============================================================
-- ARTICULATION AGREEMENTS - Santa Monica College to UCLA Art
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('42100000-0000-0000-0000-000000000001', '42400000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000002', '42400000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000003', '42400000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000005', '42400000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000006', '42400000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000007', '42400000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Art', 2024);

-- ============================================================
-- ARTICULATION AGREEMENTS - Pasadena City College to UC Berkeley Art
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('42200000-0000-0000-0000-000000000001', '42500000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
  ('42200000-0000-0000-0000-000000000002', '42500000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
  ('42200000-0000-0000-0000-000000000003', '42500000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
  ('42200000-0000-0000-0000-000000000005', '42500000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
  ('42200000-0000-0000-0000-000000000006', '42500000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024),
  ('42200000-0000-0000-0000-000000000007', '42500000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Art', 2024);

-- ============================================================
-- ARTICULATION AGREEMENTS - Long Beach City College to UC Irvine Art
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('42300000-0000-0000-0000-000000000001', '42600000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Art', 2024),
  ('42300000-0000-0000-0000-000000000002', '42600000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Art', 2024),
  ('42300000-0000-0000-0000-000000000003', '42600000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Art', 2024),
  ('42300000-0000-0000-0000-000000000005', '42600000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Art', 2024),
  ('42300000-0000-0000-0000-000000000006', '42600000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Art', 2024),
  ('42300000-0000-0000-0000-000000000007', '42600000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000009', 'Art', 2024);

-- ============================================================
-- ARTICULATION AGREEMENTS - Santa Monica College to UC Davis Art Studio
-- ============================================================
insert into articulation_agreements (cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year) values
  ('42100000-0000-0000-0000-000000000001', '42700000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000002', '42700000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000003', '42700000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000005', '42700000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000006', '42700000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'Art', 2024),
  ('42100000-0000-0000-0000-000000000007', '42700000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'Art', 2024);

-- ============================================================
-- PLAYBOOK - Realistic Art transfer story
-- ============================================================
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'test@example.com'
  LIMIT 1;

  IF test_user_id IS NULL THEN
    RAISE NOTICE 'Test user not found. Run migration 005 first.';
    RETURN;
  END IF;

  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    'a0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'Art',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ART 1A', 'title', 'Drawing and Composition I', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ART 2', 'title', 'Two-Dimensional Design', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 10
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ART 3', 'title', 'Three-Dimensional Design', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ART 4', 'title', 'Color Concepts', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ART 10', 'title', 'History of Western Art I', 'units', 3, 'grade', 'A-')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ART 11', 'title', 'History of Western Art II', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ART 20', 'title', 'Painting I', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHOTO 1', 'title', 'Beginning Photography', 'units', 3, 'grade', 'B+', 'note', 'Used photo assignments to strengthen composition and portfolio variety')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ART 21', 'title', 'Painting II', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ART 35', 'title', 'Portfolio Development', 'units', 3, 'grade', 'A', 'note', 'Refined final portfolio after weekly faculty critique'),
            jsonb_build_object('course_code', 'MUSEUM 1', 'title', 'Museum Studies Seminar', 'units', 2, 'grade', 'A')
          ),
          'total_units', 8
        )
      ),
      'failure_events', jsonb_build_array(
        jsonb_build_object(
          'course_code', 'ART 35',
          'failure_type', 'waitlisted',
          'reason', 'Portfolio development filled on the first registration pass',
          'resolution', 'Took summer open studio hours, stayed in contact with faculty, and added the course the following term',
          'lessons_learned', 'Art transfers need time built in for portfolio revision, not just course completion'
        )
      ),
      'tips', jsonb_build_array(
        'Finish drawing, 2D design, 3D design, color theory, and both art history surveys before the transfer application if possible',
        'Photograph every strong assignment because portfolio assembly takes longer than expected',
        'Use critiques and gallery visits to sharpen your artist statement, not just your technique',
        'Show range in the portfolio, but keep one clear visual direction so reviewers can see artistic growth'
      )
    )
  );
END $$;
