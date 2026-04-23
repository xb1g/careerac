#!/usr/bin/env node
/**
 * Scrape ASSIST.org for CCC Batch 3 (IDs 61-90)
 * Uses browser response interception to capture course data
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// Target colleges for batch 3 (IDs 61-90)
const COLLEGES = [
  { name: 'College of the Redwoods', assistId: 83 },
  { name: 'Bakersfield College', assistId: 84 },
  { name: 'Los Angeles Pierce College', assistId: 86 },
  { name: 'Oxnard College', assistId: 87 },
  { name: 'Yuba College', assistId: 90 },
  { name: 'West Los Angeles College', assistId: 91 },
  { name: 'Santa Barbara City College', assistId: 92 },
  { name: 'Sierra College', assistId: 93 },
  { name: 'Solano Community College', assistId: 94 },
  { name: 'Ventura College', assistId: 95 },
  { name: 'Chabot College', assistId: 96 },
  { name: 'Citrus College', assistId: 97 },
  { name: 'Cuyamaca College', assistId: 99 },
  { name: 'Mendocino College', assistId: 100 },
  { name: 'San Diego Mesa College', assistId: 101 },
  { name: 'College of the Siskiyous', assistId: 102 },
  { name: 'El Camino College', assistId: 103 },
  { name: 'Cerritos College', assistId: 104 },
  { name: 'Coastline Community College', assistId: 105 },
  { name: 'Grossmont College', assistId: 106 },
  { name: 'Imperial Valley College', assistId: 107 },
  { name: 'MiraCosta College', assistId: 108 },
  { name: 'San Joaquin Delta College', assistId: 109 },
  { name: 'Allan Hancock College', assistId: 110 },
  { name: 'College of Alameda', assistId: 111 },
  { name: 'Copper Mountain College', assistId: 112 },
  { name: 'De Anza College', assistId: 113 },
  { name: 'Diablo Valley College', assistId: 114 },
];

async function scrapeCollege(browser, college) {
  const courses = [];
  const errors = [];
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Set up response listener BEFORE navigating
    const apiPromise = page.waitForResponse(resp => 
      resp.url().includes('/api/transferability/courses') && 
      resp.url().includes(`institutionId=${college.assistId}`)
    , { timeout: 60000 });
    
    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${LIST_TYPE}&view=transferability`;
    console.log(`  Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log(`  Waiting for API response...`);
    const response = await apiPromise;
    
    const status = response.status();
    console.log(`  API response status: ${status}`);
    
    if (status === 200) {
      const data = await response.json();
      console.log(`  Response keys: ${Object.keys(data)}`);
      
      // Extract course information list
      const courseList = data.courseInformationList || data.courses || [];
      console.log(`  Found ${courseList.length} courses`);
      
      for (const item of courseList) {
        courses.push({
          identifier: item.identifier || `${item.prefixCode || ''} ${item.courseNumber || item.identifiedNumber || ''}`.trim(),
          prefixCode: item.prefixCode || '',
          courseNumber: item.courseNumber || item.identifiedNumber || '',
          courseTitle: item.courseTitle || item.courseTitles?.[0]?.title || '',
          departmentName: item.departmentName || item.department || '',
          maxUnits: item.maxUnits || item.units || 0,
          minUnits: item.minUnits || item.units || 0,
          isCsuTransferable: item.isCsuTransferable ?? true,
          transferAreas: item.transferAreas || [],
        });
      }
    } else {
      errors.push(`API returned status ${status}`);
    }
    
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    errors.push(err.message);
  }
  
  await context.close();
  return { college, courses, errors };
}

async function main() {
  console.log('='.repeat(60));
  console.log('ASSIST CCC Batch 3 Scraper');
  console.log(`Year: ${YEAR_ID}, Type: ${LIST_TYPE}`);
  console.log(`Colleges: ${COLLEGES.length}`);
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const allResults = [];
  
  for (const college of COLLEGES) {
    console.log(`\n--- ${college.name} (ID: ${college.assistId}) ---`);
    
    const result = await scrapeCollege(browser, college);
    
    console.log(`  Courses scraped: ${result.courses.length}`);
    if (result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.join(', ')}`);
    }
    
    allResults.push({
      name: result.college.name,
      assistId: result.college.assistId,
      courses: result.courses,
    });
    
    // Delay between colleges to avoid rate limiting
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
  console.log(`\nTotal: ${totalCourses} courses across ${allResults.length} colleges`);
  
  // Save JSON results
  const output = {
    scraped_at: new Date().toISOString(),
    academicYearId: YEAR_ID,
    listType: LIST_TYPE,
    colleges: allResults,
  };
  
  const jsonPath = '/tmp/ccc-batch3.json';
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${jsonPath}`);
  
  return output;
}

main().catch(console.error);
