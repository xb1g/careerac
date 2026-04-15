"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterOptions {
  ccs: { id: string; name: string; abbreviation: string | null }[];
  targets: { id: string; name: string; abbreviation: string | null }[];
  majors: string[];
}

interface PlaybookFiltersProps {
  options: FilterOptions;
  currentFilters: { cc: string; target: string; major: string };
}

export function PlaybookFilters({ options, currentFilters }: PlaybookFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const searchParamsString = searchParams?.toString() ?? "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParamsString);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = currentFilters.cc || currentFilters.target || currentFilters.major;

  const clearFilters = () => {
    const params = new URLSearchParams(searchParamsString);
    params.delete("cc");
    params.delete("target");
    params.delete("major");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900" data-testid="playbook-filters">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="filter-cc" className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Community College
          </label>
          <select
            id="filter-cc"
            data-testid="filter-cc"
            value={currentFilters.cc}
            onChange={(e) => handleFilterChange("cc", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">All CCs</option>
            {options.ccs.map((cc) => (
              <option key={cc.id} value={cc.id}>
                {cc.abbreviation ? `${cc.abbreviation} - ${cc.name}` : cc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="filter-target" className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Target School
          </label>
          <select
            id="filter-target"
            data-testid="filter-target"
            value={currentFilters.target}
            onChange={(e) => handleFilterChange("target", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">All Schools</option>
            {options.targets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.abbreviation ? `${target.abbreviation} - ${target.name}` : target.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="filter-major" className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Major
          </label>
          <select
            id="filter-major"
            data-testid="filter-major"
            value={currentFilters.major}
            onChange={(e) => handleFilterChange("major", e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">All Majors</option>
            {options.majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              data-testid="clear-filters"
              className="whitespace-nowrap rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
