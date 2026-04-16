import * as React from "react";
import { cn } from "@/lib/utils";
import { MajorInfo, MajorCard } from "./major-card";
import { MajorNotFound } from "./major-not-found";

export interface MajorSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  availableMajors: MajorInfo[];
  selectedMajor: string | null;
  onSelect: (major: string) => void;
  onRequestNew?: (major: string) => void;
}

export function MajorSelector({
  availableMajors,
  selectedMajor,
  onSelect,
  onRequestNew,
  className,
  ...props
}: MajorSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredMajors = React.useMemo(() => {
    if (!searchTerm.trim()) return availableMajors;
    
    const normalized = searchTerm.toLowerCase().trim();
    return availableMajors.filter(
      major => 
        major.name.toLowerCase().includes(normalized) || 
        major.description.toLowerCase().includes(normalized) ||
        major.category.toLowerCase().includes(normalized)
    );
  }, [searchTerm, availableMajors]);

  const majorsByCategory = React.useMemo(() => {
    return filteredMajors.reduce((acc, major) => {
      const cat = major.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(major);
      return acc;
    }, {} as Record<string, MajorInfo[]>);
  }, [filteredMajors]);

  const categories = Object.keys(majorsByCategory).sort();

  return (
    <div className={cn("space-y-8 flex flex-col", className)} {...props}>
      <div className="relative group max-w-2xl mx-auto w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a major (e.g. Computer Science, Biology)..."
          className="w-full pl-11 pr-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 transition-all text-lg shadow-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          aria-label="Search majors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filteredMajors.length === 0 ? (
        <MajorNotFound 
          searchTerm={searchTerm} 
          availableMajors={availableMajors}
          onRequestNew={onRequestNew}
          onSelect={onSelect}
        />
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          {categories.map(category => (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold tracking-tight">{category}</h3>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {majorsByCategory[category].map(major => (
                  <MajorCard 
                    key={major.id} 
                    major={major} 
                    onSelect={onSelect}
                    selected={selectedMajor === major.id}
                  />
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => onRequestNew?.(searchTerm || "Custom Major")}
              className="text-sm font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-blue-600 dark:hover:decoration-blue-400"
            >
              Don&apos;t see your major? Let us know
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
