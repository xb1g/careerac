#!/usr/bin/env python3
import re, json, csv, sys

def parse_snapshot(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')

    departments = []
    current_dept = None
    courses = []

    for i, line in enumerate(lines):
        heading_match = re.search(r'heading "(.+?)" \[level=4', line)
        if heading_match:
            if current_dept and courses:
                departments.append({'department': current_dept, 'courses': courses})
            current_dept = heading_match.group(1)
            courses = []

        if ' - row' not in line:
            continue

        row_lines = []
        j = i
        while j < len(lines) and ' - row' in lines[j]:
            row_lines.append(lines[j])
            j += 1

        row_text = '\n'.join(row_lines)
        cells = re.findall(r'cell "(.*?)" \[ref=', row_text)

        if len(cells) < 2:
            continue

        cells = [c.strip() for c in cells]
        first = cells[0]
        is_footnote = len(first) <= 3 and bool(re.match(r'^[*+o$%]$', first))

        if is_footnote and len(cells) >= 3:
            code, title = cells[1], cells[2]
            calgetc = cells[3] if len(cells) > 3 else ''
            igetc = cells[4] if len(cells) > 4 else ''
            units = cells[5] if len(cells) > 5 else ''
            uc_areas = cells[6] if len(cells) > 6 else ''
        elif not is_footnote and len(cells) >= 2:
            code, title = cells[0], cells[1]
            calgetc = cells[2] if len(cells) > 2 else ''
            igetc = cells[3] if len(cells) > 3 else ''
            units = cells[4] if len(cells) > 4 else ''
            uc_areas = cells[5] if len(cells) > 5 else ''
        else:
            continue

        if code and re.match(r'^[A-Z]+\s+\d', code) and not title.startswith('('):
            courses.append({'code': code, 'title': title, 'calgetc': calgetc, 'igetc': igetc, 'units': units, 'uc_areas': uc_areas})

    if current_dept and courses:
        departments.append({'department': current_dept, 'courses': courses})

    return departments

def main():
    input_file = '/Users/bunyasit/.local/share/opencode/tool-output/tool_db7eff608001sH6Dlc03tey9A1'
    depts = parse_snapshot(input_file)

    json_path = '/Users/bunyasit/dev/careerac/.data/bcc-uc-transferable-courses-2025-2026.json'
    csv_path = '/Users/bunyasit/dev/careerac/.data/bcc-uc-transferable-courses-2025-2026.csv'

    with open(json_path, 'w') as f:
        json.dump(depts, f, indent=2)

    with open(csv_path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['Department', 'Course Code', 'Title', 'Cal-GETC', 'IGETC', 'Semester Units', 'UC Areas'])
        for dept in depts:
            for c in dept['courses']:
                w.writerow([dept['department'], c['code'], c['title'], c['calgetc'], c['igetc'], c['units'], c['uc_areas']])

    total = sum(len(d['courses']) for d in depts)
    print(f"{len(depts)} departments, {total} courses")
    for d in depts:
        print(f"  {d['department']}: {len(d['courses'])} courses")

if __name__ == '__main__':
    main()