"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import type { BillingStatus } from "@/lib/api/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  const canSubscribe = ["none", "incomplete", "canceled", "unpaid"].includes(
    billing.status,
  );

  function handleSubscribe() {
    setError(undefined);
    startTransition(async () => {
      const result = await startCheckout();
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
