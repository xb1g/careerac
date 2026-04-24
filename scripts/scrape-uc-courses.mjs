#!/usr/bin/env node
/**
 * Scrape ASSIST.org for UC university courses
 * Uses browser response interception to capture course data
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// Top 5 UCs with their ASSIST IDs and DB UUIDs
const UNIVERSITIES = [
  { name: 'University of California, Los Angeles', assistId: 117, dbUuid: 'b0000000-0000-0000-0000-000000000001', abbreviation: 'UCLA' },
  { name: 'University of California, Berkeley', assistId: 79, dbUuid: 'b0000000-0000-0000-0000-000000000004', abbreviation: 'UCB' },
  { name: 'University of California, San Diego', assistId: 7, dbUuid: 'b0000000-0000-0000-0000-000000000005', abbreviation: 'UCSD' },
  { name: 'University of California, Davis', assistId: 89, dbUuid: 'b0000000-0000-0000-0000-000000000007', abbreviation: 'UCD' },
  { name: 'University of California, Santa Barbara', assistId: 128, dbUuid: 'b0000000-0000-0000-0000-000000000008', abbreviation: 'UCSB' },
];

async function scrapeUniversity(browser, university) {
  const courses = [];

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  try {
    // Set up response listener BEFORE navigating
    const apiPromise = page.waitForResponse(resp =>
      resp.url().includes('/api/transferability/courses') &&
      resp.url().includes(`institutionId=${university.assistId}`)
    , { timeout: 60000 });

    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${university.assistId}&type=${LIST_TYPE}&view=transferability`;
    console.log(`  Navigating to: ${url}`);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log(`  Waiting for API response...`);
    const response = await apiPromise;

    const status = response.status();
    console.log(`  API response status: ${status}`);

    if (status === 200) {
      const data = await response.json();
      console.log(`  Response keys: ${Object.keys(data).join(', ')}`);

      const courseList = data.courseInformationList || data.courses || [];
      console.log(`  Found ${courseList.length} courses`);

      for (const item of courseList) {
        courses.push({
          identifier: item.identifier || `${item.prefixCode || item.prefix || ''} ${item.courseNumber || item.identifiedNumber || ''}`.trim(),
          prefixCode: item.prefixCode || item.prefix || '',
          courseNumber: item.courseNumber || item.identifiedNumber || '',
          courseTitle: item.courseTitle || item.courseTitles?.[0]?.title || '',
          departmentName: item.departmentName || item.department || '',
          maxUnits: item.maxUnits || item.units || 0,
          minUnits: item.minUnits || item.units || 0,
          isCsuTransferable: item.isCsuTransferable ?? true,
          transferAreas: item.transferAreas || [],
        });
      }
    }

  } catch (err) {
    console.error(`  Error: ${err.message}`);
  }

  await context.close();
  return { university, courses };
}

async function main() {
  console.log('='.repeat(60));
  console.log('UC University Course Scraper');
  console.log(`Year: ${YEAR_ID}, Type: ${LIST_TYPE}`);
  console.log(`Universities: ${UNIVERSITIES.length}`);
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  for (const university of UNIVERSITIES) {
    console.log(`\n--- ${university.name} (ID: ${university.assistId}) ---`);

    const result = await scrapeUniversity(browser, university);

    console.log(`  Courses scraped: ${result.courses.length}`);

    allResults.push({
      name: result.university.name,
      assistId: result.university.assistId,
      dbUuid: result.university.dbUuid,
      abbreviation: result.university.abbreviation,
      courses: result.courses,
    });

    // Delay between universities
    await new Promise(r => setTimeout(r, 3000));
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
  console.log(`\nTotal: ${totalCourses} courses across ${allResults.length} universities`);

  // Save JSON results
  const output = {
    scraped_at: new Date().toISOString(),
    academicYearId: YEAR_ID,
    listType: LIST_TYPE,
    universities: allResults,
  };

  const jsonPath = '/tmp/uc-courses.json';
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${jsonPath}`);

  return output;
}

main().catch(console.error);
