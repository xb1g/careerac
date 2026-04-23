# Output Format

Use this schema when the user wants structured results, a reusable dataset, or a handoff artifact.

## Required top-level fields

```json
{
  "source_college": "",
  "catalog_year": "",
  "scraped_at": "",
  "targets": [],
  "courses": [],
  "mappings": [],
  "unresolved": []
}
```

## Course object

```json
{
  "course_code": "",
  "course_title": "",
  "units": "",
  "department": "",
  "prerequisites": [],
  "source_url": ""
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
