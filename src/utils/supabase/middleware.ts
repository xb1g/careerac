import { createServerClient } from "@supabase/ssr";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes
  const protectedPrefixes = ["/dashboard", "/plan", "/playbooks/submit", "/settings"];
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  // Redirect unauthenticated users to sign-in
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === "/auth/signin" || request.nextUrl.pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
