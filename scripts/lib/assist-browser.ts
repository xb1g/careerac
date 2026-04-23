// Browser automation utilities for ASSIST.org scraping
import { chromium, Browser, Page, BrowserContext } from 'playwright';

const DEFAULT_TIMEOUT = 60000;
const RETRY_DELAY = 3000;
const MAX_RETRIES = 3;

export interface BrowserConfig {
  headless?: boolean;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

export async function createBrowser(config: BrowserConfig = {}): Promise<Browser> {
  const browser = await chromium.launch({
    headless: config.headless ?? true,
    args: ['--disable-setuid-sandbox', '--no-sandbox'],
  });
  return browser;
}

export async function createPage(browser: Browser, config?: BrowserConfig): Promise<Page> {
  const context = await browser.newContext({
    viewport: config?.viewport ?? { width: 1280, height: 720 },
    userAgent: config?.userAgent ?? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  const page = await context.newPage();
  return page;
}

export async function navigateWithRetry(
  page: Page,
  url: string,
  options: { waitUntil?: 'domcontentloaded' | 'networkidle' | 'load'; timeout?: number } = {}
): Promise<void> {
  const { waitUntil = 'domcontentloaded', timeout = DEFAULT_TIMEOUT } = options;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`  Navigation attempt ${attempt}/${MAX_RETRIES}: ${url}`);
      await page.goto(url, { waitUntil, timeout });
      return;
    } catch (error) {
      console.error(`  Attempt ${attempt} failed: ${error}`);
      if (attempt < MAX_RETRIES) {
        console.log(`  Retrying in ${RETRY_DELAY}ms...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      } else {
        throw new Error(`Failed to navigate to ${url} after ${MAX_RETRIES} attempts`);
      }
    }
  }
}

export async function waitForAngularRender(page: Page, timeout: number = 10000): Promise<void> {
  // Wait for Angular to finish rendering
  try {
    await page.waitForFunction(() => {
      const angularElements = document.querySelectorAll('[ng-version], [x-ng-version], .ng-scope');
      const loadingSpinners = document.querySelectorAll('.spinner, .loading, [role="progressbar"]');
      return angularElements.length === 0 && loadingSpinners.length === 0;
    }, { timeout });
  } catch {
    // Angular elements might not exist, continue anyway
  }
  
  // Additional wait for dynamic content
  await new Promise(r => setTimeout(r, 3000));
}

export async function clickAndWait(page: Page, selector: string, waitTime: number = 2000): Promise<void> {
  try {
    await page.click(selector);
    await new Promise(r => setTimeout(r, waitTime));
  } catch (error) {
    throw new Error(`Failed to click ${selector}: ${error}`);
  }
}

export async function getPageContent(page: Page): Promise<string> {
  return await page.content();
}

export async function getPageText(page: Page): Promise<string> {
  return await page.textContent('body') ?? '';
}

export async function takeScreenshot(page: Page, path: string): Promise<void> {
  await page.screenshot({ path, fullPage: true });
}

export async function closeBrowser(browser: Browser): Promise<void> {
  await browser.close();
}

export async function withBrowser<T>(
  config: BrowserConfig,
  fn: (browser: Browser, page: Page) => Promise<T>
): Promise<T> {
  const browser = await createBrowser(config);
  const page = await createPage(browser, config);
  
  try {
    return await fn(browser, page);
  } finally {
    await browser.close();
  }
}
