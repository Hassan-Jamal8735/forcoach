"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccountAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "DELETE") {
    return { error: 'Type DELETE to confirm.' };
  }
  try {
    await apiFetch("/account", { method: "DELETE" });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Could not delete your account. Please contact support." };
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/delete-account?deleted=1");
}
