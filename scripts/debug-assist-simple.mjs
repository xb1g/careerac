#!/usr/bin/env node
/**
 * Debug: Capture ALL API responses from ASSIST page
 */

import { chromium } from 'playwright';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

async function debugCollege(college) {
  console.log(`\n=== Debugging ${college.name} (ID: ${college.assistId}) ===`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const apiCalls = [];
  
  // Capture ALL responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('assist.org')) {
      const status = response.status();
      try {
        const body = await response.text();
        const preview = body.substring(0, 200);
        apiCalls.push({ status, url: url.substring(0, 120), preview });
      } catch (e) {
        apiCalls.push({ status, url: url.substring(0, 120), error: e.message });
      }
    }
  });
  
  try {
    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${college.assistId}&type=${LIST_TYPE}&view=transferability`;
    console.log(`  Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    console.log('  Page loaded');
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log(`\n  Captured ${apiCalls.length} responses from assist.org:`);
    for (const call of apiCalls) {
      console.log(`    [${call.status}] ${call.url}`);
      if (call.preview) {
        console.log(`      Preview: ${call.preview.replace(/\n/g, ' ')}`);
      }
      if (call.error) {
        console.log(`      Error: ${call.error}`);
      }
    }
    
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
