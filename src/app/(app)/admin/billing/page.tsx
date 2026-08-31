import { apiFetch } from "@/lib/api/server-client";
import type { PromoCode } from "@/lib/api/admin";
import { PromoCodesPanel } from "./promo-codes-panel";

export default async function AdminBillingPage() {
  const codes = await apiFetch<PromoCode[]>("/admin/billing/promo-codes");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Promo codes</h1>
        <p className="text-muted-foreground mt-1">
          Create discount codes coaches can enter at checkout — 100% off
          forever for a beta tester, a limited-time offer, whatever you need.
        </p>
      </div>
      <PromoCodesPanel initialCodes={codes} />
    </div>
  );
}
