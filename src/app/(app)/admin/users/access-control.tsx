"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { grantAccess, revokeAccess } from "../actions";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function AccessControl({
  userId,
  adminOverrideUntil,
}: {
  userId: string;
  adminOverrideUntil: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState("30");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  // Lazy initializer, not a plain const — Date.now() is impure and this
  // codebase's lint rules flag it if called directly during render.
  const [overrideActive] = useState(
    () =>
      !!adminOverrideUntil &&
      new Date(adminOverrideUntil).getTime() > Date.now(),
  );

  function handleGrant() {
    setError(undefined);
    startTransition(async () => {
      const result = await grantAccess(userId, Number(days));
      if (result.error) setError(result.error);
      else setOpen(false);
    });
  }

  function handleRevoke() {
    setError(undefined);
    startTransition(async () => {
      const result = await revokeAccess(userId);
      if (result.error) setError(result.error);
    });
  }

  if (overrideActive) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-accent">
          Override until {dateFmt.format(new Date(adminOverrideUntil!))}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-xs"
          disabled={isPending}
          onClick={handleRevoke}
        >
          Revoke
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 px-1.5 text-xs"
        onClick={() => setOpen(true)}
      >
        Grant access
      </Button>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="h-6 w-14 px-1.5 text-xs"
          aria-label="Days"
        />
        <span className="text-xs text-muted-foreground">days</span>
        <Button
          type="button"
          size="sm"
          className="h-6 px-1.5 text-xs"
          disabled={isPending || !days}
          onClick={handleGrant}
        >
          {isPending ? "..." : "Grant"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-xs"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
