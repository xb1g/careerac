#!/usr/bin/env node
/**
 * Scrape ALL articulation data from ASSIST.org for a batch of Community Colleges.
 * Scrapes CCC → UC and CCC → CSU articulations for all majors and GE.
 *
 * Usage: node scripts/scrape-assist-all.mjs --cc-ids=5,73,76 --db-uuids=c0000000-0000-0000-0000-000000000001,c0000000-0000-0000-0000-000000000002,c0000000-0000-0000-0000-000000000003 --batch=1
 */

const YEAR_ID = 76;

// Target universities (receiving institutions)
const UNIVERSITIES = [
  // UCs
  { assistId: 79,  name: "University of California, Berkeley",       abbr: "UCB",  type: "university" },
  { assistId: 117, name: "University of California, Los Angeles",   abbr: "UCLA", type: "university" },
  { assistId: 7,   name: "University of California, San Diego",    abbr: "UCSD", type: "university" },
  { assistId: 89,  name: "University of California, Davis",         abbr: "UCD",  type: "university" },
  { assistId: 120, name: "University of California, Irvine",         abbr: "UCI",  type: "university" },
  { assistId: 128, name: "University of California, Santa Barbara", abbr: "UCSB", type: "university" },
  { assistId: 132, name: "University of California, Santa Cruz",    abbr: "UCSC", type: "university" },
  { assistId: 46,  name: "University of California, Riverside",      abbr: "UCR",  type: "university" },
  { assistId: 144, name: "University of California, Merced",         abbr: "UCM",  type: "university" },
  // CSUs
  { assistId: 26,  name: "San Diego State University",              abbr: "SDSU", type: "university" },
  { assistId: 39,  name: "San Jose State University",               abbr: "SJSU", type: "university" },
  { assistId: 116, name: "San Francisco State University",           abbr: "SFSU", type: "university" },
  { assistId: 29,  name: "California State University, Fresno",      abbr: "CSUF", type: "university" },
  { assistId: 129, name: "California State University, Fullerton",   abbr: "CSUF", type: "university" },
  { assistId: 81,  name: "California State University, Long Beach",  abbr: "CSULB",type: "university" },
  { assistId: 42,  name: "California State University, Northridge",  abbr: "CSUN", type: "university" },
  { assistId: 76,  name: "California State University, Los Angeles", abbr: "CSULA",type: "university" },
  { assistId: 60,  name: "California State University, Sacramento", abbr: "CSUS", type: "university" },
  { assistId: 85,  name: "California State University, San Bernardino", abbr: "CSUSB", type: "university" },
  { assistId: 21,  name: "California State University, Hayward",     abbr: "CSUEB",type: "university" },
  { assistId: 12,  name: "California State University, Monterey Bay", abbr: "CSUMB",type: "university" },
  { assistId: 23,  name: "California State University, San Marcos",  abbr: "CSUSM",type: "university" },
  { assistId: 24,  name: "California State University, Stanislaus",   abbr: "CSUS", type: "university" },
  { assistId: 88,  name: "Sonoma State University",                   abbr: "SSU",  type: "university" },
  { assistId: 115, name: "Humboldt State University",                 abbr: "HSU",  type: "university" },
  { assistId: 98,  name: "California State University, Bakersfield", abbr: "CSUB", type: "university" },
  { assistId: 141, name: "California State University, Chico",         abbr: "CSUC", type: "university" },
  { assistId: 143, name: "California State University, Channel Islands", abbr: "CSUCI", type: "university" },
  { assistId: 50,  name: "California State University, Dominguez Hills", abbr: "CSUDH", type: "university" },
  { assistId: 75,  name: "California Polytechnic University, Pomona",  abbr: "CPP",  type: "university" },
  { assistId: 11,  name: "California Polytechnic University, San Luis Obispo", abbr: "CPSLO", type: "university" },
  { assistId: 1,   name: "California Maritime Academy",               abbr: "CSUMA",type: "university" },
];

const CATEGORY_CODES = ["major", "ge"];

let cookies = "";
let xsrfToken = "";
let ccIdToDbUuid = {};

