"use client";

import { useActionState } from "react";
import { deleteAccountAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DeleteForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(deleteAccountAction, {});
  return (
    <form action={action} className="space-y-4 rounded-xl border border-destructive/30 p-6">
      <p className="text-sm">
        You are signed in as <span className="font-medium">{email}</span>.
      </p>
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="confirm">Type DELETE to confirm</Label>
        <Input id="confirm" name="confirm" autoComplete="off" />
      </div>
      <Button type="submit" variant="destructive" disabled={pending}>
        {pending ? "Deleting..." : "Delete my account permanently"}
      </Button>
    </form>
  );
}
