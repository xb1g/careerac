import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { TranscriptCourse, TranscriptData } from "@/types/transcript";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

type UserCourseRow = {
  course_code: string;
  course_title: string;
  units: number;
  grade: string | null;
  term: string | null;
  status: "completed" | "in_progress" | "planned";
};

type TranscriptRow = {
  parsed_data: { institution?: string } | null;
  created_at: string;
};

function mapStatus(
  status: UserCourseRow["status"],
  grade: string | null,
): TranscriptCourse["status"] {
  if (status === "in_progress") return "in_progress";
  if (grade && grade.toUpperCase() === "W") return "withdrawn";
  return "completed";
}

function computeGpa(courses: TranscriptCourse[]): number | undefined {
  let totalPoints = 0;
  let totalUnits = 0;
  for (const course of courses) {
    if (course.status !== "completed") continue;
    const points = GRADE_POINTS[course.grade.toUpperCase()];
    if (points === undefined) continue;
    totalPoints += points * course.units;
    totalUnits += course.units;
  }
  if (totalUnits === 0) return undefined;
  return Math.round((totalPoints / totalUnits) * 100) / 100;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [coursesRes, transcriptRes] = await Promise.all([
    supabase
      .from("user_courses")
      .select("course_code, course_title, units, grade, term, status")
      .eq("user_id", user.id)
      .in("status", ["completed", "in_progress"])
      .order("created_at", { ascending: true }),
    supabase
      .from("transcripts")
      .select("parsed_data, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (coursesRes.error) {
    return NextResponse.json({ error: coursesRes.error.message }, { status: 500 });
  }

  const rows = (coursesRes.data as UserCourseRow[] | null) ?? [];
  const latestTranscript = transcriptRes.data as TranscriptRow | null;
  const institution = latestTranscript?.parsed_data?.institution?.trim() || "";

  if (rows.length === 0) {
    return NextResponse.json({
      hasCourses: false,
      courseCount: 0,
      institution,
      transcriptData: null,
    });
  }

  const courses: TranscriptCourse[] = rows.map((row) => ({
    code: row.course_code,
    title: row.course_title,
    units: row.units,
    grade: row.grade ?? "",
    status: mapStatus(row.status, row.grade),
    semester: row.term ?? "Unknown",
  }));

  const totalUnitsCompleted = courses
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.units, 0);
  const totalUnitsInProgress = courses
    .filter((c) => c.status === "in_progress")
    .reduce((sum, c) => sum + c.units, 0);
  const gpa = computeGpa(courses);

  const transcriptData: TranscriptData = {
    institution,
    courses,
    totalUnitsCompleted,
    totalUnitsInProgress,
    ...(gpa !== undefined ? { gpa } : {}),
  };

  return NextResponse.json({
    hasCourses: true,
    courseCount: courses.length,
    institution,
    transcriptData,
  });
}
