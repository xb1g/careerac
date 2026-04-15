import React from "react";
import { Button } from "@/components/ui/button";

interface MajorConfirmationModalProps {
  detectedMajor: string;
  confidence: number;
  matchedCourses: string[];
  onConfirm: () => void;
  onReject: () => void;
}

export function MajorConfirmationModal({
  detectedMajor,
  confidence,
  matchedCourses,
  onConfirm,
  onReject,
}: MajorConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Confirm Your Major
          </h2>
          
          <p className="text-zinc-600 dark:text-zinc-300 mb-4">
            Based on your transcript, we think your major is:
            <br />
            <strong className="text-lg text-blue-600 dark:text-blue-400 block mt-1">
              {detectedMajor} <span className="text-sm font-normal text-zinc-500">({confidence}% confidence)</span>
            </strong>
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 mb-6 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course Matches
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {matchedCourses.join(", ")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onConfirm} variant="default" className="w-full">
              Yes, Continue
            </Button>
            <Button onClick={onReject} variant="outline" className="w-full">
              No, Select Different Major
            </Button>
          </div>
          
          <p className="text-center text-xs text-zinc-500 mt-4">
            Not sure? You can change this later
          </p>
        </div>
      </div>
    </div>
  );
}
