import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";

type TransferPlan = Database["public"]["Tables"]["transfer_plans"]["Insert"];

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
