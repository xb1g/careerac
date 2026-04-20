import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 overflow-hidden">
      {/* Liquid Glass Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-blue-900/30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-indigo-900/30"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-overlay dark:bg-cyan-900/20"></div>

      {/* Floating Glass Header */}
      <header className="fixed top-0 w-full px-6 py-5 sm:px-8 lg:px-12 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-6 py-3.5 rounded-full border border-white/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <span className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
            CareerAC
          </span>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin" 
              className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 pt-24">
        <div className="max-w-5xl mx-auto text-center py-24 sm:py-32 lg:py-40 relative">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-white/60 dark:border-zinc-800 shadow-sm mb-8 text-[13px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             The Premium Transfer Experience
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-8">
            Your Transfer Path, <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Perfectly Clear
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            Chat with an intelligent AI to build a seamless semester-by-semester transfer plan. 
            When life gets in the way, get smart recovery suggestions and stay perfectly on track.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-[15px] font-bold text-white transition-all duration-300 ease-in-out w-full sm:w-auto"
            >
              {/* Button Glass Background */}
              <div className="absolute inset-0 w-full h-full rounded-full bg-blue-600 transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]"></div>
              <span className="relative flex items-center gap-2">
                Get Started
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 lg:py-28">
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
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow">
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
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow">
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
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg transition-shadow">
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

          {/* Time Saved Stats */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
            {/* Decorative elements */}
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
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">20+</div>
                  <div className="text-blue-100 text-sm font-medium">Hours saved</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">5</div>
                  <div className="text-blue-100 text-sm font-medium">Minutes to plan</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">100%</div>
                  <div className="text-blue-100 text-sm font-medium">Personalized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl">
                <img
                  src="/founders/ali.png"
                  alt="Ali"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">Ali</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl">
                <img
                  src="/founders/big.jpg"
                  alt="Big"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">Big</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
