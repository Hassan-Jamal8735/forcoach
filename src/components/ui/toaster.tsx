"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  dismissToast,
  getToastsSnapshot,
  subscribeToasts,
} from "@/lib/toast";

/** Mount once near the root of the authenticated app. */
export function Toaster() {
  const toasts = useSyncExternalStore(
    subscribeToasts,
    getToastsSnapshot,
    () => [],
  );

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2",
            t.variant === "destructive"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border bg-popover text-popover-foreground",
          )}
        >
          <span>{t.message}</span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
            className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
