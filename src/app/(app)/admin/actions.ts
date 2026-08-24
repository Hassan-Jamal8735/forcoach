"use server";

import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { SupportMessage } from "@/lib/api/support";
import type { SupportThreadSummary } from "@/lib/api/admin";

export async function fetchThreads(): Promise<{
  threads?: SupportThreadSummary[];
  error?: string;
}> {
  try {
    const threads = await apiFetch<SupportThreadSummary[]>(
      "/admin/support/threads",
    );
    return { threads };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load threads",
    };
  }
}

export async function fetchThreadMessages(
  userId: string,
): Promise<{ messages?: SupportMessage[]; error?: string }> {
  try {
    const messages = await apiFetch<SupportMessage[]>(
      `/admin/support/threads/${userId}/messages`,
    );
    return { messages };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load thread",
    };
  }
}

export async function replyToThread(
  userId: string,
  body: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/admin/support/threads/${userId}/messages`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to send reply",
    };
  }
  return {};
}

export async function markThreadReadByAdmin(userId: string): Promise<void> {
  try {
    await apiFetch(`/admin/support/threads/${userId}/read`, {
      method: "POST",
    });
  } catch {
    // Non-critical: an unread badge lingering an extra poll cycle is fine.
  }
}
