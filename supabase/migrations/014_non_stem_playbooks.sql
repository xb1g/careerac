-- Migration 014: Seed playbooks for non-STEM majors
-- Realistic transfer stories for Psychology, Economics, English, Sociology, History, Political Science, Biology

-- Enable pgcrypto for password hashing (required for auth.users)
create extension if not exists pgcrypto schema extensions;

DO $$
DECLARE
  test_user_id uuid;
  smc_id uuid := 'a0000000-0000-0000-0000-000000000001';
  de_anza_id uuid := 'a0000000-0000-0000-0000-000000000002';
  pcc_id uuid := 'a0000000-0000-0000-0000-000000000003';
  foothill_id uuid := 'a0000000-0000-0000-0000-000000000004';
  bcc_id uuid := 'a0000000-0000-0000-0000-000000000005';
  lbcc_id uuid := 'a0000000-0000-0000-0000-000000000006';
  pierce_id uuid := 'a0000000-0000-0000-0000-000000000007';
  
  ucla_id uuid := 'b0000000-0000-0000-0000-000000000001';
  uc_berkeley_id uuid := 'b0000000-0000-0000-0000-000000000004';
  uc_davis_id uuid := 'b0000000-0000-0000-0000-000000000007';
  uc_san_diego_id uuid := 'b0000000-0000-0000-0000-000000000005';
  usc_id uuid := 'b0000000-0000-0000-0000-000000000003';
