"use client";

import { useState, useTransition } from "react";
import { createInvoice } from "./actions";
import type { Studio } from "@/lib/api/studios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function CreateInvoiceDialog({
  studios,
  defaultVatRate,
  trigger,
}: {
  studios: Studio[];
  defaultVatRate: string;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const defaultStart = toDateInputValue(startOfMonth(now));
  const defaultEnd = toDateInputValue(now);

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
          <DialogTitle>Create invoice draft</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await createInvoice({}, formData);
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
            <Label htmlFor="studioId">Studio *</Label>
            <Select name="studioId" required>
              <SelectTrigger id="studioId" className="w-full">
                <SelectValue placeholder="Select a studio">
                  {(value: string) =>
                    studios.find((s) => s.id === value)?.name ??
                    "Select a studio"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {studios.map((studio) => (
                  <SelectItem key={studio.id} value={studio.id}>
                    {studio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Period start *</Label>
              <Input
                id="periodStart"
                name="periodStart"
                type="date"
                required
                defaultValue={defaultStart}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Period end *</Label>
              <Input
                id="periodEnd"
                name="periodEnd"
                type="date"
                required
                defaultValue={defaultEnd}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatRate">VAT rate % (optional)</Label>
            <Input
              id="vatRate"
              name="vatRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              defaultValue={defaultVatRate}
              placeholder="Leave blank for no VAT"
            />
            <p className="text-xs text-muted-foreground">
              Pulls only classes already assigned to this studio and marked
              worked for the selected period.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || studios.length === 0}>
              {isPending ? "Creating..." : "Create draft"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
