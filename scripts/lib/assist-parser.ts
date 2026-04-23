// Parser for ASSIST.org page content
import { AssistCourse, AssistArticulation } from './assist-types';

export interface ParsedCourses {
  courses: AssistCourse[];
  errors: string[];
}

export interface ParsedArticulations {
  articulations: AssistArticulation[];
  errors: string[];
}

// Parse course data from ASSIST transferability page
export function parseCoursesFromPage(
  pageText: string,
  institutionId: string,
  sourceUrl: string
): ParsedCourses {
  const courses: AssistCourse[] = [];
  const errors: string[] = [];

  // ASSIST course pattern: "PSYC 100 - Introduction to Psychology 3.00 units"
  // Also handles: "MATH 125H - Honors Finite Mathematics 3.00 units"
  const coursePattern = /([A-Z]{2,})\s+([A-Z0-9]+H?)\s*[\-\–]\s*([^\d]+?)(\d+\.?\d*)\s*units?/gi;
  
  let match;
  while ((match = coursePattern.exec(pageText)) !== null) {
    try {
      const prefix = match[1].trim();
      const code = `${match[1].trim()} ${match[2].trim()}`;
      const title = match[3].trim();
      const units = parseFloat(match[4]);
      
      // Skip if already added (duplicate)
      if (!courses.some(c => c.code === code)) {
        courses.push({
          code,
          title,
          units,
          department: prefix,
          prefix,
          institutionId,
          sourceUrl,
        });
      }
    } catch (err) {
      errors.push(`Parse error for match ${match[0]}: ${err}`);
    }
  }

  return { courses, errors };
}

// Parse articulation agreements from ASSIST page
export function parseArticulationsFromPage(
  pageText: string,
  institutionName: string,
  sourceUrl: string,
  year: number
): ParsedArticulations {
  const articulations: AssistArticulation[] = [];
  const errors: string[] = [];

  // Parse articulation blocks - pattern varies by page type
  // Common patterns:
  // "MATH 100 → MATH 1A: Calculus I (Major Preparation)"
  // "BIOL 100 satisfies BIOL 10 requirement for Nursing major"
  
  const articulationPatterns = [
    // Pattern: "CC_COURSE → TARGET_COURSE: Title (Type)"
    /([A-Z]{2,})\s+([A-Z0-9]+H?)\s*→\s*([A-Z]{2,})\s+([A-Z0-9]+H?)[^:]*:\s*([^\(]+)\s*\(([^)]+)\)/gi,
    // Pattern: "CC_COURSE satisfies TARGET requirement"
    /([A-Z]{2,})\s+([A-Z0-9]+H?)\s+satisfies\s+([A-Z]{2,})\s+([A-Z0-9]+H?)[^→]+/gi,
    // Pattern: "CC_COURSE → TARGET (Major Prep)"
    /([A-Z]{2,})\s+([A-Z0-9]+H?)\s*→\s*([^\(]+)\s*\(([^)]+)\)/gi,
  ];

  for (const pattern of articulationPatterns) {
    let match;
    while ((match = pattern.exec(pageText)) !== null) {
      try {
        const ccCourseCode = `${match[1]} ${match[2]}`;
        const targetCourseMatch = match[3]?.toString().trim() || '';
        const requirementType = extractRequirementType(match[match.length - 1]?.toString() || '');
        
        // Skip if already added
        if (!articulations.some(a => 
          a.ccCourseCode === ccCourseCode && 
          a.targetSchool === targetCourseMatch
        )) {
          articulations.push({
            ccCourseCode,
            ccCourseTitle: '',
            targetSchool: targetCourseMatch,
            requirementType,
            agreementYear: year,
            status: 'confirmed',
            sourceUrl,
          });
        }
      } catch (err) {
        errors.push(`Parse error for match ${match[0]}: ${err}`);
      }
    }
  }

  return { articulations, errors };
}

function extractRequirementType(text: string): AssistArticulation['requirementType'] {
  const lower = text.toLowerCase();
  if (lower.includes('major') || lower.includes('prep')) return 'major_prep';
  if (lower.includes('ge') || lower.includes('general education')) return 'ge';
  if (lower.includes('breadth')) return 'breadth';
  if (lower.includes('elective')) return 'elective';
  return 'course';
}

// Generate SQL INSERT statements for courses
export function generateCourseInserts(
  courses: AssistCourse[],
  institutionUuid: string
): string {
  const inserts: string[] = [];
  
  for (const course of courses) {
    const code = course.code.replace(/'/g, "''");
    const title = course.title.replace(/'/g, "''");
    const desc = (course.description || '').replace(/'/g, "''");
    
    inserts.push(
      `INSERT INTO courses (institution_id, code, title, units, description) VALUES ` +
      `('${institutionUuid}', '${code}', '${title}', ${course.units}, '${desc}') ` +
      `ON CONFLICT (institution_id, code) DO NOTHING;`
    );
  }
  
  return inserts.join('\n');
}

// Generate SQL INSERT statements for articulations
export function generateArticulationInserts(
  articulations: AssistArticulation[],
  ccInstitutionUuid: string,
  universityInstitutionUuid: string,
  ccCourseIdMap: Map<string, string>
): string {
  const inserts: string[] = [];
  
  for (const art of articulations) {
    const ccCourseId = ccCourseIdMap.get(art.ccCourseCode);
    if (!ccCourseId) continue; // Skip if CC course not found
    
    const targetCourseId = 'NULL'; // Would need to look up university courses
    const major = art.requirementType || '';
    const notes = (art.notes || '').replace(/'/g, "''");
    
    inserts.push(
      `INSERT INTO articulation_agreements ` +
      `(cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes) VALUES ` +
      `('${ccCourseId}', ${targetCourseId}, '${ccInstitutionUuid}', '${universityInstitutionUuid}', '${major}', ${art.agreementYear}, '${notes}') ` +
      `ON CONFLICT DO NOTHING;`
    );
  }
  
  return inserts.join('\n');
}
