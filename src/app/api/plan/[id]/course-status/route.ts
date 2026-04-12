import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { CourseStatus } from "@/types/plan";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId } = await params;
    const body = await req.json();
    const { courseCode, semesterNumber, status } = body as {
      courseCode: string;
      semesterNumber: number;
      status: CourseStatus;
    };

    if (!courseCode || !status) {
      return NextResponse.json(
        { error: "Missing required fields: courseCode, status" },
        { status: 400 }
      );
    }

    // Verify the plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from("transfer_plans")
      .select("id")
      .eq("id", planId)
      .eq("user_id", user.id)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Update plan_courses status by matching course code and semester
    // Note: plan_courses may not have a direct course_code column, so we need to match via the plan_data JSONB
    // First, let's try to find and update the plan_course record
    const { data: updatedCourse, error: updateError } = await supabase
      .from("plan_courses")
      .update({
        status,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("plan_id", planId)
      .eq("semester_number", semesterNumber)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Error updating course status:", updateError);
      return NextResponse.json(
        { error: "Failed to update course status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      status,
    });
  } catch (error) {
    console.error("Course status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