async function initSession() {
  const res = await fetch("https://assist.org/", { redirect: "follow" });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  cookies = setCookies.map(c => c.split(";")[0]).join("; ");
  for (const c of setCookies) {
    if (c.startsWith("X-XSRF-TOKEN=")) {
      xsrfToken = c.split("=")[1].split(";")[0];
    }
  }
  console.error(`[Session] XSRF token: ${xsrfToken.slice(0,10)}...`);
}

async function assistFetch(path) {
  const url = `https://assist.org/api/${path}`;
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await new Promise(r => setTimeout(r, 800 * attempt)); // escalating delay
      const res = await fetch(url, {
        headers: {
          "Cookie": cookies,
          "X-XSRF-TOKEN": xsrfToken,
          "Accept": "application/json",
        },
      });
      if (res.status === 429 || res.status === 403) {
        console.error(`[RateLimit] attempt ${attempt}/5 got ${res.status}, refreshing session...`);
        await initSession();
        await new Promise(r => setTimeout(r, attempt * 5000));
        continue;
      }
      if (!res.ok) throw new Error(`ASSIST API ${res.status}: ${url}`);
      return res.json();
    } catch (e) {
      lastError = e;
      const msg = e?.message ?? String(e);
      console.error(`[Fetch Error] attempt ${attempt}/5: ${msg}`);
      if (attempt < 5) {
        await new Promise(r => setTimeout(r, attempt * 3000));
      }
    }
  }
  throw lastError || new Error("All attempts failed");
}

async function getAgreementKeys(sendingId, receivingId, categoryCode) {
  try {
    const data = await assistFetch(
      `agreements?receivingInstitutionId=${receivingId}&sendingInstitutionId=${sendingId}&academicYearId=${YEAR_ID}&categoryCode=${categoryCode}`
    );
    return data.reports ?? [];
  } catch (e) {
    console.error(`[Agreements] ${sendingId} → ${receivingId} (${categoryCode}): ${e?.message ?? String(e)}`);
    return [];
  }
}

function extractArticulations(result) {
  const articulationsRaw = typeof result.articulations === "string"
    ? JSON.parse(result.articulations) : result.articulations ?? [];

  const mappings = [];
  for (const art of articulationsRaw) {
    const recv = art.articulation;
    if (!recv?.course) continue;

    const uniCourse = {
      prefix: recv.course.prefix,
      number: recv.course.courseNumber,
      title: recv.course.courseTitle,
      units: recv.course.minUnits,
    };

    const sending = recv.sendingArticulation;
    if (!sending || sending.noArticulationReason) {
      mappings.push({ uniCourse, ccCourses: null, noArticulation: sending?.noArticulationReason || "No articulation" });
      continue;
    }

    for (const group of sending.items ?? []) {
      const ccCourses = [];
      for (const item of group.items ?? []) {
        if (item.type === "Course") {
          ccCourses.push({
            prefix: item.prefix,
            number: item.courseNumber,
            title: item.courseTitle,
            units: item.minUnits,
            note: item.attributes?.[0]?.content || null,
          });
        }
      }
      if (ccCourses.length > 0) {
        mappings.push({ uniCourse, ccCourses, conjunction: group.courseConjunction || "And" });
      }
    }
  }
  return mappings;
}

