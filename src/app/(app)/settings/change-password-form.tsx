"use client";

import { useActionState } from "react";
import { updatePasswordFromSettings, type AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: AuthActionState = {};

export function ChangePasswordForm({
  label = "Update password",
}: {
  label?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updatePasswordFromSettings,
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
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : label}
      </Button>
    </form>
  );
}
