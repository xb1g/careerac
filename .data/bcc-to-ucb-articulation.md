# Berkeley City College to UC Berkeley Transfer Articulation Agreements

**Source**: Existing database seed data (incomplete - browser automation failed to access ASSIST.org and UC Berkeley sites for comprehensive data)  
**Scraped At**: 2026-04-22  
**Scope**: Limited to available seed data; full comprehensive data requires browser automation access to ASSIST.org and UC Berkeley transfer pages  
**Institution IDs**: BCC = a0000000-0000-0000-0000-000000000005, UCB = b0000000-0000-0000-0000-000000000004  

## Confirmed Mappings

| Source Course | Source Title | Target Course | Target Title | Major | Agreement Year | Status | Evidence URL |
|---------------|--------------|---------------|--------------|-------|----------------|--------|--------------|
| CS 1 | Introduction to Programming | CS 61A | The Structure and Interpretation of Computer Programs | Electrical Engineering and Computer Sciences | 2024 | confirmed | https://assist.org/transfer/results?year=2024&institution=Berkeley+City+College&agreement=UC+Berkeley&agreementType=course (inferred from seed data) |
| MATH 1A | Calculus I | MATH 1A | Calculus | Electrical Engineering and Computer Sciences | 2024 | confirmed | https://assist.org/transfer/results?year=2024&institution=Berkeley+City+College&agreement=UC+Berkeley&agreementType=course (inferred from seed data) |
| MATH 1B | Calculus II | MATH 1B | Calculus | Electrical Engineering and Computer Sciences | 2024 | confirmed | https://assist.org/transfer/results?year=2024&institution=Berkeley+City+College&agreement=UC+Berkeley&agreementType=course (inferred from seed data) |

## Likely Mappings

(No likely mappings identified from available data)

## Unresolved Items

- **All subjects except CS and MATH for EECS major**: No data available due to browser automation failure. ASSIST.org contains comprehensive course-to-course equivalencies across all subjects (e.g., English, History, Biology, etc.) that could not be scraped.
- **GE/Breadth requirements**: UC Berkeley has specific breadth requirements that BCC courses may fulfill; data not available.
- **Major preparation courses**: Beyond EECS, other majors (e.g., Business, Psychology, etc.) have articulation agreements not captured.
- **Agreement updates**: Current agreements may have changed since 2024 seed data.

**Notes**: 
- Browser automation tool failed to start due to missing Playwright browsers despite installation attempts.
- ASSIST.org is the primary source for official UC transfer articulation.
- UC Berkeley transfer credit pages (https://ls-advise.berkeley.edu/transfer/index.html) may contain additional equivalency information.
- For comprehensive data, manual access to ASSIST.org search results or PDFs is required.
