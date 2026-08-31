"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import type { PromoCode } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPromoCode, deactivatePromoCode, fetchPromoCodes } from "../actions";

const DURATION_LABEL: Record<string, string> = {
  once: "One-time",
  repeating: "Repeating",
  forever: "Forever",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function describeDiscount(code: PromoCode): string {
  const amount =
    code.percentOff != null
      ? `${code.percentOff}% off`
      : code.amountOff != null
        ? `${(code.amountOff / 100).toFixed(2)} ${code.currency ?? ""} off`
        : "Discount";
  const duration =
    code.duration === "repeating" && code.durationInMonths
      ? `for ${code.durationInMonths} month${code.durationInMonths === 1 ? "" : "s"}`
      : code.duration
        ? DURATION_LABEL[code.duration].toLowerCase()
        : "";
  return `${amount} ${duration}`.trim();
}

export function PromoCodesPanel({
  initialCodes,
}: {
  initialCodes: PromoCode[];
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("100");
  const [duration, setDuration] = useState<"once" | "repeating" | "forever">(
    "forever",
  );
  const [durationInMonths, setDurationInMonths] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");

  function resetForm() {
    setCode("");
    setPercentOff("100");
    setDuration("forever");
    setDurationInMonths("");
    setMaxRedemptions("");
  }

  function handleCreate() {
    setError(undefined);
    startTransition(async () => {
      const result = await createPromoCode({
        code: code.trim(),
        percentOff: Number(percentOff),
        duration,
        durationInMonths:
          duration === "repeating" && durationInMonths
            ? Number(durationInMonths)
            : undefined,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      resetForm();
      setOpen(false);
      const refreshed = await fetchPromoCodes();
      if (refreshed.codes) setCodes(refreshed.codes);
    });
  }

  function handleDeactivate(id: string) {
    startTransition(async () => {
      const result = await deactivatePromoCode(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      const refreshed = await fetchPromoCodes();
      if (refreshed.codes) setCodes(refreshed.codes);
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setOpen((v) => !v)}>
          <Plus className="mr-1.5 size-4" />
          New promo code
        </Button>
      </div>

      {open && (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="promo-code">Code</Label>
                <Input
                  id="promo-code"
                  placeholder="e.g. BETA2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="promo-percent">Percent off</Label>
                <Input
                  id="promo-percent"
                  type="number"
                  min="1"
                  max="100"
                  value={percentOff}
                  onChange={(e) => setPercentOff(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="promo-duration">Duration</Label>
                <Select
                  value={duration}
                  onValueChange={(v) =>
                    setDuration((v as typeof duration) ?? "forever")
                  }
                >
                  <SelectTrigger id="promo-duration" className="w-full">
                    <SelectValue>
                      {(value: string) => DURATION_LABEL[value] ?? "Forever"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forever">
                      Forever (free access permanently)
                    </SelectItem>
                    <SelectItem value="once">
                      One-time (first payment only)
                    </SelectItem>
                    <SelectItem value="repeating">
                      Repeating (for N months)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {duration === "repeating" && (
                <div className="space-y-1.5">
                  <Label htmlFor="promo-months">Number of months</Label>
                  <Input
                    id="promo-months"
                    type="number"
                    min="1"
                    value={durationInMonths}
                    onChange={(e) => setDurationInMonths(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="promo-max">Max redemptions (optional)</Label>
                <Input
                  id="promo-max"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={
                  isPending ||
                  !code.trim() ||
                  !percentOff ||
                  (duration === "repeating" && !durationInMonths)
                }
                onClick={handleCreate}
              >
                {isPending ? "Creating..." : "Create code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Discount</th>
                <th className="px-4 py-2 font-medium">Redeemed</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono font-medium">
                    {c.code}
                  </td>
                  <td className="px-4 py-3">{describeDiscount(c)}</td>
                  <td className="px-4 py-3">
                    {c.timesRedeemed}
                    {c.maxRedemptions ? ` / ${c.maxRedemptions}` : ""}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {dateFmt.format(new Date(c.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.active ? "secondary" : "outline"}>
                      {c.active ? "Active" : "Deactivated"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDeactivate(c.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {codes.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No promo codes yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
