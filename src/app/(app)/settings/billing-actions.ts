"use server";

import { apiFetch, ApiError } from "@/lib/api/server-client";

export async function startCheckout(): Promise<{
  url?: string;
  error?: string;
}> {
  try {
    const result = await apiFetch<{ url: string }>("/billing/checkout", {
      method: "POST",
    });
    return { url: result.url };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to start checkout",
    };
  }
}

export async function openBillingPortal(): Promise<{
  url?: string;
  error?: string;
}> {
  try {
    const result = await apiFetch<{ url: string }>("/billing/portal", {
      method: "POST",
    });
    return { url: result.url };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to open billing portal",
    };
  }
}
