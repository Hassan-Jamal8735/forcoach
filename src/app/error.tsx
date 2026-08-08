"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Image
        src="/brand/logo-full-transparent.png"
        alt="FORCOACH"
        width={180}
        height={120}
      />
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          An unexpected error occurred. Try again, and if it keeps happening
          use one of the links below.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
      </div>
      {/* Both a retry and routes that don't depend on the API, so a backend
          problem can't leave someone with nowhere to go. */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          Dashboard
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href="/" />}
        >
          Home
        </Button>
        <Button
          variant="ghost"
          nativeButton={false}
          render={<a href="/login" />}
        >
          Log in again
        </Button>
      </div>
    </div>
  );
}
