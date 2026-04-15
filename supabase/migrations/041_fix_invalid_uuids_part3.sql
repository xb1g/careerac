-- Migration 041: Repair invalid UUID seeds and UCSB/UCI playbooks

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
BEGIN
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'test@example.com'
  LIMIT 1;

  IF test_user_id IS NULL THEN
    RAISE NOTICE 'Test user not found. Run migration 005 first.';
    RETURN;
  END IF;

  UPDATE playbooks
  SET target_institution_id = 'b0000000-0000-0000-0000-000000000008'
  WHERE user_id = test_user_id
    AND cc_institution_id = 'a0000000-0000-0000-0000-000000000006'
    AND target_major = 'Environmental Science'
    AND transfer_year = 2026;

  UPDATE playbooks
  SET target_institution_id = 'b0000000-0000-0000-0000-000000000008'
  WHERE user_id = test_user_id
    AND cc_institution_id = 'a0000000-0000-0000-0000-000000000007'
    AND target_major = 'Biochemistry'
    AND transfer_year = 2024;

  UPDATE playbooks
  SET target_institution_id = 'b0000000-0000-0000-0000-000000000009'
  WHERE user_id = test_user_id
    AND cc_institution_id = 'a0000000-0000-0000-0000-000000000001'
    AND target_major = 'Molecular Biology'
    AND transfer_year = 2024;

  UPDATE playbooks
  SET target_institution_id = 'b0000000-0000-0000-0000-000000000008'
  WHERE user_id = test_user_id
    AND cc_institution_id = 'a0000000-0000-0000-0000-000000000002'
    AND target_major = 'Chemical Engineering'
    AND transfer_year = 2024;
END $$;
