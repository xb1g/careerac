"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";

interface SchoolOption {
  name: string;
  abbreviation: string;
  category: string;
}

const DEFAULT_SCHOOLS: SchoolOption[] = [
  { name: "University of California, Los Angeles", abbreviation: "UCLA", category: "UC" },
  { name: "University of California, Berkeley", abbreviation: "UC Berkeley", category: "UC" },
  { name: "University of California, San Diego", abbreviation: "UCSD", category: "UC" },
  { name: "University of California, Santa Barbara", abbreviation: "UCSB", category: "UC" },
  { name: "University of California, Irvine", abbreviation: "UCI", category: "UC" },
  { name: "University of California, Davis", abbreviation: "UC Davis", category: "UC" },
  { name: "San José State University", abbreviation: "SJSU", category: "CSU" },
  { name: "California State University, Long Beach", abbreviation: "CSULB", category: "CSU" },
  { name: "California State University, Northridge", abbreviation: "CSUN", category: "CSU" },
  { name: "San Diego State University", abbreviation: "SDSU", category: "CSU" },
  { name: "California State University, Fullerton", abbreviation: "CSUF", category: "CSU" },
  { name: "Sacramento State University", abbreviation: "Sac State", category: "CSU" },
  { name: "University of Southern California", abbreviation: "USC", category: "Private" },
];

interface SchoolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  autoFocus?: boolean;
}

export function SchoolAutocomplete({
  value,
  onChange,
  placeholder,
  id,
  autoFocus,
}: SchoolAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = id ? `${id}-listbox` : "school-listbox";

  const filtered = useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return DEFAULT_SCHOOLS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.abbreviation.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [value]);

  const grouped = useMemo(() => {
    const map = new Map<string, SchoolOption[]>();
    for (const s of filtered) {
      const cat = s.category ?? "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    return map;
  }, [filtered]);

  const flatList = useMemo(() => {
    const items: SchoolOption[] = [];
    for (const opts of grouped.values()) items.push(...opts);
    return items;
  }, [grouped]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                      {highlight(opt.name)}{" "}
                      <span className="text-zinc-500 dark:text-zinc-400">
                        ({highlight(opt.abbreviation)})
                      </span>
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