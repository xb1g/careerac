-- Migration 025: Seed transfer playbooks for newly added STEM majors

insert into institutions (id, name, type, state, city, abbreviation) values
  ('b0000000-0000-0000-0000-000000000008', 'University of California, Santa Barbara', 'university', 'CA', 'Santa Barbara', 'UCSB'),
  ('b0000000-0000-0000-0000-000000000009', 'University of California, Irvine', 'university', 'CA', 'Irvine', 'UCI')
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  state = excluded.state,
  city = excluded.city,
  abbreviation = excluded.abbreviation;

DO $$
DECLARE
  test_user_id uuid;

  smc_id uuid := 'a0000000-0000-0000-0000-000000000001';
  de_anza_id uuid := 'a0000000-0000-0000-0000-000000000002';
  pcc_id uuid := 'a0000000-0000-0000-0000-000000000003';
  foothill_id uuid := 'a0000000-0000-0000-0000-000000000004';
  lbcc_id uuid := 'a0000000-0000-0000-0000-000000000006';
  pierce_id uuid := 'a0000000-0000-0000-0000-000000000007';

  ucla_id uuid := 'b0000000-0000-0000-0000-000000000001';
  uc_berkeley_id uuid := 'b0000000-0000-0000-0000-000000000004';
  uc_davis_id uuid := 'b0000000-0000-0000-0000-000000000007';
  uc_santa_barbara_id uuid := 'b0000000-0000-0000-0000-000000000008';
  uc_irvine_id uuid := 'b0000000-0000-0000-0000-000000000009';
