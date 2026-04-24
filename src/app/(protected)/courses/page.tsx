import { createClient } from "@/utils/supabase/server";
import CoursesClient from "./courses-client";

const PAGE_SIZE = 30;

interface Institution {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface Course {
  id: string;
  institution_id: string;
  code: string;
  title: string;
  units: number;
  description: string | null;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const collegeId = typeof params.college === "string" ? params.college : "";
  const subject = typeof params.subject === "string" ? params.subject : "";
  const search = typeof params.q === "string" ? params.q : "";
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);

  const supabase = await createClient();

  // Always fetch colleges for the dropdown
  const { data: collegesData } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .in("type", ["cc", "community_college"])
    .order("name");

  const colleges = (collegesData ?? []) as Institution[];

  let courses: Course[] = [];
  let totalCount = 0;
  let subjects: string[] = [];

  if (collegeId) {
    // Fetch distinct subject prefixes via RPC (migration 055).
    // Cast needed because the generated types don't include this function yet.
    const { data: subjectData } = await (supabase.rpc as Function)(
      "distinct_course_prefixes",
      { p_institution_id: collegeId },
    );

    subjects = ((subjectData as { prefix: string }[] | null) ?? []).map((r) => r.prefix);

    // Build the courses query with filters
    let query = supabase
      .from("courses")
      .select("id, institution_id, code, title, units, description", { count: "exact" })
      .eq("institution_id", collegeId)
      .order("code");

    if (subject) {
      // Filter by prefix: "MATH " matches "MATH 101", "MATH 200", etc.
      query = query.like("code", `${subject} %`);
    }

    if (search) {
      query = query.or(`code.ilike.%${search}%,title.ilike.%${search}%`);
    }

    const from = (page - 1) * PAGE_SIZE;
    query = query.range(from, from + PAGE_SIZE - 1);

    const { data, count, error } = await query;

    if (!error) {
      courses = (data ?? []) as Course[];
      totalCount = count ?? 0;
    }
  }

  return (
    <CoursesClient
      colleges={colleges}
      courses={courses}
      subjects={subjects}
      totalCount={totalCount}
      selectedCollege={collegeId}
      selectedSubject={subject}
      searchQuery={search}
      page={page}
      pageSize={PAGE_SIZE}
    />
  );
}
