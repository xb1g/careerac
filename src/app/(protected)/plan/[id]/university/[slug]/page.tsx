import { loadUniversityDetail } from "@/utils/plan-detail-fetchers";
import UniversityDetailClient from "./university-detail-client";

interface Props {
  params: Promise<{ id: string; slug: string }>;
}

export default async function UniversityDetail({ params }: Props) {
  const { id, slug } = await params;
  const result = await loadUniversityDetail(id, slug);

  if (!result.ok) {
    return <NotFound message={result.message} parentId={result.parentId} />;
  }

  return <UniversityDetailClient {...result.props} />;
}

function NotFound({ message, parentId }: { message: string; parentId?: string }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 text-center">
      <div>
        <p className="text-zinc-700 dark:text-zinc-300 mb-4">{message}</p>
        <a
          href={parentId ? `/plan/${parentId}` : "/dashboard"}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </a>
      </div>
    </div>
  );
}
