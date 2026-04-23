#!/usr/bin/env node
/**
 * Scrape ASSIST.org for all target CCC colleges
 * Uses API interception to capture course data
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPES = ['UCTCA', 'CSUTCA']; // UC and CSU Transfer Course Agreements

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

async function scrapeCollege(browser, college, listType = 'UCTCA') {
  const courses = [];
  const errors = [];
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${listType}&view=transferability`;
    
    // Navigate and wait for API response
    const [response] = await Promise.all([
      page.waitForResponse(resp => 
        resp.url().includes('/api/transferability/courses') && 
        resp.url().includes(`institutionId=${college.assistId}`)
      ),
      page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    ]);
    
    const data = await response.json();
    
    if (data.courseInformationList) {
      for (const item of data.courseInformationList) {
        // Extract course code - could be in different fields
        const courseCode = item.courseNumber || item.identifiedNumber || item.id || '';
        const courseTitle = item.courseTitles?.[0]?.title || item.title || '';
        const units = parseFloat(item.units) || 0;
        const department = item.department || '';
        const prefix = item.prefix || '';
        
        if (courseCode && courseTitle) {
          courses.push({
            code: `${prefix} ${courseCode}`.trim(),
            title: courseTitle,
            units,
            department,
            prefix,
            institutionId: college.dbUuid,
            sourceUrl: url,
            listType,
            creditType: item.creditType || '',
          });
        }
      }
    }
    
  } catch (err) {
    console.error(`    Error: ${err.message}`);
    errors.push(err.message);
  }
  
  await context.close();
  return { courses, errors };
}

async function scrapeAllColleges() {
  console.log('='.repeat(60));
  console.log('ASSIST CCC Course Scraper');
  console.log(`Year: ${YEAR_ID}`);
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const allResults = [];
  
  for (const college of COLLEGES) {
    console.log(`\n--- ${college.name} ---`);
    
    const collegeResult = {
      name: college.name,
      assistId: college.assistId,
      dbUuid: college.dbUuid,
      district: college.district,
      courses: [],
      errors: []
    };
    
    // Scrape UC transferable courses
    console.log('  Scraping UCTCA (UC transferable courses)...');
    const ucResult = await scrapeCollege(browser, college, 'UCTCA');
    console.log(`    Found ${ucResult.courses.length} UC courses`);
    collegeResult.courses.push(...ucResult.courses);
    collegeResult.errors.push(...ucResult.errors.map(e => `UCTCA: ${e}`));
    
    // Scrape CSU transferable courses
    console.log('  Scraping CSUTCA (CSU transferable courses)...');
    const csuResult = await scrapeCollege(browser, college, 'CSUTCA');
    console.log(`    Found ${csuResult.courses.length} CSU courses`);
    collegeResult.courses.push(...csuResult.courses);
    collegeResult.errors.push(...csuResult.errors.map(e => `CSUTCA: ${e}`));
    
    // Deduplicate by code
    const seen = new Set();
    const uniqueCourses = [];
    for (const course of collegeResult.courses) {
      const key = `${course.code}-${course.listType}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCourses.push(course);
      }
    }
    collegeResult.courses = uniqueCourses;
    
    console.log(`  Total unique courses: ${collegeResult.courses.length}`);
    allResults.push(collegeResult);
  }
  
  await browser.close();
  
  return allResults;
}

function generateSQL(results) {
  const lines = [];
  lines.push('-- ============================================================');
  lines.push('-- ASSIST CCC Course Data');
  lines.push(`-- Generated: ${new Date().toISOString()}`);
  lines.push('-- ============================================================\n');
  
  for (const college of results) {
    lines.push(`\n-- ${college.name} (${college.district})`);
    lines.push(`-- ASSIST ID: ${college.assistId}`);
    lines.push(`-- Total courses: ${college.courses.length}\n`);
    
    for (const course of college.courses) {
      const code = course.code.replace(/'/g, "''");
      const title = course.title.replace(/'/g, "''");
      const desc = (course.department || '').replace(/'/g, "''");
      
      lines.push(
        `INSERT INTO courses (institution_id, code, title, units, description) VALUES ` +
        `('${college.dbUuid}', '${code}', '${title}', ${course.units}, '${desc}');`
      );
    }
  }
  
  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  let targetCollege = null;
  
  for (const arg of args) {
    if (arg.startsWith('--college=')) {
      targetCollege = parseInt(arg.split('=')[1]);
    }
  }
  
  const collegesToScrape = targetCollege 
    ? COLLEGES.filter(c => c.assistId === targetCollege)
    : COLLEGES;
  
  // Temporarily override COLLEGES constant
  const originalCollegeCount = COLLEGES.length;
  
  console.log(`\nScraping ${collegesToScrape.length} colleges...\n`);
  
  // Create a filtered browser launch
  const browser = await chromium.launch({ headless: true });
  const allResults = [];
  
  for (const college of collegesToScrape) {
    console.log(`\n--- ${college.name} ---`);
    
    const collegeResult = {
      name: college.name,
      assistId: college.assistId,
      dbUuid: college.dbUuid,
      district: college.district,
      courses: [],
      errors: []
    };
    
    // Scrape UC transferable courses
    console.log('  Scraping UCTCA (UC transferable courses)...');
    const ucResult = await scrapeCollege(browser, college, 'UCTCA');
    console.log(`    Found ${ucResult.courses.length} UC courses`);
    collegeResult.courses.push(...ucResult.courses);
    collegeResult.errors.push(...ucResult.errors.map(e => `UCTCA: ${e}`));
    
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
    
    // Scrape CSU transferable courses
    console.log('  Scraping CSUTCA (CSU transferable courses)...');
    const csuResult = await scrapeCollege(browser, college, 'CSUTCA');
    console.log(`    Found ${csuResult.courses.length} CSU courses`);
    collegeResult.courses.push(...csuResult.courses);
    collegeResult.errors.push(...csuResult.errors.map(e => `CSUTCA: ${e}`));
    
    // Deduplicate by code
    const seen = new Set();
    const uniqueCourses = [];
    for (const course of collegeResult.courses) {
      const key = `${course.code}-${course.listType}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCourses.push(course);
      }
    }
    collegeResult.courses = uniqueCourses;
    
    console.log(`  Total unique courses: ${collegeResult.courses.length}`);
    allResults.push(collegeResult);
    
    // Delay between colleges
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await browser.close();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  let totalCourses = 0;
  for (const result of allResults) {
    console.log(`${result.name}: ${result.courses.length} courses`);
    totalCourses += result.courses.length;
  }
  console.log(`\nTotal: ${totalCourses} courses`);
  
  // Save JSON results
  const output = {
    scrapedAt: new Date().toISOString(),
    year: YEAR_ID,
    colleges: allResults.map(r => ({
      name: r.name,
      assistId: r.assistId,
      dbUuid: r.dbUuid,
      district: r.district,
      coursesCount: r.courses.length,
      courses: r.courses,
      errors: r.errors
    }))
  };
  
  const jsonPath = '/tmp/assist-all-ccc-courses.json';
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\nJSON results saved to ${jsonPath}`);
  
  // Generate SQL
  const sql = generateSQL(allResults);
  const sqlPath = '/tmp/assist-all-ccc-courses.sql';
  writeFileSync(sqlPath, sql);
  console.log(`SQL inserts saved to ${sqlPath}`);
  
  return output;
}

main().catch(console.error);
