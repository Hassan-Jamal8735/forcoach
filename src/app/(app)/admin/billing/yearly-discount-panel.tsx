"use client";

import { useState, useTransition } from "react";
import type { YearlyDiscount } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clearYearlyDiscount, setYearlyDiscount } from "../actions";

export function YearlyDiscountPanel({
  initialDiscount,
}: {
  initialDiscount: YearlyDiscount;
}) {
  const [discount, setDiscount] = useState(initialDiscount);
  const [percentOff, setPercentOff] = useState(
    initialDiscount.percentOff != null ? String(initialDiscount.percentOff) : "20",
  );
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(undefined);
    startTransition(async () => {
      const result = await setYearlyDiscount(Number(percentOff));
      if (result.error) {
        setError(result.error);
        return;
      }
      setDiscount({ percentOff: Number(percentOff) });
    });
  }

  function handleClear() {
    setError(undefined);
    startTransition(async () => {
      const result = await clearYearlyDiscount();
      if (result.error) {
        setError(result.error);
        return;
      }
      setDiscount({ percentOff: null });
    });
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Yearly plan discount</h2>
          {discount.percentOff != null ? (
            <Badge variant="secondary">{discount.percentOff}% off</Badge>
          ) : (
            <Badge variant="outline">None set</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Applied automatically when a coach checks out on the Yearly plan —
          they don&apos;t need to enter a code. Since Stripe only allows one
          discount method per checkout, this replaces manual promo-code entry
          for Yearly specifically (Monthly is unaffected).
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-end gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="yearly-discount">Percent off</Label>
            <Input
              id="yearly-discount"
              type="number"
              min="1"
              max="100"
              className="w-28"
              value={percentOff}
              onChange={(e) => setPercentOff(e.target.value)}
            />
          </div>
          <Button disabled={isPending || !percentOff} onClick={handleSave}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          {discount.percentOff != null && (
            <Button variant="outline" disabled={isPending} onClick={handleClear}>
              Remove discount
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
