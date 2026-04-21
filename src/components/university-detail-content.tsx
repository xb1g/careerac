"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UIMessage } from "@ai-sdk/react";
import ChatWidget from "@/components/chat-widget";
import SemesterPlan from "@/components/semester-plan";
import type { ParsedPlan, TransferPlan } from "@/types/plan";
import type { TranscriptData } from "@/types/transcript";
import { resolveInstitutionIds } from "@/utils/plan-institutions";

interface Props {
  parentPlanId: string;
  parentTitle: string;
  major: string;
  maxCreditsPerSemester: number;
  universityName: string;
  transferPlan: TransferPlan;
  fitScore: number;
  highlights: string[];
  transcriptId: string | null;
  transcript: {
    id: string;
    file_name: string;
    parsed_data: TranscriptData;
    parse_status: string;
  } | null;
  onClose?: () => void;
}

export default function UniversityDetailContent(props: Props) {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<TransferPlan>(props.transferPlan);
  const latestMessagesRef = useRef<UIMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);
  const [chooseError, setChooseError] = useState<string | null>(null);

  const handlePlanGenerated = useCallback((p: ParsedPlan) => {
    if (!("isNoData" in p) && !("isMultiUniversity" in p)) {
      setCurrentPlan(p);
    }
  }, []);

  const handleChoose = useCallback(async () => {
    setIsChoosing(true);
    setChooseError(null);
    try {
      const ids = await resolveInstitutionIds(currentPlan.ccName, currentPlan.targetUniversity);
      const serializableHistory = latestMessagesRef.current.map((msg) => ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts.map((part) => {
          if (part.type === "text") {
            return { type: "text", text: (part as { text: string }).text };
          }
          return { ...part };
        }),
      }));

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${currentPlan.ccName} → ${currentPlan.targetUniversity}`,
          cc_institution_id: ids.ccId,
          target_institution_id: ids.targetId,
          target_major: currentPlan.targetMajor,
          plan_data: JSON.parse(JSON.stringify(currentPlan)),
          chat_history: JSON.parse(JSON.stringify(serializableHistory)),
          max_credits_per_semester: props.maxCreditsPerSemester,
          transcript_id: props.transcriptId,
          has_target_school: true,
          comparison_targets: [],
        }),
      });

      if (!res.ok) {
        setChooseError("Failed to create plan.");
        return;
      }

      const data = await res.json();
      router.replace(`/plan/${data.id}`);
    } catch {
      setChooseError("Failed to create plan.");
    } finally {
      setIsChoosing(false);
    }
  }, [currentPlan, props.maxCreditsPerSemester, props.transcriptId, router]);

  const welcome = `You're viewing the ${props.universityName} option from "${props.parentTitle}". Ask me to tweak this plan — when you're ready, click "Choose this university" to make it your primary plan.`;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 lg:px-8 py-4 lg:py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            {props.onClose ? (
              <button
                type="button"
                onClick={props.onClose}
                aria-label="Close panel"
                className="mt-1 shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            ) : null}
            <div className="min-w-0">
              {!props.onClose && (
                <Link
                  href={`/plan/${props.parentPlanId}`}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  ← {props.parentTitle}
                </Link>
              )}
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 flex items-center gap-3">
                {props.universityName}
                {isChatLoading && (
                  <div className="inline-flex w-4 h-4 border-[2.5px] border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
                )}
              </h1>
              <p className="mt-1 text-[15px] font-medium text-zinc-500 dark:text-zinc-400">
                {props.major} · Fit {props.fitScore}
              </p>
            </div>
          </div>
          <button
            onClick={handleChoose}
            disabled={isChoosing}
            className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isChoosing ? "Creating…" : "Choose this university"}
          </button>
        </div>
        {chooseError && <p className="mt-2 text-sm text-red-600">{chooseError}</p>}
      </div>

      <div className="flex-1 overflow-hidden bg-[#FAFAFA] dark:bg-zinc-900/50 relative">
        <SemesterPlan plan={currentPlan} />
      </div>

      <ChatWidget
        welcomeMessage={welcome}
        onPlanGenerated={handlePlanGenerated}
        onMessagesChange={(m) => {
          latestMessagesRef.current = m;
        }}
        onLoadingChange={setIsChatLoading}
        maxCreditsPerSemester={props.maxCreditsPerSemester}
        hasTargetSchool={true}
        transcriptData={props.transcript?.parsed_data}
      />
    </div>
  );
}
