"use client";

import { useActionState } from "react";
import { updateProfile, type AuthActionState } from "@/app/(auth)/actions";
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

const initialState: AuthActionState = {};

const TIMEZONES: string[] =
  typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : ["UTC"];

export function ProfileForm({
  email,
  fullName,
  timezone,
  currency,
  siret,
  defaultVatRate,
}: {
  email: string;
  fullName: string;
  timezone: string;
  currency: string;
  siret: string;
  defaultVatRate: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 max-w-sm">
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
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={fullName}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="timezone">Time zone</Label>
        <Select name="timezone" defaultValue={timezone || "UTC"}>
          <SelectTrigger id="timezone" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select name="currency" defaultValue={currency || "EUR"}>
          <SelectTrigger id="currency" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">EUR (€)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Only EUR is supported for calculations in this version.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="siret">SIRET (optional)</Label>
        <Input
          id="siret"
          name="siret"
          type="text"
          defaultValue={siret}
          placeholder="e.g. 123 456 789 00012"
        />
        <p className="text-xs text-muted-foreground">
          Shown on your invoices if provided.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="defaultVatRate">Default VAT rate % (optional)</Label>
        <Input
          id="defaultVatRate"
          name="defaultVatRate"
          type="number"
          min="0"
          max="100"
          step="0.1"
          defaultValue={defaultVatRate}
          placeholder="Leave blank for no VAT"
        />
        <p className="text-xs text-muted-foreground">
          Pre-fills the VAT rate when creating a new invoice. VAT is off by
          default.
        </p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
