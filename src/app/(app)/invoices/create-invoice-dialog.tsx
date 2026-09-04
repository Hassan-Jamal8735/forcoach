"use client";

import { useState, useTransition } from "react";
import { createInvoice } from "./actions";
import { updateBankDetails } from "@/app/(auth)/actions";
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

type BankDetails = {
  bankAccountName: string;
  bankName: string;
  iban: string;
  bankAddress: string;
  bankPhone: string;
};

export function CreateInvoiceDialog({
  studios,
  defaultVatRate,
  bankDetails,
  trigger,
}: {
  studios: Studio[];
  defaultVatRate: string;
  bankDetails: BankDetails;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  // Once bank details exist, they're already set — no need to ask again on
  // every invoice. Only shown the first time, until filled in and saved.
  const hasBankDetails = Object.values(bankDetails).some((v) => v.trim());
  const [showBankDetails, setShowBankDetails] = useState(!hasBankDetails);

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
              if (showBankDetails) {
                const bankFormData = new FormData();
                bankFormData.set(
                  "bankAccountName",
                  String(formData.get("bankAccountName") ?? ""),
                );
                bankFormData.set(
                  "bankName",
                  String(formData.get("bankName") ?? ""),
                );
                bankFormData.set("iban", String(formData.get("iban") ?? ""));
                bankFormData.set(
                  "bankAddress",
                  String(formData.get("bankAddress") ?? ""),
                );
                bankFormData.set(
                  "bankPhone",
                  String(formData.get("bankPhone") ?? ""),
                );
                await updateBankDetails({}, bankFormData);
              }
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

          {hasBankDetails && !showBankDetails && (
            <button
              type="button"
              onClick={() => setShowBankDetails(true)}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Bank details on file — edit
            </button>
          )}

          {showBankDetails && (
            <div className="space-y-3 rounded-md border p-3">
              <p className="text-xs text-muted-foreground">
                Shown on the invoice so the studio knows where to send
                payment. Saved once, so it&apos;s prefilled automatically on
                future invoices.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bankAccountName">Account holder</Label>
                  <Input
                    id="bankAccountName"
                    name="bankAccountName"
                    defaultValue={bankDetails.bankAccountName}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bankName">Bank name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    defaultValue={bankDetails.bankName}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" name="iban" defaultValue={bankDetails.iban} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bankAddress">Address</Label>
                  <Input
                    id="bankAddress"
                    name="bankAddress"
                    defaultValue={bankDetails.bankAddress}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bankPhone">Phone number</Label>
                  <Input
                    id="bankPhone"
                    name="bankPhone"
                    type="tel"
                    defaultValue={bankDetails.bankPhone}
                  />
                </div>
              </div>
            </div>
          )}

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
