import { getCurrentAdminContext } from "@/utils/admin";
import { NextRequest, NextResponse } from "next/server";

type VerificationStatus = "pending" | "verified" | "rejected";

interface InstitutionRef {
  id: string;
  name: string;
  abbreviation: string | null;
}

interface AdminPlaybookRow {
  id: string;
  user_id: string;
  target_major: string;
  transfer_year: number;
  outcome: string;
  verification_status: VerificationStatus;
  playbook_data: unknown;
  created_at: string;
  cc_institution: InstitutionRef | null;
  target_institution: InstitutionRef | null;
}

const VALID_STATUSES: VerificationStatus[] = ["pending", "verified", "rejected"];

export async function GET(request: NextRequest) {
  const { supabase, user, isAdmin } = await getCurrentAdminContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") ?? "pending";

  if (!VALID_STATUSES.includes(status as VerificationStatus)) {
    return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("playbooks")
    .select(
      `
      id,
      user_id,
      target_major,
      transfer_year,
      outcome,
      verification_status,
      playbook_data,
      created_at,
      cc_institution:cc_institution_id (
        id,
        name,
        abbreviation
      ),
      target_institution:target_institution_id (
        id,
        name,
        abbreviation
      )
    `,
    )
    .eq("verification_status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin playbooks:", error);
    return NextResponse.json({ error: "Failed to fetch playbooks" }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as AdminPlaybookRow[]);
}
