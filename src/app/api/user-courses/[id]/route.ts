import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";

type UserCourseUpdate = Database["public"]["Tables"]["user_courses"]["Update"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { course_code, course_title, units, grade, term, status, notes } = body;

  const updateData: UserCourseUpdate = {};
  if (course_code !== undefined) updateData.course_code = course_code;
  if (course_title !== undefined) updateData.course_title = course_title;
  if (units !== undefined) updateData.units = units;
  if (grade !== undefined) updateData.grade = grade || null;
  if (term !== undefined) updateData.term = term || null;
  if (status !== undefined) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes || null;

  const { data, error } = await supabase
    .from("user_courses")
    .update(updateData as never)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("user_courses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
