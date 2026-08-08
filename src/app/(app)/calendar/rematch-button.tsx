"use client";

import { useState, useTransition } from "react";
import { Wand2 } from "lucide-react";
import { rematchUnassignedEvents } from "./actions";
import { Button } from "@/components/ui/button";

export function RematchButton({ unassignedCount }: { unassignedCount: number }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (unassignedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => {
          setError(null);
          setMessage(null);
          startTransition(async () => {
            const result = await rematchUnassignedEvents();
            if (result.error) {
              setError(result.error);
            } else if (result.matched === 0) {
              setMessage(
                "No matches found. Add a keyword on the studio that appears in the class title or location.",
              );
            } else {
              setMessage(
                `Assigned ${result.matched} class${result.matched === 1 ? "" : "es"}. ${result.stillUnassigned} still need a studio.`,
              );
            }
          });
        }}
      >
        <Wand2 className="mr-1.5 size-4" />
        {isPending ? "Matching..." : `Auto-assign ${unassignedCount} unassigned`}
      </Button>
      {message && <span className="text-xs text-muted-foreground">{message}</span>}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
