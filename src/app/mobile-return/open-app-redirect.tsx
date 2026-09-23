"use client";

import { useEffect } from "react";

export function OpenAppRedirect({ href }: { href: string }) {
  useEffect(() => {
    window.location.href = href;
  }, [href]);

  return (
    <a href={href} className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
      Open the FORCOACH app
    </a>
  );
}
