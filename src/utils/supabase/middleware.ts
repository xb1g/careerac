import { createServerClient } from "@supabase/ssr";
import { isAuthApiError } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value);
          });
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser() as it may introduce race conditions.
  let user: ReturnType<typeof supabase.auth.getUser> extends Promise<infer R>
    ? R extends { data: { user: infer U } }
      ? U
      : null
    : null = null;

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // Treat auth errors (expired/invalid refresh tokens) as unauthenticated
    // rather than letting them crash the request.
    if (
      isAuthApiError(error) ||
      (error instanceof Error && error.message?.includes("Refresh Token"))
    ) {
      console.error(
        "Auth refresh error in middleware, treating as unauthenticated:",
        error,
      );
      // Clear stale auth cookies to prevent repeated refresh errors
      for (const cookie of request.cookies.getAll()) {
        if (cookie.name.includes("-auth-token")) {
          request.cookies.set(cookie.name, "");
          supabaseResponse.cookies.set(cookie.name, "", { maxAge: 0 });
        }
      }
    } else {
      throw error;
    }
  }

  // Define protected routes
  const protectedPrefixes = [
    "/dashboard",
    "/plan",
    "/playbooks/submit",
    "/settings",
  ];
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  // Redirect unauthenticated users to sign-in
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname === "/auth/signin" ||
      request.nextUrl.pathname === "/auth/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
