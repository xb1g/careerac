-- Migration 045: Add SMCCCD colleges to institutions
-- College of San Mateo, Cañada College, Skyline College

INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'College of San Mateo', 'cc', 'CA', 'San Mateo', 'CSM'),
  ('c0000000-0000-0000-0000-000000000002', 'Cañada College', 'cc', 'CA', 'Redwood City', 'Canada'),
  ('c0000000-0000-0000-0000-000000000003', 'Skyline College', 'cc', 'CA', 'San Bruno', 'Skyline')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ADD COMMUNITY SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS community_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL, -- 'academic_support', 'financial_aid', 'support_programs', 'basic_needs', 'transfer', 'career', 'health_wellness', 'special_populations'
  service_name TEXT NOT NULL,
  service_code TEXT, -- short code like EOPS, SAS, DRC
  description TEXT,
  eligibility TEXT,
  benefits TEXT[],
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  office_location TEXT,
  website_url TEXT,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, service_code)
);

-- ============================================================
-- INSERT CSM SERVICES
-- ============================================================
INSERT INTO community_services (institution_id, service_category, service_name, service_code, description, benefits, contact_email, contact_phone, office_location, website_url, is_free) VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'support_programs',
    'Extended Opportunity Programs & Services',
    'EOPS',
    'Support service for full-time students who need additional services to successfully pursue their educational and vocational goals',
    ARRAY['Priority registration', 'Counseling', 'Book vouchers', 'Transportation', 'Tutoring', 'Peer advising'],
    'csmeops@smccd.edu',
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/eops',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'basic_needs',
    'SparkPoint',
    'SparkPoint',
    'Financial empowerment and basic needs support - financial coaching, free groceries, housing support, tax prep, CalFresh enrollment',
    ARRAY['Financial coaching', 'Free groceries (Second Harvest)', 'Housing support', 'Free tax preparation (VITA)', 'CalFresh enrollment', 'SamTrans bus pass', 'Personal care products'],
    'csmsparkpoint@smccd.edu',
    '(650) 378-7275',
    'Building 17, Room 154',
    'https://collegeofsanmateo.edu/sparkpoint',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'transfer',
    'Transfer Services',
    'Transfer',
    'Assists students in planning transfer to UC, CSU, and private universities. Workshops, transfer admission agreements, UC TAG, ADT degrees.',
    ARRAY['Transfer workshops', 'University rep visits', 'Transfer admission agreements', 'UC TAG', 'ADT degrees', 'Transfer Club'],
    'csmtransfer@smccd.edu',
    NULL,
    'College Center Building 10, Room 340',
    'https://collegeofsanmateo.edu/transfer',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'financial_aid',
    'Financial Aid Services',
    'Finaid',
    'Administers federal and state financial aid including Pell Grants, Cal Grants, Federal Work Study, and scholarships',
    ARRAY['FAFSA assistance', 'Pell Grants', 'Cal Grants', 'Federal Work Study', 'Scholarships', 'Fee waivers (SB 893)'],
    'csmfinancialaid@smccd.edu',
    '(650) 574-6146',
    'College Center Building 10, Room 360',
    'https://collegeofsanmateo.edu/finaid',
    false
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'academic_support',
    'Learning Center',
    'LearningCenter',
    'Peer and professional tutoring, academic support services',
    ARRAY['Tutoring', 'Academic support', 'Study resources'],
    NULL,
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/learningcenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'special_populations',
    'Veterans Services',
    'Veterans',
    'Support for student veterans and military-connected students',
    ARRAY['VA benefits assistance', 'Academic counseling', 'Peer support'],
    NULL,
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/veterans',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'support_programs',
    'Promise Scholars Program',
    'Promise',
    'First-time, full-time student support program with financial support and counseling',
    ARRAY['Financial support', 'Personalized counseling', 'Priority enrollment', 'Events and workshops'],
    NULL,
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/promise',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'special_populations',
    'Undocumented Community Center',
    'UCC',
    'Safe haven space for undocumented students and allies',
    ARRAY['Safe space', 'Academic support', 'Financial resources', 'Community building'],
    NULL,
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/ucc',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'special_populations',
    'Multicultural Center',
    'MCC',
    'Safe space for underrepresented students rooted in social justice and community empowerment',
    ARRAY['Safe space', 'Social justice programs', 'Community empowerment', 'Advocacy'],
    NULL,
    NULL,
    NULL,
    'http://collegeofsanmateo.edu/mcc',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'health_wellness',
    'Wellness Center',
    'Wellness',
    'Health services, personal counseling, wellness programs',
    ARRAY['Health services', 'Personal counseling', 'Wellness programs'],
    NULL,
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/wellnesscenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'support_programs',
    'CalWORKs',
    'CalWORKs',
    'Support for welfare-to-work transitional students',
    ARRAY['Welfare-to-work support', 'Counseling', 'Priority registration'],
    NULL,
    NULL,
    NULL,
    'http://collegeofsanmateo.edu/calworks',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000001',
    'academic_support',
    'Disability Resource Center',
    'DRC',
    'Services for students with verified physical, psychological and specific learning disabilities',
    ARRAY['Test accommodations', 'Alternative media', 'Assistive technologies', 'Academic accommodations'],
    NULL,
    NULL,
    NULL,
    'https://collegeofsanmateo.edu/drc',
    true
  )
