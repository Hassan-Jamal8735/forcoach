// Minimal toast store — same external-store pattern as the coachmark
// dismiss state (a plain module-level list + listener set), rather than a
// React Context provider, so `toast()` can be called from anywhere
// (including inside a startTransition callback deep in a form component)
// without prop drilling.
export type ToastVariant = "default" | "destructive";
export type ToastItem = { id: string; message: string; variant: ToastVariant };

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
const DURATION_MS = 4000;

function emit() {
  listeners.forEach((l) => l());
}

export function toast(message: string, variant: ToastVariant = "default") {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  toasts = [...toasts, { id, message, variant }];
  emit();
  setTimeout(() => dismissToast(id), DURATION_MS);
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
