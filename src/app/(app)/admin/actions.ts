"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { SupportMessage } from "@/lib/api/support";
import type {
  PromoCode,
  SupportThreadSummary,
  YearlyDiscount,
} from "@/lib/api/admin";

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

export type CreatePromoCodeInput = {
  code: string;
  percentOff: number;
  duration: "once" | "repeating" | "forever";
  durationInMonths?: number;
  maxRedemptions?: number;
};

export async function createPromoCode(
  input: CreatePromoCodeInput,
): Promise<{ error?: string }> {
  try {
    await apiFetch("/admin/billing/promo-codes", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to create promo code",
    };
  }
  revalidatePath("/admin/billing");
  return {};
}

export async function deactivatePromoCode(
  id: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/admin/billing/promo-codes/${id}`, { method: "DELETE" });
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to deactivate code",
    };
  }
  revalidatePath("/admin/billing");
  return {};
}

export async function fetchPromoCodes(): Promise<{
  codes?: PromoCode[];
  error?: string;
}> {
  try {
    const codes = await apiFetch<PromoCode[]>("/admin/billing/promo-codes");
    return { codes };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to load promo codes",
    };
  }
}

export async function fetchYearlyDiscount(): Promise<{
  discount?: YearlyDiscount;
  error?: string;
}> {
  try {
    const discount = await apiFetch<YearlyDiscount>(
      "/admin/billing/yearly-discount",
    );
    return { discount };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to load discount",
    };
  }
}

export async function setYearlyDiscount(
  percentOff: number,
): Promise<{ error?: string }> {
  try {
    await apiFetch("/admin/billing/yearly-discount", {
      method: "POST",
      body: JSON.stringify({ percentOff }),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to set discount",
    };
  }
  revalidatePath("/admin/billing");
  return {};
}

export async function clearYearlyDiscount(): Promise<{ error?: string }> {
  try {
    await apiFetch("/admin/billing/yearly-discount", { method: "DELETE" });
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to remove discount",
    };
  }
  revalidatePath("/admin/billing");
  return {};
}

export async function grantAccess(
  userId: string,
  days: number,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/admin/users/${userId}/grant-access`, {
      method: "POST",
      body: JSON.stringify({ days }),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to grant access",
    };
  }
  revalidatePath("/admin/users");
  return {};
}

export async function revokeAccess(userId: string): Promise<{ error?: string }> {
  try {
    await apiFetch(`/admin/users/${userId}/grant-access`, {
      method: "DELETE",
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to revoke access",
    };
  }
  revalidatePath("/admin/users");
  return {};
}
