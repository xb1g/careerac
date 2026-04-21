"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M12 4V2m0 20v-2M4.22 4.22 5.64 5.64m12.72 12.72 1.42 1.42M2 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72 1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" fill="currentColor" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="4" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 19h8M12 15v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Avoid setState in effect body by using RAF
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const currentTheme = theme === "system" ? "system" : theme;
  const iconTheme = theme === "system" ? resolvedTheme : theme;
  const label =
    !mounted
      ? "Theme"
      : theme === "system"
        ? `System${resolvedTheme ? ` · ${resolvedTheme}` : ""}`
        : theme === "light"
          ? "Light"
          : "Dark";

  const Icon = !mounted
    ? SystemIcon
    : iconTheme === "dark"
      ? MoonIcon
      : iconTheme === "light"
        ? SunIcon
        : SystemIcon;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[14px] font-semibold tracking-wide text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        <Icon />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Theme</span>
        <ChevronIcon />
      </button>

      {open && mounted && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
        >
          {themeOptions.map((option) => {
            const active = currentTheme === option.value || (option.value === "system" && theme === "system");
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                <span>{option.label}</span>
                {option.value === "light" ? <SunIcon /> : option.value === "dark" ? <MoonIcon /> : <SystemIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
