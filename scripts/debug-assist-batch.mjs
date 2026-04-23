#!/usr/bin/env node
/**
 * Debug: Find the correct API response pattern
 */

import { chromium } from 'playwright';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

async function debugCollege(college) {
  console.log(`\n=== Debugging ${college.name} (ID: ${college.assistId}) ===`);
  
  const browser = await chromium.launch({ headless: false });  // non-headless for debugging
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Capture ALL responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('assist.org') && !url.includes('fonts') && !url.includes('css') && !url.includes('js')) {
      console.log(`  Response: ${response.status()} - ${url.substring(0, 100)}`);
      if (url.includes('api')) {
        console.log(`    >>> API RESPONSE <<<`);
        try {
          const body = await response.text();
          console.log(`    Body preview: ${body.substring(0, 300)}`);
        } catch (e) {
          console.log(`    Could not read body: ${e.message}`);
        }
      }
    }
  });
  
  page.on('request', async (request) => {
    const url = request.url();
    if (url.includes('api')) {
      console.log(`  Request to API: ${url}`);
    }
  });
  
  try {
    await page.goto(`https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${LIST_TYPE}&view=transferability`, { 
      waitUntil: 'networkidle', 
      timeout: 90000 
    });
    console.log('  Page loaded with networkidle');
    
    // Wait a bit more
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (err) {
    console.error(`  Error: ${err.message}`);
  }
  
  await browser.close();
}

async function main() {
  // Test with first college
  await debugCollege({ name: 'Evergreen Valley College', assistId: 2 });
}

main().catch(console.error);