BEGIN
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'test@example.com'
  LIMIT 1;

  IF test_user_id IS NULL THEN
    RAISE NOTICE 'Test user not found. Run migration 005 first.';
    RETURN;
  END IF;

  -- 1) SMC -> UCLA Chemistry
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    smc_id,
    ucla_id,
    'Chemistry',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 11', 'title', 'General Chemistry I', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 28', 'title', 'Calculus I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 12', 'title', 'General Chemistry II', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 29', 'title', 'Calculus II', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'BIO 3', 'title', 'Human Biology', 'units', 4, 'grade', 'A')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 21', 'title', 'Organic Chemistry I', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'PHYS 21', 'title', 'Physics for Scientists and Engineers I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PSYCH 1', 'title', 'Introduction to Psychology', 'units', 3, 'grade', 'A')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 22', 'title', 'Organic Chemistry II', 'units', 5, 'grade', 'B', 'note', 'Retook the lab practical after a rough first midterm'),
            jsonb_build_object('course_code', 'CHEM 23', 'title', 'Organic Chemistry III', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 22', 'title', 'Physics for Scientists and Engineers II', 'units', 5, 'grade', 'A')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 30A', 'title', 'Organic Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CHEM 30B', 'title', 'Organic Chemistry II', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'MATH 33A', 'title', 'Differential Equations', 'units', 4, 'grade', 'A')
          ),
          'total_units', 14
        )
      ),
      'failure_events', jsonb_build_array(
        jsonb_build_object(
          'course_code', 'CHEM 22',
          'failure_type', 'failed',
          'reason', 'Struggled with the organic chemistry lab sequence and missed several technique points on the first attempt',
          'resolution', 'Retook the lab with a stricter notebook routine and weekly tutoring',
          'lessons_learned', 'Lab technique and consistency matter as much as exam prep'
        )
      ),
      'tips', jsonb_build_array(
        'Get into organic lab office hours early because technique points add up fast',
        'Balance pre-med prerequisites with chemistry electives so one hard term does not sink the GPA',
        'Use flashcards for reaction patterns and spectroscopy before every lab practical',
        'Shadow a pharmacist or physician to keep the pre-med motivation real'
      )
    )
  ) on conflict do nothing;

  -- 2) De Anza -> UC Berkeley Physics
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    de_anza_id,
    uc_berkeley_id,
    'Physics',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1A', 'title', 'Calculus I', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHYS 4A', 'title', 'Physics for Scientists and Engineers I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1B', 'title', 'Calculus II', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 4B', 'title', 'Physics for Scientists and Engineers II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'CIS 22A', 'title', 'Java Programming', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1C', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'PHYS 4C', 'title', 'Physics for Scientists and Engineers III', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 1D', 'title', 'Linear Algebra', 'units', 5, 'grade', 'A')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1E', 'title', 'Differential Equations', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 50A', 'title', 'Modern Physics', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'RESEARCH 1', 'title', 'Undergraduate Research Seminar', 'units', 2, 'grade', 'B+')
          ),
          'total_units', 11
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'PHYS 50B', 'title', 'Quantum Mechanics Prep', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 2A', 'title', 'Advanced Linear Algebra', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 8
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Take calculus and mechanics together early so upper-division physics stays manageable',
        'Use tutoring or a study group to get past calc anxiety before it snowballs',
        'Research experience matters a lot, so start talking to faculty by the second semester',
        'Keep one lighter GE each term to protect focus on the math-heavy load'
      )
    )
  ) on conflict do nothing;

  -- 3) Foothill -> UC Davis Mathematics
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    foothill_id,
    uc_davis_id,
    'Mathematics',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1A', 'title', 'Single Variable Calculus I', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'CS 1A', 'title', 'Introduction to Computer Science', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'English Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1B', 'title', 'Single Variable Calculus II', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 1C', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'STAT 10', 'title', 'Introduction to Statistics', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 2A', 'title', 'Linear Algebra', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 2B', 'title', 'Discrete Structures', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 3A', 'title', 'Introduction to Proofs', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 4A', 'title', 'Abstract Algebra', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 4B', 'title', 'Real Analysis', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 5', 'title', 'Tutor Training Practicum', 'units', 2, 'grade', 'A', 'note', 'Started tutoring calculus after proving I could explain the hard stuff')
          ),
          'total_units', 10
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Proof-based classes matter, so start writing full solutions instead of relying on intuition alone',
        'TA or tutoring experience is a strong signal for pure math programs and grad school later',
        'Build comfort with abstraction by taking one proof course before transfer',
        'Keep the course load steady; math transfer is more about consistency than cramming'
      )
    )
  ) on conflict do nothing;

  -- 4) PCC -> UC Berkeley Data Science
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    pcc_id,
    uc_berkeley_id,
    'Data Science',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 1A', 'title', 'Programming Fundamentals in Python', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 5A', 'title', 'Calculus I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'College Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'STAT 50', 'title', 'Introduction to Statistics', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'CS 1B', 'title', 'Data Structures and Algorithms', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 5B', 'title', 'Calculus II', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'DATA 15', 'title', 'Introduction to Data Science and Statistics', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 5C', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CS 2A', 'title', 'Object-Oriented Programming', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 3', 'title', 'Linear Algebra', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'STAT 54', 'title', 'Probability and Statistical Inference', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CS 3B', 'title', 'Applied Data Science Project', 'units', 3, 'grade', 'A', 'note', 'Startup internship turned into a portfolio project')
          ),
          'total_units', 11
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Pair statistics with real projects so you can talk about impact, not just coursework',
        'Start internships early; Berkeley data science loves evidence of applied work',
        'Get comfortable with Python notebooks, SQL, and version control before transfer',
        'A startup internship can be more useful than a perfect GPA if you can explain the learning'
      )
    )
  ) on conflict do nothing;

  -- 5) LBCC -> UC Santa Barbara Environmental Science (in progress)
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    lbcc_id,
    uc_santa_barbara_id,
    'Environmental Science',
    2026,
    'in_progress',
    'pending',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENV 1', 'title', 'Introduction to Environmental Science', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 40', 'title', 'College Algebra and Trigonometry', 'units', 4, 'grade', 'B+'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A-')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 1A', 'title', 'General Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'GEOG 1', 'title', 'Physical Geography', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'SOC 1', 'title', 'Introduction to Sociology', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 11
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENV 12', 'title', 'Climate Change and Society', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'BIO 1', 'title', 'General Biology', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'GEOL 1', 'title', 'Introduction to Geology', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 11
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENV 20', 'title', 'Environmental Policy', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'BIO 2', 'title', 'Ecology', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'FIELD 1', 'title', 'Field Methods in Coastal Ecology', 'units', 2, 'grade', 'A', 'note', 'Weekend field work was the best part of the term')
          ),
          'total_units', 9
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Field methods and lab classes are worth prioritizing because UCSB likes hands-on preparation',
        'Use activism experience as a strength, but pair it with data and policy literacy',
        'Take geology and ecology seriously since environmental science bridges both',
        'Volunteer with local conservation groups so your story shows sustained commitment'
      )
    )
  ) on conflict do nothing;

  -- 6) Pierce -> UC Santa Barbara Biochemistry
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    pierce_id,
    uc_santa_barbara_id,
    'Biochemistry',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 1A', 'title', 'General Chemistry I', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 160', 'title', 'Calculus I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'College Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 1B', 'title', 'General Chemistry II', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'BIO 1', 'title', 'General Biology I', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'STAT 1', 'title', 'Introduction to Statistics', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 12A', 'title', 'Organic Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'BIO 2', 'title', 'General Biology II', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 260', 'title', 'Calculus II', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 12B', 'title', 'Organic Chemistry II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'BIO 3', 'title', 'Cell Biology', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'RESEARCH 2', 'title', 'Biochemistry Lab Research', 'units', 2, 'grade', 'A', 'note', 'Spent every spare hour in the protein purification lab')
          ),
          'total_units', 11
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 12C', 'title', 'Organic Chemistry III', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'BIO 4', 'title', 'Molecular Biology', 'units', 4, 'grade', 'A')
          ),
          'total_units', 9
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Research lab experience is huge for biochemistry, so get in early and stay consistent',
        'Organic chemistry sequencing matters more than people admit, especially for grad school prep',
        'Ask for recommendation letters from lab mentors, not just classroom instructors',
        'Keep your GPA steady; UCSB biochem is demanding but very research-friendly'
      )
    )
  ) on conflict do nothing;

  -- 7) SMC -> UC Irvine Molecular Biology
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    smc_id,
    uc_irvine_id,
    'Molecular Biology',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'BIO 1A', 'title', 'General Biology I with Lab', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'CHEM 11', 'title', 'General Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'BIO 1B', 'title', 'General Biology II with Lab', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CHEM 12', 'title', 'General Chemistry II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 28', 'title', 'Calculus I', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'BIO 1C', 'title', 'General Biology III with Lab', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'CHEM 21', 'title', 'Organic Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 29', 'title', 'Calculus II', 'units', 5, 'grade', 'B')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 22', 'title', 'Organic Chemistry II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'BIO 30', 'title', 'Genetics', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'BIO 31', 'title', 'Cell and Molecular Biology', 'units', 4, 'grade', 'A', 'note', 'Genetics kept the pre-med goal interesting')
          ),
          'total_units', 13
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'For molecular biology, genetics and lab technique are just as important as chemistry',
        'Keep the pre-med track balanced with research or volunteering so the application feels coherent',
        'Document lab protocols carefully; interviewers love students who can explain experiments clearly',
        'Use summer sessions to keep the bio/chem sequence moving without overload'
      )
    )
  ) on conflict do nothing;

  -- 8) De Anza -> UC Santa Barbara Chemical Engineering
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    de_anza_id,
    uc_santa_barbara_id,
    'Chemical Engineering',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1A', 'title', 'Calculus I', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'CHEM 1A', 'title', 'General Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGR 10', 'title', 'Introduction to Engineering', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1B', 'title', 'Calculus II', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CHEM 1B', 'title', 'General Chemistry II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHYS 4A', 'title', 'Physics for Scientists and Engineers I', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1C', 'title', 'Calculus III', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'CHEM 12A', 'title', 'Organic Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 4B', 'title', 'Physics for Scientists and Engineers II', 'units', 5, 'grade', 'B')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1D', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CHEM 12B', 'title', 'Organic Chemistry II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGR 14', 'title', 'Introduction to MATLAB for Engineers', 'units', 4, 'grade', 'A', 'note', 'MATLAB helped bridge theory and process modeling')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1F', 'title', 'Differential Equations', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CHEM 12C', 'title', 'Organic Chemistry III', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'IND 1', 'title', 'Industrial Process Internship', 'units', 2, 'grade', 'A')
          ),
          'total_units', 12
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Process engineering becomes much easier once you learn to model systems in MATLAB early',
        'Industry internships help a ton because UCSB chemical engineering is very applied',
        'Do not let one hard physics term derail the math sequence; keep moving',
        'Chemical engineering rewards consistency more than raw speed, so pace your weeks carefully'
      )
    )
  ) on conflict do nothing;

  RAISE NOTICE 'Seeded 8 new major playbooks for user %', test_user_id;
END $$;
