import { apiFetch } from "@/lib/api/server-client";
import type { PromoCode, YearlyDiscount } from "@/lib/api/admin";
import { PromoCodesPanel } from "./promo-codes-panel";
import { YearlyDiscountPanel } from "./yearly-discount-panel";

export default async function AdminBillingPage() {
  const [codes, yearlyDiscount] = await Promise.all([
    apiFetch<PromoCode[]>("/admin/billing/promo-codes"),
    apiFetch<YearlyDiscount>("/admin/billing/yearly-discount"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Promo codes and the standing Yearly plan discount.
        </p>
      </div>
      <YearlyDiscountPanel initialDiscount={yearlyDiscount} />
      <div>
        <h2 className="text-lg font-medium">Promo codes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create discount codes coaches can enter at checkout — 100% off
          forever for a beta tester, a limited-time offer, whatever you need.
        </p>
      </div>
      <PromoCodesPanel initialCodes={codes} />
    </div>
  );
}
