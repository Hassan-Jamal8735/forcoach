import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAIL } from "@/lib/admin";

// Auth flows: logged-in users get bounced to /dashboard from these.
// "/reset-password" is deliberately NOT here — a password recovery link
// establishes a real session before landing there, so bouncing "logged in"
// users away would make it impossible to actually finish setting a password.
const AUTH_PATHS = ["/login", "/register", "/forgot-password"];

// Reference pages: viewable regardless of auth state, never redirected either way
// (e.g. Google's OAuth verification reviewer needs to reach these while logged out,
// and a logged-in user should still be able to re-read them).
// "/auth/callback" is included because it must run before we know whether the
// user is authenticated -- it's the route that establishes the session itself.
const ALWAYS_ACCESSIBLE_PATHS = [
  "/privacy",
  "/terms",
  "/auth/callback",
  "/reset-password",
  "/blog",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  // "/" is public (the marketing landing page) but must be an exact match --
  // every path starts with "/", so using startsWith() here would make every
  // route public and defeat the auth guard entirely.
  const isRoot = pathname === "/";
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isAlwaysAccessible = ALWAYS_ACCESSIBLE_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (!user && !isRoot && !isAuthPath && !isAlwaysAccessible) {
    const url = request.nextUrl.clone();
    const originalPathAndQuery = `${pathname}${request.nextUrl.search}`;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirectTo", originalPathAndQuery);
    return NextResponse.redirect(url);
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

  if (user && (isRoot || isAuthPath)) {
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? "/admin" : "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // The admin account only ever sees the admin panel and Support (to reply
  // there too) — never the regular coach app, so there's no ambiguity about
  // which "mode" is showing.
  // "/settings" stays reachable for the admin account too — it's where
  // Aya manages her own password/profile, not a coaching operation.
  const COACH_ONLY_PATHS = [
    "/dashboard",
    "/calendar",
    "/studios",
    "/earnings",
    "/invoices",
    "/guide",
    "/support",
  ];
  if (
    isAdmin &&
    COACH_ONLY_PATHS.some((path) => pathname.startsWith(path))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Subscribe/trial gate: a coach without an active subscription or trial
  // can still reach Settings (to actually subscribe) and Support/Help
  // Centre, but not the parts of the app that do real work. Only checked
  // on these paths, not every request, since it costs a round trip to the
  // API.
  const GATED_PATHS = ["/dashboard", "/calendar", "/studios", "/earnings", "/invoices"];
  if (
    user &&
    !isAdmin &&
    GATED_PATHS.some((path) => pathname.startsWith(path))
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
        const res = await fetch(`${apiUrl}/billing/status`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const status = (await res.json()) as { hasAccess: boolean };
          if (!status.hasAccess) {
            const url = request.nextUrl.clone();
            url.pathname = "/subscribe";
            url.search = "";
            return NextResponse.redirect(url);
          }
        }
      } catch {
        // Fail open: an API hiccup shouldn't lock coaches out of the app.
      }
    }
  }

  return supabaseResponse;
}
