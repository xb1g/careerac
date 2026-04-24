#!/usr/bin/env node
/**
 * Pilot: Scrape ASSIST articulation agreements for 1 CC × 1 UC
 * Test with Orange Coast College → UCLA
 * URL pattern: https://www.assist.org/transfer/results?year=76&institution=74&agreement=aa&agreementType=major&view=agreement&otherInstitution=117
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;

// Test: Orange Coast College → UCLA
const CC = { name: 'Orange Coast College', assistId: 74, dbUuid: 'a0000000-0000-0000-0000-000000000008' };
const UC = { name: 'University of California, Los Angeles', assistId: 117, dbUuid: 'b0000000-0000-0000-0000-000000000001' };

async function scrapeArticulation() {
  console.log(`Scraping: ${CC.name} → ${UC.name}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const apis = [];

  // Capture ALL API responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/') && response.status() === 200) {
      try {
        const data = await response.json();
        apis.push({ url, data });
        console.log(`  API: ${url.substring(url.indexOf('/api/'))}`);
        console.log(`    Keys: ${Object.keys(data).join(', ')}`);
      } catch (e) {
        // Not JSON
      }
    }
  });

  try {
    // Navigate to the articulation page
    const url = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${CC.assistId}&agreement=aa&agreementType=major&view=agreement&otherInstitution=${UC.assistId}`;
    console.log(`\nNavigating to: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));

    // Take screenshot
    await page.screenshot({ path: '/tmp/assist-articulation-pilot.png', fullPage: true });
    console.log('Screenshot saved to /tmp/assist-articulation-pilot.png');

    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Check for major selection
    const bodyText = await page.textContent('body');
    console.log(`\nPage text (first 1000 chars):\n${bodyText.slice(0, 1000)}`);

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }

  await browser.close();

  // Save all API responses
  writeFileSync('/tmp/assist-articulation-apis.json', JSON.stringify(apis, null, 2));
  console.log(`\nSaved ${apis.length} API responses to /tmp/assist-articulation-apis.json`);

  return apis;
}

scrapeArticulation().catch(console.error);
