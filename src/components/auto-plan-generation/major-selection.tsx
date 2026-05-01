import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MajorAutocomplete } from "@/components/major-autocomplete";

interface MajorSelectionFallbackProps {
  open?: boolean;
  suggestions?: string[];
  initialValue?: string | null;
  onContinue?: (selectedMajor: string) => void;
  onConfirm?: (selectedMajor: string) => void;
  onSwitchToCustomize?: () => void;
  onCancel?: () => void;
}

export function MajorSelectionFallback({
  open = true,
  suggestions = [],
  initialValue,
  onContinue,
  onConfirm,
  onSwitchToCustomize,
  onCancel,
}: MajorSelectionFallbackProps) {
  const [selectedMajor, setSelectedMajor] = useState<string>(
    initialValue ?? "",
  );

  if (!open) return null;

  const handleContinue = () => {
    const nextMajor = selectedMajor.trim();
    if (!nextMajor) return;
    (onConfirm ?? onContinue)?.(nextMajor);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-visible">
        <div className="p-8">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Help Us Understand Your Major
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Your transcript shows a diverse range of courses. To generate the
            most accurate transfer plan, please select your intended major
            below.
          </p>

          <div className="space-y-4 mb-8">
            <label
              htmlFor="major-select"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Select your intended major
            </label>
            <div className="relative">
              <MajorAutocomplete
                id="major-select"
                value={selectedMajor}
                onChange={setSelectedMajor}
                placeholder="Search for a major..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContinue}
              variant="default"
              className="w-full py-5 text-base"
              disabled={!selectedMajor.trim()}
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
