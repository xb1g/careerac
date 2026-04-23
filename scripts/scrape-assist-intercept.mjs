#!/usr/bin/env node
/**
 * Scrape ASSIST.org by intercepting API responses
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// Target colleges
const COLLEGES = [
  { name: 'Orange Coast College', assistId: 74, dbUuid: 'a0000000-0000-0000-0000-000000000008', district: 'OCC' },
  { name: 'Berkeley City College', assistId: 58, dbUuid: 'd0000000-0000-0000-0000-000000000058', district: 'Peralta' },
];

async function scrapeCollege(college) {
  console.log(`\n=== Scraping ${college.name} ===`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const courses = [];
  const errors = [];
  
  try {
    // Listen for API responses
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/api/transferability/courses') && url.includes(`institutionId=${college.assistId}`)) {
        console.log(`  Caught API response from: ${url}`);
        
        try {
          const data = await response.json();
          console.log(`  Response keys: ${Object.keys(data)}`);
          
          if (data.courseInformationList) {
            console.log(`  Found ${data.courseInformationList.length} courses in API response`);
            
            for (const item of data.courseInformationList) {
              courses.push({
                code: item.courseNumber || item.identifiedNumber || '',
                title: item.courseTitles?.[0]?.title || item.title || '',
                units: parseFloat(item.units) || 0,
                department: item.department || '',
                prefix: item.prefix || '',
                institutionId: college.dbUuid,
                sourceUrl: url,
              });
            }
          } else if (data.listType) {
            // This is the right endpoint but format is different
            console.log(`  Data format: ${JSON.stringify(data).slice(0, 500)}`);
          }
        } catch (err) {
          console.error(`  Error parsing response: ${err.message}`);
          errors.push(err.message);
        }
      }
    });
    
    // Navigate to the main page first
    const mainUrl = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${LIST_TYPE}&view=transferability`;
    console.log(`  Navigating to: ${mainUrl}`);
    
    await page.goto(mainUrl, { waitUntil: 'networkidle', timeout: 60000 });
    console.log(`  Page loaded, waiting for API calls...`);
    
    // Wait a bit for API calls to complete
    await new Promise(r => setTimeout(r, 5000));
    
    // Now manually trigger the courses API
    const apiUrl = `https://www.assist.org/api/transferability/courses?institutionId=${college.assistId}&academicYearId=${YEAR_ID}&listType=${LIST_TYPE}`;
    console.log(`  Fetching API directly: ${apiUrl}`);
    
    const response = await page.request.get(apiUrl);
    console.log(`  Direct API status: ${response.status()}`);
    
    if (response.status() === 200) {
      const text = await response.text();
      console.log(`  Response length: ${text.length}`);
      console.log(`  Response preview: ${text.slice(0, 500)}`);
      
      try {
        const data = JSON.parse(text);
        console.log(`  Parsed JSON keys: ${Object.keys(data)}`);
        
        if (data.courseInformationList) {
          console.log(`  Found ${data.courseInformationList.length} courses`);
          for (const item of data.courseInformationList) {
            courses.push({
              code: item.courseNumber || item.identifiedNumber || '',
              title: item.courseTitles?.[0]?.title || item.title || '',
              units: parseFloat(item.units) || 0,
              department: item.department || '',
              prefix: item.prefix || '',
              institutionId: college.dbUuid,
              sourceUrl: apiUrl,
            });
          }
        }
      } catch (err) {
        console.error(`  Parse error: ${err.message}`);
        errors.push(err.message);
      }
    }
    
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    errors.push(err.message);
  }
  
  await browser.close();
  
  return { college, courses, errors };
}

async function main() {
  console.log(`Starting ASSIST scraping via API interception...`);
  
  const results = [];
  
  for (const college of COLLEGES) {
    const result = await scrapeCollege(college);
    results.push(result);
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  for (const result of results) {
    console.log(`${result.college.name}: ${result.courses.length} courses`);
  }
  
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
      courses: r.courses
    }))
  };
  
  writeFileSync('/tmp/assist-intercept-results.json', JSON.stringify(output, null, 2));
  console.log('\nResults saved to /tmp/assist-intercept-results.json');
}

main().catch(console.error);
