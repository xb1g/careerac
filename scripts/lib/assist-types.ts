// ASSIST.org Types and Interfaces

export interface AssistInstitution {
  id: string;
  name: string;
  assistId: number;
  district: string;
  type: 'cc' | 'university';
  state: string;
}

export interface AssistCourse {
  code: string;
  title: string;
  units: number;
  department: string;
  prefix: string;
  description?: string;
  prerequisites?: string[];
  institutionId: string;
  sourceUrl: string;
}

export interface AssistArticulation {
  ccCourseCode: string;
  ccCourseTitle: string;
  targetSchool: string;
  targetCourseCode?: string;
  targetCourseTitle?: string;
  requirementType: 'major_prep' | 'ge' | 'breadth' | 'elective' | 'course';
  agreementYear: number;
  status: 'confirmed' | 'likely' | 'no_match' | 'expired';
  notes?: string;
  sourceUrl: string;
}

export interface AssistScrapeResult {
  institution: string;
  scrapedAt: string;
  coursesCount: number;
  articulationsCount: number;
  courses: AssistCourse[];
  articulations: AssistArticulation[];
  errors: string[];
}

// Target colleges for scraping
export const TARGET_COLLEGES: { name: string; assistId: number; dbUuid: string; district: string }[] = [
  // Peralta Colleges
  { name: 'Berkeley City College', assistId: 58, dbUuid: 'd0000000-0000-0000-0000-000000000058', district: 'Peralta' },
  { name: 'College of Alameda', assistId: 72, dbUuid: 'd0000000-0000-0000-0000-000000000072', district: 'Peralta' },
  { name: 'Laney College', assistId: 141, dbUuid: 'd0000000-0000-0000-0000-000000000141', district: 'Peralta' },
  { name: 'Merritt College', assistId: 142, dbUuid: 'd0000000-0000-0000-0000-000000000142', district: 'Peralta' },
  // SMCCCD - San Mateo County Community College District
  { name: 'College of San Mateo', assistId: 75, dbUuid: 'c0000000-0000-0000-0000-000000000001', district: 'SMCCCD' },
  { name: 'Cañada College', assistId: 73, dbUuid: 'c0000000-0000-0000-0000-000000000002', district: 'SMCCCD' },
  { name: 'Skyline College', assistId: 76, dbUuid: 'c0000000-0000-0000-0000-000000000003', district: 'SMCCCD' },
  // Orange Coast College
  { name: 'Orange Coast College', assistId: 74, dbUuid: 'a0000000-0000-0000-0000-000000000008', district: 'OCC' },
  // CCCD - Coast Community College District
  { name: 'Cypress College', assistId: 71, dbUuid: 'e0000000-0000-0000-0000-000000000071', district: 'CCCD' },
  { name: 'Fullerton College', assistId: 77, dbUuid: 'e0000000-0000-0000-0000-000000000077', district: 'CCCD' },
  { name: 'Golden West College', assistId: 78, dbUuid: 'e0000000-0000-0000-0000-000000000078', district: 'CCCD' },
];

export const YEAR_ID = 76; // 2025-2026 academic year
