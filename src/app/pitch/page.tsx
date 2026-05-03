import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CareerAC — Collider Cup Pitch",
  description:
    "1 counselor. 300 students. 10 transferred. CareerAC gives every student the plan the system never provided.",
};

export default function PitchPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 overflow-x-hidden font-sans">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-blue-900/30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-indigo-900/30" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-cyan-900/20" />

      {/* Header */}
      <header className="fixed top-0 z-50 w-full px-3 py-3 sm:px-8 sm:py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-2xl border border-white/50 bg-white/70 px-4 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/70 dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] sm:rounded-full sm:px-6">
          <Link href="/" className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-white">
            CareerAC
          </Link>
          <span className="text-right text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 sm:text-[13px]">
            Collider Cup 2026
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32">
        <div className="mx-auto max-w-3xl space-y-14 sm:space-y-20">

          {/* Hook */}
          <section className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                SCET Berkeley — Collider Cup
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white sm:text-[72px]">
              1 counselor.<br />
              300 students.<br />
              <span className="text-blue-500">10 transferred.</span>
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[20px]">
              That&apos;s not a bad outcome. That&apos;s the system working as designed.
            </p>
          </section>

          {/* The Story */}
          <section className="space-y-6 rounded-3xl border border-white/80 bg-white/60 p-5 shadow-[0_8px_40px_rgb(0,0,0,0.06)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] sm:p-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[14px]">
                AS
              </div>
              <div>
                <p className="text-[15px] font-semibold text-zinc-900 dark:text-white">Muhammad Ali Salman</p>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Co-founder, CareerAC</p>
              </div>
            </div>
            <blockquote className="border-l-4 border-blue-500 pl-4 text-xl font-medium leading-[1.4] text-zinc-800 dark:text-zinc-100 sm:pl-6 sm:text-[26px]">
              &quot;I lost a year of my life and $40,000 because nobody told me my credits wouldn&apos;t count at Berkeley.&quot;
            </blockquote>
            <p className="pl-4 text-[16px] leading-relaxed text-zinc-500 dark:text-zinc-400 sm:pl-6">
              He took the right classes. He worked hard. He just didn&apos;t have the right plan. That&apos;s not a personal failure — it&apos;s a system failure. And it&apos;s happening to hundreds of thousands of students right now.
            </p>
          </section>

          {/* Statistics */}
          <section className="space-y-6">
            <h2 className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              The scale of the problem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  stat: "257",
                  label: "out of 300 students",
                  sub: "don't know if their credits will count when they transfer",
                  color: "from-red-400 to-orange-400",
                },
                {
                  stat: "$20k",
                  label: "per semester",
                  sub: "international students risk on a single wrong course choice",
                  color: "from-amber-400 to-yellow-400",
                },
                {
                  stat: "4 months",
                  label: "lost",
                  sub: "just to retake the right courses — one full semester, gone",
                  color: "from-blue-400 to-indigo-500",
                },
              ].map(({ stat, label, sub, color }) => (
                <div
                  key={stat}
                  className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-zinc-800/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6 space-y-2"
                >
                  <div className={`text-[44px] font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent leading-none`}>
                    {stat}
                  </div>
                  <div className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">{label}</div>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-500 leading-snug">{sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Solution */}
          <section className="space-y-6">
            <h2 className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              The solution
            </h2>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 space-y-6 text-white">
              <h3 className="text-[32px] sm:text-[40px] font-bold leading-tight">
                One plan.<br />All UC campuses.
              </h3>
              <p className="text-[17px] text-blue-100 leading-relaxed max-w-xl">
                Upload your transcript. Tell us your target school and major. CareerAC pulls every articulation agreement from ASSIST — all of California — and generates a semester-by-semester plan that auto-adjusts when life happens.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { icon: "📄", title: "Transcript Import", desc: "Upload once, never copy-paste requirements again" },
                  { icon: "🤖", title: "AI Plan Generation", desc: "Built on real ASSIST articulation data, not guesses" },
                  { icon: "🔄", title: "Auto-Adjust", desc: "Class cancelled? Waitlisted? New plan, instantly" },
                  { icon: "🎯", title: "All UCs at Once", desc: "One plan covers every target campus simultaneously" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="bg-white/10 rounded-2xl p-4 space-y-1">
                    <div className="text-[20px]">{icon}</div>
                    <div className="text-[14px] font-semibold">{title}</div>
                    <div className="text-[13px] text-blue-200">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Business Model */}
          <section className="space-y-6">
            <h2 className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Business model
            </h2>
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/80 dark:border-zinc-800/50 shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 sm:p-10 space-y-6">
              <p className="text-[20px] font-semibold text-zinc-900 dark:text-white leading-snug">
                We license to community colleges — not to students.
              </p>
              <p className="text-[16px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Transfer rate is a published performance metric for California CCs. It affects funding, rankings, and accreditation. CareerAC isn&apos;t a threat to counselors — it&apos;s how one counselor actually handles 300 students. The tool handles the plan. The counselor handles the cases that need human judgment.
              </p>
              <div className="flex flex-col gap-2 rounded-2xl bg-blue-50 px-4 py-4 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
                <div className="text-[32px] font-bold text-blue-600 dark:text-blue-400">60%</div>
                <div className="text-[14px] text-zinc-600 dark:text-zinc-400">
                  of students surveyed said they would use CareerAC <strong>daily</strong>. CCs buy because their students want it.
                </div>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="space-y-6">
            <h2 className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Why us
            </h2>
            <div className="space-y-4">
              {[
                {
                  initials: "AS",
                  name: "Muhammad Ali Salman",
                  role: "Co-founder",
                  story: "Lost a year and $40,000 to a broken transfer plan. Built CareerAC so no student has to make the same mistake.",
                  gradient: "from-blue-400 to-indigo-500",
                },
                {
                  initials: "PL",
                  name: "Peyton Li",
                  role: "Co-founder",
                  story: "Studied for free at San Mateo specifically to get the right credits for Berkeley. Knows the system from the inside.",
                  gradient: "from-indigo-400 to-purple-500",
                },
                {
                  initials: "BF",
                  name: "Bunyasit Fang",
                  role: "Co-founder & Builder",
                  story: "Building edtech for university and career navigation in Thailand. Has seen this problem from Bangkok to Berkeley. Built the product.",
                  gradient: "from-cyan-400 to-blue-500",
                },
              ].map(({ initials, name, role, story, gradient }) => (
                <div
                  key={name}
                  className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/60 p-5 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 sm:flex-row sm:gap-5 sm:p-6"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-[13px]`}>
                    {initials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-[15px] font-semibold text-zinc-900 dark:text-white">{name}</span>
                      <span className="text-[12px] text-zinc-400 dark:text-zinc-500">{role}</span>
                    </div>
                    <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-snug">{story}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Closing line */}
          <section className="text-center space-y-6 pt-4">
            <p className="text-[28px] sm:text-[36px] font-bold text-zinc-900 dark:text-white leading-tight">
              The system was never designed<br />to help every student.
            </p>
            <p className="text-[28px] sm:text-[36px] font-bold text-blue-500 leading-tight">
              We are.
            </p>
            <div className="pt-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold px-8 py-4 rounded-full transition-colors shadow-lg shadow-blue-500/20"
              >
                Get your transfer plan
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-4 py-8 dark:border-zinc-900 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-[13px] font-semibold text-zinc-900 dark:text-white">CareerAC</span>
          <span className="text-[12px] text-zinc-400 dark:text-zinc-600">SCET Berkeley — Collider Cup 2026</span>
        </div>
      </footer>
    </div>
  );
}
