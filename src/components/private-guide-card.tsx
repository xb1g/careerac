"use client";

import Image from "next/image";
import { useState } from "react";
import BookingModal from "./booking-modal";

export default function PrivateGuideCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ali's Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/80 dark:border-zinc-800/50 shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl">
                <Image
                  src="/founders/ali.png"
                  alt="Muhammad Ali Salman"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                AS
              </div>
            </div>
            <h3 className="text-[18px] font-bold text-zinc-900 dark:text-white mb-1">
              Muhammad Ali Salman
            </h3>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-4">
              Private Transfer Guide
            </p>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-[24px] font-bold text-blue-600 dark:text-blue-400 mb-6">
              $35
              <span className="text-[13px] font-normal text-zinc-500 dark:text-zinc-400">
                /hour
              </span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-blue-500/20"
            >
              Book a Session
            </button>
          </div>
        </div>

        {/* Copy Card */}
        <div className="flex items-center">
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/80 dark:border-zinc-800/50 shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 flex flex-col justify-center">
            <p className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
              Sometimes you just need to talk to someone who&apos;s been there
            </p>
            <h3 className="text-[28px] sm:text-[32px] font-bold text-zinc-900 dark:text-white leading-tight mb-4">
              He lost $40k and a year —{" "}
              <span className="text-blue-500">so you don&apos;t have to.</span>
            </h3>
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              One hour with Ali gets you a personalized review of your transfer
              plan, your specific target schools, and real talk about what
              actually works.
            </p>
            <ul className="space-y-3">
              {[
                "Review your exact course sequence",
                "Answers to your specific questions",
                "Honest assessment of your plan",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-zinc-600 dark:text-zinc-400">
                  <svg
                    className="w-5 h-5 text-emerald-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
