import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import type { TranscriptData } from "@/types/transcript";

interface GenerationChoiceScreenProps {
  onAutoGenerate: () => void;
  onCustomize: () => void;
  onBack?: () => void;
  transcriptData?: TranscriptData;
  isBusy?: boolean;
}

export function GenerationChoiceScreen({
  onAutoGenerate,
  onCustomize,
  onBack,
  transcriptData,
  isBusy = false,
}: GenerationChoiceScreenProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          How would you like to create your plan?
        </h2>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          {transcriptData
            ? `We parsed ${transcriptData.courses.length} courses from ${transcriptData.institution}. You can always edit your plan later.`
            : "You can always edit your plan later, no matter which option you choose."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          variant="glass" 
          className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 flex flex-col"
          onClick={() => !isBusy && onAutoGenerate()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-2xl">
              🚀
            </div>
            <CardTitle className="text-2xl mb-2">Generate Plan Automatically</CardTitle>
            <CardDescription className="text-base">
              Let AI analyze your transcript and create a complete 2-year transfer plan instantly. Best for getting started quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Automatically detects your major
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Maps your completed credits
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Builds a semester-by-semester schedule
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-4">
              <Button className="w-full text-base py-6" variant="default" disabled={isBusy}>
                Generate My Plan
              </Button>
            </CardFooter>
          </Card>

        <Card 
          variant="glass" 
          className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-600 flex flex-col"
          onClick={() => !isBusy && onCustomize()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-4">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-2xl">
              ⚙️
            </div>
            <CardTitle className="text-2xl mb-2">Customize Settings</CardTitle>
            <CardDescription className="text-base">
              Manually configure your target schools, majors, and specific requirements before creating your plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Select your own target universities
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Set custom semester constraints
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Chat to fine-tune your goals
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-4">
              <Button className="w-full text-base py-6" variant="secondary" disabled={isBusy}>
                Customize Manually
              </Button>
            </CardFooter>
          </Card>
      </div>

      {onBack && (
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={onBack} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            Back to transcript review
          </Button>
        </div>
      )}
    </div>
  );
}
