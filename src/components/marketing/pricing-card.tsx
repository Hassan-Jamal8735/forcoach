"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Interval = "monthly" | "yearly";

const PRICES: Record<Interval, { regular: number; early: number; suffix: string }> = {
  monthly: { regular: 19.99, early: 9, suffix: "/month" },
  yearly: { regular: 239.88, early: 108, suffix: "/year" },
};

// Icon components can't cross the server/client boundary as props, so this
// lives here rather than being passed in from the (server) page component.
const PRICING_INCLUDED = [
  { icon: Building2, text: "Unlimited studios and classes" },
  { icon: CalendarDays, text: "Automatic calendar sync (Google Calendar or CSV)" },
  { icon: TrendingUp, text: "Earnings tracking, per studio and overall" },
  { icon: FileText, text: "Unlimited branded invoices" },
];

export function PricingCard() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const price = PRICES[interval];

  return (
    <Card className="relative overflow-hidden border-accent/30 shadow-xl">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40"
      />
      <CardHeader className="pt-8 text-center">
        <Badge variant="secondary" className="mx-auto mb-3 w-fit">
          Early access price
        </Badge>

        <div
          role="radiogroup"
          aria-label="Billing interval"
          className="mx-auto flex w-fit rounded-lg border border-border bg-muted/50 p-0.5 text-sm"
        >
          {(["monthly", "yearly"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={interval === value}
              onClick={() => setInterval(value)}
              className={cn(
                "rounded-md px-4 py-1.5 font-medium capitalize transition-colors",
                interval === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-lg text-muted-foreground line-through">
            €{price.regular}
            {price.suffix}
          </span>
        </div>
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="font-heading text-6xl font-semibold tracking-tight">
            €{price.early}
          </span>
          <span className="text-lg text-muted-foreground">{price.suffix}</span>
        </div>
        <Badge variant="outline" className="mx-auto mt-3 w-fit">
          15-day free trial
        </Badge>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Locked in for early users, even as the price rises for new
          sign-ups later.
        </p>
      </CardHeader>
      <CardContent className="pb-8">
        <ul className="space-y-3.5 border-t border-border pt-6">
          {PRICING_INCLUDED.map((item) => (
            <li key={item.text} className="flex items-center gap-3 text-sm">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <item.icon className="size-3.5" />
              </div>
              {item.text}
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          nativeButton={false}
          className="group mt-7 w-full"
          render={
            <Link href="/register">
              Start 15-day free trial
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          }
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure checkout via Stripe. Cancel anytime during the trial, no
          charge.
        </p>
      </CardContent>
    </Card>
  );
}
