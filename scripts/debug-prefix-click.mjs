// Debug script to click on prefix and see what happens
import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Going to ASSIST.org with prefix view...');

  const url = 'https://www.assist.org/transfer/results?year=76&institution=74&type=UCTCA&view=transferability&viewBy=prefix';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait longer for Angular to render
  await new Promise(r => setTimeout(r, 8000));

  console.log('Title:', await page.title());
  
  // Take screenshot of initial state
  await page.screenshot({ path: '/tmp/assist-prefix-main.png', fullPage: true });
  console.log('Screenshot saved to /tmp/assist-prefix-main.png');

  // Get body text
  const bodyText = await page.textContent('body');
  console.log('\n--- BODY TEXT (first 2000 chars) ---');
  console.log(bodyText.slice(0, 2000));

  // Try to find and click on ACCT
  console.log('\n--- Trying to click on ACCT ---');
  
  try {
    // Look for ACCT link
    const acctLink = page.locator('a:has-text("ACCT Accounting"), a:has-text("ACCT ")').first();
    
    const isVisible = await acctLink.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('ACCT link visible:', isVisible);
    
    if (isVisible) {
      // Get the link's href
      const href = await acctLink.getAttribute('href').catch(() => 'no href');
      console.log('ACCT href:', href);
      
      // Get link text
      const text = await acctLink.textContent().catch(() => 'no text');
      console.log('ACCT text:', text);
      
      // Click it
      console.log('Clicking ACCT...');
      await acctLink.click();
      
      // Wait for content to load
      await new Promise(r => setTimeout(r, 5000));
      
      // Take screenshot after click
      await page.screenshot({ path: '/tmp/assist-acct-clicked.png', fullPage: true });
      console.log('Screenshot saved to /tmp/assist-acct-clicked.png');
      
      // Get body text after click
      const bodyTextAfter = await page.textContent('body');
      console.log('\n--- BODY TEXT AFTER CLICK (first 3000 chars) ---');
      console.log(bodyTextAfter.slice(0, 3000));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
}

debug().catch(console.error);
