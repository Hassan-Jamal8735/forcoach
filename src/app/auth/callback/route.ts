import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Behind a reverse proxy (Caddy -> container), `request.url` reports the
// container's own bind address (http://0.0.0.0:3000), so redirects built from
// it send the browser somewhere unreachable. Prefer the configured public URL,
// then the proxy's forwarded headers, and only fall back to the request origin
// for local development where none of the above are set.
function publicOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host) {
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }

  return new URL(request.url).origin;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
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

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
