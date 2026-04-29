#!/usr/bin/env node
/**
 * Scrape ASSIST.org articulation data for Berkeley City College → UC campuses
 * for Computer Science, then output a SQL migration.
 *
 * Usage: node scripts/scrape-assist-csm.mjs
 */

const CSM_ID = 58; // Berkeley City College on ASSIST
const YEAR_ID = 76; // 2025-2026
const CSM_DB_ID = "a0000000-0000-0000-0000-000000000005"; // Our DB UUID

// UC campuses: ASSIST ID → our DB UUID + name
const UNIVERSITIES = [
  { assistId: 79,  name: "University of California, Berkeley",       abbr: "UCB",  dbId: "b0000000-0000-0000-0000-000000000004" },
  { assistId: 117, name: "University of California, Los Angeles",    abbr: "UCLA", dbId: "b0000000-0000-0000-0000-000000000001" },
  { assistId: 7,   name: "University of California, San Diego",      abbr: "UCSD", dbId: "b0000000-0000-0000-0000-000000000005" },
  { assistId: 89,  name: "University of California, Davis",          abbr: "UCD",  dbId: "b0000000-0000-0000-0000-000000000009" },
  { assistId: 120, name: "University of California, Irvine",         abbr: "UCI",  dbId: null },
  { assistId: 128, name: "University of California, Santa Barbara",  abbr: "UCSB", dbId: null },
  { assistId: 132, name: "University of California, Santa Cruz",     abbr: "UCSC", dbId: null },
  { assistId: 46,  name: "University of California, Riverside",      abbr: "UCR",  dbId: null },
  { assistId: 144, name: "University of California, Merced",         abbr: "UCM",  dbId: null },
];

const CS_KEYWORDS = ["computer science", "software engineering", "computer engineering"];

let cookies = "";
let xsrfToken = "";

async function initSession() {
  const res = await fetch("https://assist.org/", { redirect: "follow" });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  cookies = setCookies.map(c => c.split(";")[0]).join("; ");
  for (const c of setCookies) {
    if (c.startsWith("X-XSRF-TOKEN=")) {
      xsrfToken = c.split("=")[1].split(";")[0];
    }
  }
  console.log("Session initialized, XSRF token obtained");
}

async function assistFetch(path) {
  const url = `https://assist.org/api/${path}`;
  const res = await fetch(url, {
    headers: {
      "Cookie": cookies,
      "X-XSRF-TOKEN": xsrfToken,
      "Accept": "application/json",
    },
  });
  if (!res.ok) throw new Error(`ASSIST API ${res.status}: ${url}`);
  return res.json();
}

