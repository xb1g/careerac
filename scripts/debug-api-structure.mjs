#!/usr/bin/env node
/**
 * Debug: Show the actual structure of course data
 */

import { chromium } from 'playwright';

async function debug() {
  console.log('Starting...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  let courseData = null;
  
  page.on('response', async (response) => {
    const url = response.url();
    
    if (url.includes('/api/transferability/courses') && url.includes('institutionId=74')) {
      console.log('Found courses API!');
      const data = await response.json();
      courseData = data;
    }
  });
  
  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
  
  if (courseData) {
    console.log('\n=== COURSE DATA STRUCTURE ===');
    console.log(`listType: ${courseData.listType}`);
    console.log(`institutionName: ${courseData.institutionName}`);
    console.log(`academicYear: ${JSON.stringify(courseData.academicYear)}`);
    console.log(`courseInformationList length: ${courseData.courseInformationList.length}`);
    
    console.log('\n=== FIRST 3 COURSES (FULL STRUCTURE) ===');
    for (let i = 0; i < 3; i++) {
      console.log(`\nCourse ${i}:`);
      console.log(JSON.stringify(courseData.courseInformationList[i], null, 2));
    }
    
    console.log('\n=== SAMPLE COURSE KEYS ===');
    console.log(Object.keys(courseData.courseInformationList[0]));
  } else {
    console.log('No course data captured!');
  }
}

debug().catch(console.error);
