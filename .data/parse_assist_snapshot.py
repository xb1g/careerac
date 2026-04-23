#!/usr/bin/env python3
import re, json, csv

with open('/Users/bunyasit/.local/share/opencode/tool-output/tool_db7eff608001sH6Dlc03tey9A1') as f:
    content = f.read()

dept_pattern = re.compile(r'heading \"(.+?)\" \[level=4')
parts = dept_pattern.split(content)

departments = []
for i in range(1, len(parts) - 1, 2):
    dept_name = parts[i].strip()
    section = parts[i + 1]
    courses = []

    for m in re.finditer(r'cell \"([A-Z][A-Z0-9]*\s+\d+\w*)\" \[ref=', section):
        code = m.group(1)
        row_start = section.rfind('- row', 0, m.start())
        row_end = section.find('- row', m.start() + 5)
        if row_end == -1:
            row_end = len(section)
        row_block = section[row_start:row_end]
        row_lines = row_block.split('\n')
        cells = []
        for line in row_lines:
            m = re.search(r'cell "(.*?)" \[ref=', line)
            if m:
                cells.append(m.group(1).strip())
            elif re.search(r'^\s+- cell\s*$', line):
                cells.append('')

        if len(cells) < 2:
            continue

        if cells[0] == '':
            code, title = cells[1], cells[2]
            calgetc = cells[3] if len(cells) > 3 else ''
            igetc = cells[4] if len(cells) > 4 else ''
            units = cells[5] if len(cells) > 5 else ''
            uc_areas = cells[6] if len(cells) > 6 else ''
        elif bool(re.match(r'^[*+o$%]$', cells[0])):
            code, title = cells[1], cells[2]
            calgetc = cells[3] if len(cells) > 3 else ''
            igetc = cells[4] if len(cells) > 4 else ''
            units = cells[5] if len(cells) > 5 else ''
            uc_areas = cells[6] if len(cells) > 6 else ''
        else:
            continue

        if title.startswith('(') or code.startswith('('):
            continue
        courses.append({'code': code, 'title': title, 'calgetc': calgetc, 'igetc': igetc, 'units': units, 'uc_areas': uc_areas})

    if courses:
        departments.append({'department': dept_name, 'courses': courses})

total = sum(len(d['courses']) for d in departments)
print(f'{len(departments)} departments, {total} courses')

with open('/Users/bunyasit/dev/careerac/.data/bcc-uc-transferable-courses-2025-2026.json', 'w') as f:
    json.dump(departments, f, indent=2)

with open('/Users/bunyasit/dev/careerac/.data/bcc-uc-transferable-courses-2025-2026.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['Department', 'Course Code', 'Title', 'Cal-GETC', 'IGETC', 'Semester Units', 'UC Areas'])
    for dept in departments:
        for c in dept['courses']:
            w.writerow([dept['department'], c['code'], c['title'], c['calgetc'], c['igetc'], c['units'], c['uc_areas']])