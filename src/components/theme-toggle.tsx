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
        ? `System${resolvedTheme ? ` / ${resolvedTheme}` : ""}`
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
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] font-medium text-zinc-700 shadow-[0_1px_2px_rgba(24,24,27,0.05)] transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 hover:shadow-[0_8px_18px_rgba(24,24,27,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:ring-white/20 sm:gap-2 sm:px-3"
      >
        <Icon />
        <span className="hidden sm:inline">{label}</span>
        <span className="sr-only sm:hidden">Theme</span>
        <ChevronIcon />
      </button>

      {open && mounted && (
        <div
          role="menu"
          className="fixed right-3 top-16 z-50 w-40 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-[0_14px_34px_rgba(24,24,27,0.12)] dark:border-zinc-800 dark:bg-zinc-950 sm:absolute sm:right-0 sm:top-11"
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
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
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
