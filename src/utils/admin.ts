import { createClient } from "@/utils/supabase/server";

function getConfiguredAdminUserIds() {
  return new Set(
    (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export async function getCurrentAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, isAdmin: false };
  }

  const configuredAdminUserIds = getConfiguredAdminUserIds();

  if (configuredAdminUserIds.has(user.id)) {
    return { supabase, user, isAdmin: true };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle<{ is_admin: boolean }>();

  return { supabase, user, isAdmin: Boolean(profile?.is_admin) };
}
