"use client";

import { useState, useTransition } from "react";
import { updateLineItemRate } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Editable rate for one line of a draft invoice. Studios often agree different
 * amounts per class, so the coach needs to correct a rate before issuing.
 */
export function LineItemRate({
  invoiceId,
  lineItemId,
  rate,
  editable,
  formatted,
}: {
  invoiceId: string;
  lineItemId: string;
  rate: number;
  editable: boolean;
  formatted: string;
}) {
  const [value, setValue] = useState(String(rate));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!editable) return <span>{formatted}</span>;

  const dirty = Number(value) !== rate && value.trim() !== "";

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 w-24 text-right text-sm"
        aria-label="Rate for this class"
      />
      {dirty && (
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateLineItemRate(
                invoiceId,
                lineItemId,
                Number(value),
              );
              if (result.error) setError(result.error);
            });
          }}
        >
          {isPending ? "..." : "Save"}
        </Button>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
