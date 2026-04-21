import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  savePlanRecord,
  type ComparisonTargetPayload,
} from "@/lib/plan-service";

const MAX_COMPARISON_TARGETS = 20;

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

    if (Array.isArray(comparison_targets) && comparison_targets.length > MAX_COMPARISON_TARGETS) {
      return NextResponse.json(
        { error: `You can select up to ${MAX_COMPARISON_TARGETS} comparison targets.` },
        { status: 400 }
      );
    }

    try {
      const data = await savePlanRecord(supabase, {
        userId: user.id,
        title,
        ccInstitutionId: cc_institution_id ?? null,
        targetInstitutionId: target_institution_id ?? null,
        targetMajor: target_major,
        planData: plan_data ?? null,
        chatHistory: Array.isArray(chat_history) ? chat_history : [],
        maxCreditsPerSemester: max_credits_per_semester ?? null,
        transcriptId: transcript_id ?? null,
        hasTargetSchool: has_target_school ?? true,
        comparisonTargets: Array.isArray(comparison_targets)
          ? (comparison_targets as ComparisonTargetPayload[])
          : null,
      });

      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error("Error creating plan:", error);
      return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
    }
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
