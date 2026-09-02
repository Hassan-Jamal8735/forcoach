"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import type { BillingStatus, Plan } from "@/lib/api/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { startCheckout } from "@/app/(app)/settings/billing-actions";
import { logout } from "@/app/(auth)/actions";

const MONTHLY_BASE_PRICE = 9;
const YEARLY_BASE_PRICE = 108;

const INCLUDED = [
  "Unlimited studios and classes",
  "Automatic calendar sync",
  "Earnings tracking, per studio and overall",
  "Unlimited branded invoices",
];

function planOptions(yearlyDiscountPercentOff: number | null) {
  const yearlyPrice =
    yearlyDiscountPercentOff != null
      ? YEARLY_BASE_PRICE * (1 - yearlyDiscountPercentOff / 100)
      : YEARLY_BASE_PRICE;

  return [
    { value: "monthly" as Plan, label: "Monthly", price: `€${MONTHLY_BASE_PRICE}/month` },
    {
      value: "yearly" as Plan,
      label: "Yearly",
      price: `€${yearlyPrice % 1 === 0 ? yearlyPrice : yearlyPrice.toFixed(2)}/year`,
    },
  ];
}

export function SubscribeCard({ billing }: { billing: BillingStatus }) {
  const [plan, setPlan] = useState<Plan>("monthly");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const options = planOptions(billing.yearlyDiscountPercentOff);

  function handleStart() {
    setError(undefined);
    startTransition(async () => {
      const result = await startCheckout(plan);
      if (result.error) setError(result.error);
      else if (result.url) window.location.assign(result.url);
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="secondary" className="mx-auto mb-2 w-fit">
          15-day free trial
        </Badge>
        <CardTitle className="text-xl">Start your free trial</CardTitle>
        <p className="text-sm text-muted-foreground">
          Pick a plan to get full access to FORCOACH. You won&apos;t be
          charged until the trial ends.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2" role="radiogroup" aria-label="Billing plan">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={plan === option.value}
              onClick={() => setPlan(option.value)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                plan === option.value
                  ? "border-accent bg-accent/10"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">
                {option.price}
              </div>
            </button>
          ))}
        </div>

        <ul className="space-y-2.5">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm">
              <Check className="size-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <Button className="w-full" disabled={isPending} onClick={handleStart}>
          {isPending ? "Redirecting..." : "Start 15-day free trial"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Secure checkout via Stripe. Cancel anytime.
        </p>

        <button
          type="button"
          onClick={() => logout()}
          className="mx-auto block text-xs text-muted-foreground underline hover:text-foreground"
        >
          Log out
        </button>
      </CardContent>
    </Card>
  );
}
