import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";

type TransferPlan = Database["public"]["Tables"]["transfer_plans"]["Insert"];
type UserTargetInsert = Database["public"]["Tables"]["user_targets"]["Insert"];

interface ComparisonTargetPayload {
  institution_id: string;
  name?: string;
  abbreviation?: string | null;
  priority_order?: number;
}

async function resolveMajorId(supabase: Awaited<ReturnType<typeof createClient>>, targetMajor: string): Promise<string | null> {
  const { data } = await supabase
    .from("majors")
    .select("id, name")
    .ilike("name", targetMajor)
    .limit(1)
    .maybeSingle();

  const major = data as { id: string } | null;
  return major?.id ?? null;
}

async function syncUserTargets(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  majorId: string | null,
  primaryTargetId: string | null,
  comparisonTargets: ComparisonTargetPayload[],
) {
  const uniqueTargets = Array.from(
    new Set([
      ...(primaryTargetId ? [primaryTargetId] : []),
      ...comparisonTargets.map((target) => target.institution_id).filter(Boolean),
    ]),
  );

  await supabase.from("user_targets").delete().eq("user_id", userId);

  if (uniqueTargets.length === 0) return;

  const inserts: UserTargetInsert[] = uniqueTargets.map((institutionId, index) => ({
    user_id: userId,
    institution_id: institutionId,
    major_id: majorId,
    priority_order: index + 1,
  }));

  await supabase.from("user_targets").insert(inserts as never);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      cc_institution_id,
      target_institution_id,
      target_major,
      plan_data,
      chat_history,
      max_credits_per_semester,
      transcript_id,
      has_target_school,
      comparison_targets,
    } = body;

    if (!title || !target_major) {
      return NextResponse.json(
        { error: "Missing required fields: title, target_major" },
        { status: 400 }
      );
    }

    const insertData: TransferPlan = {
      user_id: user.id,
      title,
      cc_institution_id: cc_institution_id ?? null,
      target_institution_id: target_institution_id ?? null,
      target_major,
      plan_data: plan_data ?? null,
      chat_history: chat_history ?? null,
      status: "active",
      max_credits_per_semester: max_credits_per_semester ?? null,
      transcript_id: transcript_id ?? null,
      has_target_school: has_target_school ?? true,
      comparison_targets: comparison_targets ?? null,
    };

    const { data, error } = await supabase
      .from("transfer_plans")
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      console.error("Error creating plan:", error);
      return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
    }

    const majorId = await resolveMajorId(supabase, target_major);
    await syncUserTargets(
      supabase,
      user.id,
      majorId,
      target_institution_id ?? null,
      Array.isArray(comparison_targets) ? comparison_targets : [],
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Plan creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching plans:", error);
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Plan listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
