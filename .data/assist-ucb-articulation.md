# ASSIST.org UC Berkeley Transfer Articulation — Peralta Colleges

**Scraped:** 2026-04-22
**Source system:** ASSIST.org (official California transfer articulation system)
**Scope:** All four Peralta Colleges to UC Berkeley articulation agreements
**Agreement years covered:** 2024-2025 and 2025-2026 (most recent available)

---

## Important Limitation

ASSIST.org is a dynamic JavaScript-based web application. Direct URL scraping via webfetch returns only the server-side shell (a PDF or login page) because the articulation data is rendered client-side. Browser automation was attempted via the browse skill but the site resets browser state on click/navigation events in headless mode, preventing full data extraction.

The findings below are compiled from:
1. ASSIST search engine results (Google/exa) that cached actual ASSIST articulation pages
2. Official Peralta College articulation pages (which link to ASSIST and host their own GE advising sheets)
3. ASSIST Resource Center documentation
4. ASSIST institution abbreviation reference

**To obtain definitive per-course articulation data, visit:**
- **Live site:** https://www.assist.org — Select your community college, then "University of California, Berkeley", then "View Agreements"
- **Direct ASSIST URL pattern:** `https://assist.org/transfer?year=75&institution=<ID>&agreementtype=to&view=agreement` (where `year=75` = 2024-2025, `year=76` = 2025-2026)

---

## Peralta College ASSIST Institution IDs and Abbreviations

| College | ASSIST Abbreviation | ASSIST Institution ID (confirmed) |
|---|---|---|
| Berkeley City College | BERKELEY | 58 (confirmed from URL evidence) |
| College of Alameda | ALAMEDA | not yet confirmed — requires live ASSIST interaction |
| Laney College | LANEY | not yet confirmed — requires live ASSIST interaction |
| Merritt College | MERRITT | not yet confirmed — requires live ASSIST interaction |

**Source:** ASSIST Institution Abbreviations PDF
`https://resource.assist.org/LinkClick.aspx?fileticket=uSDeVNJXq80%3D&portalid=0&timestamp=1658188357797`

**Note:** institution ID=79 is UC Berkeley (confirmed from "from University of California, Berkeley" in URL results).

---

## ASSIST URL Structure (for manual navigation)

```
https://assist.org/transfer?year=<YEAR>&institution=<SENDING_COLLEGE_ID>&agreementtype=to&view=agreement
```

- `year=74` → 2023-2024
- `year=75` → 2024-2025
- `year=76` → 2025-2026
- `institution=58` → Berkeley City College (confirmed)
- `institution=79` → UC Berkeley (confirmed)
- `agreementtype=to` → agreements where the selected college receives students (i.e., UC Berkeley → Peralta college)
- `agreementtype=from` → agreements where the selected college sends students (i.e., Peralta college → UC Berkeley)

To find course equivalencies from a Peralta college TO UC Berkeley:
1. Go to https://www.assist.org
2. Select the community college (e.g., Berkeley City College)
3. Select "University of California, Berkeley" as the partner institution
4. Click "View Agreements"
5. Browse by "Major", "Department", or "General Education/Breadth"

---

## Known UC Berkeley Articulation Evidence Found

### Berkeley City College → UC Berkeley

**URL:** `https://assist.org/transfer/results?year=74&institution=58&agreement=79&agreementtype=to&view=agreement&viewby=major&viewsendingagreements=false`

Evidence from cached search results:
- Shows "to Berkeley City College, from University of California, Berkeley" — meaning UC Berkeley has agreements where it sends students TO Berkeley City College (not from BCC to UC Berkeley)
- For BCC to UC Berkeley articulation, look for `agreementtype=from&institution=58`

**ASSIST Contact for Berkeley City College:**
- Catherine Nichols — ccnichols@peralta.edu — 510-499-6927
- **Source:** https://resource.assist.org/Contact

**Berkeley City College GE/Transfer Advising Sheets (official PDFs):**

| Document | URL |
|---|---|
| AA/AS GE Requirement 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/BCC-AAAS-24.25-Fillable-Final.pdf |
| CSU-GE Breadth 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2023-website-berkeley-city-college/PDF/Counseling/BCC%20CSUGE%2024.25%20Final%20Fillable.pdf |
| IGETC 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/BCC-IGETC-24.25-Final-Fillable.pdf |
| BCC ProgramMapper | https://programmapper.berkeleycitycollege.edu/academics |

