"use client";

import UniversityDetailContent from "@/components/university-detail-content";
import type { UniversityDetailProps } from "@/utils/plan-detail-fetchers";

export default function UniversityDetailClient(props: UniversityDetailProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <UniversityDetailContent {...props} />
    </div>
  );
}
