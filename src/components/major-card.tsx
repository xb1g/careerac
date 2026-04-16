import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MajorInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  supportedSchools: number;
}

export interface MajorCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  major: MajorInfo;
  onSelect: (id: string) => void;
  selected?: boolean;
}

export function MajorCard({ major, onSelect, selected, className, ...props }: MajorCardProps) {
  const getCategoryVariant = (category: string) => {
    const normalized = category.toLowerCase();
    if (normalized.includes("stem") || normalized.includes("engineering") || normalized.includes("computer")) return "primary";
    if (normalized.includes("business") || normalized.includes("finance")) return "success";
    if (normalized.includes("art") || normalized.includes("design")) return "warning";
    return "default";
  };

  return (
    <Card 
      className={cn(
        "group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50",
        selected ? "border-blue-500 ring-1 ring-blue-500 dark:border-blue-500 dark:ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10" : "bg-white dark:bg-zinc-950",
        className
      )}
      {...props}
    >
      <CardHeader className="pb-3 flex-none space-y-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight line-clamp-2">{major.name}</CardTitle>
          <Badge variant={getCategoryVariant(major.category)} className="shrink-0 rounded-md px-2 font-medium">
            {major.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
          {major.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex-none flex items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto p-4">
        <div className="flex items-center text-xs font-medium text-zinc-500 dark:text-zinc-500">
          <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {major.supportedSchools > 0 ? (
            <span>{major.supportedSchools} school{major.supportedSchools !== 1 ? 's' : ''}</span>
          ) : (
            <span>Data coming soon</span>
          )}
        </div>
        <Button 
          variant={selected ? "default" : "secondary"} 
          size="sm" 
          className="shrink-0 transition-all rounded-full px-4 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600"
          onClick={() => onSelect(major.id)}
        >
          {selected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
