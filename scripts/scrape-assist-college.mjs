#!/usr/bin/env node
/**
 * Scrape ASSIST.org for a single college's courses and articulations
 * Usage: node scrape-assist-college.mjs --institution=74 --year=76
 */

import { chromium } from 'playwright';
import { parseCoursesFromPage, parseArticulationsFromPage } from './lib/assist-parser.js';

const COLLEGE_PREFIXES = [
  'ACCT', 'ANTH', 'ARCH', 'ART', 'ASTR', 'ATHL', 'BIOL', 'BUS', 'CDE', 'CHEM',
  'CHIN', 'CIS', 'CMST', 'COMM', 'COUN', 'CS', 'DANC', 'ECON', 'ENGL', 'ENGR',
  'ESEC', 'ESL', 'ETHS', 'FASH', 'FILM', 'FN', 'FREN', 'GEOG', 'GEOL', 'GLST',
  'GNDR', 'GRMN', 'HIST', 'HORT', 'HUM', 'ITAL', 'JAPN', 'JOUR', 'KIN', 'LIBR',
  'MARA', 'MATH', 'MRSC', 'MUS', 'PHIL', 'PHOT', 'PHYS', 'POLS', 'PORT', 'PSCI',
  'PSYC', 'PUBH', 'RLST', 'SJS', 'SOC', 'SPAN', 'STAT', 'THEA', 'VIET'
];

const UC_CAMPUS_IDS = [79, 141, 142, 143, 144, 145, 146, 147, 148]; // UC Berkeley, Davis, Irvine, LA, Merced, Riverside, San Diego, San Francisco, Santa Barbara, Santa Cruz
const CSU_CAMPUS_IDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];

async function scrapeCollege(institutionId, year = 76, type = 'UCTCA') {
  console.log(`\n=== Scraping institution ${institutionId} for year ${year} ===`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const allCourses = [];
  const errors = [];
  
  // Step 1: Get transferability list (all courses that transfer)
  const transferUrl = `https://www.assist.org/transfer/results?year=${year}&institution=${institutionId}&type=${type}&view=transferability`;
  console.log(`Fetching transferability list: ${transferUrl}`);
  
  try {
    await page.goto(transferUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000)); // Wait for Angular render
    
    // Take screenshot for debugging
    await page.screenshot({ path: `/tmp/assist-${institutionId}-main.png`, fullPage: true });
    
    const pageText = await page.textContent('body');
    console.log(`Page text length: ${pageText.length} characters`);
    
    // Parse courses from main page
    const { courses, errors: parseErrors } = parseCoursesFromPage(
      pageText,
      institutionId.toString(),
      transferUrl
    );
    
    console.log(`Found ${courses.length} courses on main page`);
    allCourses.push(...courses);
    errors.push(...parseErrors);
    
    // Step 2: Click through each prefix to get more courses
    for (const prefix of COLLEGE_PREFIXES.slice(0, 5)) { // Limit to first 5 for testing
      console.log(`  Scraping prefix: ${prefix}`);
      
      try {
        // Try to click on the prefix
        const prefixSelectors = [
          `a:has-text("${prefix} ")`,
          `button:has-text("${prefix} ")`,
          `span:has-text("${prefix} ")`,
          `div:has-text("^${prefix} ")`,
        ];
        
        let clicked = false;
        for (const selector of prefixSelectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
            await element.click();
            clicked = true;
            console.log(`    Clicked prefix ${prefix} using selector: ${selector}`);
            break;
          }
        }
        
        if (clicked) {
          await new Promise(r => setTimeout(r, 3000));
          
          const prefixText = await page.textContent('body');
          const { courses: prefixCourses, errors: prefixErrors } = parseCoursesFromPage(
            prefixText,
            institutionId.toString(),
            page.url()
          );
          
          console.log(`    Found ${prefixCourses.length} courses for ${prefix}`);
          allCourses.push(...prefixCourses);
          errors.push(...prefixErrors);
          
          // Go back
          await page.goBack();
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (err) {
        console.error(`    Error scraping prefix ${prefix}: ${err.message}`);
        errors.push(`Prefix ${prefix} error: ${err.message}`);
      }
    }
    
  } catch (err) {
    console.error(`Error loading main page: ${err.message}`);
    errors.push(`Main page error: ${err.message}`);
  }
  
  // Deduplicate courses
  const uniqueCourses = [];
  const seen = new Set();
  for (const course of allCourses) {
    if (!seen.has(course.code)) {
      seen.add(course.code);
      uniqueCourses.push(course);
    }
  }
  
  console.log(`\nTotal unique courses: ${uniqueCourses.length}`);
  console.log(`Total errors: ${errors.length}`);
  
  await browser.close();
  
  return {
    institutionId: institutionId.toString(),
    year,
    courses: uniqueCourses,
    errors
  };
}

// Parse command line arguments
const args = process.argv.slice(2);
let institutionId = 74; // Default: Orange Coast College
let year = 76;

for (const arg of args) {
  if (arg.startsWith('--institution=')) {
    institutionId = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--year=')) {
    year = parseInt(arg.split('=')[1]);
  }
}

console.log(`Starting scrape for institution ${institutionId}, year ${year}`);

scrapeCollege(institutionId, year)
  .then(result => {
    console.log('\n=== RESULTS ===');
    console.log(JSON.stringify(result, null, 2));
    
    // Save to file
    const fs = require('fs');
    const outputPath = `/tmp/assist-scrape-${institutionId}-${year}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\nResults saved to ${outputPath}`);
  })
  .catch(err => {
    console.error('Scraping failed:', err);
    process.exit(1);
  });
