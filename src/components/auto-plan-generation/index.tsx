"use client";

import { useMemo, useState } from "react";
import type { TranscriptData } from "@/types/transcript";

export interface GenerationError {
  code: string;
  message: string;
  retryable: boolean;
  fallback: "retry" | "customize" | "retry_or_customize";
}

interface GenerationChoiceScreenProps {
  transcriptData: TranscriptData;
  onCustomize: () => void;
  onAutoGenerate: () => void;
  onBack: () => void;
  isBusy?: boolean;
}

export function GenerationChoiceScreen({
  transcriptData,
  onCustomize,
  onAutoGenerate,
  onBack,
  isBusy = false,
}: GenerationChoiceScreenProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">How do you want to generate your plan?</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          We parsed {transcriptData.courses.length} courses from {transcriptData.institution}. You can review settings first or let us auto-detect your best-fit plan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onAutoGenerate}
          disabled={isBusy}
          className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-left transition-colors hover:border-blue-300 hover:bg-blue-100/70 disabled:cursor-not-allowed disabled:opacity-70 dark:border-blue-900/50 dark:bg-blue-950/40 dark:hover:bg-blue-950/60"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-base font-semibold text-zinc-900 dark:text-white">Generate Automatically</div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                We&apos;ll detect your likely major, generate a best-fit plan, and take you straight to the finished result.
              </p>
            </div>
            {isBusy && <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />}
          </div>
        </button>

        <button
          type="button"
          onClick={onCustomize}
          disabled={isBusy}
          className="rounded-2xl border border-zinc-200 bg-white p-6 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <div className="text-base font-semibold text-zinc-900 dark:text-white">Customize Settings</div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Choose your intended major, unit limit, and whether you already have a target school.
          </p>
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-lg text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Back to transcript review
      </button>
    </div>
  );
}

interface ModalFrameProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ModalFrame({ title, description, children }: ModalFrameProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

interface MajorConfirmationModalProps {
  open: boolean;
  major: string;
  confidence: number;
  onConfirm: () => void;
  onChooseAnother: () => void;
}

export function MajorConfirmationModal({
  open,
  major,
  confidence,
  onConfirm,
  onChooseAnother,
}: MajorConfirmationModalProps) {
  if (!open) return null;

  return (
    <ModalFrame
      title="Confirm detected major"
      description={`We think your transcript aligns with ${major}. Confidence: ${Math.round(confidence * 100)}%.`}>
      <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        Continue if this looks right, or pick a different major before we generate your plan.
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onChooseAnother}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Choose another major
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Yes, continue
        </button>
      </div>
    </ModalFrame>
  );
}

interface MajorSelectionFallbackProps {
  open: boolean;
  suggestions: string[];
  initialValue?: string | null;
  onConfirm: (major: string) => void;
  onCancel: () => void;
}

const DEFAULT_MAJOR_OPTIONS = [
  "Computer Science",
  "Business Administration",
  "Biology",
  "Psychology",
  "Mathematics",
  "Engineering",
  "Economics",
  "English",
];

export function MajorSelectionFallback({
  open,
  suggestions,
  initialValue,
  onConfirm,
  onCancel,
}: MajorSelectionFallbackProps) {
  const [selectedMajor, setSelectedMajor] = useState(initialValue ?? suggestions[0] ?? DEFAULT_MAJOR_OPTIONS[0]);

  const options = useMemo(() => {
    const next = new Set([...suggestions, ...DEFAULT_MAJOR_OPTIONS].filter(Boolean));
    return Array.from(next);
  }, [suggestions]);

  if (!open) return null;

  return (
    <ModalFrame
      title="Choose your major"
      description="We couldn&apos;t confidently infer your intended major from the transcript alone. Pick the closest option to continue.">
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = option === selectedMajor;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedMajor(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-100"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div>
          <label htmlFor="fallback-major-input" className="block text-sm font-medium text-zinc-900 dark:text-white">
            Or type a different major
          </label>
          <input
            id="fallback-major-input"
            type="text"
            value={selectedMajor}
            onChange={(event) => setSelectedMajor(event.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="e.g., Data Science"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm(selectedMajor.trim())}
          disabled={!selectedMajor.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </ModalFrame>
  );
}

interface AutoGenerationLoadingProps {
  major: string | null;
  isRecovering?: boolean;
}

export function AutoGenerationLoading({ major, isRecovering = false }: AutoGenerationLoadingProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-white">
        {isRecovering ? "Recovering your generation request" : "Generating your plan"}
      </h2>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {major
          ? `We’re building a best-fit transfer plan for ${major}. This usually takes less than a minute.`
          : "We’re building your transfer plan now. This usually takes less than a minute."}
      </p>
      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        Please keep this tab open while we finish the request.
      </p>
    </div>
  );
}

interface AutoGenerationErrorProps {
  error: GenerationError;
  onRetry: () => void;
  onCustomize: () => void;
}

export function AutoGenerationError({ error, onRetry, onCustomize }: AutoGenerationErrorProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/70 p-8 dark:border-red-900/40 dark:bg-red-950/20">
      <div className="text-sm font-medium uppercase tracking-wide text-red-600 dark:text-red-300">Auto-generation failed</div>
      <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">We couldn&apos;t finish your plan automatically.</h2>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{error.message}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {error.retryable && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Retry auto-generation
          </button>
        )}
        <button
          type="button"
          onClick={onCustomize}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Customize settings instead
        </button>
      </div>
    </div>
  );
}
