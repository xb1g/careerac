import CounselorDashboard from "./counselor-dashboard";

export default function CounselorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Counselor Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Overview of all student transfer plans, progress, and risk indicators.
        </p>
      </div>
      <CounselorDashboard />
    </div>
  );
}
