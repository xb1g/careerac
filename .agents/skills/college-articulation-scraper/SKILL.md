---
name: college-articulation-scraper
description: Scrape college course catalogs and transfer articulation data, then organize how source-college courses map to destination universities such as UC Berkeley, CSU campuses, or other transfer targets. Use when Codex needs to gather course lists, catalog metadata, ASSIST-style articulation rules, GE/breadth mappings, or transfer-path evidence from official college and university sites, especially when the work should be split across subagents and verified with browser automation.
---

# College Articulation Scraper

## Overview

Use this skill to gather transfer-ready course data for a college and map it to one or more destination universities.

Prefer official sources, parallelize by school or target campus, and return evidence-backed results that clearly separate facts, inferred mappings, and unknowns.

## ASSIST.org Critical Implementation Notes

**DO NOT assume ASSIST institution IDs** - The numeric IDs in ASSIST URLs (e.g., `institution=74`) do NOT match college names intuitively. You MUST discover the correct ID for each college via API interception or testing.

**Use browser response interception** - ASSIST's API returns HTTP 400 when called directly via fetch/curl, but works when responses are intercepted during browser navigation.

**Correct API pattern for ASSIST:**
```
URL: https://www.assist.org/transfer/results?year={YEAR}&institution={ID}&type={TYPE}&view=transferability
API Endpoint (intercept from browser): https://www.assist.org/api/transferability/courses?institutionId={ID}&academicYearId={YEAR}&listType={TYPE}
```

**Known ASSIST institution IDs (discovered 2026-04):**
| College | ASSIST ID |
|---------|-----------|
| Berkeley City College | 58 |
| College of Alameda | 111 |
| Laney College | 77 |
| Merritt College | 13 |
| College of San Mateo | 5 |
| Cañada College | 68 |
| Skyline College | 127 |
| Orange Coast College | 74 |
| Cypress College | 71 |
| Fullerton College | 134 |
| Golden West College | 55 |

**Course data field mapping from ASSIST API:**
```typescript
{
  identifier: "ENGL A109",      // Full course code
  prefixCode: "ENGL",           // Department prefix
  courseNumber: "A109",        // Course number
  courseTitle: "Critical Reasoning and Writing for Science and Technology",
  departmentName: "English",
  maxUnits: 4,
  minUnits: 4,
  isCsuTransferable: true,
  transferAreas: [{ code: "UCTCA", codeDescription: "UCTCA" }, ...]
}
```

## Workflow

1. Confirm the scope:
- Identify the source college, target universities, subject areas, catalog year, and whether the user wants full-catalog scraping or only transfer-relevant courses.
- If the user is ambiguous, assume California transfer workflows first because ASSIST and CSU/UC articulation sources are usually the highest-signal starting point.

2. Choose sources in this order:
- Official articulation systems such as ASSIST or the destination university's transfer-equivalency database.
- Official source-college catalog, course inventory, schedule, and department pages.
- Official university transfer, departmental, major-prep, and GE/breadth pages.
- Only use third-party sources to discover leads. Do not treat them as final evidence if an official source exists.

3. Decide the browser operator:
- Prefer `agent-browser` when direct CLI browser automation is available.
- Otherwise use the `browse` skill already present in the environment.
- If the user explicitly asks for another browser wrapper such as OpenCLI, use it only when it is actually available in the environment; otherwise fall back to `agent-browser` or `browse` and say so.

**For ASSIST specifically:** Use Playwright to intercept API responses during page navigation. Set up a response listener BEFORE navigating, then navigate to the transferability page.

4. Split work into subagents when the task spans multiple independent axes:
- One subagent per source college when comparing several colleges.
- One subagent per destination university or campus when comparing articulation targets.
- One subagent per subject cluster when the catalog is very large.
- Keep each subagent's mission concrete: source, target, year, subject scope, and output path.

5. In each subagent, collect:
- Course identity: code, title, units, prerequisites, department, catalog year, and official URL.
- Articulation evidence: destination campus, destination course or requirement, agreement year or effective term, official page URL, and any caveats.
- Negative results separately: no articulation found, expired agreement, manual review needed, or page inaccessible.

6. Merge results conservatively:
- Deduplicate by source course code plus target campus plus agreement year.
- Preserve many-to-one and one-to-many mappings.
- Mark cross-page synthesis as inference unless one official page states the full mapping directly.
- Never silently fill gaps from intuition.

7. Return a structured report and, when useful, a machine-readable artifact using the schema in [references/output-format.md](references/output-format.md).

## Subagent Prompt Pattern

Use fresh subagents for independent scraping passes. Give them only the task-local scope and the skill path.

Template:

```text
Use $college-articulation-scraper at /Users/bunyasit/dev/careerac/.agents/skills/college-articulation-scraper.
Gather official course and articulation data for <source college> to <target university or campus> for <catalog/agreement year>.
Scope: <subjects or "all transfer-relevant courses">.
Use browser automation with agent-browser or browse.
Write findings to <artifact path> and cite every official source URL you rely on.
Separate confirmed mappings, likely mappings, and unresolved items.
```

Do not leak your synthesis into the prompt. Let the subagent discover the evidence independently.

## Evidence Rules

- Prefer direct page URLs over search-result URLs.
- Capture the exact catalog or articulation year whenever the site exposes it.
- If a site exposes PDFs, downloadable tables, or modal details, save or cite them rather than summarizing from memory.
- When two official sources disagree, report the conflict and keep both citations.
- When browser automation fails on a site, retry with a narrower task before changing tools.

## Common California Targets

- For California community-college transfer work, check ASSIST first for UC and CSU articulation.
- For UC Berkeley, also inspect department transfer-credit or major-preparation pages when the articulation table alone is incomplete.
- For CSU campuses, check campus transfer or equivalency pages when ASSIST does not cover the needed year or requirement type.
- Use college catalog pages to confirm source-course titles, units, and prerequisite chains before claiming equivalency.

## Deliverables

Always produce:

- A concise narrative summary of the transfer pathways found.
- A citation-backed table or JSON artifact for the mappings.
- An explicit unresolved-items section.
- The scraping date and any year-specific limitations.

Load [references/output-format.md](references/output-format.md) when you need the exact field set or output template.
