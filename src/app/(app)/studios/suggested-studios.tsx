"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { createStudiosFromSuggestions } from "./actions";
import type { StudioSuggestion } from "@/lib/api/studios";
import type { CurrencyCode } from "@/lib/currency";
import { currencySymbol } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Row = {
  selected: boolean;
  name: string;
  rate: string;
  type: "hourly" | "per_class";
};

/**
 * Offers studios detected in the coach's imported classes, so setup starts
 * from what's actually in their calendar rather than a blank form.
 */
export function SuggestedStudios({
  suggestions,
  currencyCode,
}: {
  suggestions: StudioSuggestion[];
  currencyCode: CurrencyCode;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    suggestions.map((s) => ({
      selected: true,
      name: s.label,
      rate: "",
      type: "per_class" as const,
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (suggestions.length === 0 || dismissed) return null;

  const symbol = currencySymbol(currencyCode);
  const chosen = rows.filter((r) => r.selected);
  const missingRate = chosen.some((r) => r.rate.trim() === "");

  function patch(index: number, changes: Partial<Row>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    );
  }

  return (
    <Card className="border-accent/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-accent" />
          We found {suggestions.length}{" "}
          {suggestions.length === 1 ? "place" : "places"} in your classes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Create studios for these and your classes will be assigned to them
          automatically. Just add the rate you&apos;re paid at each one.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestions.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-wrap items-center gap-3 rounded-md border px-3 py-2.5"
          >
            <Checkbox
              checked={rows[i].selected}
              onCheckedChange={(v) => patch(i, { selected: v === true })}
              aria-label={`Create a studio for ${s.label}`}
            />
            <div className="min-w-52 flex-1">
              <Input
                value={rows[i].name}
                onChange={(e) => patch(i, { name: e.target.value })}
                className="h-8 text-sm"
                aria-label="Studio name"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {s.classCount} {s.classCount === 1 ? "class" : "classes"}
                {s.fromTitle
                  ? " · matched on the class name, as these have no location"
                  : ""}
              </p>
            </div>

            <Select
              value={rows[i].type}
              onValueChange={(v) =>
                patch(i, { type: (v as Row["type"]) ?? "per_class" })
              }
            >
              <SelectTrigger size="sm" className="w-36 text-xs">
                <SelectValue>
                  {(value: string) =>
                    value === "hourly" ? "Per hour" : "Per class"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_class">Per class</SelectItem>
                <SelectItem value="hourly">Per hour</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">{symbol}</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={rows[i].rate}
                onChange={(e) => patch(i, { rate: e.target.value })}
                placeholder="Rate"
                className="h-8 w-24 text-sm"
                aria-label={`Rate for ${s.label}`}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            Not now
          </Button>
          <div className="flex items-center gap-2">
            {missingRate && chosen.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Add a rate for each selected studio
              </span>
            )}
            <Button
              disabled={isPending || chosen.length === 0 || missingRate}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const payload = rows
                    .map((row, i) => ({ row, suggestion: suggestions[i] }))
                    .filter(({ row }) => row.selected)
                    .map(({ row, suggestion }) => ({
                      name: row.name.trim(),
                      // Keep the detected text as a keyword so renaming the
                      // studio doesn't stop its classes from matching.
                      keyword: suggestion.keyword,
                      compensationType: row.type,
                      compensationValue: Number(row.rate),
                    }));

                  const result = await createStudiosFromSuggestions(payload);
                  if (result.error) setError(result.error);
                  else setDismissed(true);
                });
              }}
            >
              {isPending
                ? "Creating..."
                : `Create ${chosen.length} ${chosen.length === 1 ? "studio" : "studios"}`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
