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
    const { courseCode, semesterNumber, status, planCourseId } = body as {
      courseCode: string;
      semesterNumber: number;
      status: CourseStatus;
      planCourseId?: string;
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

    // Update plan_courses status
    let updateQuery = supabase
      .from("plan_courses")
      .update({
        status,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("plan_id", planId)
      .eq("semester_number", semesterNumber)
      .select()
      .maybeSingle();

    // If we have a planCourseId, use it for more precise matching
    if (planCourseId) {
      updateQuery = supabase
        .from("plan_courses")
        .update({
          status,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", planCourseId)
        .select()
        .maybeSingle();
    }

    const { data: updatedCourse, error: updateError } = await updateQuery;

    if (updateError) {
      console.error("Error updating course status:", updateError);
      return NextResponse.json(
        { error: "Failed to update course status" },
        { status: 500 }
      );
    }

    // Create a failure event if the status is failed, cancelled, or waitlisted
    let failureEvent = null;
    const isFailureStatus = status === "failed" || status === "cancelled" || status === "waitlisted";

    if (isFailureStatus && updatedCourse) {
      const courseId = (updatedCourse as Record<string, unknown>).id as string;
      const { data: failureData, error: failureError } = await supabase
        .from("failure_events")
        .insert({
          plan_id: planId,
          plan_course_id: courseId,
          failure_type: status === "waitlisted" ? "waitlisted" : status === "cancelled" ? "cancelled" : "failed",
          created_at: new Date().toISOString(),
        } as never)
        .select()
        .maybeSingle();

      if (failureError) {
        console.error("Error creating failure event:", failureError);
        // Don't fail the whole request if failure event creation fails
      } else {
        failureEvent = failureData;
      }
    }

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      status,
      failureEvent,
      triggerRecovery: isFailureStatus,
    });
  } catch (error) {
    console.error("Course status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
