import { getCurrentAdminContext } from "@/utils/admin";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteContext) {
  const { supabase, user, isAdmin } = await getCurrentAdminContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("playbooks")
    .update({ verification_status: "rejected" } as never)
    .eq("id", id)
    .select("id, verification_status")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Playbook not found" }, { status: 404 });
    }

    console.error("Error rejecting playbook:", error);
    return NextResponse.json({ error: "Failed to reject playbook" }, { status: 500 });
  }

  return NextResponse.json(data);
}
