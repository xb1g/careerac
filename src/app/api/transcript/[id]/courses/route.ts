import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { TranscriptCourse } from "@/types/transcript";

const VALID_GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "P", "NP", "W", "I"];

interface UpdateCoursesPayload {
  add?: TranscriptCourse[];
  remove?: string[];
}

function validateCourse(course: TranscriptCourse): string | null {
  // course code: required, string, 2-10 chars, alphanumeric + space
  if (!course.code || typeof course.code !== "string" || course.code.length < 2 || course.code.length > 10) {
    return "Course code must be 2-10 characters";
  }
  if (!/^[a-zA-Z0-9\s]+$/.test(course.code)) {
    return "Course code must be alphanumeric";
  }

  // title: required, string, 1-200 chars
  if (!course.title || typeof course.title !== "string" || course.title.length < 1 || course.title.length > 200) {
    return "Title must be 1-200 characters";
  }

  // units: required, number, > 0, <= 20
  if (typeof course.units !== "number" || course.units <= 0 || course.units > 20) {
    return "Units must be a number greater than 0 and up to 20";
  }

  // grade: required, one of valid grades
  if (!course.grade || !VALID_GRADES.includes(course.grade)) {
    return `Grade must be one of: ${VALID_GRADES.join(", ")}`;
  }

  // semester: optional, string
  if (course.semester !== undefined && typeof course.semester !== "string") {
    return "Semester must be a string";
  }

  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const result = await supabase
      .from("transcripts")
      .select("parsed_data")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as { data: { parsed_data: unknown } | null; error: { message: string } | null };

    if (result.error || !result.data) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    const parsedData = result.data.parsed_data as { courses?: TranscriptCourse[] } | null;
    const courses = parsedData?.courses ?? [];

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Transcript courses fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateCoursesPayload = await req.json();

    // Fetch existing transcript
    const fetchResult = await supabase
      .from("transcripts")
      .select("parsed_data")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as { data: { parsed_data: unknown } | null; error: { message: string } | null };

    if (fetchResult.error || !fetchResult.data) {
      return NextResponse.json({ error: "Transcript not found" }, { status: 404 });
    }

    const parsedData = fetchResult.data.parsed_data as { courses?: TranscriptCourse[] } | null;
    let courses = parsedData?.courses ? [...parsedData.courses] : [];

    // Validate and add courses
    if (body.add && Array.isArray(body.add)) {
      for (const course of body.add) {
        const validationError = validateCourse(course);
        if (validationError) {
          return NextResponse.json({ error: validationError }, { status: 400 });
        }
        // Check for duplicate course code
        if (courses.some((c) => c.code === course.code)) {
          return NextResponse.json({ error: `Course with code "${course.code}" already exists` }, { status: 400 });
        }
        courses.push(course);
      }
    }

    // Remove courses by code
    if (body.remove && Array.isArray(body.remove)) {
      const removeCodes = new Set(body.remove);
      const beforeCount = courses.length;
      courses = courses.filter((c) => !removeCodes.has(c.code));
      if (courses.length === beforeCount && body.remove.length > 0) {
        // Only error if nothing was removed but remove list is not empty
        const notFound = body.remove.filter((code) => !parsedData?.courses?.some((c) => c.code === code));
        if (notFound.length > 0) {
          return NextResponse.json({ error: `Courses not found: ${notFound.join(", ")}` }, { status: 400 });
        }
      }
    }

    // Save updated parsed_data
    const updatedParsedData = {
      ...parsedData,
      courses,
    };

    const updateResult = await supabase
      .from("transcripts")
      .update({
        parsed_data: updatedParsedData,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("parsed_data")
      .single() as { data: { parsed_data: unknown } | null; error: { message: string } | null };

    if (updateResult.error || !updateResult.data) {
      return NextResponse.json({ error: "Failed to update courses" }, { status: 500 });
    }

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Transcript courses update error:", error);
    return NextResponse.json({ error: "Failed to update courses" }, { status: 500 });
  }
}
