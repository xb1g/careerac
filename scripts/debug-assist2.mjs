// Debug script to understand ASSIST page structure
import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Going to ASSIST.org...');

  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability&viewBy=prefix';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));

  console.log('Title:', await page.title());

  // Look for iframes
  const iframes = await page.locator('iframe').all();
  console.log(`\nFound ${iframes.length} iframes`);

  // Look for Angular app elements
  const angularContent = await page.evaluate(() => {
    // Look for the main content area
    const body = document.body;
    const text = body.innerText;

    // Find elements that might contain course data
    const elements = document.querySelectorAll('*');
    const results = [];

    elements.forEach(el => {
      const textContent = el.textContent || '';
      // Look for course-like patterns
      if (/[A-Z]{4}\s+[A-Z]\d+/.test(textContent) && textContent.length < 500) {
        results.push({
          tag: el.tagName,
          class: el.className,
          text: textContent.slice(0, 200)
        });
      }
    });

    return results.slice(0, 10);
  });

  console.log('\nAngular content elements:');
  console.log(JSON.stringify(angularContent, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/tmp/assist-debug2.png', fullPage: true });
  console.log('\nScreenshot saved');

  // Check what's in the main content area
  const mainContent = await page.locator('main, [role="main"], #main, .main-content').first().textContent().catch(() => 'Not found');
  console.log('\nMain content area:');
  console.log(mainContent?.slice(0, 500));

  await browser.close();
}

debug().catch(console.error);