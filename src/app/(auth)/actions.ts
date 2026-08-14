"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo || "/dashboard");
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const timezone = String(formData.get("timezone") ?? "") || "UTC";

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, timezone, currency: "EUR" },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Account created. Check your email to confirm your address before logging in.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `${headerList.get("x-forwarded-proto") ?? "http"}://${headerList.get("host")}`;

  const supabase = await createClient();
  // Point the recovery link at the server-side callback rather than straight
  // at /reset-password. This request runs on the server, so the PKCE code
  // verifier is written to a server-set cookie — it has to be exchanged on the
  // server too. Exchanging it in the browser fails with "code verifier not
  // found in storage" because that's a different storage context.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirectTo=%2Freset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function updatePasswordFromSettings(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated." };
}

export async function updateProfile(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "");
  const timezone = String(formData.get("timezone") ?? "");
  const currency = String(formData.get("currency") ?? "EUR");
  const siret = String(formData.get("siret") ?? "").trim();
  const defaultVatRate = String(formData.get("defaultVatRate") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      timezone,
      currency,
      siret: siret || null,
      default_vat_rate: defaultVatRate ? Number(defaultVatRate) : null,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Profile updated." };
}
