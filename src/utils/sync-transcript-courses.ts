import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { TranscriptCourse } from "@/types/transcript";

type UserCourseInsert = Database["public"]["Tables"]["user_courses"]["Insert"];
type UserCourseStatus = "completed" | "in_progress" | "planned";

/**
 * Maps a TranscriptCourse to user_courses insert fields.
 */
export function mapTranscriptCourse(
  course: TranscriptCourse,
  userId: string,
): UserCourseInsert {
  let status: UserCourseStatus;
  let grade: string | null = course.grade || null;

  if (course.status === "withdrawn") {
    status = "completed";
    grade = "W";
  } else if (course.status === "in_progress") {
    status = "in_progress";
  } else {
    status = "completed";
  }

  return {
    user_id: userId,
    course_code: course.code,
    course_title: course.title,
    units: course.units,
    grade,
    term: course.semester || null,
    status,
    notes: null,
  };
}

export interface SyncResult {
  created: number;
  updated: number;
  errors: string[];
}

/**
 * Syncs transcript courses to the user_courses table.
 * Does an app-level upsert: fetches existing courses, matches by course_code,
 * then inserts new or updates existing ones.
 */
export async function syncTranscriptToUserCourses(
  supabase: SupabaseClient<Database>,
  userId: string,
  courses: TranscriptCourse[],
): Promise<SyncResult> {
  const result: SyncResult = { created: 0, updated: 0, errors: [] };

  if (courses.length === 0) {
    return result;
  }

  // Fetch all existing user_courses for this user
  const { data: existingCourses, error: fetchError } = await supabase
    .from("user_courses")
    .select("id, course_code")
    .eq("user_id", userId) as { data: { id: string; course_code: string }[] | null; error: { message: string } | null };

  if (fetchError) {
    result.errors.push(`Failed to fetch existing courses: ${fetchError.message}`);
    return result;
  }

  // Build lookup map: course_code -> id
  const existingMap = new Map<string, string>();
  for (const row of existingCourses ?? []) {
    existingMap.set(row.course_code, row.id);
  }

  // Process each transcript course
  for (const course of courses) {
    try {
      const mapped = mapTranscriptCourse(course, userId);
      const existingId = existingMap.get(course.code);

      if (existingId) {
        // Update existing course
        const { error: updateError } = await supabase
          .from("user_courses")
          .update({
            course_title: mapped.course_title,
            units: mapped.units,
            grade: mapped.grade,
            term: mapped.term,
            status: mapped.status,
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", existingId);

        if (updateError) {
          result.errors.push(`Failed to update ${course.code}: ${updateError.message}`);
        } else {
          result.updated++;
        }
      } else {
        // Insert new course
        const { error: insertError } = await supabase
          .from("user_courses")
          .insert(mapped as never);

        if (insertError) {
          result.errors.push(`Failed to insert ${course.code}: ${insertError.message}`);
        } else {
          result.created++;
        }
      }
    } catch (err) {
      result.errors.push(`Error processing ${course.code}: ${String(err)}`);
    }
  }

  return result;
}
