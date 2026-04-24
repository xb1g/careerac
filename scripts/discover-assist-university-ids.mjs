#!/usr/bin/env node
/**
 * Discover ASSIST.org university institution IDs
 * Test IDs 1-200 to find UC campuses
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// Known university names to look for
const TARGET_UNIS = [
  'University of California, Los Angeles',
  'University of California, Berkeley',
  'University of California, San Diego',
  'University of California, Davis',
  'University of California, Santa Barbara',
  'University of California, Irvine',
  'University of California, Santa Cruz',
  'University of California, Riverside',
  'University of California, Merced',
];

async function testId(browser, id) {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  let result = null;

  try {
    const [response] = await Promise.all([
      page.waitForResponse(resp =>
        resp.url().includes('/api/transferability/courses') &&
        resp.url().includes(`institutionId=${id}`)
      , { timeout: 15000 }),
      page.goto(`https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${id}&type=${LIST_TYPE}&view=transferability`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      })
    ]);

    const data = await response.json();
    const institutionName = data.institutionName || data.name || '';

    if (institutionName) {
      result = { id, name: institutionName };
      console.log(`  ID ${id}: ${institutionName}`);
    }
  } catch (e) {
    // Silent fail
  }

  await context.close();
  return result;
}

async function main() {
  console.log('Discovering ASSIST university IDs...');
  console.log('Testing IDs 1-200...\n');

  const browser = await chromium.launch({ headless: true });
  const found = [];

  for (let id = 1; id <= 200; id++) {
    process.stdout.write(`Testing ${id}... `);
    const result = await testId(browser, id);
    if (result) {
      found.push(result);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  try { await browser.close(); } catch {}

  console.log('\n=== FOUND INSTITUTIONS ===');
  for (const f of found) {
    console.log(`  ${f.id}: ${f.name}`);
  }

  // Filter for UCs
  console.log('\n=== UC CAMPUSES ===');
  const ucs = found.filter(f =>
    f.name.includes('University of California') ||
    f.name.includes('UC ')
  );
  for (const uc of ucs) {
    console.log(`  ${uc.id}: ${uc.name}`);
  }

  writeFileSync('/tmp/assist-university-ids.json', JSON.stringify({ all: found, ucs }, null, 2));
}

main().catch(console.error);
