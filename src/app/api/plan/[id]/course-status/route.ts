import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createCheckpoint } from "@/lib/checkpoint";
import type { CourseStatus } from "@/types/plan";

interface PlanCourseRow {
  id: string;
  course_id: string | null;
  semester_number: number;
  status: string;
}

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
    const { courseCode, status, planCourseId } = body as {
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

    // Snapshot current state before mutation
    await createCheckpoint(supabase, planId, `Changed ${courseCode} to ${status}`);

    // Attempt to update plan_courses status if it exists
    let updatedCourse: PlanCourseRow | null = null;
    
    if (planCourseId) {
      const { data } = await supabase
        .from("plan_courses")
        .update({
          status,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", planCourseId)
        .select()
        .maybeSingle();
      updatedCourse = data as unknown as PlanCourseRow;
    }

    // If no planCourseId or update failed, try to update by planId and semester + code if possible
    // Note: plan_courses might not even exist yet for many plans as they are often just in plan_data JSON
    if (!updatedCourse) {
       // We don't have a reliable way to update plan_courses without an ID 
       // because it doesn't store course_code directly (it stores course_id)
       // and we might not have resolved course_id yet.
    }

    // Sync to user_courses table - ALWAYS do this if courseCode and status are provided
    // and status is meaningful for "My Courses"
    let statusToSync: "completed" | "in_progress" | "planned" | null = null;
    if (status === "completed") statusToSync = "completed";
    else if (status === "in_progress") statusToSync = "in_progress";
    else if (status === "planned" || status === "failed" || status === "cancelled" || status === "waitlisted") {
      statusToSync = "planned";
    }

    if (statusToSync) {
      // Get full course details if possible
      let courseTitle = courseCode;
      let courseUnits = 3;

      // Try to find the course in the catalog to get the real title/units
      const { data: courseCatalogData } = await supabase
        .from("courses")
        .select("title, units")
        .eq("code", courseCode)
        .limit(1)
        .maybeSingle();
      
      if (courseCatalogData) {
        const typed = courseCatalogData as { title: string; units: number };
        courseTitle = typed.title;
        courseUnits = typed.units;
      }

      // Upsert into user_courses
      const { data: existingUserCourse } = await supabase
        .from("user_courses")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_code", courseCode)
        .maybeSingle();

      if (existingUserCourse) {
        const typedExisting = existingUserCourse as { id: string };
        await supabase
          .from("user_courses")
          .update({
            status: statusToSync,
            course_title: courseTitle,
            units: courseUnits,
          } as never)
          .eq("id", typedExisting.id);
      } else {
        await supabase
          .from("user_courses")
          .insert({
            user_id: user.id,
            course_code: courseCode,
            course_title: courseTitle,
            units: courseUnits,
            status: statusToSync,
          } as never);
      }
    }

    // Create a failure event if the status is failed, cancelled, or waitlisted
    const isFailureStatus = status === "failed" || status === "cancelled" || status === "waitlisted";
    if (isFailureStatus && updatedCourse) {
      await supabase
        .from("failure_events")
        .insert({
          plan_id: planId,
          plan_course_id: updatedCourse.id,
          failure_type: status === "waitlisted" ? "waitlisted" : status === "cancelled" ? "cancelled" : "failed",
          created_at: new Date().toISOString(),
        } as never);
    }

    return NextResponse.json({
      success: true,
      status,
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
