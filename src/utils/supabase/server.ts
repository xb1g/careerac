import { createServerClient } from "@supabase/ssr";
import { isAuthApiError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Safely retrieve the current user from a server-side Supabase client.
 * Handles expired/invalid refresh tokens gracefully instead of throwing.
 */
export async function getSafeUser(supabase: SupabaseServerClient) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    if (
      isAuthApiError(error) ||
      (error instanceof Error && error.message?.includes("Refresh Token"))
    ) {
      console.error(
        "Auth refresh error in server client, treating as unauthenticated:",
        error,
      );
      return null;
    }
    throw error;
  }
}
