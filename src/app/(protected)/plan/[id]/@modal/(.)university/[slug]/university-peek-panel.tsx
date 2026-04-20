"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import UniversityDetailContent from "@/components/university-detail-content";
import type { UniversityDetailProps } from "@/utils/plan-detail-fetchers";

export default function UniversityPeekPanel(props: UniversityDetailProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/plan/${props.parentPlanId}`);
    }
  }, [router, props.parentPlanId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.classList.remove("translate-x-full");
      el.classList.add("translate-x-0");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${props.universityName} details`}>
      <button
        type="button"
        aria-label="Close panel"
        onClick={handleClose}
        className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 cursor-default"
      />
      <div
        ref={panelRef}
        className="fixed top-16 right-0 bottom-0 z-40 w-full lg:w-[75%] bg-white dark:bg-zinc-950 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 translate-x-full transition-transform duration-300 ease-out"
      >
        <UniversityDetailContent {...props} onClose={handleClose} />
      </div>
    </div>
  );
}
