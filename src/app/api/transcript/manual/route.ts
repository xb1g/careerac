import { createClient } from "@/utils/supabase/server";
import { syncTranscriptToUserCourses } from "@/utils/sync-transcript-courses";
import type { Database } from "@/types/database";
import type { TranscriptCourse } from "@/types/transcript";
import {
  NORMAL_GRADE_OPTIONS,
  normalizeNormalGrade,
  normalizeSemesterLabel,
} from "@/utils/course-input-rules";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { parsed_data, parse_status, parse_method, file_name, institution } = body;

    if (!parsed_data || !file_name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const courses = Array.isArray(parsed_data?.courses)
      ? (parsed_data.courses as TranscriptCourse[])
      : [];
    for (const course of courses) {
      const grade = normalizeNormalGrade(course.grade);
      if (!grade) {
        return Response.json(
          { error: `Grade must be one of: ${NORMAL_GRADE_OPTIONS.join(", ")}` },
          { status: 400 },
        );
      }

      const semester = normalizeSemesterLabel(course.semester);
      if (!semester) {
        return Response.json(
          { error: "Semester must use the format Fall YYYY or Spring YYYY" },
          { status: 400 },
        );
      }

      course.grade = grade;
      course.semester = semester;
      course.status = "completed";
    }

    const insertPayload: Database["public"]["Tables"]["transcripts"]["Insert"] = {
      user_id: user.id,
      file_path: `manual/${user.id}/${Date.now()}.json`,
      file_name,
      parsed_data,
      parse_status: parse_status ?? "completed",
      parse_error: null,
      parse_method: parse_method ?? "manual",
      updated_at: new Date().toISOString(),
    };

    const transcriptResult = (await supabase
      .from("transcripts")
      .insert(insertPayload as never)
      .select("id")
      .single()) as { data: { id: string } | null; error: { message?: string } | null };
    const transcript = transcriptResult.data;
    const error = transcriptResult.error;

    if (error || !transcript) {
      console.error("Manual transcript insert error:", error);
      return Response.json({ error: "Failed to save manual transcript" }, { status: 500 });
    }

    // After transcript is saved, sync courses to user_courses (best-effort)
    if (courses.length > 0) {
      try {
        const syncResult = await syncTranscriptToUserCourses(supabase, user.id, courses);
        if (syncResult.errors.length > 0) {
          console.warn("Manual transcript sync partial errors:", syncResult.errors);
        }
      } catch (syncErr) {
        console.error("Manual transcript sync failed (non-blocking):", syncErr);
      }
    }

    return Response.json({
      id: (transcript as { id: string }).id,
      institution: institution ?? null,
      parsedData: parsed_data,
      parseStatus: parse_status ?? "completed",
      parseMethod: parse_method ?? "manual",
    });
  } catch (error) {
    console.error("Manual transcript error:", error);
    return Response.json({ error: "Failed to process manual transcript" }, { status: 500 });
  }
}