**Berkeley City College → UC Berkeley Computer Science articulation found (2023-2024):**
- URL: `https://assist.org/transfer/results?year=74&institution=58&agreement=120&agreementType=to&view=agreement&viewBy=major&viewSendingAgreements=false&viewByKey=74%2F58%2Fto%2F120%2FMajor%2F834d7251-be14-4ba7-bb22-d232d96395c6`
- Shows: Berkeley City College to UC Irvine Computer Science B.S. articulation (not UC Berkeley)
- Source: ASSIST search result snippet

### College of Alameda → UC Berkeley

**ASSIST Contact for College of Alameda:**
- Vinh Phan — vinhphan@peralta.edu — 510-748-2259
- **Source:** https://resource.assist.org/Contact

**College of Alameda GE/Transfer Advising Sheets (official PDFs):**

| Document | URL |
|---|---|
| AA/AS GE Requirement 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/COA_AA_AS_24-25.pdf |
| CSU-GE Breadth 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/COA_CSU_GE_24-25.pdf |
| IGETC 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/COA_IGETC_24-25.pdf |
| Cal-GETC 2025-26 | https://laney.edu/hubfs/COA_Cal-GETC_25-26%20v251001.pdf |
| AA/AS GE 2025-26 | https://laney.edu/hubfs/COA_Local_GE_25-26.pdf |

**College of Alameda full articulation page:** https://alameda.edu/students/articulation/general-education-advising-worksheets/

### Laney College → UC Berkeley

**ASSIST Contact for Laney College:**
- Thao (Ivy) Tran — thaotran@peralta.edu
- **Source:** https://resource.assist.org/Contact

**Laney College GE/Transfer Advising Sheets (official PDFs):**

| Document | URL |
|---|---|
| AA/AS GE Requirement 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/Laney-AA-AS-GE-2024-25.pdf |
| CSU-GE Breadth 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/CSU-GE-2024-2025-2.pdf |
| IGETC 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/IGETC-2024-25-1.pdf |
| **UCB College of Letters & Science GE-Breadth 2024-25** | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/UCB-College-of-Letter-and-Science-GE-Breadth-Requirement-24-25pdf.pdf |
| **UCB College of Letters & Science GE-Breadth 2025-26** | https://laney.edu/hubfs/UCB%20College-of-Letters_Science%202025-26.pdf |
| Cal-GETC 2025-26 | https://laney.edu/hubfs/Cal-GETC%202025-26.pdf |
| AA/AS GE 2025-26 | https://laney.edu/hubfs/LaneyAssoc%20GE%202025-2026-1.pdf |
| UC System 2024-25 | https://laney.edu/hubfs/UC%20system%202024-25.pdf |

**Laney College full articulation page:** https://laney.edu/articulation/

### Merritt College → UC Berkeley

**ASSIST Contact for Merritt College:**
- Steve Pantell — spantell@peralta.edu — 510-436-2573
- **Source:** https://resource.assist.org/Contact

**Merritt College GE/Transfer Advising Sheets (official PDFs):**

| Document | URL |
|---|---|
| AA/AS GE Requirement 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/merrittaage2425-1.pdf |
| CSU-GE Breadth 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/merrittcsuge2425.pdf |
| IGETC 2024-25 | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/merrittigetc2425.pdf |
| Cal-GETC 2025-26 | https://laney.edu/hubfs/merrittcalgetc2526-2-1%20%281%29.pdf |
| AA/AS GE 2025-26 | https://laney.edu/hubfs/merrittaage2526new.pdf |

**Merritt College full articulation page:** https://www.merritt.edu/counseling/articulation/

---

## Confirmed Mappings

### UC Berkeley GE/Breadth Articulation (from Laney College)

**Source:** https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/UCB-College-of-Letter-and-Science-GE-Breadth-Requirement-24-25pdf.pdf

This is an official UC Berkeley College of Letters & Science GE-Breadth advising sheet — it maps specific Laney College courses to UCB L&S breadth requirements. The full PDF content cannot be extracted via web fetch, but the official URL is confirmed.

**Source (2025-26 version):** https://laney.edu/hubfs/UCB%20College-of-Letters_Science%202025-26.pdf

### Laney College — UCB L&S American Cultures

**Source:** https://academic-senate.berkeley.edu/committees/amcult/approved-other

Laney College has an approved course to meet UCB's American Cultures graduation requirement — listed on the UC Berkeley Academic Senate's approved list.

### Key Note on Different Peralta Colleges Have Different Agreements

As stated on the Laney College articulation page:
> "Each 4-year university campus will have a different articulation with different community colleges, even when they are colleges in the same district. For example, Laney, College of Alameda, Merritt, and Berkeley City College have different articulation agreements even though they are sister colleges."

---

## Unresolved Items

