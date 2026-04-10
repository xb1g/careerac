import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Simple header */}
      <header className="w-full px-6 py-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            CareerAC
          </span>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center py-24 sm:py-32 lg:py-40">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            CareerAC: Your AI-powered
            <br className="hidden sm:inline" />
            {" "}transfer planning companion
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Chat with AI to build a personalized semester-by-semester transfer
            plan from community college to university. When life gets in the way,
            get smart recovery suggestions — and learn from playbooks written by
            students who&apos;ve walked the path before you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors w-full sm:w-auto"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 sm:px-8 lg:px-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-zinc-500 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} CareerAC
        </div>
      </footer>
    </div>
  );
}
