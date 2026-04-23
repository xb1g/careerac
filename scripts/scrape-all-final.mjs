#!/usr/bin/env node
/**
 * Scrape ASSIST.org for all target CCC colleges - CORRECTED IDs
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;

// CORRECTED ASSIST IDs based on actual API responses
const COLLEGES = [
  // Peralta Colleges
  { name: 'Berkeley City College', assistId: 58, dbUuid: 'd0000000-0000-0000-0000-000000000058', district: 'Peralta' },
  { name: 'College of Alameda', assistId: 111, dbUuid: 'd0000000-0000-0000-0000-000000000111', district: 'Peralta' },
  { name: 'Laney College', assistId: 77, dbUuid: 'd0000000-0000-0000-0000-000000000077', district: 'Peralta' },
  { name: 'Merritt College', assistId: 13, dbUuid: 'd0000000-0000-0000-0000-000000000013', district: 'Peralta' },
  // SMCCCD
  { name: 'College of San Mateo', assistId: 5, dbUuid: 'c0000000-0000-0000-0000-000000000001', district: 'SMCCCD' },
  { name: 'Cañada College', assistId: 68, dbUuid: 'c0000000-0000-0000-0000-000000000002', district: 'SMCCCD' },
  { name: 'Skyline College', assistId: 127, dbUuid: 'c0000000-0000-0000-0000-000000000003', district: 'SMCCCD' },
  // Orange Coast College
  { name: 'Orange Coast College', assistId: 74, dbUuid: 'a0000000-0000-0000-0000-000000000008', district: 'OCC' },
  // CCCD - Coast Community College District
  { name: 'Cypress College', assistId: 71, dbUuid: 'e0000000-0000-0000-0000-000000000071', district: 'CCCD' },
  { name: 'Fullerton College', assistId: 134, dbUuid: 'e0000000-0000-0000-0000-000000000134', district: 'CCCD' },
  { name: 'Golden West College', assistId: 55, dbUuid: 'e0000000-0000-0000-0000-000000000055', district: 'CCCD' },
];

async function scrapeCollege(college) {
  const courses = [];
  const errors = [];
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  try {
    page.on('response', async (response) => {
      const url = response.url();
      
      if (url.includes('/api/transferability/courses') && url.includes(`institutionId=${college.assistId}`)) {
        try {
          const data = await response.json();
          
          if (data.courseInformationList) {
            for (const item of data.courseInformationList) {
              const code = item.identifier || `${item.prefixCode} ${item.courseNumber}`.trim();
              const title = item.courseTitle || '';
              const units = item.maxUnits || item.minUnits || 0;
              const prefix = item.prefixCode || '';
              const department = item.departmentName || prefix;
              const isCsuTransferable = item.isCsuTransferable || false;
              const isUcTransferable = item.transferAreas?.some(a => a.code === 'UCTCA') || false;
              
              if (code && title) {
                courses.push({
                  code,
                  title,
                  units,
                  prefix,
                  department,
                  institutionId: college.dbUuid,
                  isCsuTransferable,
                  isUcTransferable,
                  sourceUrl: url,
                });
              }
            }
          }
        } catch (e) {
          errors.push(`Parse: ${e.message}`);
        }
      }
    });
    
    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=UCTCA&view=transferability`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (e) {
    errors.push(`Nav: ${e.message}`);
  }
  
  await context.close();
  await browser.close();
  
  return { courses, errors };
}

async function main() {
  console.log('='.repeat(60));
  console.log('ASSIST CCC Course Scraper - CORRECTED IDs');
  console.log(`Year: ${YEAR_ID}`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const college of COLLEGES) {
    console.log(`\n${college.name} (ID: ${college.assistId})...`);
    
    const result = await scrapeCollege(college);
    console.log(`  ${result.courses.length} courses`);
    
    results.push({
      ...college,
      courses: result.courses,
      errors: result.errors,
      coursesCount: result.courses.length,
    });
    
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  let total = 0;
  for (const r of results) {
    console.log(`${r.name}: ${r.coursesCount}`);
    total += r.coursesCount;
  }
  console.log(`\nTotal: ${total} courses`);
  
  // Save
  const output = { scrapedAt: new Date().toISOString(), year: YEAR_ID, colleges: results };
  writeFileSync('/tmp/assist-corrected.json', JSON.stringify(output, null, 2));
  
  // SQL
  const sql = [];
  sql.push('-- ============================================================');
  sql.push('-- ASSIST CCC Courses - Corrected IDs');
  sql.push('-- Generated: ' + output.scrapedAt);
  sql.push('-- ============================================================');
  sql.push('');
  sql.push('-- Institution inserts');
  sql.push("INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES ('d0000000-0000-0000-0000-000000000111', 'College of Alameda', 'cc', 'CA', 'Alameda', 'CoA') ON CONFLICT (id) DO NOTHING;");
  sql.push("INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES ('d0000000-0000-0000-0000-000000000077', 'Laney College', 'cc', 'CA', 'Oakland', 'Laney') ON CONFLICT (id) DO NOTHING;");
  sql.push("INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES ('d0000000-0000-0000-0000-000000000013', 'Merritt College', 'cc', 'CA', 'Oakland', 'Merritt') ON CONFLICT (id) DO NOTHING;");
  sql.push("INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES ('e0000000-0000-0000-0000-000000000134', 'Fullerton College', 'cc', 'CA', 'Fullerton', 'Fullerton') ON CONFLICT (id) DO NOTHING;");
  sql.push("INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES ('e0000000-0000-0000-0000-000000000055', 'Golden West College', 'cc', 'CA', 'Huntington Beach', 'GWC') ON CONFLICT (id) DO NOTHING;");
  sql.push('');
  
  for (const r of results) {
    sql.push(`\n-- ${r.name} (${r.district}) - ${r.coursesCount} courses`);
    for (const c of r.courses) {
      sql.push(`INSERT INTO courses (institution_id, code, title, units, description) VALUES ('${r.dbUuid}', '${c.code.replace(/'/g, "''")}', '${c.title.replace(/'/g, "''")}', ${c.units}, 'Dept: ${c.department}');`);
    }
  }
  writeFileSync('/tmp/assist-corrected.sql', sql.join('\n'));
  
  console.log('\nSaved to /tmp/assist-corrected.json and /tmp/assist-corrected.sql');
}

main().catch(console.error);
