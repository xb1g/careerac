// Debug script to see what ASSIST page contains
import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Going to ASSIST.org...');

  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability&viewBy=prefix&prefix=ACCT';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait a bit for Angular to render
  await new Promise(r => setTimeout(r, 5000));

  // Get page title and URL
  console.log('URL:', page.url());
  console.log('Title:', await page.title());

  // Get body text
  const bodyText = await page.textContent('body');
  console.log('\n--- BODY TEXT (first 3000 chars) ---');
  console.log(bodyText.slice(0, 3000));

  // Get HTML structure
  const html = await page.content();
  console.log('\n--- HTML LENGTH ---');
  console.log(html.length, 'characters');

  // Look for specific elements
  const hasAngular = await page.evaluate(() => {
    return document.body.innerHTML.includes('angular') ||
           document.body.innerHTML.includes('ng-') ||
           document.body.innerHTML.includes('x-ng');
  });
  console.log('\nHas Angular markers:', hasAngular);

  // Take screenshot
  await page.screenshot({ path: '/tmp/assist-debug.png', fullPage: true });
  console.log('\nScreenshot saved to /tmp/assist-debug.png');

  await browser.close();
}

debug().catch(console.error);