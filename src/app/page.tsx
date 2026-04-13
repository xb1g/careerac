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

          {/* Glass Preview Panel (Decorative) */}
          <div className="mt-20 relative mx-auto w-full max-w-4xl h-[400px] rounded-t-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border-t border-l border-r border-white/60 dark:border-zinc-800/60 shadow-[0_-20px_60px_rgba(0,0,0,0.03)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
              <div className="h-12 border-b border-white/50 dark:border-zinc-800/50 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-300/80 dark:bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-300/80 dark:bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-300/80 dark:bg-zinc-700"></div>
              </div>
              <div className="flex-1 bg-gradient-to-b from-transparent to-[#FAFAFA] dark:to-zinc-950"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
