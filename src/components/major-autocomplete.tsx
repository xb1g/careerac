"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";

interface MajorOption {
  name: string;
  category: string;
}

const DEFAULT_MAJORS: MajorOption[] = [
  { name: "Computer Science", category: "STEM" },
  { name: "Software Engineering", category: "STEM" },
  { name: "Data Science", category: "STEM" },
  { name: "Mathematics", category: "STEM" },
  { name: "Statistics", category: "STEM" },
  { name: "Physics", category: "STEM" },
  { name: "Chemistry", category: "STEM" },
  { name: "Environmental Science", category: "STEM" },
  { name: "Earth Science/Geology", category: "STEM" },
  { name: "Biology", category: "Biological Sciences" },
  { name: "Biochemistry", category: "Biological Sciences" },
  { name: "Molecular Biology", category: "Biological Sciences" },
  { name: "Cell Biology", category: "Biological Sciences" },
  { name: "Biological Sciences", category: "Biological Sciences" },
  { name: "Aerospace Engineering", category: "Engineering" },
  { name: "Bioengineering", category: "Engineering" },
  { name: "Chemical Engineering", category: "Engineering" },
  { name: "Civil Engineering", category: "Engineering" },
  { name: "Electrical Engineering", category: "Engineering" },
  { name: "Mechanical Engineering", category: "Engineering" },
  { name: "Environmental Engineering", category: "Engineering" },
  { name: "Materials Science", category: "Engineering" },
  { name: "Business Administration", category: "Business" },
  { name: "Economics", category: "Social Sciences" },
  { name: "Psychology", category: "Social Sciences" },
  { name: "Political Science", category: "Social Sciences" },
  { name: "Sociology", category: "Social Sciences" },
  { name: "Communications", category: "Social Sciences" },
  { name: "English", category: "Humanities" },
  { name: "History", category: "Humanities" },
  { name: "Nursing", category: "Health Sciences" },
  { name: "Art", category: "Arts" },
];

interface MajorAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  autoFocus?: boolean;
}

export function MajorAutocomplete({
  value,
  onChange,
  placeholder,
  id,
  autoFocus,
}: MajorAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = id ? `${id}-listbox` : "major-listbox";

  const filtered = useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return DEFAULT_MAJORS.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 8);
  }, [value]);

  // Group filtered results by category
  const grouped = useMemo(() => {
    const map = new Map<string, MajorOption[]>();
    for (const m of filtered) {
      const cat = m.category ?? "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(m);
    }
    return map;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatList = useMemo(() => {
    const items: MajorOption[] = [];
    for (const opts of grouped.values()) items.push(...opts);
    return items;
  }, [grouped]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex < 0 || !listboxRef.current) return;
    const el = listboxRef.current.querySelector(`[data-index="${highlightIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex]);

  const select = useCallback(
    (name: string) => {
      onChange(name);
      setIsOpen(false);
      setHighlightIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || flatList.length === 0) {
      if (e.key === "ArrowDown" && filtered.length > 0) {
        setIsOpen(true);
        setHighlightIndex(0);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((i) => (i + 1) % flatList.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((i) => (i - 1 + flatList.length) % flatList.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < flatList.length) {
          select(flatList[highlightIndex].name);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setHighlightIndex(-1);
    if (e.target.value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const highlight = (text: string) => {
    if (!value.trim()) return text;
    const idx = text.toLowerCase().indexOf(value.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {text.slice(idx, idx + value.length)}
        </span>
        {text.slice(idx + value.length)}
      </>
    );
  };

  const showDropdown = isOpen && flatList.length > 0;
  let itemIndex = 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-activedescendant={
          highlightIndex >= 0 ? `${listboxId}-opt-${highlightIndex}` : undefined
        }
        aria-autocomplete="list"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (value.trim() && filtered.length > 0) setIsOpen(true); }}
        placeholder={placeholder}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />
      {showDropdown && (
        <ul
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg"
        >
          {Array.from(grouped.entries()).map(([category, options]) => (
            <li key={category} role="presentation">
              <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 sticky top-0">
                {category}
              </div>
              <ul role="group" aria-label={category}>
                {options.map((opt) => {
                  const idx = itemIndex++;
                  return (
                    <li
                      key={opt.name}
                      id={`${listboxId}-opt-${idx}`}
                      role="option"
                      data-index={idx}
                      aria-selected={idx === highlightIndex}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        select(opt.name);
                      }}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      className={`cursor-pointer px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 ${
                        idx === highlightIndex
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {highlight(opt.name)}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}