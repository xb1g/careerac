// Debug script to navigate directly to prefix URL
import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Going directly to ACCT prefix URL...');

  // Try the direct URL with prefix parameter
  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability&viewBy=prefix&prefix=ACCT';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for Angular to render
  await new Promise(r => setTimeout(r, 8000));

  console.log('Title:', await page.title());
  console.log('URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/assist-direct-acct.png', fullPage: true });
  console.log('Screenshot saved');

  // Get body text
  const bodyText = await page.textContent('body');
  console.log('\n--- BODY TEXT (first 5000 chars) ---');
  console.log(bodyText.slice(0, 5000));

  // Check for Angular-specific elements
  const angularInfo = await page.evaluate(() => {
    return {
      ngVersion: document.querySelector('[ng-version]')?.getAttribute('ng-version'),
      angularRoot: document.querySelector('[ng-app]') ? true : false,
      appRoot: document.querySelector('[data-ng-app]') ? true : false
    };
  });
  console.log('\nAngular info:', angularInfo);

  await browser.close();
}

debug().catch(console.error);
