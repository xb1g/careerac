"use client";

import { useState } from "react";
import { deletePlan } from "@/app/(protected)/dashboard/actions";
import { useRouter } from "next/navigation";

export function DeletePlanButton({ planId }: { planId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    setIsDeleting(true);
    try {
      await deletePlan(planId);
      // Redirection is handled by revalidatePath for dashboard, 
      // but if we are on /plan/[id] page, we should push to dashboard.
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete plan");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-zinc-400 transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-[0_8px_18px_rgba(190,18,60,0.08)] dark:hover:border-red-900/70 dark:hover:bg-red-950/30 dark:hover:text-red-300 pointer-events-auto cursor-pointer"
      title="Delete plan"
    >
      {isDeleting ? (
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      )}
    </button>
  );
}
