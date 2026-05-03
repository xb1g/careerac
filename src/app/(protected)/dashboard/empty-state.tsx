import Link from "next/link";

export function EmptyState() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-950 sm:mt-8 sm:p-12 lg:p-16">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-2xl">
        No plans yet
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Create your first transfer plan by chatting with our AI assistant. Tell us about your community college and where you want to transfer.
      </p>

      <div className="mt-9">
        <Link
          href="/plan/new"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(24,24,27,0.14)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-zinc-800 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_18px_rgba(24,24,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-zinc-950"
        >
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Your First Plan
        </Link>
      </div>
    </div>
  );
}
