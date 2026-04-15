import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface ComparisonTargetPayload {
  institution_id: string;
}

async function resolveMajorId(supabase: Awaited<ReturnType<typeof createClient>>, targetMajor: string | undefined): Promise<string | null> {
  if (!targetMajor) return null;

  const { data } = await supabase
    .from("majors")
    .select("id")
    .ilike("name", targetMajor)
    .limit(1)
    .maybeSingle() as { data: { id: string } | null };

  return (data as { id: string } | null)?.id ?? null;
}

async function syncUserTargets(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  majorId: string | null,
  targetInstitutionId: string | null,
  comparisonTargets: ComparisonTargetPayload[],
) {
  const uniqueTargets = Array.from(
    new Set([
      ...(targetInstitutionId ? [targetInstitutionId] : []),
      ...comparisonTargets.map((target) => target.institution_id).filter(Boolean),
    ]),
  );

  await supabase.from("user_targets").delete().eq("user_id", userId);

  if (uniqueTargets.length === 0) return;

  await supabase.from("user_targets").insert(
    uniqueTargets.map((institutionId, index) => ({
      user_id: userId,
      institution_id: institutionId,
      major_id: majorId,
      priority_order: index + 1,
    })) as never,
  );
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("transfer_plans")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }
      console.error("Error fetching plan:", error);
      return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Plan fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan_data, chat_history, title, target_major, status, target_institution_id, comparison_targets } = body;

    // Verify the plan belongs to this user
    const { data: existingPlan, error: fetchError } = await supabase
      .from("transfer_plans")
      .select("id, target_major, target_institution_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single() as {
        data: { id: string; target_major: string; target_institution_id: string | null } | null;
        error: { code?: string } | null;
      };

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }
      console.error("Error verifying plan ownership:", fetchError);
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (plan_data !== undefined) updateData.plan_data = plan_data;
    if (chat_history !== undefined) updateData.chat_history = chat_history;
    if (title !== undefined) updateData.title = title;
    if (target_major !== undefined) updateData.target_major = target_major;
    if (status !== undefined) updateData.status = status;
    if (target_institution_id !== undefined) updateData.target_institution_id = target_institution_id;
    if (comparison_targets !== undefined) updateData.comparison_targets = comparison_targets;

    const { data, error } = await supabase
      .from("transfer_plans")
      .update(updateData as never)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating plan:", error);
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    if (comparison_targets !== undefined || target_institution_id !== undefined || target_major !== undefined) {
      const majorId = await resolveMajorId(supabase, target_major ?? existingPlan?.target_major);
      await syncUserTargets(
        supabase,
        user.id,
        majorId,
        target_institution_id ?? existingPlan?.target_institution_id ?? null,
        Array.isArray(comparison_targets) ? comparison_targets : [],
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Plan update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
