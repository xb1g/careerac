import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface AcceptAlternativeRequest {
  alternative: {
    code: string;
    title: string;
    units: number;
    transferEquivalency: string;
    prerequisites?: string[];
  };
  failedCourseCode: string;
  failedCourseTitle: string;
  semesterNumber: number;
  targetSemesterNumber?: number;
  planCourseId?: string;
}

export async function POST(
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
    const body: AcceptAlternativeRequest = await req.json();
    const { alternative, failedCourseCode, failedCourseTitle, semesterNumber, targetSemesterNumber, planCourseId } = body;

    if (!alternative?.code || !failedCourseCode) {
      return NextResponse.json(
        { error: "Missing required fields: alternative, failedCourseCode" },
        { status: 400 }
      );
    }

    // Verify the plan belongs to the user
    const { data: plan, error: planError } = await supabase
      .from("transfer_plans")
      .select("plan_data")
      .eq("id", planId)
      .eq("user_id", user.id)
      .single() as { data: { plan_data: unknown } | null; error: unknown };

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const planData = plan.plan_data as Record<string, unknown> | null;
    if (!planData || !("semesters" in planData) || !Array.isArray(planData.semesters)) {
      return NextResponse.json({ error: "Invalid plan data" }, { status: 400 });
    }

    const semesters = planData.semesters as Array<{
      number: number;
      label: string;
      courses: Array<{
        code: string;
        title: string;
        units: number;
        transferEquivalency?: string;
        prerequisites?: string[];
        status?: string;
        alternative_for?: string;
      }>;
      totalUnits: number;
    }>;

    const effectiveSemesterNumber = targetSemesterNumber || semesterNumber;

    // Find or create the target semester
    let targetSemester = semesters.find(s => s.number === effectiveSemesterNumber);
    if (!targetSemester) {
      // Create a new semester
      const newSemester = {
        number: effectiveSemesterNumber,
        label: `Semester ${effectiveSemesterNumber}`,
        courses: [],
        totalUnits: 0,
      };
      semesters.push(newSemester);
      targetSemester = newSemester;
      // Sort semesters by number
      semesters.sort((a, b) => a.number - b.number);
    }

    // Add the alternative course to the target semester
    // Use alternative_for to link it to the failed course
    targetSemester.courses.push({
      code: alternative.code,
      title: alternative.title,
      units: alternative.units,
      transferEquivalency: alternative.transferEquivalency,
      prerequisites: alternative.prerequisites || [],
      status: "planned",
      alternative_for: failedCourseCode,
    });

    // Update the failed course's status in the original semester (keep the status indicator)
    for (const semester of semesters) {
      for (const course of semester.courses) {
        if (course.code === failedCourseCode && course.title === failedCourseTitle) {
          // Ensure the failed/cancelled/waitlisted status is retained
          // It should already be set, but ensure it's not overwritten
          break;
        }
      }
    }

    // Recalculate total units for each semester
    for (const semester of semesters) {
      semester.totalUnits = semester.courses.reduce((sum, c) => sum + c.units, 0);
    }

    // Calculate overall total units
    const totalUnits = semesters.reduce((sum, s) => sum + s.totalUnits, 0);
    planData.totalUnits = totalUnits;

    // Save the updated plan
    const { error: updateError } = await supabase
      .from("transfer_plans")
      .update({
        plan_data: planData as never,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", planId);

    if (updateError) {
      console.error("Error updating plan with alternative:", updateError);
      return NextResponse.json(
        { error: "Failed to update plan with alternative" },
        { status: 500 }
      );
    }

    // Also create/update the plan_courses record for the new alternative
    const { error: courseError } = await supabase
      .from("plan_courses")
      .insert({
        plan_id: planId,
        course_id: null,
        semester_number: effectiveSemesterNumber,
        status: "planned",
        alternative_for: planCourseId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as never);

    if (courseError) {
      console.error("Error creating plan_course for alternative:", courseError);
      // Don't fail the request if this fails
    }

    return NextResponse.json({
      success: true,
      message: `Added ${alternative.code} as alternative for ${failedCourseCode}`,
      updatedSemester: effectiveSemesterNumber,
    });
  } catch (error) {
    console.error("Accept alternative error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
