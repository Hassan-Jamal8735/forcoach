"use client";

import { useActionState } from "react";
import { updateBankDetails, type AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: AuthActionState = {};

export function BankDetailsForm({
  bankAccountName,
  bankName,
  iban,
  bankAddress,
  bankPhone,
}: {
  bankAccountName: string;
  bankName: string;
  iban: string;
  bankAddress: string;
  bankPhone: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateBankDetails,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Optional — only shown on your invoices if filled in, so studios know
        where to send payment.
      </p>
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert>
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bankAccountName">Account holder name</Label>
          <Input
            id="bankAccountName"
            name="bankAccountName"
            type="text"
            defaultValue={bankAccountName}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank name</Label>
          <Input id="bankName" name="bankName" type="text" defaultValue={bankName} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="iban">IBAN</Label>
        <Input
          id="iban"
          name="iban"
          type="text"
          defaultValue={iban}
          placeholder="e.g. FR76 1234 5678 9012 3456 7890 123"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bankAddress">Address</Label>
          <Input id="bankAddress" name="bankAddress" type="text" defaultValue={bankAddress} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankPhone">Phone number</Label>
          <Input id="bankPhone" name="bankPhone" type="tel" defaultValue={bankPhone} />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save bank details"}
      </Button>
    </form>
  );
}
