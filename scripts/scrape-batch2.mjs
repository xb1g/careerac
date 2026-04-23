#!/usr/bin/env node
/**
 * Scrape ASSIST.org for CCC Batch 2 (IDs 31-60)
 * Uses API response interception via page.on('response') listener
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// Batch 2 colleges (IDs 31-60) - using the FIRST number from each pair as ASSIST institution ID
const COLLEGES = [
  { name: 'Los Angeles Mission College', assistId: 47 },
  { name: 'Ohlone College', assistId: 48 },
  { name: 'Pasadena City College', assistId: 49 },
  { name: 'Foothill College', assistId: 51 },
  { name: 'Modesto Junior College', assistId: 52 },
  { name: 'Mt. San Jacinto College', assistId: 53 },
  { name: 'San Diego City College', assistId: 54 },
  { name: 'Golden West College', assistId: 55 },
  { name: 'Palomar College', assistId: 56 },
  { name: 'Santa Rosa Junior College', assistId: 57 },
  { name: 'Berkeley City College', assistId: 58 },
  { name: 'Los Medanos College', assistId: 61 },
  { name: 'Mount San Antonio College', assistId: 62 },
  { name: 'Palo Verde College', assistId: 63 },
  { name: 'Rio Hondo College', assistId: 64 },
  { name: 'Saddleback College', assistId: 65 },
  { name: 'Santiago Canyon College', assistId: 66 },
  { name: 'Coalinga College', assistId: 67 },
  { name: 'Canada College', assistId: 68 },
  { name: 'Chaffey College', assistId: 69 },
  { name: 'Crafton Hills College', assistId: 70 },
  { name: 'Cypress College', assistId: 71 },
  { name: 'Gavilan College', assistId: 72 },
  { name: 'Napa Valley College', assistId: 73 },
  { name: 'Orange Coast College', assistId: 74 },
  { name: 'Laney College', assistId: 77 },
  { name: 'Riverside City College', assistId: 78 },
  { name: 'West Valley College', assistId: 80 },
  { name: 'Lassen Community College', assistId: 82 },
];

async function scrapeCollege(college) {
  const courses = [];
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Set up response listener BEFORE navigating
    page.on('response', async (response) => {
      const url = response.url();
      
      if (url.includes('/api/transferability/courses') && url.includes(`institutionId=${college.assistId}`)) {
        try {
          const data = await response.json();
          
          if (data.courseInformationList) {
            for (const item of data.courseInformationList) {
              const course = {
                identifier: item.identifier || `${item.prefixCode || item.prefix || ''} ${item.courseNumber || item.identifiedNumber || ''}`.trim(),
                prefixCode: item.prefixCode || item.prefix || '',
                courseNumber: item.courseNumber || item.identifiedNumber || '',
                courseTitle: item.courseTitles?.[0]?.title || item.courseTitle || item.title || '',
                departmentName: item.departmentName || item.department || '',
                maxUnits: item.maxUnits || item.units || 0,
                minUnits: item.minUnits || item.units || 0,
                isCsuTransferable: item.isCsuTransferable ?? true,
                transferAreas: item.transferAreas || [],
              };
              courses.push(course);
            }
          }
        } catch (e) {
          // Ignore parse errors silently
        }
      }
    });
    
    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${LIST_TYPE}&view=transferability`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000)); // Wait for Angular to make API calls
    
    console.log(`    Found ${courses.length} courses`);
    
  } catch (err) {
    console.error(`    Error: ${err.message}`);
  }
  
  await browser.close();
  return courses;
}

async function main() {
  console.log('='.repeat(60));
  console.log('ASSIST CCC Batch 2 Scraper (IDs 31-60)');
  console.log(`Year: ${YEAR_ID}, Type: ${LIST_TYPE}`);
  console.log('='.repeat(60));
  
  const allResults = [];
  
  for (const college of COLLEGES) {
    console.log(`\n--- ${college.name} (ID: ${college.assistId}) ---`);
    
    const courses = await scrapeCollege(college);
    
    allResults.push({
      name: college.name.trim(),
      assistId: college.assistId,
      courses,
    });
    
    // Delay between colleges to be respectful of the server
    await new Promise(r => setTimeout(r, 3000));
  }
  
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
    colleges: allResults,
  };
  
  const jsonPath = '/tmp/ccc-batch2.json';
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${jsonPath}`);
}

main().catch(console.error);
