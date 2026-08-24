"use server";

import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { SupportMessage } from "@/lib/api/support";

export async function fetchMessages(): Promise<{
  messages?: SupportMessage[];
  error?: string;
}> {
  try {
    const messages = await apiFetch<SupportMessage[]>("/support/messages");
    return { messages };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load messages",
    };
  }
}

export async function sendMessage(
  body: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch("/support/messages", {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to send message",
    };
  }
  return {};
}

export async function markThreadRead(): Promise<void> {
  try {
    await apiFetch("/support/messages/read", { method: "POST" });
  } catch {
    // Non-critical: an unread badge lingering an extra poll cycle is fine.
  }
}
