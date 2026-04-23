#!/usr/bin/env node
/**
 * Scrape ASSIST.org for CCC Batch 1 colleges (IDs 1-30)
 * Uses API interception via Playwright browser automation
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// Batch 1 colleges to scrape
const COLLEGES = [
  { name: 'Evergreen Valley College', assistId: 2 },
  { name: 'Los Angeles City College', assistId: 3 },
  { name: 'College of Marin', assistId: 4 },
  { name: 'College of San Mateo', assistId: 5 },
  { name: 'College of the Sequoias', assistId: 6 },
  { name: 'Butte College', assistId: 8 },
  { name: 'Cerro Coso Community College', assistId: 9 },
  { name: 'Columbia College', assistId: 10 },
  { name: 'Merritt College', assistId: 13 },
  { name: 'Santa Ana College', assistId: 14 },
  { name: 'Cuesta College', assistId: 16 },
  { name: 'Merced College', assistId: 17 },
  { name: 'Las Positas College', assistId: 18 },
  { name: 'Victor Valley College', assistId: 19 },
  { name: 'Barstow Community College', assistId: 20 },
  { name: 'Los Angeles Trade Technical College', assistId: 25 },
  { name: 'American River College', assistId: 27 },
  { name: 'Contra Costa College', assistId: 28 },
  { name: 'College of the Desert', assistId: 30 },
  { name: 'Los Angeles Harbor College', assistId: 31 },
  { name: 'Mission College', assistId: 32 },
  { name: 'City College of San Francisco', assistId: 33 },
  { name: 'Fresno City College', assistId: 35 },
  { name: 'Reedley College', assistId: 36 },
  { name: 'Shasta College', assistId: 38 },
  { name: 'Lake Tahoe Community College', assistId: 40 },
  { name: 'Cabrillo College', assistId: 41 },
  { name: 'Glendale Community College', assistId: 43 },
  { name: 'Los Angeles Valley College', assistId: 44 },
  { name: 'San Diego Miramar College', assistId: 45 },
];

async function scrapeCollege(browser, college) {
  const courses = [];
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Navigate and wait for API response interception
    const [response] = await Promise.all([
      page.waitForResponse(resp => 
        resp.url().includes('/api/transferability/courses') && 
        resp.url().includes(`institutionId=${college.assistId}`)
      ),
      page.goto(`https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${LIST_TYPE}&view=transferability`, { 
        waitUntil: 'domcontentloaded', 
        timeout: 90000 
      })
    ]);
    
    const data = await response.json();
    
    if (data.courseInformationList) {
      for (const item of data.courseInformationList) {
        // Build identifier from prefix and course number
        const prefix = item.prefix || '';
        const courseNumber = item.courseNumber || item.identifiedNumber || '';
        const identifier = [prefix, courseNumber].filter(Boolean).join(' ');
        
        if (identifier && item.courseTitles?.[0]?.title) {
          courses.push({
            identifier,
            prefixCode: prefix,
            courseNumber,
            courseTitle: item.courseTitles[0].title,
            departmentName: item.department || '',
            maxUnits: parseFloat(item.maxUnits) || parseFloat(item.units) || 0,
            minUnits: parseFloat(item.minUnits) || parseFloat(item.units) || 0,
            isCsuTransferable: item.isCsuTransferable || false,
            transferAreas: item.transferAreas || []
          });
        }
      }
    }
    
    console.log(`    Found ${courses.length} courses`);
    
  } catch (err) {
    console.error(`    Error: ${err.message}`);
  }
  
  await context.close();
  return courses;
}

async function main() {
  console.log('='.repeat(60));
  console.log('CCC Batch 1 Course Scraper (IDs 1-30)');
  console.log(`Year: ${YEAR_ID}, Type: ${LIST_TYPE}`);
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const allResults = [];
  
  for (let i = 0; i < COLLEGES.length; i++) {
    const college = COLLEGES[i];
    console.log(`\n[${i + 1}/${COLLEGES.length}] ${college.name} (ID: ${college.assistId})`);
    
    const courses = await scrapeCollege(browser, college);
    
    allResults.push({
      name: college.name,
      assistId: college.assistId,
      courses
    });
    
    // Delay between colleges to be respectful to the server
    if (i < COLLEGES.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
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
    colleges: allResults
  };
  
  const jsonPath = '/tmp/ccc-batch1.json';
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${jsonPath}`);
  
  return output;
}

main().catch(console.error);
