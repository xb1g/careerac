import Link from "next/link";

export function EmptyState() {
  return (
    <div className="relative mt-8 group flex flex-col items-center justify-center rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/60 dark:border-zinc-800/60 p-12 lg:p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden">
      {/* Decorative blurred background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 dark:bg-zinc-800/80 shadow-sm border border-zinc-100 dark:border-zinc-700/50 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600 dark:text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
      </div>
      
      <h2 className="relative z-10 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        No plans yet
      </h2>
      <p className="relative z-10 mt-3 text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
        Create your first transfer plan by chatting with our AI assistant. Tell us about your community college and where you want to transfer.
      </p>
      
      <div className="relative z-10 mt-10">
        <Link
          href="/plan/new"
          className="group/btn relative inline-flex items-center justify-center px-8 py-3.5 text-[15px] font-bold text-white transition-all duration-300 ease-in-out"
        >
          <div className="absolute inset-0 w-full h-full rounded-full bg-blue-600 transition-all duration-300 ease-out group-hover/btn:scale-105 group-hover/btn:shadow-[0_0_30px_rgba(37,99,235,0.3)]"></div>
          <span className="relative flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Your First Plan
          </span>
        </Link>
      </div>
    </div>
  );
}
