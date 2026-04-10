import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your transfer plans and explore community playbooks.
        </p>
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-12 text-center">
        <div className="mx-auto h-12 w-12 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          No plans yet
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Create your first transfer plan by chatting with our AI assistant. Tell us about your community college and where you want to transfer.
        </p>
        <div className="mt-6">
          <Link
            href="/plan/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Create Your First Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
