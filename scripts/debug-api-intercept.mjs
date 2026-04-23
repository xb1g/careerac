#!/usr/bin/env node
/**
 * Debug: Test the exact working scenario from intercept script
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function debug() {
  console.log('Starting debug...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  const courses = [];
  
  // Set up response listener FIRST
  page.on('response', async (response) => {
    const url = response.url();
    console.log(`Response: ${url.substring(0, 80)}...`);
    
    if (url.includes('/api/transferability/courses') && url.includes('institutionId=74')) {
      console.log('  -> Caught courses API!');
      try {
        const data = await response.json();
        console.log(`  -> Data keys: ${Object.keys(data)}`);
        if (data.courseInformationList) {
          console.log(`  -> Found ${data.courseInformationList.length} courses`);
          for (const item of data.courseInformationList.slice(0, 3)) {
            console.log(`     Course: ${item.prefix} ${item.courseNumber} - ${item.courseTitles?.[0]?.title}`);
          }
        }
      } catch (e) {
        console.log(`  -> Parse error: ${e.message}`);
      }
    }
  });
  
  console.log('\nNavigating to page...');
  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability';
  
  // This approach worked before - wait for networkidle
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  console.log('Page loaded with networkidle\n');
  
  // Wait more
  await new Promise(r => setTimeout(r, 5000));
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/assist-debug2.png', fullPage: true });
  console.log('Screenshot saved');
  
  // Check current page content
  const text = await page.textContent('body');
  console.log(`\nPage text (first 500 chars):\n${text.slice(0, 500)}`);
  
  await browser.close();
}

debug().catch(console.error);
