import React from "react";
import { Button } from "@/components/ui/button";

export interface GenerationError {
  code: string;
  message: string;
  retryable: boolean;
  fallback: "retry" | "customize" | "retry_or_customize";
}

interface ErrorStateProps {
  error?: GenerationError;
  onRetry: () => void;
  onCustomize: () => void;
  onContactSupport?: () => void;
}

export function AutoGenerationError({
  error,
  onRetry,
  onCustomize,
  onContactSupport,
}: ErrorStateProps) {
  return (
    <div className="w-full max-w-lg mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-red-100 dark:border-red-900/30 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Oops, Something Went Wrong
          </h2>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            {error?.message ?? "We couldn&apos;t generate your plan automatically. This might be due to network issues or complex transcript requirements."}
          </p>

          <div className="space-y-3 mb-8">
            <Button onClick={onRetry} variant="default" className="w-full py-5 text-base" disabled={error?.retryable === false}>
              Try Again
            </Button>
            <Button onClick={onCustomize} variant="secondary" className="w-full py-5 text-base relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              Customize Settings Instead
            </Button>
            {onContactSupport && (
              <Button onClick={onContactSupport} variant="outline" className="w-full py-5 text-base text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Contact Support
              </Button>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 text-left">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong className="font-semibold block mb-0.5">Helpful tip</strong>
              The customize option gives you full control over your transfer path and is recommended for complex requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
