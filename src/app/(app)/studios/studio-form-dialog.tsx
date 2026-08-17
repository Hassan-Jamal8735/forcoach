"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createStudio, updateStudio } from "./actions";
import type { CompensationType, RateTierInput, Studio } from "@/lib/api/studios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const COMPENSATION_LABELS: Record<CompensationType, string> = {
  hourly: "Hourly rate",
  per_class: "Per class rate",
  tiered: "By attendance",
};

type TierRow = { minAttendance: string; maxAttendance: string; rate: string };

function tiersToRows(studio?: Studio): TierRow[] {
  const tiers = studio?.rate_tiers ?? [];
  if (tiers.length === 0) return [{ minAttendance: "1", maxAttendance: "", rate: "" }];
  return tiers.map((t) => ({
    minAttendance: String(t.min_attendance),
    maxAttendance: t.max_attendance != null ? String(t.max_attendance) : "",
    rate: String(t.rate),
  }));
}

export function StudioFormDialog({
  studio,
  trigger,
}: {
  studio?: Studio;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [compensationType, setCompensationType] = useState<CompensationType>(
    studio?.compensation_type ?? "hourly",
  );
  const [tierRows, setTierRows] = useState<TierRow[]>(() => tiersToRows(studio));

  function patchTier(index: number, changes: Partial<TierRow>) {
    setTierRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    );
  }

  const rateTiersJson = JSON.stringify(
    tierRows
      .filter((r) => r.minAttendance.trim() !== "" && r.rate.trim() !== "")
      .map(
        (r): RateTierInput => ({
          minAttendance: Number(r.minAttendance),
          maxAttendance:
            r.maxAttendance.trim() !== "" ? Number(r.maxAttendance) : undefined,
          rate: Number(r.rate),
        }),
      ),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setError(undefined);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{studio ? "Edit studio" : "Add studio"}</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = studio
                ? await updateStudio(studio.id, {}, formData)
                : await createStudio({}, formData);
              if (result.error) {
                setError(result.error);
              } else {
                setOpen(false);
              }
            });
          }}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Studio name *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={studio?.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="compensationType">Compensation</Label>
              <Select
                name="compensationType"
                value={compensationType}
                onValueChange={(v) =>
                  setCompensationType((v as CompensationType) ?? "hourly")
                }
              >
                <SelectTrigger id="compensationType">
                  <SelectValue>
                    {(value: string) =>
                      COMPENSATION_LABELS[value as CompensationType] ??
                      "Hourly rate"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly rate</SelectItem>
                  <SelectItem value="per_class">Per class rate</SelectItem>
                  <SelectItem value="tiered">By attendance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {compensationType !== "tiered" && (
              <div className="space-y-2">
                <Label htmlFor="compensationValue">Rate</Label>
                <Input
                  id="compensationValue"
                  name="compensationValue"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={studio?.compensation_value}
                />
              </div>
            )}
          </div>
          {compensationType === "tiered" && (
            <div className="space-y-2 rounded-md border p-3">
              <Label>Attendance brackets</Label>
              <p className="text-xs text-muted-foreground">
                e.g. 1 person &rarr; 40, 3 to 4 &rarr; 45, 6 and up &rarr; 50.
                Leave the &ldquo;to&rdquo; field blank for an open-ended top
                bracket.
              </p>
              {tierRows.map((row, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    className="h-8 w-20 text-sm"
                    placeholder="From"
                    value={row.minAttendance}
                    onChange={(e) =>
                      patchTier(i, { minAttendance: e.target.value })
                    }
                    aria-label="Minimum attendance"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    className="h-8 w-20 text-sm"
                    placeholder="and up"
                    value={row.maxAttendance}
                    onChange={(e) =>
                      patchTier(i, { maxAttendance: e.target.value })
                    }
                    aria-label="Maximum attendance"
                  />
                  <span className="text-xs text-muted-foreground">
                    people &rarr;
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="h-8 w-24 text-sm"
                    placeholder="Rate"
                    value={row.rate}
                    onChange={(e) => patchTier(i, { rate: e.target.value })}
                    aria-label="Rate for this bracket"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    disabled={tierRows.length === 1}
                    onClick={() =>
                      setTierRows((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setTierRows((prev) => [
                    ...prev,
                    { minAttendance: "", maxAttendance: "", rate: "" },
                  ])
                }
              >
                <Plus className="mr-1.5 size-4" />
                Add bracket
              </Button>
              <input type="hidden" name="rateTiers" value={rateTiersJson} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={studio?.status ?? "active"}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Inactive studios are hidden from new event assignment but keep
              their history.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID</Label>
              <Input
                id="referenceId"
                name="referenceId"
                defaultValue={studio?.reference_id ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                defaultValue={studio?.contact_person ?? undefined}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={studio?.email ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={studio?.phone ?? undefined}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={studio?.address ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matchKeywords">
              Extra matching words{" "}
              <span className="font-normal text-muted-foreground">
                — optional, usually not needed
              </span>
            </Label>
            <Input
              id="matchKeywords"
              name="matchKeywords"
              defaultValue={(studio?.match_keywords ?? []).join(", ")}
              placeholder="e.g. Victor Hugo"
            />
            <p className="text-xs text-muted-foreground">
              Imported classes are matched to this studio by its name
              automatically. Only add words here if your classes refer to the
              studio differently, for example by street name. Separate with
              commas.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={studio?.notes ?? undefined}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : studio ? "Save changes" : "Add studio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
