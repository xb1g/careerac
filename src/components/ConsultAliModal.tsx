"use client";

import { Modal } from "./Modal";
import { X, Calendar, Mail, MessageCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ConsultAliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultAliModal({ isOpen, onClose }: ConsultAliModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `CareerAC Consultation Request — ${name}`;
    const body = `Hi Ali,%0D%0A%0D%0AI'd like to book a $25 consultation with you.%0D%0A%0D%0AName: ${name}%0D%0AEmail: ${email}%0D%0ACollege: ${college}%0D%0AWhat I need help with: ${goal || "General transfer planning"}%0D%0A%0D%0AThanks!`;
    window.open(`mailto:ali17261@berkeley.edu?subject=${encodeURIComponent(subject)}&body=${body}`, "_blank");
    setSubmitted(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="relative bg-neutral-900 px-6 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
              <MessageCircle size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Consult with Ali</h3>
              <p className="text-sm text-neutral-400">Co-founder @ CareerAC</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Ali lost a year and $40,000 when his community college courses didn't articulate.
            Now he helps students avoid the same mistake.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available now — $25
          </div>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900">Request sent!</h4>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              Ali will reach out to you within 24 hours to schedule your consultation.
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Your Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jamie Chen"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Community College
              </label>
              <input
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Orange Coast College"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                What do you need help with?
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Course articulation, transfer plan, GE requirements..."
                rows={3}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors resize-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                <Calendar size={16} />
                Book Consultation — $25
              </button>
              <a
                href="mailto:ali17261@berkeley.edu?subject=CareerAC%20Consultation%20Request"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
            <p className="text-xs text-neutral-400 text-center">
              You'll pay after we confirm a time. No charge if we can't help.
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}
