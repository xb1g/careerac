#!/usr/bin/env node
/**
 * Scrape ASSIST.org using API endpoints
 * Direct API access is much more reliable than HTML scraping
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA'; // UC Transfer Course Agreement

// Target colleges
const COLLEGES = [
  // Peralta Colleges
  { name: 'Berkeley City College', assistId: 58, dbUuid: 'd0000000-0000-0000-0000-000000000058', district: 'Peralta' },
  { name: 'College of Alameda', assistId: 72, dbUuid: 'd0000000-0000-0000-0000-000000000072', district: 'Peralta' },
  { name: 'Laney College', assistId: 141, dbUuid: 'd0000000-0000-0000-0000-000000000141', district: 'Peralta' },
  { name: 'Merritt College', assistId: 142, dbUuid: 'd0000000-0000-0000-0000-000000000142', district: 'Peralta' },
  // SMCCCD
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

async function fetchCoursesFromAPI(browser, college) {
  console.log(`\n=== Fetching ${college.name} (ID: ${college.assistId}) ===`);
  
  const courses = [];
  const errors = [];
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });
    const page = await context.newPage();
    
    // First, navigate to ASSIST to get any necessary cookies/session
    await page.goto('https://www.assist.org/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Fetch courses via API
    const apiUrl = `https://www.assist.org/api/transferability/courses?institutionId=${college.assistId}&academicYearId=${YEAR_ID}&listType=${LIST_TYPE}`;
    
    const response = await page.request.get(apiUrl, { timeout: 60000 });
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log(`  API response received`);
      
      if (data.courseInformationList) {
        for (const item of data.courseInformationList) {
          courses.push({
            code: item.courseNumber || item.identifiedNumber || '',
            title: item.courseTitles?.[0]?.title || item.title || '',
            units: parseFloat(item.units) || 0,
            department: item.department || item.prefix || '',
            prefix: item.prefix || '',
            institutionId: college.dbUuid,
            sourceUrl: apiUrl,
            // Additional fields from API
            courseId: item.id,
            creditType: item.creditType,
            effectiveYears: item.effectiveYears,
          });
        }
        console.log(`  Found ${courses.length} courses`);
      } else {
        console.log(`  No courseInformationList in response`);
        console.log(`  Response keys: ${Object.keys(data)}`);
      }
    } else {
      console.log(`  API returned status ${response.status()}`);
      errors.push(`API status ${response.status()}`);
    }
    
    await context.close();
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    errors.push(err.message);
  }
  
  return { college, courses, errors };
}

async function fetchAllColleges() {
  console.log(`Starting ASSIST API scraping for ${COLLEGES.length} colleges...`);
  console.log(`Year: ${YEAR_ID}, Type: ${LIST_TYPE}`);
  
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  
  for (const college of COLLEGES) {
    const result = await fetchCoursesFromAPI(browser, college);
    results.push(result);
  }
  
  await browser.close();
  
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  let targetCollege = null;
  
  for (const arg of args) {
    if (arg.startsWith('--college=')) {
      targetCollege = parseInt(arg.split('=')[1]);
    }
  }
  
  const colleges = targetCollege 
    ? COLLEGES.filter(c => c.assistId === targetCollege)
    : COLLEGES;
  
  console.log(`\nScraping ${colleges.length} colleges...`);
  
  // Override COLLEGES for this run
  const runColleges = colleges;
  
  const browser = await chromium.launch({ headless: true });
  const results = [];
  
  for (const college of runColleges) {
    const result = await fetchCoursesFromAPI(browser, college);
    results.push(result);
  }
  
  await browser.close();
  
  // Summary
  console.log('\n=== SUMMARY ===');
  let totalCourses = 0;
  let totalErrors = 0;
  
  for (const result of results) {
    console.log(`${result.college.name}: ${result.courses.length} courses, ${result.errors.length} errors`);
    totalCourses += result.courses.length;
    totalErrors += result.errors.length;
  }
  
  console.log(`\nTotal: ${totalCourses} courses, ${totalErrors} errors`);
  
  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    year: YEAR_ID,
    listType: LIST_TYPE,
    colleges: results.map(r => ({
      name: r.college.name,
      assistId: r.college.assistId,
      dbUuid: r.college.dbUuid,
      district: r.college.district,
      coursesCount: r.courses.length,
      courses: r.courses,
      errors: r.errors
    }))
  };
  
  const outputPath = '/tmp/assist-api-scrape-results.json';
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${outputPath}`);
  
  // Generate SQL
  const sqlPath = '/tmp/assist-api-courses.sql';
  const sqlContent = generateSQL(output);
  writeFileSync(sqlPath, sqlContent);
  console.log(`SQL saved to ${sqlPath}`);
  
  return output;
}

function generateSQL(output) {
  const lines = [];
  lines.push('-- ============================================================');
  lines.push(`-- ASSIST CCC Course Data via API`);
  lines.push(`-- Scraped: ${output.scrapedAt}`);
  lines.push(`-- Year: ${output.year}, Type: ${output.listType}`);
  lines.push('-- ============================================================\n');
  
  for (const college of output.colleges) {
    lines.push(`\n-- ${college.name} (${college.district})`);
    lines.push(`-- ASSIST ID: ${college.assistId}, DB UUID: ${college.dbUuid}`);
    lines.push(`-- Courses: ${college.coursesCount}\n`);
    
    for (const course of college.courses) {
      const code = (course.code || '').replace(/'/g, "''");
      const title = (course.title || '').replace(/'/g, "''");
      const units = course.units || 0;
      const desc = (course.description || '').replace(/'/g, "''");
      
      if (code && title) {
        lines.push(
          `INSERT INTO courses (institution_id, code, title, units, description) VALUES ` +
          `('${college.dbUuid}', '${code}', '${title}', ${units}, '${desc}');`
        );
      }
    }
  }
  
  return lines.join('\n');
}

main().catch(console.error);
