#!/usr/bin/env node
/**
 * Find remaining UC campus IDs on ASSIST.org
 * Test specific IDs likely to be UCSB, UCSC, UCM
 */

import { chromium } from 'playwright';

const YEAR_ID = 76;
const LIST_TYPE = 'UCTCA';

// IDs to test - likely candidates for remaining UCs
const TEST_IDS = [121, 122, 123, 124, 125, 126, 128, 129, 130, 131, 132, 133, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200];

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
    }
  } catch (e) {
    // Silent fail
  }

  try { await context.close(); } catch {}
  return result;
}

async function main() {
  console.log('Finding remaining UC campus IDs...');
  console.log('Testing IDs: ' + TEST_IDS.join(', ') + '\n');

  const browser = await chromium.launch({ headless: true });
  const found = [];

  for (const id of TEST_IDS) {
    process.stdout.write(`Testing ${id}... `);
    const result = await testId(browser, id);
    if (result) {
      found.push(result);
      console.log(`${result.name}`);
    } else {
      console.log('no response');
    }
    await new Promise(r => setTimeout(r, 500));
  }

  try { await browser.close(); } catch {}

  console.log('\n=== ALL FOUND ===');
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
}

main().catch(console.error);
