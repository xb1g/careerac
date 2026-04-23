#!/bin/bash

input_file="/Users/bunyasit/dev/careerac/.data/bcc-catalog.txt"
output_file="/Users/bunyasit/dev/careerac/.data/bcc-full-catalog.md"

echo "# Berkeley City College Full Course Catalog" > "$output_file"
echo "" >> "$output_file"
echo "Source: https://www.berkeleycitycollege.edu/hubfs/2024-2025%20BCC%20Catalog.pdf" >> "$output_file"
echo "" >> "$output_file"

current_dept=""
current_code=""
current_title=""
current_units=""
current_prereq=""
current_desc=""

while IFS= read -r line; do
    # Check if line is a department code (all caps, no spaces)
    if [[ $line =~ ^[A-Z]{2,}[[:space:]]*$ ]]; then
        current_dept="$line"
        continue
    fi
    
    # Check if line is a course code (dept space number)
    if [[ $line =~ ^[A-Z]{2,}[[:space:]][0-9A-Z]+$ ]]; then
        # Save previous course if exists
        if [[ -n "$current_code" ]]; then
            echo "## $current_code: $current_title" >> "$output_file"
            echo "" >> "$output_file"
            echo "- **Units**: $current_units" >> "$output_file"
            echo "- **Department**: $current_dept" >> "$output_file"
            if [[ -n "$current_prereq" ]]; then
                echo "- **Prerequisites**: $current_prereq" >> "$output_file"
            fi
            echo "- **Source URL**: https://www.berkeleycitycollege.edu/hubfs/2024-2025%20BCC%20Catalog.pdf" >> "$output_file"
            echo "" >> "$output_file"
            echo "$current_desc" >> "$output_file"
            echo "" >> "$output_file"
        fi
        
        current_code="$line"
        current_title=""
        current_units=""
        current_prereq=""
        current_desc=""
        continue
    fi
    
    # Check if line starts with units
    if [[ $line =~ ^[0-9]+[[:space:]]Units ]]; then
        current_units="$(echo "$line" | sed 's/^\([0-9]\+\).*/\1/')"
        continue
    fi
    
    # Check if line starts with Prerequisite
    if [[ $line =~ ^Prerequisite ]]; then
        current_prereq="$(echo "$line" | sed 's/^Prerequisite: //')"
        continue
    fi
    
    # Check if line is Acceptable for Credit
    if [[ $line =~ ^Acceptable[[:space:]]for[[:space:]]Credit ]]; then
        continue
    fi
    
    # If not matched, it's part of description or title
    if [[ -z "$current_title" ]]; then
        current_title="$line"
    else
        current_desc="$current_desc$line "
    fi
done < "$input_file"

# Save last course
if [[ -n "$current_code" ]]; then
    echo "## $current_code: $current_title" >> "$output_file"
    echo "" >> "$output_file"
    echo "- **Units**: $current_units" >> "$output_file"
    echo "- **Department**: $current_dept" >> "$output_file"
    if [[ -n "$current_prereq" ]]; then
        echo "- **Prerequisites**: $current_prereq" >> "$output_file"
    fi
    echo "- **Source URL**: https://www.berkeleycitycollege.edu/hubfs/2024-2025%20BCC%20Catalog.pdf" >> "$output_file"
    echo "" >> "$output_file"
    echo "$current_desc" >> "$output_file"
    echo "" >> "$output_file"
fi

echo "Parsing complete. Output written to $output_file"
