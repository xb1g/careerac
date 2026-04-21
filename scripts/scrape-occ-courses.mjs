// Script to scrape OCC courses from assist.org
import { chromium } from 'playwright';

const PREFIXES = [
  'ACCT', 'ANTH', 'ARCH', 'ART', 'ASTR', 'ATHL', 'BIOL', 'BUS', 'CDE', 'CHEM',
  'CHIN', 'CIS', 'CMST', 'COMM', 'COUN', 'CS', 'DANC', 'ECON', 'ENGL', 'ENGR',
  'ESEC', 'ESL', 'ETHS', 'FASH', 'FILM', 'FN', 'FREN', 'GEOG', 'GEOL', 'GLST',
  'GNDR', 'GRMN', 'HIST', 'HORT', 'HUM', 'ITAL', 'JAPN', 'JOUR', 'KIN', 'LIBR',
  'MARA', 'MATH', 'MRSC', 'MUS', 'PHIL', 'PHOT', 'PHYS', 'POLS', 'PORT', 'PSCI',
  'PSYC', 'PUBH', 'RLST', 'SJS', 'SOC', 'SPAN', 'STAT', 'THEA', 'VIET'
];

const INSTITUTION_ID = '74';
const YEAR_ID = '76';

async function scrapeCourses() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allCourses = [];

  console.log('Starting OCC course scraping...');

  // First navigate to the main prefix view page
  const mainUrl = `https://www.assist.org/transfer/results?year=${YEAR_ID}&institution=${INSTITUTION_ID}&type=UCTCA&view=transferability&viewBy=prefix`;
  await page.goto(mainUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000)); // Wait for Angular to render

  for (const prefix of PREFIXES) {
    console.log(`Scraping prefix: ${prefix}`);

    try {
      // Find and click on the prefix link (e.g., "ACCT Accounting")
      const prefixLinkText = `${prefix} `;
      const prefixLink = page.locator(`a:has-text("${prefixLinkText}"), span:has-text("${prefixLinkText}"), div:has-text("${prefixLinkText}")`).first();

      if (await prefixLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await prefixLink.click();
        await new Promise(r => setTimeout(r, 2000)); // Wait for content to load

        // Get the page text and extract courses
        const pageText = await page.textContent('body');

        // Parse courses from the text
        // Pattern: "ACCT A101 - Course Title 4.00 units"
        const coursePattern = new RegExp(`(${prefix}\\s+[A-Z0-9]+H?)\\s*[\\-\\–]\\s*([^\\d]+)(\\d+\\.?\\d*)\\s*units?`, 'gi');
        let match;
        let prefixCourseCount = 0;

        while ((match = coursePattern.exec(pageText)) !== null) {
          const fullCode = match[1].trim();
          const title = match[2].trim();
          const units = parseFloat(match[3]);

          // Skip if already added
          if (!allCourses.some(c => c.code === fullCode)) {
            allCourses.push({
              code: fullCode,
              title: title,
              units: units,
              prefix: prefix
            });
            prefixCourseCount++;
          }
        }

        console.log(`  Found ${prefixCourseCount} new courses for ${prefix}`);
      } else {
        console.log(`  Prefix ${prefix} link not visible, trying filter approach`);
      }

      // Go back to the main prefix page to select next prefix
      await page.goto(mainUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));

    } catch (error) {
      console.error(`  Error scraping ${prefix}: ${error.message}`);
      // Try to go back to main page
      try {
        await page.goto(mainUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
      } catch (e) {
        console.error(`  Failed to return to main page: ${e.message}`);
      }
    }
  }

  console.log(`\nTotal courses scraped: ${allCourses.length}`);

  // Output as JSON
  console.log('\n--- JSON OUTPUT ---');
  console.log(JSON.stringify(allCourses, null, 2));

  await browser.close();

  return allCourses;
}

scrapeCourses().catch(console.error);