function escSql(s) {
  return String(s).replace(/'/g, "''");
}

function makeUUID(prefix, counter) {
  const hex = counter.toString(16).padStart(12, "0");
  return `${prefix}${hex}`;
}

async function scrapeCC(ccId, ccDbUuid) {
  const results = [];
  
  console.error(`[Scrape] CC ${ccId} → all universities`);
  
  for (const uni of UNIVERSITIES) {
    for (const catCode of CATEGORY_CODES) {
      await new Promise(r => setTimeout(r, 500));
      
      const agreements = await getAgreementKeys(ccId, uni.assistId, catCode);
      
      if (agreements.length === 0) continue;
      
      for (const agreement of agreements) {
        await new Promise(r => setTimeout(r, 500));
        
        try {
          const data = await assistFetch(
            `articulation/Agreements?Key=${encodeURIComponent(agreement.key)}&sending=${ccId}`
          );
          const mappings = extractArticulations(data.result);
          
          for (const m of mappings) {
            results.push({
              ccId,
              ccDbUuid,
              uniId: uni.assistId,
              uniName: uni.name,
              uniAbbr: uni.abbr,
              category: catCode,
              major: agreement.label,
              ...m
            });
          }
          
          console.error(`[OK] ${ccId} → ${uni.abbr} (${catCode}) "${agreement.label}": ${mappings.length} mappings`);
        } catch (e) {
          console.error(`[FAIL] ${ccId} → ${uni.abbr} "${agreement.label}": ${e?.message ?? String(e)}`);
        }
      }
    }
  }
  
  return results;
}

function generateSQL(allMappings, batchNum, ccIds) {
  const lines = [];
  lines.push("-- ============================================================");
  lines.push(`-- ASSIST Articulation Data - Batch ${batchNum}`);
  lines.push(`-- CC IDs: ${ccIds.join(', ')}`);
  lines.push(`-- Source: assist.org API, academic year 2025-2026`);
  lines.push(`-- Generated: ${new Date().toISOString()}`);
  lines.push("-- ============================================================\n");

  // Deduplicate
  const seen = new Set();
  const uniqueMappings = allMappings.filter(m => {
    if (!m.ccCourses) return false;
    for (const cc of m.ccCourses) {
      const key = `${cc.prefix} ${cc.number}|${m.uniCourse.prefix} ${m.uniCourse.number}|${m.uniId}|${m.major}`;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  });

  lines.push(`-- Total unique articulation entries: ${uniqueMappings.length}\n`);

  // Insert articulations
  let artCounter = 0xA00 + (batchNum * 0x100);
  let courseCounter = 0x900 + (batchNum * 0x100);
  
  const ccCourses = new Map();
  const uniCourses = new Map();
  
  for (const m of uniqueMappings) {
    const ccKey = `${m.ccCourses[0].prefix} ${m.ccCourses[0].number}`;
    const uniKey = `${m.uniCourse.prefix} ${m.uniCourse.number}`;
    
    if (!ccCourses.has(ccKey)) {
      const id = makeUUID("d0000000-0000-0000-0000-", ++courseCounter);
      ccCourses.set(ccKey, { id, data: m.ccCourses[0], ccDbUuid: m.ccDbUuid });
    }
    if (!uniCourses.has(`${uniKey}|${m.uniId}`)) {
      const id = makeUUID("d0000000-0000-0000-0000-", ++courseCounter);
      uniCourses.set(`${uniKey}|${m.uniId}`, { id, prefix: m.uniCourse.prefix, number: m.uniCourse.number, title: m.uniCourse.title, units: m.uniCourse.units, uniId: m.uniId });
    }
  }

  // Insert CC courses
  lines.push("-- CC Courses");
  for (const [key, c] of ccCourses) {
    lines.push(`INSERT INTO courses (id, institution_id, code, title, units) VALUES`);
    lines.push(`  ('${c.id}', '${c.ccDbUuid}', '${escSql(key)}', '${escSql(c.data.title)}', ${c.data.units})`);
    lines.push(`ON CONFLICT (institution_id, code) DO NOTHING;`);
  }
  lines.push("");

  // Insert university courses
  lines.push("-- University Courses");
  for (const [key, c] of uniCourses) {
    const [prefix, number] = key.split('|')[0].split(' ');
    lines.push(`INSERT INTO courses (id, institution_id, code, title, units) VALUES`);
    lines.push(`  ('${c.id}', 'university_${c.uniId}', '${escSql(key.split('|')[0])}', '${escSql(c.title)}', ${c.units})`);
    lines.push(`ON CONFLICT (institution_id, code) DO NOTHING;`);
  }
  lines.push("");

  // Insert articulations
  lines.push("-- Articulation Agreements");
  for (const m of uniqueMappings) {
    const ccKey = `${m.ccCourses[0].prefix} ${m.ccCourses[0].number}`;
    const uniKey = `${m.uniCourse.prefix} ${m.uniCourse.number}`;
    const ccCourseId = ccCourses.get(ccKey)?.id;
    const uniCourseId = uniCourses.get(`${uniKey}|${m.uniId}`)?.id;
    
    if (!ccCourseId || !uniCourseId) continue;
    
    const artId = makeUUID("e0000000-0000-0000-0000-", ++artCounter);
    const majorName = m.major.replace(/, B\.\w+\.?$/, "");
    const note = m.ccCourses[0].note ? `'${escSql(m.ccCourses[0].note)}'` : "NULL";
    
    lines.push(`INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes, category)`);
    lines.push(`  SELECT '${artId}', cc.id, uni.id, '${m.ccDbUuid}', 'university_${m.uniId}', '${escSql(majorName)}', 2025, ${note}, '${m.category}'`);
    lines.push(`  FROM (SELECT id FROM courses WHERE institution_id='${m.ccDbUuid}' AND code='${escSql(ccKey)}' LIMIT 1) cc,`);
    lines.push(`       (SELECT id FROM courses WHERE institution_id='university_${m.uniId}' AND code='${escSql(uniKey)}' LIMIT 1) uni`);
    lines.push(`ON CONFLICT (id) DO NOTHING;`);
  }

  return lines.join("\n");
}

async function main() {
  const fs = await import('fs');
  const args = process.argv.slice(2);
  let ccIds = [];
  let dbUuids = [];
  let batchNum = 1;

  for (const arg of args) {
    if (arg.startsWith('--cc-ids=')) {
      ccIds = arg.split('=')[1].split(',').map(Number);
    } else if (arg.startsWith('--db-uuids=')) {
      dbUuids = arg.split('=')[1].split(',');
    } else if (arg.startsWith('--batch=')) {
      batchNum = parseInt(arg.split('=')[1]);
    }
  }

  if (ccIds.length === 0) {
    console.error("Usage: node scrape-assist-all.mjs --cc-ids=5,73,76 --db-uuids=uuid1,uuid2,uuid3 --batch=1");
    process.exit(1);
  }

  console.error(`Batch ${batchNum}: CC IDs [${ccIds.join(', ')}]`);
  
  // Map CC IDs to DB UUIDs
  for (let i = 0; i < ccIds.length; i++) {
    ccIdToDbUuid[ccIds[i]] = dbUuids[i] || `cc_${ccIds[i]}`;
  }

  // Check for checkpoint file
  const checkpointPath = `/tmp/assist_batch${batchNum}_checkpoint.json`;
  let allMappings = [];
  let startIdx = 0;
  
  if (fs.existsSync(checkpointPath)) {
    try {
      const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
      allMappings = checkpoint.mappings || [];
      startIdx = checkpoint.nextIndex || 0;
      console.error(`[Resume] Loaded checkpoint: ${allMappings.length} mappings, starting at CC index ${startIdx}`);
    } catch (e) {
      console.error(`[Checkpoint] Failed to load: ${e.message}`);
    }
  }

  await initSession();

  for (let i = startIdx; i < ccIds.length; i++) {
    const ccId = ccIds[i];
    const ccDbUuid = ccIdToDbUuid[ccId];
    
    try {
      const mappings = await scrapeCC(ccId, ccDbUuid);
      allMappings.push(...mappings);
      
      // Save checkpoint after each CC
      fs.writeFileSync(checkpointPath, JSON.stringify({
        mappings: allMappings,
        nextIndex: i + 1,
        ccIds,
        batchNum
      }));
      
      console.error(`[Progress] CC ${i+1}/${ccIds.length} done, total mappings: ${allMappings.length}`);
    } catch (e) {
      console.error(`[Error] CC ${ccId} failed: ${e?.message ?? String(e)}`);
      // Save checkpoint even on failure
      fs.writeFileSync(checkpointPath, JSON.stringify({
        mappings: allMappings,
        nextIndex: i,
        ccIds,
        batchNum
      }));
      throw e;
    }
  }

  const sql = generateSQL(allMappings, batchNum, ccIds);
  const outPath = `supabase/migrations/059_assist_batch${batchNum}.sql`;
  fs.writeFileSync(outPath, sql);
  console.error(`\nSQL written to ${outPath}`);
  console.error(`  Mappings: ${allMappings.length}`);
  
  // Remove checkpoint on success
  if (fs.existsSync(checkpointPath)) {
    fs.unlinkSync(checkpointPath);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
