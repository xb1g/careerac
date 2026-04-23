// Debug script to wait for Angular to fully render
import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Going to ASSIST.org...');

  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability&viewBy=prefix';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('Initial load done, waiting for Angular...');
  
  // Wait for Angular to finish bootstrapping
  await page.waitForFunction(() => {
    const el = document.querySelector('[ng-version="21.2.0"]');
    return el !== null;
  }, { timeout: 10000 }).catch(() => console.log('Angular version element not found'));
  
  // Additional wait for content
  await new Promise(r => setTimeout(r, 5000));

  console.log('Title:', await page.title());
  
  // Check the full HTML
  const html = await page.content();
  
  // Look for course data in the HTML
  const coursePattern = /ACCT\s+[A-Z0-9]+\s*[\-–]\s*[^<\n]+?\d+\.?\d*\s*units/gi;
  const matches = html.match(coursePattern);
  console.log('\nCourse matches in HTML:', matches ? matches.length : 0);
  if (matches) {
    console.log('Sample matches:');
    matches.slice(0, 5).forEach(m => console.log('  ', m));
  }
  
  // Look for API endpoints in the HTML
  const apiPattern = /api[/\w]*/gi;
  const apiMatches = html.match(apiPattern);
  console.log('\nAPI patterns found:', apiMatches ? [...new Set(apiMatches)].slice(0, 10) : 'none');
  
  // Check for any data in script tags
  const scriptData = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script');
    const data = [];
    scripts.forEach(s => {
      const text = s.textContent || '';
      if (text.includes('transfer') || text.includes('course')) {
        data.push(text.slice(0, 500));
      }
    });
    return data;
  });
  
  console.log('\nRelevant script content found:', scriptData.length);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/assist-angular-full.png', fullPage: true });
  console.log('\nScreenshot saved');

  // Try clicking on ACCT and waiting for the result
  console.log('\n--- Clicking on ACCT and waiting ---');
  
  try {
    // Wait for ACCT element to be clickable
    const acctElement = page.locator('a:has-text("ACCT Accounting")').first();
    await acctElement.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click with wait
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('api') || resp.url().includes('transfer'), { timeout: 10000 }).catch(() => null),
      acctElement.click()
    ]);
    
    // Wait for Angular to update
    await new Promise(r => setTimeout(r, 5000));
    
    // Check the URL
    console.log('URL after click:', page.url());
    
    // Get text after click
    const textAfter = await page.textContent('body');
    console.log('\n--- TEXT AFTER CLICK (first 3000 chars) ---');
    console.log(textAfter.slice(0, 3000));
    
    await page.screenshot({ path: '/tmp/assist-after-click.png', fullPage: true });
    
  } catch (err) {
    console.error('Click error:', err.message);
  }

  await browser.close();
}

debug().catch(console.error);
