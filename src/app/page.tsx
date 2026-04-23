import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 overflow-x-hidden">
      {/* Liquid Glass Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-blue-900/30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-indigo-900/30"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-cyan-900/20"></div>

      {/* Floating Glass Header */}
      <header className="fixed top-0 w-full px-6 py-5 sm:px-8 lg:px-12 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-6 py-3.5 rounded-full border border-white/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-white">
              CareerAC
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#how-it-works" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">How it Works</Link>
              <Link href="#features" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Features</Link>
              <Link href="#community" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Community</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin" 
              className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-[14px] font-bold text-white hover:bg-blue-700 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10 flex-1 px-6 sm:px-8 lg:px-12 pt-24">
        <div className="max-w-5xl mx-auto text-center py-24 sm:py-32 lg:py-40 relative">
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-8">
            Your Transfer Path, <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Perfectly Clear
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium mb-12">
            Chat with an intelligent AI to build a seamless semester-by-semester transfer plan. 
            When life gets in the way, get smart recovery suggestions and stay perfectly on track.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-[16px] font-bold text-white transition-all duration-300 ease-in-out w-full sm:w-auto overflow-hidden rounded-full bg-blue-600"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                Start Your Journey
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3" />
                </svg>
              </span>
            </Link>
            <Link
              href="/playbooks"
              className="inline-flex items-center justify-center px-10 py-5 text-[16px] font-bold text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-white/50 dark:border-zinc-800 rounded-full hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all duration-300 w-full sm:w-auto"
            >
              Browse Playbooks
            </Link>
          </div>

          {/* Computer Science Demo Section */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-20 dark:opacity-40"></div>
            <div className="relative rounded-[2rem] border border-white/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
              {/* Sidebar / Context */}
              <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/20 dark:border-zinc-800/50 p-6 flex flex-col gap-6">
                <div>
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Current School</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold text-xs">OCC</div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-white">Orange Coast College</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Target Goal</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">CAL</div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-white">UC Berkeley</div>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Target Major</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">Computer Science (B.A.)</div>
                </div>
                <div className="mt-auto p-4 rounded-2xl bg-blue-600/5 border border-blue-600/10 hidden md:block">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Transfer Status</div>
                  </div>
                  <div className="text-[20px] font-bold text-zinc-900 dark:text-white">84% Ready</div>
                  <div className="mt-2 h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[84%] bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Plan View */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Computer Science Path</h3>
                   <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Optimized for Berkeley</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Semester 1 */}
                  <div className="p-5 rounded-2xl bg-white/50 dark:bg-zinc-800/30 border border-white/50 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-xs font-bold text-zinc-500 uppercase">Semester 1</span>
                       <span className="text-xs font-bold text-zinc-400">14 Units</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-xs font-bold font-mono text-zinc-700 dark:text-zinc-300">CS A150</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">C++ Programming</span>
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-xs font-bold font-mono text-zinc-700 dark:text-zinc-300">MATH A180</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Calculus 1</span>
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Semester 2 */}
                  <div className="p-5 rounded-2xl bg-white/50 dark:bg-zinc-800/30 border border-white/50 dark:border-zinc-800 shadow-sm relative">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-xs font-bold text-zinc-500 uppercase">Semester 2</span>
                       <span className="text-xs font-bold text-zinc-400">16 Units</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">CS A250</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Data Structures</span>
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500/30 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">MATH A185</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Calculus 2</span>
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <div className="px-6 py-3 rounded-2xl bg-zinc-900/5 dark:bg-zinc-100/5 border border-zinc-900/10 dark:border-zinc-100/10 flex items-center gap-4">
                    <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">A</div>
                       <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">B</div>
                       <div className="w-6 h-6 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">C</div>
                    </div>
                    <div className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                      Join 1,200+ students planning their CS transfer today.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 lg:py-28 bg-white/30 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Transfer planning, simplified
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Three simple steps to build your perfect transfer roadmap
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  Tell us your goals
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Share your current school, target university, and your dream major. Our AI understands your unique situation.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  Get your roadmap
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Receive a personalized semester-by-semester plan that shows exactly which courses to take and when.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  Stay on track
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Get smart recovery suggestions if life happens. Never lose your transfer path again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                Advanced Features
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                Intelligence built into every step
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Articulation Engine</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">Deep database of transfer agreements between community colleges and top universities.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Recovery Mode</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">Failed a class? Changed your major? One click to recalculate your entire path and stay on schedule.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600/10 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">AI Planning Chat</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">Natural conversation to adjust your load, request specific semesters off, or explore different career paths.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px]"></div>
              <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-2 border border-white/50 dark:border-zinc-800/50 shadow-2xl">
                 <div className="bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800">
                    <div className="p-8">
                       <div className="flex items-center justify-between mb-8">
                         <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                         <div className="h-8 w-8 rounded-full bg-blue-600"></div>
                       </div>
                       <div className="space-y-4">
                          <div className="h-32 w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                            <div className="h-4 w-1/3 bg-blue-100 dark:bg-blue-900/30 rounded mb-4"></div>
                            <div className="space-y-2">
                               <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                               <div className="h-3 w-4/5 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="h-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"></div>
                             <div className="h-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Playbooks Preview Section */}
      <section id="community" className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 lg:py-28 bg-white/30 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
              Community Insight
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Learn from those who succeeded
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Real transfer stories and verified paths from community college to elite universities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { school: "UC Berkeley", major: "Computer Science", year: "2024", path: "OCC → Berkeley" },
               { school: "Stanford", major: "Economics", year: "2023", path: "De Anza → Stanford" },
               { school: "UCLA", major: "Psychology", year: "2024", path: "SMC → UCLA" }
             ].map((pb, i) => (
               <div key={i} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">{pb.path}</span>
                    <span className="text-xs font-bold text-zinc-400">{pb.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{pb.school}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">{pb.major}</p>
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-400">Verified Path</span>
                    <Link href="/playbooks" className="text-blue-600 text-xs font-bold hover:underline">Read Story →</Link>
                  </div>
               </div>
             ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/playbooks" className="text-zinc-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              View all 200+ playbooks
            </Link>
          </div>
        </div>
      </section>

      {/* Time Saved Stats */}
      <section className="relative z-10 px-6 sm:px-8 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[3rem] p-10 lg:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Stop stressing. Start transferring.
              </h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
                Students spend <span className="font-bold text-white">20+ hours</span> researching transfer requirements. 
                CareerAC builds your complete plan in <span className="font-bold text-white">under 5 minutes</span>.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">20+</div>
                  <div className="text-blue-100 text-sm font-medium">Hours saved</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">5</div>
                  <div className="text-blue-100 text-sm font-medium">Minutes to plan</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">100%</div>
                  <div className="text-blue-100 text-sm font-medium">Personalized</div>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/auth/signup" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-zinc-50 transition-colors shadow-lg">
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              The Team
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Meet the founders
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110">
                  <Image
                    src="/founders/ali.png"
                    alt="Ali"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="mt-6 text-xl font-bold text-zinc-900 dark:text-white">Ali</span>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Co-founder</span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110">
                  <Image
                    src="/founders/big.jpg"
                    alt="Big"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="mt-6 text-xl font-bold text-zinc-900 dark:text-white">Big</span>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Co-founder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 sm:px-8 lg:px-12 py-12 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="max-w-xs">
              <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white mb-4 block">
                CareerAC
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Building the premium transfer experience for students everywhere. AI-powered roadmaps to your dream university.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#how-it-works" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">How it Works</Link></li>
                  <li><Link href="#features" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Features</Link></li>
                  <li><Link href="/playbooks" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Playbooks</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Help Center</Link></li>
                  <li><Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Privacy Policy</Link></li>
                  <li><Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Terms of Service</Link></li>
                </ul>
              </div>
              <div className="hidden sm:block">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">About Us</Link></li>
                  <li><Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Careers</Link></li>
                  <li><Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Blog</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400">&copy; 2026 CareerAC. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="https://twitter.com/careerac" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="https://linkedin.com/company/careerac" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.1s.493-1.1 1.1-1.1 1.1.493 1.1 1.1-.493 1.1-1.1 1.1zm9 6.891h-2v-3.032c0-.866-.543-.968-.833-.968s-.833.102-.833.968v3.032h-2v-6h2v.949c.313-.611 1.025-.949 1.833-.949s2.167.925 2.167 3.032v3.019z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

