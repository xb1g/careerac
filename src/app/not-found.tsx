import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-900 bg-zinc-900 px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(24,24,27,0.14)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-zinc-800 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_18px_rgba(24,24,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-zinc-950"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
