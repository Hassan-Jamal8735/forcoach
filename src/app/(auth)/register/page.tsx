"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { register, resendConfirmationEmail, type AuthActionState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GoogleSignInButton } from "../google-signin-button";

const initialState: AuthActionState = {};

function ConfirmationScreen({ email }: { email: string }) {
  const [changing, setChanging] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleResend() {
    setResendMessage(undefined);
    startTransition(async () => {
      const result = await resendConfirmationEmail(email);
      setResendMessage(result.success ?? result.error);
    });
  }

  // Simplest "change email" option: send them back to a fresh form. A full
  // page load rather than local state, since register() is a server action
  // tied to useActionState — easiest to just restart.
  useEffect(() => {
    if (changing) window.location.href = "/register";
  }, [changing]);

  if (changing) return null;

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Check your inbox. We sent a confirmation email to{" "}
          <span className="font-medium text-foreground">{email}</span>.
          Please check your spam folder if you don&apos;t see it.
        </AlertDescription>
      </Alert>
      {resendMessage && (
        <Alert>
          <AlertDescription>{resendMessage}</AlertDescription>
        </Alert>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isPending}
          onClick={handleResend}
        >
          {isPending ? "Sending..." : "Resend email"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => setChanging(true)}
        >
          Use a different email
        </Button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState);
  const timezoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {state.confirmEmail ? "Check your email" : "Create your account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state.confirmEmail ? (
          <ConfirmationScreen email={state.confirmEmail} />
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="timezone" ref={timezoneRef} />
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" type="text" required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}
        {!state.confirmEmail && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <GoogleSignInButton />
          </>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
