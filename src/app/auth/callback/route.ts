import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NEW_USER_WINDOW_MS = 60_000;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const supabase = await createClient();
  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const isNewUser =
    Date.now() - new Date(data.user.created_at).getTime() < NEW_USER_WINDOW_MS;

  if (isNewUser) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      await fetch(`${apiUrl}/notifications/new-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.user.email }),
      });
    } catch {
      // Non-critical: don't block sign-in if the admin notification fails to send.
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
