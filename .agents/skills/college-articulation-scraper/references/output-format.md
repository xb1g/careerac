# Output Format

Use this schema when the user wants structured results, a reusable dataset, or a handoff artifact.

## Required top-level fields

```json
{
  "source_college": "",
  "source_college_assist_id": 0,
  "catalog_year": "",
  "scraped_at": "",
  "targets": [],
  "courses": [],
  "mappings": [],
  "unresolved": []
}
```

## Course object (standard format)

```json
{
  "course_code": "",
  "course_title": "",
  "units": "",
  "department": "",
  "prefix": "",
  "prerequisites": [],
  "source_url": "",
  "is_csu_transferable": true,
  "is_uc_transferable": true,
  "transfer_areas": [{"code": "UCTCA", "description": "UCTCA"}, ...]
}
```

## ASSIST API Course object (exact fields from API)

When scraping from ASSIST, use these exact field names from the API response:

```json
{
  "identifier": "ENGL A109",
  "prefixCode": "ENGL",
  "courseNumber": "A109",
  "courseTitle": "Critical Reasoning and Writing for Science and Technology",
  "departmentName": "English",
  "maxUnits": 4,
  "minUnits": 4,
  "isCsuTransferable": true,
  "transferAreas": [
    { "code": "1B", "codeDescription": "Critical Thinking - English Composition" },
    { "code": "UC-E", "codeDescription": "English Composition" },
    { "code": "UCTCA", "codeDescription": "UCTCA" }
  ]
}
```

## Mapping object

```json
{
  "source_course_code": "",
  "target_school": "",
  "target_requirement_type": "course|major_prep|ge|breadth|unknown",
  "target_requirement_label": "",
  "agreement_year": "",
  "status": "confirmed|likely|no_match|expired|manual_review",
  "evidence_urls": [],
  "notes": ""
}
```

## Unresolved object

```json
{
  "source_course_code": "",
  "target_school": "",
  "reason": "",
  "checked_urls": []
}
```

## Narrative summary checklist

- State which schools and years were covered.
- State whether ASSIST or another official articulation system was available.
- Separate confirmed mappings from probable matches derived from multiple official sources.
- Call out missing years, inaccessible pages, or program-specific ambiguity.
- Note any institution ID discoveries or corrections made during scraping.
