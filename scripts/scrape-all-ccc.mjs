#!/usr/bin/env node
/**
 * Scrape all target CCC colleges from ASSIST.org
 * Scrapes: Peralta, OCC, SMCCCD, CCCD colleges
 * Usage: node scrape-all-ccc.mjs [--college=74] [--year=76]
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

// Target colleges configuration
const TARGET_COLLEGES = [
  // Peralta Colleges
  { name: 'Berkeley City College', assistId: 58, dbUuid: 'd0000000-0000-0000-0000-000000000058', district: 'Peralta' },
  { name: 'College of Alameda', assistId: 72, dbUuid: 'd0000000-0000-0000-0000-000000000072', district: 'Peralta' },
  { name: 'Laney College', assistId: 141, dbUuid: 'd0000000-0000-0000-0000-000000000141', district: 'Peralta' },
  { name: 'Merritt College', assistId: 142, dbUuid: 'd0000000-0000-0000-0000-000000000142', district: 'Peralta' },
  // SMCCCD
  { name: 'College of San Mateo', assistId: 75, dbUuid: 'c0000000-0000-0000-0000-000000000001', district: 'SMCCCD' },
  { name: 'Cañada College', assistId: 73, dbUuid: 'c0000000-0000-0000-0000-000000000002', district: 'SMCCCD' },
  { name: 'Skyline College', assistId: 76, dbUuid: 'c0000000-0000-0000-0000-000000000003', district: 'SMCCCD' },
  // Orange Coast College
  { name: 'Orange Coast College', assistId: 74, dbUuid: 'a0000000-0000-0000-0000-000000000008', district: 'OCC' },
  // CCCD - Coast Community College District
  { name: 'Cypress College', assistId: 71, dbUuid: 'e0000000-0000-0000-0000-000000000071', district: 'CCCD' },
  { name: 'Fullerton College', assistId: 77, dbUuid: 'e0000000-0000-0000-0000-000000000077', district: 'CCCD' },
  { name: 'Golden West College', assistId: 78, dbUuid: 'e0000000-0000-0000-0000-000000000078', district: 'CCCD' },
];

const COLLEGE_PREFIXES = [
  'ACCT', 'ANTH', 'ART', 'BIOL', 'BUS', 'CHEM', 'CIS', 'COMM', 'CS', 'DANC',
  'ECON', 'ENGL', 'ENGR', 'ESL', 'ETHS', 'FILM', 'FREN', 'GEOG', 'GEOL', 'HIST',
  'HUM', 'JOUR', 'KIN', 'MATH', 'MUS', 'NUTR', 'PHIL', 'PHYS', 'POLS', 'PSYC',
  'SOC', 'SPAN', 'STAT', 'THEA'
];

const YEAR_ID = 76;

async function scrapeCollege(page, college, year) {
  console.log(`\n=== Scraping ${college.name} (ID: ${college.assistId}) ===`);
  
  const baseUrl = `https://www.assist.org/transfer/results?year=${year}&institution=${college.assistId}`;
  const courses = [];
  const errors = [];
  
  try {
    // Navigate to transferability page
    const url = `${baseUrl}&type=UCTCA&view=transferability`;
    console.log(`  URL: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));
    
    // Get initial page content
    let pageText = await page.textContent('body');
    console.log(`  Page text length: ${pageText.length} chars`);
    
    // Parse courses from page
    const parsedCourses = parseCourses(pageText, college.dbUuid, url);
    courses.push(...parsedCourses.courses);
    errors.push(...parsedCourses.errors);
    console.log(`  Found ${parsedCourses.courses.length} courses so far`);
    
    // Try to get prefix view
    const prefixUrl = `${baseUrl}&type=UCTCA&view=transferability&viewBy=prefix`;
    await page.goto(prefixUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));
    
    // Iterate through prefixes
    for (const prefix of COLLEGE_PREFIXES) {
      try {
        const prefixLink = page.locator(`a:has-text("${prefix} ")`).first();
        
        if (await prefixLink.isVisible({ timeout: 1000 }).catch(() => false)) {
          await prefixLink.click();
          await new Promise(r => setTimeout(r, 3000));
          
          const prefixText = await page.textContent('body');
          const { courses: prefixCourses, errors: prefixErrors } = parseCourses(prefixText, college.dbUuid, page.url());
          
          for (const c of prefixCourses) {
            if (!courses.some(existing => existing.code === c.code)) {
              courses.push(c);
            }
          }
          errors.push(...prefixErrors);
          
          console.log(`    ${prefix}: +${prefixCourses.length} courses (total: ${courses.length})`);
          
          await page.goBack();
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (err) {
        // Prefix not found, continue
      }
    }
    
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    errors.push(err.message);
  }
  
  return { college, courses, errors };
}

function parseCourses(pageText, institutionId, sourceUrl) {
  const courses = [];
  const errors = [];
  
  // Pattern: "PSYC 100 - Introduction to Psychology 3.00 units"
  const pattern = /([A-Z]{2,})\s+([A-Z0-9]+H?)\s*[\-\–]\s*([^\d]+?)(\d+\.?\d*)\s*units?/gi;
  
  let match;
  while ((match = pattern.exec(pageText)) !== null) {
    const code = `${match[1].trim()} ${match[2].trim()}`;
    const title = match[3].trim();
    const units = parseFloat(match[4]);
    
    if (!courses.some(c => c.code === code)) {
      courses.push({
        code,
        title,
        units,
        department: match[1].trim(),
        prefix: match[1].trim(),
        institutionId,
        sourceUrl
      });
    }
  }
  
  return { courses, errors };
}

async function main() {
  const args = process.argv.slice(2);
  let year = YEAR_ID;
  let targetCollege = null;
  
  for (const arg of args) {
    if (arg.startsWith('--year=')) {
      year = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--college=')) {
      targetCollege = parseInt(arg.split('=')[1]);
    }
  }
  
  const colleges = targetCollege 
    ? TARGET_COLLEGES.filter(c => c.assistId === targetCollege)
    : TARGET_COLLEGES;
  
  console.log(`Scraping ${colleges.length} colleges for year ${year}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const allResults = [];
  
  for (const college of colleges) {
    const result = await scrapeCollege(page, college, year);
    allResults.push(result);
    console.log(`  Total courses: ${result.courses.length}, Errors: ${result.errors.length}`);
  }
  
  await browser.close();
  
  // Aggregate results
  const totalCourses = allResults.reduce((sum, r) => sum + r.courses.length, 0);
  const totalErrors = allResults.reduce((sum, r) => sum + r.errors.length, 0);
  
  console.log('\n=== SUMMARY ===');
  for (const result of allResults) {
    console.log(`${result.college.name}: ${result.courses.length} courses`);
  }
  console.log(`\nTotal: ${totalCourses} courses, ${totalErrors} errors`);
  
  // Save results
  const output = {
    scrapedAt: new Date().toISOString(),
    year,
    colleges: allResults.map(r => ({
      name: r.college.name,
      assistId: r.college.assistId,
      dbUuid: r.college.dbUuid,
      district: r.college.district,
      coursesCount: r.courses.length,
      courses: r.courses,
      errors: r.errors
    }))
  };
  
  const outputPath = '/tmp/assist-all-ccc-scrape.json';
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${outputPath}`);
  
  // Generate SQL inserts
  const sqlPath = '/tmp/assist-ccc-courses.sql';
  const sqlContent = generateSQL(output);
  writeFileSync(sqlPath, sqlContent);
  console.log(`SQL inserts saved to ${sqlPath}`);
}

function generateSQL(output) {
  const lines = [];
  lines.push('-- ============================================================');
  lines.push('-- ASSIST CCC Course Data Scraped: ' + output.scrapedAt);
  lines.push('-- Year: ' + output.year);
  lines.push('-- ============================================================\n');
  
  for (const college of output.colleges) {
    lines.push(`\n-- ${college.name} (${college.district})`);
    lines.push(`-- ASSIST ID: ${college.assistId}, DB UUID: ${college.dbUuid}`);
    lines.push(`-- Total courses: ${college.coursesCount}\n`);
    
    for (const course of college.courses) {
      const code = course.code.replace(/'/g, "''");
      const title = course.title.replace(/'/g, "''");
      lines.push(
        `INSERT INTO courses (institution_id, code, title, units, description) VALUES ` +
        `('${college.dbUuid}', '${code}', '${title}', ${course.units}, '');`
      );
    }
  }
  
  return lines.join('\n');
}

main().catch(console.error);
