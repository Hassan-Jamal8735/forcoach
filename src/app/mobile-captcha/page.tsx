"use client";

import { Turnstile } from "@/components/turnstile";

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

// Loaded inside a WebView by the mobile app. Turnstile only runs on hostnames
// registered for the widget, so the app can't render it natively; this page
// hands each token back to the app through the WebView bridge.
export default function MobileCaptchaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-0">
      <Turnstile
        onToken={(token) => window.ReactNativeWebView?.postMessage(JSON.stringify({ token }))}
      />
    </div>
  );
}
