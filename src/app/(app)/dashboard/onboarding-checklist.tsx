"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getCoachmarkSnapshot,
  markCoachmarkSeen,
  subscribeCoachmarks,
} from "@/lib/onboarding";

const DISMISS_ID = "onboarding-checklist";

type Step = { label: string; done: boolean; href: string; cta: string };

export function OnboardingChecklist({ steps }: { steps: Step[] }) {
  // Reuses the coachmark dismiss-state store (same "seen once, hidden
  // forever" localStorage pattern) rather than a second implementation.
  const visible = useSyncExternalStore(
    subscribeCoachmarks,
    () => getCoachmarkSnapshot(DISMISS_ID),
    () => true,
  );

  const allDone = steps.every((s) => s.done);
  if (allDone || !visible) return null;

  function dismiss() {
    markCoachmarkSeen(DISMISS_ID);
  }

  return (
    <Card className="border-accent/30">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Get set up
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            A few steps to get FORCOACH doing the work for you.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          onClick={dismiss}
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  step.done
                    ? "bg-accent text-accent-foreground"
                    : "border border-border",
                )}
              >
                {step.done && <Check className="size-3" />}
              </div>
              <span
                className={cn(
                  "text-sm",
                  step.done && "text-muted-foreground line-through",
                )}
              >
                {step.label}
              </span>
            </div>
            {!step.done && (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={step.href}>{step.cta}</Link>}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
