import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database";

type PlaybookRow = Database["public"]["Tables"]["playbooks"]["Row"];

/**
 * Extended playbook row with nested institution data from the select query.
 */
interface PlaybookWithInstitutions extends Omit<PlaybookRow, "playbook_data"> {
  cc_institution: { id: string; name: string; abbreviation: string | null } | null;
  target_institution: { id: string; name: string; abbreviation: string | null } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playbook_data: any;
}

/**
 * Fetches verified playbooks to include as community context in the AI system prompt.
 *
 * CRITICAL: Only includes playbooks with verification_status='verified' AND outcome='transferred'.
 * Unverified playbooks (in_progress, changed_direction, pending) are NEVER included.
 *
 * @param ccInstitutionId - Optional CC institution ID to filter by
 * @param targetInstitutionId - Optional target institution ID to filter by
 * @param major - Optional major to filter by
 */
export async function getVerifiedPlaybooksContext(
  ccInstitutionId?: string,
  targetInstitutionId?: string,
  major?: string,
): Promise<string> {
  try {
    const supabase = await createClient();

    // ONLY fetch verified playbooks with transferred outcome
    let query = supabase
      .from("playbooks")
      .select(
        `
        id,
        target_major,
        transfer_year,
        outcome,
        verification_status,
        playbook_data,
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
      `
      )
      .eq("verification_status", "verified")
      .eq("outcome", "transferred")
      .order("created_at", { ascending: false })
      .limit(10);

    if (ccInstitutionId) {
      query = query.eq("cc_institution_id", ccInstitutionId);
    }
    if (targetInstitutionId) {
      query = query.eq("target_institution_id", targetInstitutionId);
    }
    if (major) {
      query = query.eq("target_major", major);
    }

    const { data, error } = await query.returns<PlaybookWithInstitutions[]>();

    if (error || !data || data.length === 0) {
      return "";
    }

    // Format verified playbook data for the AI system prompt
    const playbookContexts = data.map((pb) => {
      const ccName = pb.cc_institution?.abbreviation ?? pb.cc_institution?.name ?? "Unknown CC";
      const targetName =
        pb.target_institution?.abbreviation ?? pb.target_institution?.name ?? "Unknown University";
      const playbookData = pb.playbook_data;

      let context = `Community Playbook: ${ccName} → ${targetName} for ${pb.target_major} (transferred ${pb.transfer_year})`;

      if (playbookData?.semesters && playbookData.semesters.length > 0) {
        const courses = playbookData.semesters.flatMap(
          (s: { number: number; courses: Array<{ course_code: string; title: string; units: number; note?: string }> }) =>
            s.courses.map(
              (c: { course_code: string; title: string; units: number; note?: string }) =>
                `${c.course_code} (${c.title}, ${c.units} units)${c.note ? ` — ${c.note}` : ""}`,
            ),
        );
        context += `\n  Courses taken: ${courses.join("; ")}`;
      }

      if (playbookData?.failure_events && playbookData.failure_events.length > 0) {
        const failures = playbookData.failure_events.map(
          (fe: { course_code: string; failure_type: string; resolution?: string; lessons_learned?: string }) =>
            `${fe.course_code} (${fe.failure_type}) — resolved: ${fe.resolution ?? fe.lessons_learned ?? "N/A"}`,
        );
        context += `\n  Challenges overcome: ${failures.join("; ")}`;
      }

      return context;
    });

    return `\n## COMMUNITY PLAYBOOKS (Verified — Real Transfer Student Paths)\nThe following playbooks are from verified transfer students who successfully completed their transfer (outcome: "transferred"). Use these as community insights when generating plans.\n\n${playbookContexts.join("\n\n")}\n\nWhen referencing these playbooks, use language like "Students who transferred from X to Y for Z typically took..." or "Based on community playbooks from successful transfers...".`;
  } catch {
    return "";
  }
}
