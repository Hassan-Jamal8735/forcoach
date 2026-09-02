import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { apiFetch } from "@/lib/api/server-client";
import type { BillingStatus } from "@/lib/api/billing";
import { ADMIN_EMAIL } from "@/lib/admin";
import { SubscribeCard } from "./subscribe-card";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email === ADMIN_EMAIL) redirect("/admin");

  const billing = await apiFetch<BillingStatus>("/billing/status");
  if (billing.hasAccess) redirect("/dashboard");

  return <SubscribeCard billing={billing} />;
}
