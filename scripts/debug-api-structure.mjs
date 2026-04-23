#!/usr/bin/env node
/**
 * Debug: Print full API response structure
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

async function debugCollege() {
  console.log('\n=== Debugging API Response Structure ===');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    const apiUrl = `https://www.assist.org/api/transferability/courses?institutionId=2&academicYearId=${YEAR_ID}&listType=${LIST_TYPE}`;
    
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes(apiUrl), { timeout: 60000 }),
      page.goto(`https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=2&type=${LIST_TYPE}&view=transferability`, { 
        waitUntil: 'domcontentloaded', 
        timeout: 90000 
      })
    ]);
    
    const data = await response.json();
    
    // Save full response for analysis
    writeFileSync('/tmp/api-response.json', JSON.stringify(data, null, 2));
    console.log('Full API response saved to /tmp/api-response.json');
    
    // Print top-level keys
    console.log('\nTop-level keys:', Object.keys(data));
    
    // Check if there's a courseInformationList
    if (data.courseInformationList) {
      console.log('\nFound courseInformationList with', data.courseInformationList.length, 'items');
      console.log('First item:', JSON.stringify(data.courseInformationList[0], null, 2));
    } else {
      console.log('\nNo courseInformationList found');
      console.log('Data keys:', Object.keys(data));
      
      // Print first level of data
      for (const key of Object.keys(data)) {
        const val = data[key];
        if (Array.isArray(val)) {
          console.log(`  ${key}: Array[${val.length}]`);
          if (val.length > 0) {
            console.log(`    First item:`, JSON.stringify(val[0]).substring(0, 200));
          }
        } else if (typeof val === 'object') {
          console.log(`  ${key}: Object with keys`, Object.keys(val || {}).slice(0, 5));
        } else {
          console.log(`  ${key}:`, String(val).substring(0, 100));
        }
      }
    }
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
  
  await browser.close();
}

debugCollege().catch(console.error);