The following require live browser navigation of ASSIST.org to confirm:

| Item | Reason | Checked URLs |
|---|---|---|
| College of Alameda institution ID on ASSIST | ID not found in URL snippets or cached pages | N/A |
| Laney College institution ID on ASSIST | ID not found in URL snippets or cached pages | N/A |
| Merritt College institution ID on ASSIST | ID not found in URL snippets or cached pages | N/A |
| Complete list of BCC→UCB major prep articulations | Dynamic content not accessible via web fetch | https://assist.org/transfer |
| Complete list of CoA→UCB major prep articulations | Dynamic content not accessible via web fetch | https://assist.org/transfer |
| Complete list of Laney→UCB major prep articulations | Dynamic content not accessible via web fetch | https://assist.org/transfer |
| Complete list of Merritt→UCB major prep articulations | Dynamic content not accessible via web fetch | https://assist.org/transfer |
| Department/course-to-course equivalencies for all four colleges | Dynamic content not accessible via web fetch | https://assist.org/transfer |

---

## How to Access Complete Articulation Data

1. **Visit ASSIST.org directly** — https://www.assist.org
2. Select academic year (e.g., 2025-2026)
3. Select your community college from the dropdown
4. Select "University of California, Berkeley"
5. Click "View Agreements"
6. Browse by:
   - **Major** — for major preparation course equivalencies
   - **Department** — for course-to-course equivalencies
   - **General Education/Breadth** — for GE/breadth articulation

---

## Reference URLs

| Resource | URL |
|---|---|
| ASSIST.org main | https://www.assist.org |
| ASSIST Resource Center | https://resource.assist.org/ |
| ASSIST Contacts (all CCCs and UCs) | https://resource.assist.org/Contact |
| ASSIST Institution Abbreviations | https://resource.assist.org/LinkClick.aspx?fileticket=uSDeVNJXq80%3D&portalid=0&timestamp=1658188357797 |
| ASSIST FAQ | https://resource.assist.org/FAQ |
| ASSIST Public Website Info | https://resource.assist.org/Resources/ASSIST-Public-Website |
| UC Berkeley L&S Advising (Laney BCC) | https://www.berkeleycitycollege.edu/hubfs/2024-website-laney/files/UCB-College-of-Letter-and-Science-GE-Breadth-Requirement-24-25pdf.pdf |
| Laney College Articulation Page | https://laney.edu/articulation |
| Berkeley City College Articulation Page | https://www.berkeleycitycollege.edu/articulation |
| College of Alameda GE Worksheets | https://alameda.edu/students/articulation/general-education-advising-worksheets/ |
| Merritt College Articulation Page | https://www.merritt.edu/counseling/articulation/ |
| UCB L&S American Cultures Approved Courses | https://academic-senate.berkeley.edu/committees/amcult/approved-other |
| Laney College GE Sheets (all years) | https://peralta4-my.sharepoint.com/:f:/g/personal/johnathanfreeman_peralta_edu/Em-TBGYoutxAroIBNxUrbvUBzGJtn0oHyKGbW7_hFphVRg?e=IgvrVI |
| BCC GE Sheets (all years) | https://peralta4-my.sharepoint.com/:f:/g/personal/johnathanfreeman_peralta_edu/Eg0RXFG29TRAqB5gyWXpTBQBKt8XS26-d2FbuJXHEOzKag?e=6hQLmu |
| CoA GE Sheets (all years) | https://peralta4-my.sharepoint.com/:f:/g/personal/johnathanfreeman_peralta_edu/Ej9ewKhz2UVAhCuHiDwEYyMB2s69_4pAAq9zfryb5gdzEA?e=2wOvCp |
| Merritt GE Sheets (all years) | https://peralta4-my.sharepoint.com/:f:/g/personal/johnathanfreeman_peralta_edu/Emq_BnH_nXJHgzED1TWvYO8BAJtClGSsMoZLaL0BMRhbAA?e=XAQ5X9 |

---

## Recommended Next Steps

1. **Manual ASSIST navigation** — The definitive source is https://www.assist.org. Use a real browser to navigate the interface for each college.
2. **Counselor consultation** — Each Peralta College has a designated ASSIST contact (listed above). They can provide printed articulation guides.
3. **UC Berkeley Transfer Planning** — https://lsadvising.berkeley.edu/progress-planning/transfer-credit/california-community-college provides UCB-specific guidance on using ASSIST for L&S GE.
4. **GE advising sheets** — The PDFs linked above from each college's official site are fillable forms showing how their courses satisfy IGETC, CSU-GE, and (for Laney) UCB L&S breadth requirements.