ON CONFLICT (institution_id, service_code) DO NOTHING;

-- ============================================================
-- INSERT CAÑADA COLLEGE SERVICES
-- ============================================================
INSERT INTO community_services (institution_id, service_category, service_name, service_code, description, contact_email, website_url, is_free) VALUES
  (
    'c0000000-0000-0000-0000-000000000002',
    'basic_needs',
    'SparkPoint',
    'SparkPoint',
    'Food lockers, weekly food distributions, housing resources, financial education, CalFresh enrollment',
    'CANSparkpoint@smccd.edu',
    'https://canadacollege.edu/sparkpoint',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'transfer',
    'Transfer Center (COLTS-U)',
    'Transfer',
    'UC TAG, CSU transfer, ADT degrees, application workshops, university rep meetings',
    NULL,
    'https://canadacollege.edu/transfercenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'transfer',
    'UC Transfer Admission Guarantee',
    'TAG',
    'Guaranteed admission to UC campuses for qualifying students',
    NULL,
    'https://canadacollege.edu/transfercenter/tag.php',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'financial_aid',
    'Financial Aid',
    'Finaid',
    'Grants, scholarships, work study, and loans. Cost calculator available.',
    NULL,
    'https://canadacollege.edu/financialaid',
    false
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'academic_support',
    'Learning Center',
    'LearningCenter',
    'Online tutoring services, learning support, professional tutoring',
    NULL,
    'https://canadacollege.edu/learningcenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'special_populations',
    'Disability Resource Center',
    'DRC',
    'Academic accommodations, alternative media, assistive technologies',
    NULL,
    'https://canadacollege.edu/disabilityresourcecenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'special_populations',
    'Undocumented Community Center',
    'UCC',
    'Safe space and resource center for undocumented students and allies',
    NULL,
    'https://canadacollege.edu/ucc',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'support_programs',
    'STEM Center',
    'STEM',
    'Resource and study center for STEM students',
    NULL,
    'https://canadacollege.edu/STEMcenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'support_programs',
    'Honors Transfer Program',
    'Honors',
    'Prestigious program for students pursuing a Bachelor''s degree',
    NULL,
    'https://canadacollege.edu/honorsprogram',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'health_wellness',
    'Health Center & Personal Counseling',
    'Health',
    'Personal counseling, health and wellness resources',
    NULL,
    'https://canadacollege.edu/pcc',
    true
  )
ON CONFLICT (institution_id, service_code) DO NOTHING;

-- ============================================================
-- INSERT SKYLINE COLLEGE SERVICES
-- ============================================================
INSERT INTO community_services (institution_id, service_category, service_name, service_code, description, contact_email, contact_phone, office_location, website_url, is_free) VALUES
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'CalWORKs',
    'CalWORKs',
    'Welfare-to-work transitional students support',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/calworks',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'Educational Access Center',
    'EAC',
    'Students with disabilities - academic accommodations, alternative media, assistive technologies',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/educationalaccesscenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'EOPS / CARE',
    'EOPS',
    'Extended Opportunity Programs and Services for students disadvantaged by social, economic, educational or linguistic barriers',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/eops',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'Foster Youth Programs',
    'FosterYouth',
    'College-bound students transitioning out of foster care',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/fosteryouth',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'Promise Scholars Program',
    'Promise',
    'First-time, full-time students - up to 3 years financial support, personalized counseling, priority enrollment',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/promise',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'STEM Center',
    'STEM',
    'Academic tutoring, STEM pathways resources, internship hub, community',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/stemcenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'TRIO Student Support Services',
    'TRIO',
    'First-generation, low-income, disability, or undocumented students',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/trio',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'Veterans Resource & Opportunity Center',
    'Veterans',
    'Veterans, active duty, National Guard, Reserve, and dependents',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/veterans',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'support_programs',
    'Project Change',
    'ProjectChange',
    'For incarcerated, formerly incarcerated, and system-impacted students',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/projectchange',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'basic_needs',
    'SparkPoint',
    'SparkPoint',
    'Food pantry, CalFresh, financial coaching, housing resources',
    'skylinesparkpoint@smccd.edu',
    '650-738-7035',
    'Building 1, Room 1-214',
    'https://skylinecollege.edu/sparkpoint',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'transfer',
    'Transfer Center',
    'Transfer',
    'Transfer planning, UC/CSU/Private university applications, ADT degrees, events',
    NULL,
    NULL,
    'Building 19, Room 208',
    'https://skylinecollege.edu/transfercenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'academic_support',
    'Learning Center & Tutoring',
    'LearningCenter',
    'Academic tutoring and support for all students',
    NULL,
    NULL,
    NULL,
    'https://skylinecollege.edu/learningcenter',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'financial_aid',
    'Financial Aid',
    'Finaid',
    'FAFSA, Cal Grants, scholarships, work study, CPOS guidance',
    NULL,
    NULL,
    'Building 19, Room 104',
    'https://skylinecollege.edu/financialaid',
    false
  )
ON CONFLICT (institution_id, service_code) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_services_institution ON community_services(institution_id);
CREATE INDEX IF NOT EXISTS idx_community_services_category ON community_services(service_category);
CREATE INDEX IF NOT EXISTS idx_community_services_code ON community_services(service_code);
