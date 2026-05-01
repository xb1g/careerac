-- Migration 062: Seed tuition data for 2025-26 academic year
-- Sources: UCOP 2025-26 fee schedules, CSU 2025-26 tuition tables,
--          individual campus financial aid pages, CCCCO nonresident tuition reports
--
-- Student type: international (non-resident, non-citizen)
-- Student level: undergraduate
-- Academic year: 2025

-- ===================================================================
-- UNIVERSITY OF CALIFORNIA campuses (10 campuses)
-- UC systemwide tuition + fees for undergrad: ~$15,500
-- Nonresident supplemental tuition: ~$39,270
-- Total UC tuition + fees for international: ~$54,770/year
-- ===================================================================

-- UCB: $56,750 tuition & fees + $28,000 living = $84,750
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 56750, 28000, 84750, 'UC Berkeley - 2025-26 international undergrad on-campus'
FROM institutions WHERE abbreviation = 'UCB'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCLA: $55,976 tuition & fees + $27,000 living = $82,976
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55976, 27000, 82976, 'UCLA - 2025-26 international undergrad on-campus'
FROM institutions WHERE abbreviation = 'UCLA'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCSD: ~$55,500 tuition & fees + $22,000 living = $77,500
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55500, 22000, 77500, 'UC San Diego - 2025-26 international undergrad on-campus'
FROM institutions WHERE abbreviation = 'UCSD'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCD: ~$57,100 tuition & fees + $20,000 living = $77,100
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 57100, 20000, 77100, 'UC Davis - 2025-26 international undergrad on-campus'
FROM institutions WHERE name LIKE '%California, Davis%' AND type = 'university'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCI: ~$55,500 tuition & fees + $22,500 living = $78,000
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55500, 22500, 78000, 'UC Irvine - 2025-26 international undergrad on-campus'
FROM institutions WHERE abbreviation = 'UCI'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCSB: ~$55,500 tuition & fees + $23,000 living = $78,500
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55500, 23000, 78500, 'UC Santa Barbara - 2025-26 international undergrad on-campus'
FROM institutions WHERE abbreviation = 'UCSB'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCSC: ~$55,500 tuition & fees + $23,000 living = $78,500
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55500, 23000, 78500, 'UC Santa Cruz - 2025-26 international undergrad on-campus'
FROM institutions WHERE abbreviation = 'UCSC'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCR: ~$55,500 tuition & fees + $18,000 living = $73,500
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55500, 18000, 73500, 'UC Riverside - 2025-26 international undergrad on-campus'
FROM institutions WHERE name LIKE '%California, Riverside%' AND type = 'university'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- UCM: ~$55,500 tuition & fees + $17,000 living = $72,500
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 55500, 17000, 72500, 'UC Merced - 2025-26 international undergrad on-campus'
FROM institutions WHERE name LIKE '%California, Merced%' AND type = 'university'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- ===================================================================
-- CALIFORNIA STATE UNIVERSITY campuses (23 campuses)
-- CSU systemwide tuition: $6,450/year
-- Nonresident per-unit fee: $444/semester × 2 semesters × 15 units = $13,320/year
-- Total CSU tuition for international: ~$19,770/year
-- ===================================================================

-- Most CSUs: ~$19,770 tuition + $18,000 living = ~$37,770
-- Campuses: Fullerton, Long Beach, Northridge, Sacramento, San Bernardino,
--           Fresno, Dominguez Hills, San Marcos, Stanislaus, Bakersfield,
--           Chico, Channel Islands, East Bay, Monterey Bay, etc.

INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 19770, 18000, 37770, 'CSU - 2025-26 international undergrad standard campus'
FROM institutions
WHERE type = 'university'
  AND abbreviation IN ('CSUF', 'CSULB', 'CSUN', 'Sac State', 'CSUSB', 'CSUEB', 'CSUMB', 'CSUSM', 'CSUS', 'CSUB', 'CSUC', 'CSUCI', 'CSUDH')
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- San Diego State: ~$19,770 tuition + $20,000 living = $39,770 (higher living cost)
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 19770, 20000, 39770, 'San Diego State - 2025-26 international undergrad'
FROM institutions WHERE abbreviation = 'SDSU'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- San Jose State: ~$19,770 tuition + $22,000 living = $41,770 (higher living cost)
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 19770, 22000, 41770, 'San Jose State - 2025-26 international undergrad'
FROM institutions WHERE abbreviation = 'SJSU'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- San Francisco State: ~$19,770 tuition + $22,000 living = $41,770
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 19770, 22000, 41770, 'San Francisco State - 2025-26 international undergrad'
FROM institutions WHERE abbreviation = 'SFSU'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- Cal Poly San Luis Obispo: higher tuition ~$25,770 + $18,000 living = $43,770
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 25770, 18000, 43770, 'Cal Poly SLO - 2025-26 international undergrad'
FROM institutions WHERE name LIKE '%Polytechnic University, San Luis Obispo%'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- Cal Poly Pomona: ~$21,270 + $18,000 living = $39,270
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 21270, 18000, 39270, 'Cal Poly Pomona - 2025-26 international undergrad'
FROM institutions WHERE name LIKE '%Polytechnic University, Pomona%'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- ===================================================================
-- CALIFORNIA COMMUNITY COLLEGES (representative sample + major ones)
-- Nonresident tuition: ~$471/unit × 24 units/year = ~$11,300
-- Health insurance: ~$1,500/year
-- Living expenses: vary by region
-- ===================================================================

-- Los Angeles area CCCs (higher living): ~$11,382 tuition + $24,000 living = $35,382
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 11382, 24000, 35382, 'LA area CCC - 2025-26 international'
FROM institutions
WHERE type = 'cc'
  AND city IN ('Los Angeles', 'Pasadena', 'Glendale', 'Burbank', 'Culver City', 'Santa Monica')
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- Bay Area CCCs (highest living): ~$11,300 tuition + $26,000 living = $37,300
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 11300, 26000, 37300, 'Bay Area CCC - 2025-26 international'
FROM institutions
WHERE type = 'cc'
  AND city IN ('Berkeley', 'San Francisco', 'San Mateo', 'Mountain View', 'Palo Alto', 'Cupertino', 'Fremont')
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- San Diego area CCCs: ~$11,300 tuition + $20,000 living = $31,300
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 11300, 20000, 31300, 'San Diego CCC - 2025-26 international'
FROM institutions
WHERE type = 'cc'
  AND city IN ('San Diego', 'Chula Vista', 'El Cajon')
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- Orange County CCCs: ~$11,300 tuition + $22,000 living = $33,300
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 11300, 22000, 33300, 'Orange County CCC - 2025-26 international'
FROM institutions
WHERE type = 'cc'
  AND city IN ('Costa Mesa', 'Fountain Valley', 'Fullerton', 'Garden Grove', 'Huntington Beach', 'Cypress', 'Orange')
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- Central Valley CCCs (lower living): ~$11,300 tuition + $16,000 living = $27,300
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 11300, 16000, 27300, 'Central Valley CCC - 2025-26 international'
FROM institutions
WHERE type = 'cc'
  AND city IN ('Fresno', 'Bakersfield', 'Madera', 'Merced', 'Visalia', 'Clovis', 'Modesto')
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;

-- Default for all remaining CCs (mid-range living): ~$11,300 tuition + $18,000 living = $29,300
INSERT INTO institution_tuition (institution_id, academic_year, student_type, student_level, tuition_and_fees, living_expenses, total_cost, notes)
SELECT id, 2025, 'international', 'undergraduate', 11300, 18000, 29300, 'CCC - 2025-26 international (default)'
FROM institutions WHERE type = 'cc'
ON CONFLICT (institution_id, academic_year, student_type, student_level) DO UPDATE SET
  tuition_and_fees = EXCLUDED.tuition_and_fees,
  living_expenses = EXCLUDED.living_expenses,
  total_cost = EXCLUDED.total_cost,
  notes = EXCLUDED.notes;