BEGIN
  -- Get existing test user
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'Test user not found. Run migration 005 first.';
    RETURN;
  END IF;

  -- Playbook 5: SMC -> UCLA Psychology (Verified, transferred)
  -- Student balanced pre-med requirements with psychology, struggled with calculus
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    smc_id,
    ucla_id,
    'Psychology',
    2023,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'PSYCH 1', 'title', 'Introduction to Psychology', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 1', 'title', 'College Composition', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 1', 'title', 'Calculus and Analytic Geometry I', 'units', 5, 'grade', 'B')
          ),
          'total_units', 11
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'PSYCH 2', 'title', 'Psychology of Personality', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 2', 'title', 'Calculus and Analytic Geometry II', 'units', 5, 'grade', 'B-', 'note', 'Tough semester, got tutoring'),
            jsonb_build_object('course_code', 'BIO 10', 'title', 'Introduction to Biology', 'units', 4, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'PSYCH 5', 'title', 'Abnormal Psychology', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 28', 'title', 'Calculus for the Life Sciences', 'units', 4, 'grade', 'B+'),
            jsonb_build_object('course_code', 'CHEM 11', 'title', 'Introduction to Chemistry', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ANTHRO 1', 'title', 'Introduction to Cultural Anthropology', 'units', 3, 'grade', 'A')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'PSYCH 7', 'title', 'Research Methods in Psychology', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 54', 'title', 'Statistics for Social Sciences', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'PSYCH 3', 'title', 'Social Psychology', 'units', 3, 'grade', 'B+'),
            jsonb_build_object('course_code', 'SOC 1', 'title', 'Introduction to Sociology', 'units', 3, 'grade', 'A-')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'PSYCH 8', 'title', 'Developmental Psychology', 'units', 3, 'grade', 'A', 'note', 'Summer session'),
            jsonb_build_object('course_code', 'ENGL 2', 'title', 'Critical Thinking and Argumentation', 'units', 3, 'grade', 'A')
          ),
          'total_units', 6
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Take calculus early - it opens up so many upper division courses',
        'The psych research methods course at SMC prepares you well for UCLA',
        'Join Psi Beta (psychology honors society) for networking',
        'Consider becoming a research assistant - great for grad school apps',
        'UCLA Psych has amazing faculty - reach out during office hours'
      )
    )
  ) on conflict do nothing;

  -- Playbook 6: De Anza -> UC Berkeley Economics (Verified, transferred)
  -- Student switched from business to econ, found passion in behavioral economics
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    de_anza_id,
    uc_berkeley_id,
    'Economics',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1A', 'title', 'Single Variable Calculus', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CS 46A', 'title', 'Introduction to Programming', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1B', 'title', 'Integration and Infinite Series', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'ECON 1', 'title', 'Principles of Microeconomics', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'CS 46B', 'title', 'Foundations of Software Engineering', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 1C', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ECON 2', 'title', 'Principles of Macroeconomics', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHYS 4A', 'title', 'Physics for Scientists and Engineers: Mechanics', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 2A', 'title', 'Linear Algebra', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ECON 3', 'title', 'Money, Banking and Financial Institutions', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHYS 4B', 'title', 'Physics for Scientists and Engineers: Electricity and Magnetism', 'units', 5, 'grade', 'B')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ECON 5', 'title', 'International Economics', 'units', 4, 'grade', 'A', 'note', 'Changed my life - discovered love of trade theory'),
            jsonb_build_object('course_code', 'ENGL 1B', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A-')
          ),
          'total_units', 8
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Take the full calculus sequence - Berkeley Econ requires multivariable',
        'Learn programming (Python/R) - modern econ is very quantitative',
        'Read Freakonomics and Thinking Fast and Slow for motivation',
        'Join the Economics Club at De Anza',
        'Berkeley Haas is competitive but Econ at LS is excellent too'
      )
    )
  ) on conflict do nothing;

  -- Playbook 7: PCC -> UCLA English (Verified, transferred)
  -- Non-traditional student, worked full-time, pursued creative writing passion
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    pcc_id,
    ucla_id,
    'English',
    2022,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 101', 'title', 'English Composition', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'SPAN 1', 'title', 'Elementary Spanish I', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENGL 1B', 'title', 'English Composition and Literature', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 41', 'title', 'English Literature to 1800', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'SPAN 2', 'title', 'Elementary Spanish II', 'units', 5, 'grade', 'B')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENGL 42', 'title', 'English Literature 1800 to Present', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 43', 'title', 'American Literature to 1865', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'HIST 7A', 'title', 'History of the United States to 1877', 'units', 3, 'grade', 'A')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENGL 44', 'title', 'American Literature 1865 to Present', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 46', 'title', 'Introduction to Shakespeare', 'units', 3, 'grade', 'A', 'note', 'Changed my entire view of literature'),
            jsonb_build_object('course_code', 'HIST 7B', 'title', 'History of the United States Since 1865', 'units', 3, 'grade', 'A-')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENGL 5', 'title', 'Creative Writing', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHIL 1', 'title', 'Introduction to Philosophy', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 6
        ),
        jsonb_build_object(
          'number', 6,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'ENGL 8', 'title', 'Literature of California', 'units', 3, 'grade', 'A')
          ),
          'total_units', 3
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Pace yourself if working full-time - English requires lots of reading',
        'Start Spanish early - UCLA requires 1-2 years',
        'Take honors English courses if available - looks great on apps',
        'Submit to the PCC literary magazine - build your portfolio',
        'UCLA English has amazing creative writing workshops'
      )
    )
  ) on conflict do nothing;

  -- Playbook 8: Foothill -> UC Davis Sociology (In Progress)
  -- First-generation student, planning to study social inequality and policy
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    foothill_id,
    uc_davis_id,
    'Sociology',
    2025,
    'in_progress',
    'pending',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'SOC 1', 'title', 'Introduction to Sociology', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'CS 1A', 'title', 'Introduction to Programming Methodologies in Java', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'SOC 2', 'title', 'Social Problems', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CS 1B', 'title', 'Data Structures and Abstractions in Java', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'MATH 1A', 'title', 'Single Variable Calculus', 'units', 5, 'grade', 'A-')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'SOC 3', 'title', 'Marriage and Family', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'MATH 10', 'title', 'Elementary Statistics', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 1B', 'title', 'Integration and Infinite Series', 'units', 5, 'grade', 'status', 'in_progress')
          ),
          'total_units', 10
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'SOC 10', 'title', 'Race and Ethnic Relations', 'units', 5, 'status', 'planned'),
            jsonb_build_object('course_code', 'PSYCH 1', 'title', 'Introduction to Psychology', 'units', 4, 'status', 'planned'),
            jsonb_build_object('course_code', 'ANTHRO 1', 'title', 'Introduction to Cultural Anthropology', 'units', 4, 'status', 'planned')
          ),
          'total_units', 13
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Foothill has incredible sociology faculty - take advantage of office hours',
        'Statistics is required - take it seriously',
        'Consider double majoring with Data Science - very complementary',
        'Join the Sociology Club and debate current events',
        'UC Davis has great research opportunities in social policy'
      )
    )
  ) on conflict do nothing;

  -- Playbook 9: BCC -> UC Berkeley History (Verified, transferred)
  -- Mature student returning to education, focused on Asian American history
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    bcc_id,
    uc_berkeley_id,
    'History',
    2023,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'HIST 1', 'title', 'History of Western Civilization I', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'HIST 7A', 'title', 'History of the United States to 1877', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A')
          ),
          'total_units', 10
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'HIST 2', 'title', 'History of Western Civilization II', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'HIST 7B', 'title', 'History of the United States Since 1865', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'HIST 12', 'title', 'Introduction to Asian American History', 'units', 3, 'grade', 'A')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'HIST 19', 'title', 'Introduction to Latin American History', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'POLSC 1', 'title', 'American Government', 'units', 3, 'grade', 'B+'),
            jsonb_build_object('course_code', 'GEOG 1', 'title', 'Physical Geography', 'units', 3, 'grade', 'A')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'HIST 25', 'title', 'History of California', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ETHNST 1', 'title', 'Introduction to Ethnic Studies', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ART 4', 'title', 'Art History', 'units', 3, 'grade', 'A-')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'HIST 30', 'title', 'Introduction to World History', 'units', 3, 'grade', 'A')
          ),
          'total_units', 3
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Berkeley City College is amazing - small classes, great faculty',
        'Take the world history sequence early - it is a foundation',
        'Asian American history at BCC with Professor Lee is life-changing',
        'Berkeley History has incredible Asian American Studies faculty',
        'Consider the Berkeley Public History program - amazing internships'
      )
    )
  ) on conflict do nothing;

  -- Playbook 10: LBCC -> UC San Diego Political Science (Verified, transferred)
  -- Pre-law track, interned at city council
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    lbcc_id,
    uc_san_diego_id,
    'Political Science',
    2023,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'POLSC 1', 'title', 'American Government', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 1', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 37', 'title', 'Statistics for the Social Sciences', 'units', 4, 'grade', 'A')
          ),
          'total_units', 11
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'POLSC 2', 'title', 'Introduction to Political Theory', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'POLSC 5', 'title', 'Comparative Government', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ECON 1', 'title', 'Principles of Microeconomics', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'POLSC 7', 'title', 'International Relations', 'units', 3, 'grade', 'A', 'note', 'Favorite class - got me interested in foreign policy'),
            jsonb_build_object('course_code', 'POLSC 10', 'title', 'Introduction to Public Policy', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'HIST 11', 'title', 'World History', 'units', 3, 'grade', 'A')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'POLSC 15', 'title', 'California Politics', 'units', 3, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHIL 2', 'title', 'Introduction to Logic', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'SPAN 1', 'title', 'Elementary Spanish I', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 10
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'SPAN 2', 'title', 'Elementary Spanish II', 'units', 4, 'grade', 'B'),
            jsonb_build_object('course_code', 'SPCH 1', 'title', 'Public Speaking', 'units', 3, 'grade', 'A')
          ),
          'total_units', 7
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'Get involved in student government - crucial for law school apps',
        'Intern at City Hall or with a campaign - real experience matters',
        'Take logic/philosophy courses - LSAT prep is easier',
        'Learn Spanish - essential for CA politics',
        'UCSD Political Science has great IR and American politics faculty'
      )
    )
  ) on conflict do nothing;

  -- Playbook 11: Pierce -> UC Davis Biology (Verified, transferred)
  -- Pre-med track, overcame organic chemistry struggle
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    pierce_id,
    uc_davis_id,
    'Biology',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'BIOL 1', 'title', 'General Biology I', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'CHEM 101', 'title', 'General Chemistry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 261', 'title', 'Calculus I', 'units', 5, 'grade', 'A-')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'BIOL 2', 'title', 'General Biology II', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CHEM 102', 'title', 'General Chemistry II', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'MATH 262', 'title', 'Calculus II', 'units', 5, 'grade', 'B')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 211', 'title', 'Organic Chemistry I', 'units', 5, 'grade', 'B', 'note', 'First O-Chem grade was rough, got tutoring'),
            jsonb_build_object('course_code', 'PHYS 101', 'title', 'General Physics I', 'units', 4, 'grade', 'B+'),
            jsonb_build_object('course_code', 'ENGL 101', 'title', 'Composition', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CHEM 212', 'title', 'Organic Chemistry II', 'units', 5, 'grade', 'B+', 'note', 'Retook concepts and improved'),
            jsonb_build_object('course_code', 'PHYS 102', 'title', 'General Physics II', 'units', 4, 'grade', 'B'),
            jsonb_build_object('course_code', 'PSYCH 1', 'title', 'Introduction to Psychology', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'BIOL 3', 'title', 'Cell Biology', 'units', 4, 'grade', 'A-', 'note', 'Summer session - intense but worth it'),
            jsonb_build_object('course_code', 'CHEM 221', 'title', 'Biochemistry', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 8
        )
      ),
      'failure_events', jsonb_build_array(
        jsonb_build_object(
          'course_code', 'CHEM 211',
          'failure_type', 'failed',
          'reason', 'Struggled with reaction mechanisms and stereochemistry',
          'resolution', 'Worked with tutor, attended office hours, formed study group',
          'lessons_learned', 'Do not wait to get help in O-Chem - it compounds fast'
        )
      ),
      'tips', jsonb_build_array(
        'Organic Chemistry is the weed-out course - start study groups immediately',
        'Pierce has amazing science faculty - Dr. Martinez saved my O-Chem grade',
        'Take physics at the same time as O-Chem to stay on pre-med track',
        'Shadow doctors over summer - reaffirms why you are doing this',
        'UC Davis has incredible pre-med advising - use it early and often'
      )
    )
  ) on conflict do nothing;

  RAISE NOTICE 'Created 7 non-STEM playbooks for test user %', test_user_id;
END $$;
