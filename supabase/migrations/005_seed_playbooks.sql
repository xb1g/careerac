-- Migration 005: Seed playbooks with a test user
-- This creates a test user and associated playbooks for testing purposes

-- Enable pgcrypto for password hashing (required for auth.users)
create extension if not exists pgcrypto schema extensions;

-- Create a test user in auth.users (if not exists)
-- This is a seed-only user for testing playbook data
DO $$
DECLARE
  test_user_id uuid;
  smc_id uuid := 'a0000000-0000-0000-0000-000000000001';
  ucla_id uuid := 'b0000000-0000-0000-0000-000000000001';
  de_anza_id uuid := 'a0000000-0000-0000-0000-000000000002';
  sjsu_id uuid := 'b0000000-0000-0000-0000-000000000002';
  pcc_id uuid := 'a0000000-0000-0000-0000-000000000003';
  usc_id uuid := 'b0000000-0000-0000-0000-000000000003';
BEGIN
  -- Check if test user already exists
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;

  -- Create test user if not exists
  IF test_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, invited_at, confirmation_token,
      confirmation_sent_at, recovery_token, recovery_sent_at,
      email_change, email_change_token_new, email_change_sent_at,
      last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, created_at, updated_at, phone, phone_confirmed_at,
      phone_change, phone_change_token, phone_change_sent_at,
      email_change_token_current, email_change_confirm_status,
      banned_until, reauthentication_token, reauthentication_sent_at,
      is_sso_user, deleted_at, is_anonymous
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test@example.com',
      extensions.crypt('TestPassword123!', extensions.gen_salt('bf', 10)),
      now(),
      NULL, '', NULL,
      '', NULL,
      NULL, NULL, NULL,
      NULL,
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test User"}',
      false,
      now(),
      now(),
      NULL, NULL,
      NULL, NULL, NULL,
      NULL, 0,
      NULL, NULL, NULL,
      false, NULL, false
    ) RETURNING id INTO test_user_id;

    -- Also create the profile (trigger should handle this, but be explicit)
    INSERT INTO profiles (id, email, full_name)
    VALUES (test_user_id, 'test@example.com', 'Test User')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Insert Playbook 1: SMC -> UCLA CS (Verified, transferred)
  -- Student had a CS failure and recovered
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    smc_id,
    ucla_id,
    'Computer Science',
    2023,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 1', 'title', 'Introduction to Computer Science I', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 1', 'title', 'Calculus and Analytic Geometry I', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 1', 'title', 'College Composition', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 2', 'title', 'Introduction to Computer Science II', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 2', 'title', 'Calculus and Analytic Geometry II', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'PHYS 1', 'title', 'Physics for Scientists and Engineers I', 'units', 4, 'grade', 'A-')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 3', 'title', 'Intermediate Data Structures in Java', 'units', 4, 'grade', 'B', 'note', 'Retook after failing first attempt'),
            jsonb_build_object('course_code', 'MATH 3', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 2', 'title', 'Physics for Scientists and Engineers II', 'units', 4, 'grade', 'B+')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 4', 'title', 'Assembly Language and Machine Organization', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 4', 'title', 'Linear Algebra and Differential Equations', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 2', 'title', 'Critical Thinking and Argumentation', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 5,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 6', 'title', 'Discrete Structures for Computer Science', 'units', 4, 'grade', 'B+'),
            jsonb_build_object('course_code', 'CS 8', 'title', 'Introduction to Computer Programming for Scientists', 'units', 4, 'grade', 'A-')
          ),
          'total_units', 8
        )
      ),
      'failure_events', jsonb_build_array(
        jsonb_build_object(
          'course_code', 'CS 3',
          'failure_type', 'failed',
          'reason', 'Struggled with Java OOP concepts first time',
          'resolution', 'Retook the course next semester, used office hours and study group',
          'lessons_learned', 'Dont skip office hours, form study groups early'
        )
      ),
      'tips', jsonb_build_array(
        'Start CS sequence in your first semester',
        'Form study groups for CS courses',
        'Take advantage of summer sessions for gen-ed requirements',
        'Visit transfer center early to verify articulation agreements'
      )
    )
  );

  -- Insert Playbook 2: SMC -> UCLA CS (Verified, transferred)
  -- Student had a course cancellation and recovered via summer session
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    smc_id,
    ucla_id,
    'Computer Science',
    2022,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 1', 'title', 'Introduction to Computer Science I', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 1', 'title', 'Calculus and Analytic Geometry I', 'units', 5, 'grade', 'A')
          ),
          'total_units', 9
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 2', 'title', 'Introduction to Computer Science II', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 2', 'title', 'Calculus and Analytic Geometry II', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'ENGL 1', 'title', 'College Composition', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 3', 'title', 'Intermediate Data Structures in Java', 'units', 4, 'grade', 'B+'),
            jsonb_build_object('course_code', 'MATH 3', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'B+', 'note', 'Took in summer session after fall cancellation'),
            jsonb_build_object('course_code', 'PHYS 1', 'title', 'Physics for Scientists and Engineers I', 'units', 4, 'grade', 'A-')
          ),
          'total_units', 13
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 4', 'title', 'Assembly Language and Machine Organization', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 4', 'title', 'Linear Algebra and Differential Equations', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'ENGL 2', 'title', 'Critical Thinking and Argumentation', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        )
      ),
      'failure_events', jsonb_build_array(
        jsonb_build_object(
          'course_code', 'MATH 3',
          'failure_type', 'cancelled',
          'reason', 'Section was cancelled due to low enrollment',
          'resolution', 'Took the course in the following summer session instead',
          'lessons_learned', 'Have backup courses registered, monitor enrollment numbers'
        )
      ),
      'tips', jsonb_build_array(
        'Apply for TAG (Transfer Admission Guarantee) if eligible',
        'Keep a backup plan for every critical course',
        'Join the CS student association for networking and study groups',
        'Start internship applications in junior year of community college'
      )
    )
  );

  -- Insert Playbook 3: De Anza -> SJSU SE (Unverified, in_progress)
  -- Student is currently working through their plan
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    de_anza_id,
    sjsu_id,
    'Software Engineering',
    2026,
    'in_progress',
    'pending',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 1B', 'title', 'Advanced Data Structures in C++', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 1A', 'title', 'Single Variable Calculus', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'ENGL 1A', 'title', 'Reading and Composition', 'units', 4, 'grade', 'A-')
          ),
          'total_units', 14
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 2B', 'title', 'Object-Oriented Data Structures in C++', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 1B', 'title', 'Integration and Infinite Series', 'units', 5, 'grade', 'A'),
            jsonb_build_object('course_code', 'PHYS 4A', 'title', 'Physics for Scientists and Engineers: Mechanics', 'units', 5, 'grade', 'B+')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 2C', 'title', 'Advanced Programming Methodology in Java', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'MATH 1C', 'title', 'Multivariable Calculus', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 4B', 'title', 'Physics for Scientists and Engineers: Electricity and Magnetism', 'units', 5, 'grade', 'B')
          ),
          'total_units', 15
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 2A', 'title', 'Linear Algebra', 'units', 5, 'status', 'in_progress'),
            jsonb_build_object('course_code', 'MATH 2B', 'title', 'Differential Equations', 'units', 5, 'status', 'planned')
          ),
          'total_units', 10
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'De Anza has great CS faculty - take advantage of office hours',
        'SJSU values practical experience - get internships early',
        'Join coding clubs and hackathons for portfolio building'
      )
    )
  );

  -- Insert Playbook 4: PCC -> USC Business (Verified, transferred)
  INSERT INTO playbooks (user_id, cc_institution_id, target_institution_id, target_major, transfer_year, outcome, verification_status, playbook_data)
  VALUES (
    test_user_id,
    pcc_id,
    usc_id,
    'Business Administration',
    2024,
    'transferred',
    'verified',
    jsonb_build_object(
      'semesters', jsonb_build_array(
        jsonb_build_object(
          'number', 1,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 1', 'title', 'Introduction to Computer Science I', 'units', 4, 'grade', 'A-'),
            jsonb_build_object('course_code', 'MATH 180', 'title', 'Calculus I', 'units', 5, 'grade', 'B+'),
            jsonb_build_object('course_code', 'ENGL 101', 'title', 'English Composition', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 2,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 2', 'title', 'Advanced Programming', 'units', 4, 'grade', 'A'),
            jsonb_build_object('course_code', 'MATH 181', 'title', 'Calculus II', 'units', 5, 'grade', 'A-'),
            jsonb_build_object('course_code', 'BUS 101', 'title', 'Introduction to Business', 'units', 3, 'grade', 'A')
          ),
          'total_units', 12
        ),
        jsonb_build_object(
          'number', 3,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'MATH 250', 'title', 'Linear Algebra', 'units', 3, 'grade', 'B+'),
            jsonb_build_object('course_code', 'BUS 201', 'title', 'Business Statistics', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'PHYS 101', 'title', 'General Physics I', 'units', 4, 'grade', 'B')
          ),
          'total_units', 10
        ),
        jsonb_build_object(
          'number', 4,
          'courses', jsonb_build_array(
            jsonb_build_object('course_code', 'CS 3', 'title', 'Computer Organization', 'units', 3, 'grade', 'A-'),
            jsonb_build_object('course_code', 'CS 4', 'title', 'Discrete Mathematics', 'units', 3, 'grade', 'B+')
          ),
          'total_units', 6
        )
      ),
      'failure_events', jsonb_build_array(),
      'tips', jsonb_build_array(
        'USC Marshall is competitive - maintain high GPA',
        'Business networking events at PCC are valuable',
        'Get involved in student business organizations early'
      )
    )
  );

  RAISE NOTICE 'Seed playbooks created for user %', test_user_id;
END $$;
