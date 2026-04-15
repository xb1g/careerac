"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("transfer_plans")
    .delete()
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Failed to delete plan: " + error.message);
  }

  revalidatePath("/dashboard");
}
