import { createClient } from "@/utils/supabase/server";
import PlaybookSubmitClient from "./playbook-submit-client";

interface Institution {
  id: string;
  name: string;
  abbreviation: string | null;
}

async function getInstitutions(): Promise<{
  ccs: Institution[];
  universities: Institution[];
}> {
  const supabase = await createClient();

  const { data: ccs } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .eq("type", "cc")
    .order("name");

  const { data: universities } = await supabase
    .from("institutions")
    .select("id, name, abbreviation")
    .eq("type", "university")
    .order("name");

  return {
    ccs: (ccs ?? []) as Institution[],
    universities: (universities ?? []) as Institution[],
  };
}

export default async function PlaybookSubmitPage() {
  const institutions = await getInstitutions();

  return <PlaybookSubmitClient institutions={institutions} />;
}
