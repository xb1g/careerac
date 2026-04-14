import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CoursesClient from "./courses-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const { data: courses } = await supabase
    .from("user_courses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
          My Courses
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Track courses you&apos;ve completed, are currently taking, or plan to
          take. This helps generate better transfer plans.
        </p>
      </div>

      <CoursesClient initialCourses={courses ?? []} />
    </div>
  );
}
