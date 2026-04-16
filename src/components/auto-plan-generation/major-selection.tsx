import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface MajorSelectionFallbackProps {
  open?: boolean;
  suggestions?: string[];
  initialValue?: string | null;
  onContinue?: (selectedMajor: string) => void;
  onConfirm?: (selectedMajor: string) => void;
  onSwitchToCustomize?: () => void;
  onCancel?: () => void;
}

const POPULAR_MAJORS = [
  "Computer Science",
  "Business Administration",
  "Psychology",
  "Biology",
  "Engineering",
  "Nursing",
  "Economics",
  "Communications",
  "Political Science",
  "English",
];

export function MajorSelectionFallback({
  open = true,
  suggestions = [],
  initialValue,
  onContinue,
  onConfirm,
  onSwitchToCustomize,
  onCancel,
}: MajorSelectionFallbackProps) {
  const [selectedMajor, setSelectedMajor] = useState<string>(initialValue ?? "");

  const resolvedOptions = Array.from(new Set([...suggestions, ...POPULAR_MAJORS]));

  if (!open) return null;

  const handleContinue = () => {
    const nextMajor = selectedMajor.trim();
    if (!nextMajor || nextMajor === "other") return;
    (onConfirm ?? onContinue)?.(nextMajor);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-8">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Help Us Understand Your Major
          </h2>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Your transcript shows a diverse range of courses. To generate the most accurate transfer plan, please select your intended major below.
          </p>

          <div className="space-y-4 mb-8">
            <label htmlFor="major-select" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select your intended major
            </label>
            <div className="relative">
              <select
                id="major-select"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full appearance-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>Select a major...</option>
                {resolvedOptions.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
                <option value="other">Other (Customize my plan)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContinue}
              variant="default"
              className="w-full py-5 text-base"
              disabled={!selectedMajor || selectedMajor === "other"}
            >
              Continue with Auto-Generation
            </Button>
            {(onSwitchToCustomize ?? onCancel) && (
              <Button
                onClick={onSwitchToCustomize ?? onCancel}
                variant="outline"
                className="w-full py-5 text-base"
              >
                {onSwitchToCustomize ? "Switch to Customize" : "Back"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
