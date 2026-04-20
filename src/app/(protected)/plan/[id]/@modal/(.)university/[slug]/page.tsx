import { loadUniversityDetail } from "@/utils/plan-detail-fetchers";
import UniversityPeekPanel from "./university-peek-panel";

interface Props {
  params: Promise<{ id: string; slug: string }>;
}

export default async function InterceptedUniversityDetail({ params }: Props) {
  const { id, slug } = await params;
  const result = await loadUniversityDetail(id, slug);

  if (!result.ok) {
    return null;
  }

  return <UniversityPeekPanel {...result.props} />;
}
