import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MajorInfo, MajorCard } from "./major-card";

export interface MajorNotFoundProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  searchTerm: string;
  availableMajors: MajorInfo[];
  onRequestNew?: (majorName: string) => void;
  onSelect: (id: string) => void;
}

export function MajorNotFound({
  searchTerm,
  availableMajors,
  onRequestNew,
  onSelect,
  className,
  ...props
}: MajorNotFoundProps) {
  const getSimilarMajors = (term: string, majors: MajorInfo[]) => {
    if (!term) return [];
    
    const normalizedTerm = term.toLowerCase().trim();
    const termWords = normalizedTerm.split(/\s+/).filter(w => w.length > 2);
    
    const scored = majors.map(major => {
      let score = 0;
      const normalizedName = major.name.toLowerCase();
      const normalizedDesc = major.description.toLowerCase();
      const normalizedCategory = major.category.toLowerCase();
      
      if (normalizedName.includes(normalizedTerm)) score += 10;
      if (normalizedCategory.includes(normalizedTerm)) score += 5;
      
      termWords.forEach(word => {
        if (normalizedName.includes(word)) score += 3;
        if (normalizedDesc.includes(word)) score += 1;
        if (normalizedCategory.includes(word)) score += 2;
      });
      
      return { major, score };
    });
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.major)
      .slice(0, 3);
  };

  const similarMajors = React.useMemo(
    () => getSimilarMajors(searchTerm, availableMajors),
    [searchTerm, availableMajors]
  );

  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", className)} {...props}>
      <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">
          We don&apos;t have &ldquo;{searchTerm}&rdquo; data yet
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
          Our system is still growing. You can select a similar major from below, or request this specific one to be added in the future.
        </p>
        
        {onRequestNew && (
          <Button 
            onClick={() => onRequestNew(searchTerm)}
            variant="outline"
            className="rounded-full shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
          >
            Request this major
          </Button>
        )}
      </div>

      {similarMajors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-medium tracking-tight">Similar Options</h4>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1 ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarMajors.map(major => (
              <MajorCard 
                key={major.id} 
                major={major} 
                onSelect={onSelect} 
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-medium tracking-tight">Browse All Available Majors</h4>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1 ml-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMajors.map(major => (
            <MajorCard 
              key={major.id} 
              major={major} 
              onSelect={onSelect} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
