"use client";

import { Calendar, MessageCircle, GraduationCap, CheckCircle } from "lucide-react";

interface ConsultAliSectionProps {
  onOpenConsultModal: () => void;
}

export function ConsultAliSection({ onOpenConsultModal }: ConsultAliSectionProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-900 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available now — $25
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              Talk to someone who's been there
            </h2>
            <p className="mt-4 text-lg text-neutral-300 leading-relaxed">
              Ali lost a year and $40,000 when his community college courses didn't articulate to Berkeley.
              Now he helps students avoid the same mistake.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-0.5 text-emerald-400 shrink-0" />
                <p className="text-sm text-neutral-300">30-minute 1:1 video call</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-0.5 text-emerald-400 shrink-0" />
                <p className="text-sm text-neutral-300">Course-by-course articulation check</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-0.5 text-emerald-400 shrink-0" />
                <p className="text-sm text-neutral-300">Personalized transfer roadmap</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-0.5 text-emerald-400 shrink-0" />
                <p className="text-sm text-neutral-300">Follow-up email summary</p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenConsultModal}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <Calendar size={18} />
                Book a Consultation — $25
              </button>
              <a
                href="mailto:ali17261@berkeley.edu?subject=CareerAC%20Consultation%20Request"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                <MessageCircle size={18} />
                Or email Ali directly
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-neutral-800/50 border border-neutral-700/50 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <GraduationCap size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ali</h3>
                  <p className="text-sm text-neutral-400">Co-founder, CareerAC · Berkeley '24</p>
                </div>
              </div>
              <blockquote className="text-neutral-300 leading-relaxed italic">
                "I took 12 units that didn't transfer because no one told me about ASSIST.org or articulation agreements.
                That mistake cost me a full year and $40,000 in tuition. I started CareerAC so no one else has to learn
                the hard way."
              </blockquote>
              <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Transferred from Diablo Valley College to UC Berkeley
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
