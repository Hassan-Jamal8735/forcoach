// Minimal toast store — same external-store pattern as the coachmark
// dismiss state (a plain module-level list + listener set), rather than a
// React Context provider, so `toast()` can be called from anywhere
// (including inside a startTransition callback deep in a form component)
// without prop drilling.
export type ToastVariant = "default" | "destructive";
export type ToastAction = { label: string; onClick: () => void };
export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
};

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
const DURATION_MS = 4000;
// Longer window for undo-able actions — 4s isn't enough time to notice and
// react to an accidental delete, let alone click a button in time.
const UNDO_DURATION_MS = 6000;

function emit() {
  listeners.forEach((l) => l());
}

export function toast(
  message: string,
  variant: ToastVariant = "default",
  action?: ToastAction,
) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  toasts = [...toasts, { id, message, variant, action }];
  emit();
  setTimeout(() => dismissToast(id), action ? UNDO_DURATION_MS : DURATION_MS);
}

/**
 * Delays `commit` (the real, irreversible action) until the undo window
 * passes, showing a toast with an Undo button that cancels it. Simpler than
 * optimistic-remove-then-restore: the item stays visible until the window
 * expires, but the actual delete never reaches the server if undone.
 */
export function undoableAction(message: string, commit: () => void) {
  let cancelled = false;
  const timer = setTimeout(() => {
    if (!cancelled) commit();
  }, UNDO_DURATION_MS);
  toast(message, "default", {
    label: "Undo",
    onClick: () => {
      cancelled = true;
      clearTimeout(timer);
    },
  });
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function subscribeToasts(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getToastsSnapshot(): ToastItem[] {
  return toasts;
}
