import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  NORMAL_GRADE_OPTIONS,
  normalizeNormalGrade,
  normalizeSemesterLabel,
} from "@/utils/course-input-rules";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_courses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { course_code, course_title, units, grade, term, status, notes } = body;

  if (!course_code || !course_title) {
    return NextResponse.json(
      { error: "course_code and course_title are required" },
      { status: 400 }
    );
  }

  const normalizedGrade = grade ? normalizeNormalGrade(grade) : null;
  if (grade && !normalizedGrade) {
    return NextResponse.json(
      { error: `Grade must be one of: ${NORMAL_GRADE_OPTIONS.join(", ")}` },
      { status: 400 },
    );
  }

  const normalizedTerm = term ? normalizeSemesterLabel(term) : null;
  if (term && !normalizedTerm) {
    return NextResponse.json(
      { error: "Term must use the format Fall YYYY or Spring YYYY" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("user_courses")
    .insert({
      user_id: user.id,
      course_code,
      course_title,
      units: units ?? 3,
      grade: normalizedGrade,
      term: normalizedTerm,
      status: status || "completed",
      notes: notes || null,
    } as never)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
