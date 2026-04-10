"use client";

import { useState } from "react";
import Chat from "@/components/chat";
import SemesterPlan from "@/components/semester-plan";
import { ParsedPlan } from "@/types/plan";

export default function NewPlanPage() {
  const [currentPlan, setCurrentPlan] = useState<ParsedPlan | null>(null);

  const handlePlanGenerated = (plan: ParsedPlan) => {
    setCurrentPlan(plan);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Create a New Plan
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Chat with our AI assistant to build your personalized transfer plan.
        </p>
      </div>

      {/* Split layout: chat panel (left) + plan display (right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="w-full lg:w-1/2 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Chat onPlanGenerated={handlePlanGenerated} />
        </div>

        {/* Plan display area */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-zinc-50 dark:bg-zinc-900">
          {currentPlan ? (
            <SemesterPlan plan={currentPlan} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-white">
                  Your plan will appear here
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Tell the AI your community college, target school, and major to generate your semester-by-semester transfer plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
