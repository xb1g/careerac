import React from "react";
import { Button } from "@/components/ui/button";

export type LoadingStep = "detecting" | "analyzing" | "creating" | "finalizing";

interface LoadingStateProps {
  currentStep: LoadingStep;
  detectedMajor?: string;
  onCancel: () => void;
}

export function AutoGenerationLoading({
  currentStep = "creating",
  detectedMajor = "Computer Science",
  onCancel,
}: LoadingStateProps) {
  
  const stepConfig = [
    {
      id: "detecting",
      label: `Detected major: ${detectedMajor}`,
      done: ["analyzing", "creating", "finalizing"].includes(currentStep),
      active: currentStep === "detecting",
    },
    {
      id: "analyzing",
      label: "Analyzing transfer requirements",
      done: ["creating", "finalizing"].includes(currentStep),
      active: currentStep === "analyzing",
    },
    {
      id: "creating",
      label: "Creating semester-by-semester plan...",
      done: currentStep === "finalizing",
      active: currentStep === "creating",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="relative mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          Generating Your Plan
        </h2>
        
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">
          We&apos;re crunching the numbers to build your optimal transfer path.
        </p>

        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-10">
          <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full w-2/3 animate-pulse" />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 text-left mb-10">
          <ul className="space-y-4">
            {stepConfig.map((step) => (
              <li key={step.id} className="flex items-center gap-3">
                {step.done ? (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : step.active ? (
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700" />
                )}
                <span className={`text-sm font-medium ${step.done ? 'text-zinc-900 dark:text-zinc-100' : step.active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <Button onClick={onCancel} variant="ghost" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            Cancel & Customize Instead
          </Button>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            This usually takes 30-45 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
