import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type InstitutionRow = {
  id: string;
  name: string;
  abbreviation: string | null;
  type: string;
};

type TuitionRow = {
  id: string;
  institution_id: string;
  academic_year: number;
  student_type: string;
  student_level: string;
  tuition_and_fees: number;
  living_expenses: number;
  total_cost: number;
  notes: string | null;
};

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const institutionIds = searchParams.getAll("institution_ids[]").flatMap((v) => v.split(","));
  const studentType = searchParams.get("student_type") || "international";
  const academicYear = parseInt(searchParams.get("academic_year") || "2025");

  let query = supabase
    .from("institution_tuition")
    .select("*, institutions(id, name, abbreviation, type)")
    .eq("academic_year", academicYear)
    .eq("student_type", studentType)
    .eq("student_level", "undergraduate");

  if (institutionIds.length > 0 && institutionIds[0]) {
    query = query.in("institution_id", institutionIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Tuition API error:", error);
    return NextResponse.json({ error: "Failed to fetch tuition data" }, { status: 500 });
  }

  const results = (data ?? []).map((row: TuitionRow & { institutions: InstitutionRow }) => ({
    institutionId: row.institution_id,
    institutionName: row.institutions?.name,
    institutionAbbreviation: row.institutions?.abbreviation,
    institutionType: row.institutions?.type,
    academicYear: row.academic_year,
    studentType: row.student_type,
    studentLevel: row.student_level,
    tuitionAndFees: row.tuition_and_fees,
    livingExpenses: row.living_expenses,
    totalCost: row.total_cost,
    notes: row.notes,
  }));

  return NextResponse.json({ tuition: results });
}
