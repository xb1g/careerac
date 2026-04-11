import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
    const { plan_data, chat_history, title, target_major, status } = body;

    // Verify the plan belongs to this user
    const { error: fetchError } = await supabase
      .from("transfer_plans")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Plan update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
