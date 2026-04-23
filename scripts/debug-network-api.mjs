// Debug script to capture network requests and responses
import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const networkRequests = [];
  const apiResponses = [];
  
  // Listen to all network requests
  page.on('request', req => {
    const url = req.url();
    if (url.includes('api') || url.includes('transfer') || url.includes('course')) {
      networkRequests.push({ url, method: req.method() });
    }
  });
  
  // Listen to all responses
  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('api') || url.includes('transfer') || url.includes('course') || url.includes('apiv')) {
      try {
        const body = await resp.text();
        apiResponses.push({ url: resp.url(), status: resp.status(), body: body.slice(0, 500) });
      } catch (e) {
        apiResponses.push({ url: resp.url(), status: resp.status(), body: 'Could not read body' });
      }
    }
  });

  console.log('Going to ASSIST.org...');

  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability&viewBy=prefix&prefix=ACCT';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('Waiting for content to load...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('\n=== NETWORK REQUESTS ===');
  console.log(`Total API requests: ${networkRequests.length}`);
  networkRequests.forEach(req => {
    console.log(`  ${req.method} ${req.url}`);
  });

  console.log('\n=== API RESPONSES ===');
  console.log(`Total API responses: ${apiResponses.length}`);
  apiResponses.forEach((resp, i) => {
    console.log(`\n--- Response ${i + 1} ---`);
    console.log(`Status: ${resp.status}`);
    console.log(`URL: ${resp.url}`);
    console.log(`Body: ${resp.body.slice(0, 300)}...`);
  });

  // Try to find course content in the DOM
  const courseContent = await page.evaluate(() => {
    // Look for elements that might contain course data
    const results = [];
    
    // Search for elements with course-like patterns
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      const text = el.textContent || '';
      // Pattern: "ACCT 100 - Course Title 3.00 units"
      if (/[A-Z]{4}\s+[A-Z]\d+[H]?\s*[\-–]\s*[^<]{3,50}\d+\.?\d*\s*units/.test(text) && text.length < 200) {
        results.push({
          tag: el.tagName,
          class: el.className,
          text: text.trim()
        });
      }
    }
    return results.slice(0, 10);
  });
  
  console.log('\n=== COURSE CONTENT ELEMENTS ===');
  console.log(JSON.stringify(courseContent, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/tmp/assist-network.png', fullPage: true });
  console.log('\nScreenshot saved to /tmp/assist-network.png');

  await browser.close();
}

debug().catch(console.error);
