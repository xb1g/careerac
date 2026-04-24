import { createClient } from "@/utils/supabase/server";
import CoursesClient from "./courses-client";

interface Institution {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface Course {
  id: string;
  institution_id: string;
  code: string;
  title: string;
  units: number;
  description: string | null;
}

async function getColleges(): Promise<Institution[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .eq("type", "cc")
    .order("name");

  if (error) {
    console.error("Error fetching colleges:", error);
    return [];
  }

  return (data ?? []) as Institution[];
}

async function getCoursesByCollege(collegeIds: string[]): Promise<Record<string, Course[]>> {
  if (collegeIds.length === 0) return {};

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("id, institution_id, code, title, units, description")
    .in("institution_id", collegeIds)
    .order("code");

  if (error) {
    console.error("Error fetching courses:", error);
    return {};
  }

  const courses = (data ?? []) as Course[];
  const grouped: Record<string, Course[]> = {};
  for (const course of courses) {
    if (!grouped[course.institution_id]) {
      grouped[course.institution_id] = [];
    }
    grouped[course.institution_id].push(course);
  }

  return grouped;
}

export default async function CoursesPage() {
  const colleges = await getColleges();
  const coursesByCollege = await getCoursesByCollege(colleges.map((c) => c.id));

  return <CoursesClient colleges={colleges} coursesByCollege={coursesByCollege} />;
}