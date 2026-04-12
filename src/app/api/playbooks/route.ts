import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    ccInstitutionId: string;
    targetInstitutionId: string;
    targetMajor: string;
    transferYear: number;
    outcome: "transferred" | "in_progress" | "changed_direction";
    playbookData: {
      semesters: Array<{
        number: number;
        courses: Array<{
          course_code: string;
          title: string;
          units: number;
          grade?: string;
          note?: string;
        }>;
      }>;
      failure_events: Array<{
        course_code: string;
        failure_type: "failed" | "cancelled" | "waitlisted";
        reason?: string;
        resolution?: string;
        lessons_learned?: string;
      }>;
    };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const {
    ccInstitutionId,
    targetInstitutionId,
    targetMajor,
    transferYear,
    outcome,
    playbookData,
  } = body;

  // Validate required fields
  if (!ccInstitutionId || !targetInstitutionId || !targetMajor || !transferYear || !outcome) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const insertData = {
    user_id: user.id,
    cc_institution_id: ccInstitutionId,
    target_institution_id: targetInstitutionId,
    target_major: targetMajor,
    transfer_year: transferYear,
    outcome,
    verification_status: "pending" as const,
    playbook_data: playbookData,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("playbooks") as any)
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating playbook:", error);
    return NextResponse.json(
      { error: "Failed to create playbook" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Failed to create playbook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