async function getCSAgreementKeys(receivingId) {
  const data = await assistFetch(
    `agreements?receivingInstitutionId=${receivingId}&sendingInstitutionId=${CSM_ID}&academicYearId=${YEAR_ID}&categoryCode=major`
  );
  const reports = data.reports ?? [];
  return reports.filter(r =>
    CS_KEYWORDS.some(kw => r.label.toLowerCase().includes(kw))
  );
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

    // Each item in sending.items is a CourseGroup (OR between groups, AND within)
    for (const group of sending.items) {
      const ccCourses = [];
      for (const item of group.items) {
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
  return s.replace(/'/g, "''");
}

function makeUUID(prefix, counter) {
  const hex = counter.toString(16).padStart(12, "0");
  // prefix should be like "b0000000-0000-0000-0000-" (24 chars with dashes)
  return `${prefix}${hex}`;
}

async function main() {
  await initSession();

  const allMappings = []; // { uni, major, uniCourse, ccCourses }

  for (const uni of UNIVERSITIES) {
    console.log(`\nFetching agreements: CSM → ${uni.abbr}...`);
    let keys;
    try {
      keys = await getCSAgreementKeys(uni.assistId);
    } catch (e) {
      console.error(`  Failed to get agreements: ${e.message}`);
      continue;
    }

    if (keys.length === 0) {
      console.log(`  No CS-related agreements found`);
      continue;
    }

    for (const agreement of keys) {
      console.log(`  Fetching: ${agreement.label}`);
      await new Promise(r => setTimeout(r, 500)); // rate limit

      try {
        const data = await assistFetch(
          `articulation/Agreements?Key=${encodeURIComponent(agreement.key)}&sending=${CSM_ID}`
        );
        const mappings = extractArticulations(data.result);
        for (const m of mappings) {
          allMappings.push({ uni, major: agreement.label, ...m });
        }
        console.log(`    ${mappings.length} course mappings found`);
      } catch (e) {
        console.error(`    Failed: ${e.message}`);
      }
    }
  }

  console.log(`\n=== Total mappings: ${allMappings.length} ===\n`);

  // Generate SQL
  const lines = [];
  lines.push("-- Migration: Add ASSIST articulation data for Berkeley City College → UC campuses (Computer Science)");
  lines.push("-- Source: assist.org API, academic year 2025-2026");
  lines.push(`-- Generated: ${new Date().toISOString()}\n`);

  // Ensure university institutions exist
  const newUnis = UNIVERSITIES.filter(u => !u.dbId);
  let uniCounter = 0x13; // start after existing b0...0d
  for (const uni of newUnis) {
    uni.dbId = makeUUID("b0000000-0000-0000-0000-", ++uniCounter);
    lines.push(`INSERT INTO institutions (id, name, type, state, city, abbreviation) VALUES`);
    lines.push(`  ('${uni.dbId}', '${escSql(uni.name)}', 'university', 'CA', NULL, '${uni.abbr}')`);
    lines.push(`ON CONFLICT (id) DO NOTHING;\n`);
  }

  // Collect unique CC courses and university courses
  const ccCourseMap = new Map(); // "PREFIX NUMBER" → { prefix, number, title, units }
  const uniCourseMap = new Map();

  for (const m of allMappings) {
    if (m.uniCourse) {
      const key = `${m.uniCourse.prefix} ${m.uniCourse.number}`;
      if (!uniCourseMap.has(key)) uniCourseMap.set(key, { ...m.uniCourse, uniDbId: m.uni.dbId });
    }
    if (m.ccCourses) {
      for (const cc of m.ccCourses) {
        const key = `${cc.prefix} ${cc.number}`;
        if (!ccCourseMap.has(key)) ccCourseMap.set(key, cc);
      }
    }
  }

  // Insert CC courses
  let courseCounter = 0xB00;
  const ccCourseDbIds = new Map();
  lines.push("-- CC courses (Berkeley City College)");
  for (const [key, c] of ccCourseMap) {
    const id = makeUUID("d0000000-0000-0000-0000-", ++courseCounter);
    ccCourseDbIds.set(key, id);
    lines.push(`INSERT INTO courses (id, institution_id, code, title, units) VALUES`);
    lines.push(`  ('${id}', '${CSM_DB_ID}', '${escSql(key)}', '${escSql(c.title)}', ${c.units})`);
    lines.push(`ON CONFLICT (institution_id, code) DO NOTHING;`);
  }

  // Insert university courses
  const uniCourseDbIds = new Map();
  lines.push("\n-- University courses");
  for (const [key, c] of uniCourseMap) {
    const id = makeUUID("d0000000-0000-0000-0000-", ++courseCounter);
    uniCourseDbIds.set(key, id);
    lines.push(`INSERT INTO courses (id, institution_id, code, title, units) VALUES`);
    lines.push(`  ('${id}', '${c.uniDbId}', '${escSql(key)}', '${escSql(c.title)}', ${c.units})`);
    lines.push(`ON CONFLICT (institution_id, code) DO NOTHING;`);
  }

  // Insert articulation agreements
  lines.push("\n-- Articulation agreements (subqueries resolve course IDs by institution+code)");
  let artCounter = 0xC00;
  const seen = new Set();
  for (const m of allMappings) {
    if (!m.ccCourses) continue;
    const uniKey = `${m.uniCourse.prefix} ${m.uniCourse.number}`;
    const uniCourseId = uniCourseDbIds.get(uniKey);
    if (!uniCourseId) continue;

    for (const cc of m.ccCourses) {
      const ccKey = `${cc.prefix} ${cc.number}`;
      const ccCourseId = ccCourseDbIds.get(ccKey);
      if (!ccCourseId) continue;

      const dedupKey = `${ccKey}|${uniKey}|${m.uni.dbId}`;
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);

      const id = makeUUID("e0000000-0000-0000-0000-", ++artCounter);
      const majorName = m.major.replace(/, B\.\w+\.?$/, "");
      const note = cc.note ? `'${escSql(cc.note)}'` : "NULL";
      lines.push(`INSERT INTO articulation_agreements (id, cc_course_id, university_course_id, cc_institution_id, university_institution_id, major, effective_year, notes)`);
      lines.push(`  SELECT '${id}', cc.id, uni.id, '${CSM_DB_ID}', '${m.uni.dbId}', '${escSql(majorName)}', 2025, ${note}`);
      lines.push(`  FROM (SELECT id FROM courses WHERE institution_id='${CSM_DB_ID}' AND code='${escSql(ccKey)}' LIMIT 1) cc,`);
      lines.push(`       (SELECT id FROM courses WHERE institution_id='${m.uni.dbId}' AND code='${escSql(uniKey)}' LIMIT 1) uni`);
      lines.push(`ON CONFLICT (id) DO NOTHING;`);
    }
  }

  const sql = lines.join("\n");
  const fs = await import("fs");
  const outPath = "supabase/migrations/059_bcc_assist_articulation.sql";
  fs.writeFileSync(outPath, sql);
  console.log(`\nSQL migration written to ${outPath}`);
  console.log(`  CC courses: ${ccCourseMap.size}`);
  console.log(`  University courses: ${uniCourseMap.size}`);
  console.log(`  Articulation rows: ${seen.size}`);
}

main().catch(e => { console.error(e); process.exit(1); });
