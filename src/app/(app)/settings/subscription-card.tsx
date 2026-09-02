"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import type { BillingStatus, Plan } from "@/lib/api/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { openBillingPortal, startCheckout } from "./billing-actions";

const STATUS_LABEL: Record<BillingStatus["status"], string> = {
  none: "No subscription",
  incomplete: "Payment incomplete",
  trialing: "Trial",
  active: "Active",
  past_due: "Payment past due",
  canceled: "Canceled",
  unpaid: "Unpaid",
};

const PLAN_LABEL: Record<Plan, string> = {
  monthly: "Monthly plan",
  yearly: "Yearly plan",
};

// Display copy only — the actual charge always comes from whichever Stripe
// price (and, for yearly, whichever discount coupon) the backend applies.
// Keep the base amounts in sync if the underlying Stripe prices change.
const MONTHLY_BASE_PRICE = 9;
const YEARLY_BASE_PRICE = 108;

function planOptions(
  yearlyDiscountPercentOff: number | null,
): { value: Plan; label: string; price: string; note?: string }[] {
  const yearlyPrice =
    yearlyDiscountPercentOff != null
      ? YEARLY_BASE_PRICE * (1 - yearlyDiscountPercentOff / 100)
      : YEARLY_BASE_PRICE;

  return [
    { value: "monthly", label: "Monthly", price: `€${MONTHLY_BASE_PRICE}/month` },
    {
      value: "yearly",
      label: "Yearly",
      price: `€${yearlyPrice % 1 === 0 ? yearlyPrice : yearlyPrice.toFixed(2)}/year`,
      note:
        yearlyDiscountPercentOff != null
          ? `${yearlyDiscountPercentOff}% off, applied automatically`
          : undefined,
    },
  ];
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function SubscriptionCard({ billing }: { billing: BillingStatus }) {
  const searchParams = useSearchParams();
  const billingResult = searchParams.get("billing");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");

  const canSubscribe = ["none", "incomplete", "canceled", "unpaid"].includes(
    billing.status,
  );
  const options = planOptions(billing.yearlyDiscountPercentOff);

  function handleSubscribe() {
    setError(undefined);
    startTransition(async () => {
      const result = await startCheckout(selectedPlan);
      if (result.error) setError(result.error);
      else if (result.url) window.location.assign(result.url);
    });
  }

  function handleManage() {
    setError(undefined);
    startTransition(async () => {
      const result = await openBillingPortal();
      if (result.error) setError(result.error);
      else if (result.url) window.location.assign(result.url);
    });
  }

  return (
    <div className="space-y-3">
      {billingResult === "success" && (
        <Alert>
          <AlertDescription>
            Subscription confirmed — thanks for subscribing!
          </AlertDescription>
        </Alert>
      )}
      {billingResult === "cancelled" && (
        <Alert>
          <AlertDescription>
            Checkout was cancelled — no changes were made.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Badge variant={billing.status === "active" || billing.status === "trialing" ? "secondary" : "outline"}>
          {STATUS_LABEL[billing.status]}
        </Badge>
        {billing.plan && (
          <Badge variant="outline">{PLAN_LABEL[billing.plan]}</Badge>
        )}
        {!billing.enforced && (
          <span className="text-xs text-muted-foreground">
            (not required yet — beta access)
          </span>
        )}
      </div>

      {billing.currentPeriodEnd && (
        <p className="text-sm text-muted-foreground">
          {billing.cancelAtPeriodEnd ? "Ends" : "Renews"} on{" "}
          {dateFmt.format(new Date(billing.currentPeriodEnd))}.
        </p>
      )}
      {billing.promoCode && (
        <p className="text-sm text-muted-foreground">
          Promo code <span className="font-medium">{billing.promoCode}</span>
          {billing.discountPercentOff != null &&
            ` applied — ${billing.discountPercentOff}% off`}
          .
        </p>
      )}

      {canSubscribe && (
        <div className="flex gap-2" role="radiogroup" aria-label="Billing plan">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selectedPlan === option.value}
              onClick={() => setSelectedPlan(option.value)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                selectedPlan === option.value
                  ? "border-accent bg-accent/10"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">
                {option.price}
              </div>
              {option.note && (
                <div className="text-xs text-accent">{option.note}</div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {canSubscribe && (
          <Button disabled={isPending} onClick={handleSubscribe}>
            {isPending ? "Redirecting..." : "Subscribe"}
          </Button>
        )}
        {!canSubscribe && (
          <Button variant="outline" disabled={isPending} onClick={handleManage}>
            {isPending ? "Redirecting..." : "Manage subscription"}
          </Button>
        )}
      </div>
    </div>
  );
}
