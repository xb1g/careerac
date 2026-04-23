#!/usr/bin/env node
/**
 * Scrape ASSIST.org for all target CCC colleges
 * Fixed version with proper response interception
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;

const COLLEGES = [
  { name: 'Berkeley City College', assistId: 58, dbUuid: 'd0000000-0000-0000-0000-000000000058', district: 'Peralta' },
  { name: 'College of Alameda', assistId: 72, dbUuid: 'd0000000-0000-0000-0000-000000000072', district: 'Peralta' },
  { name: 'Laney College', assistId: 141, dbUuid: 'd0000000-0000-0000-0000-000000000141', district: 'Peralta' },
  { name: 'Merritt College', assistId: 142, dbUuid: 'd0000000-0000-0000-0000-000000000142', district: 'Peralta' },
  { name: 'College of San Mateo', assistId: 75, dbUuid: 'c0000000-0000-0000-0000-000000000001', district: 'SMCCCD' },
  { name: 'Cañada College', assistId: 73, dbUuid: 'c0000000-0000-0000-0000-000000000002', district: 'SMCCCD' },
  { name: 'Skyline College', assistId: 76, dbUuid: 'c0000000-0000-0000-0000-000000000003', district: 'SMCCCD' },
  { name: 'Orange Coast College', assistId: 74, dbUuid: 'a0000000-0000-0000-0000-000000000008', district: 'OCC' },
  { name: 'Cypress College', assistId: 71, dbUuid: 'e0000000-0000-0000-0000-000000000071', district: 'CCCD' },
  { name: 'Fullerton College', assistId: 77, dbUuid: 'e0000000-0000-0000-0000-000000000077', district: 'CCCD' },
  { name: 'Golden West College', assistId: 78, dbUuid: 'e0000000-0000-0000-0000-000000000078', district: 'CCCD' },
];

async function scrapeCollegeData(college) {
  const courses = [];
  const context = await chromium.launch({ headless: true });
  const page = await context.newPage();
  
  // Set up response listener FIRST
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/transferability/courses') && 
        url.includes(`institutionId=${college.assistId}`)) {
      try {
        const data = await response.json();
        if (data.courseInformationList) {
          for (const item of data.courseInformationList) {
            const courseCode = item.courseNumber || item.identifiedNumber || '';
            const courseTitle = item.courseTitles?.[0]?.title || item.title || '';
            const units = parseFloat(item.units) || 0;
            const prefix = item.prefix || '';
            
            if (courseCode && courseTitle) {
              courses.push({
                code: `${prefix} ${courseCode}`.trim(),
                title: courseTitle,
                units,
                department: item.department || prefix,
                prefix,
                institutionId: college.dbUuid,
                listType: url.includes('listType=CSUTCA') ? 'CSUTCA' : 'UCTCA',
              });
            }
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
  
  // Now navigate
  const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=UCTCA&view=transferability`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));
  
  await context.close();
  return courses;
}

async function main() {
  console.log('Starting ASSIST CCC scraper...\n');
  
  const results = [];
  
  for (const college of COLLEGES) {
    console.log(`Scraping ${college.name}...`);
    
    try {
      const courses = await scrapeCollegeData(college);
      console.log(`  Found ${courses.length} courses`);
      
      // Deduplicate
      const seen = new Set();
      const unique = courses.filter(c => {
        const key = `${c.code}-${c.listType}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      
      results.push({
        ...college,
        courses: unique,
        coursesCount: unique.length
      });
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      results.push({
        ...college,
        courses: [],
        coursesCount: 0,
        error: err.message
      });
    }
    
    // Rate limit between colleges
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  let total = 0;
  for (const r of results) {
    console.log(`${r.name}: ${r.coursesCount} courses`);
    total += r.coursesCount;
  }
  console.log(`\nTotal: ${total} courses`);
  
  // Save
  const output = {
    scrapedAt: new Date().toISOString(),
    year: YEAR_ID,
    colleges: results
  };
  
  writeFileSync('/tmp/assist-ccc-v2.json', JSON.stringify(output, null, 2));
  
  // Generate SQL
  const lines = ['-- ASSIST CCC Courses\n'];
  for (const r of results) {
    lines.push(`\n-- ${r.name}`);
    for (const c of r.courses) {
      const code = c.code.replace(/'/g, "''");
      const title = c.title.replace(/'/g, "''");
      lines.push(`INSERT INTO courses (institution_id, code, title, units, description) VALUES ('${r.dbUuid}', '${code}', '${title}', ${c.units}, '');`);
    }
  }
  writeFileSync('/tmp/assist-ccc-v2.sql', lines.join('\n'));
  
  console.log('\nSaved to /tmp/assist-ccc-v2.json and /tmp/assist-ccc-v2.sql');
}

main().catch(console.error);
