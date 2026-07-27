"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { CreateInvoiceInput, Invoice } from "@/lib/api/invoices";

export type InvoiceActionState = {
  error?: string;
};

export async function createInvoice(
  _prevState: InvoiceActionState,
  formData: FormData,
): Promise<InvoiceActionState> {
  const studioId = String(formData.get("studioId") ?? "");
  const periodStart = String(formData.get("periodStart") ?? "");
  const periodEnd = String(formData.get("periodEnd") ?? "");
  const vatRateRaw = String(formData.get("vatRate") ?? "").trim();

  if (!studioId || !periodStart || !periodEnd) {
    return { error: "Studio and period are required." };
  }

  // periodEnd comes from a date-only <input type="date">, which parses to
  // midnight UTC — push it to the end of that day so same-day classes are
  // included in the range, matching what a user picking "today" would expect.
  const periodEndDate = new Date(periodEnd);
  periodEndDate.setUTCHours(23, 59, 59, 999);

  const input: CreateInvoiceInput = {
    studioId,
    periodStart: new Date(periodStart).toISOString(),
    periodEnd: periodEndDate.toISOString(),
    vatRate: vatRateRaw ? Number(vatRateRaw) : undefined,
  };

  try {
    await apiFetch<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to create invoice",
    };
  }
  revalidatePath("/invoices");
  return {};
}

export async function generateInvoice(id: string): Promise<InvoiceActionState> {
  try {
    await apiFetch<Invoice>(`/invoices/${id}/generate`, { method: "POST" });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to generate invoice",
    };
  }
  revalidatePath("/invoices");
  return {};
}

export async function archiveInvoice(id: string): Promise<InvoiceActionState> {
  try {
    await apiFetch<Invoice>(`/invoices/${id}/archive`, { method: "POST" });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to archive invoice",
    };
  }
  revalidatePath("/invoices");
  return {};
}

export async function deleteInvoice(id: string): Promise<InvoiceActionState> {
  try {
    await apiFetch(`/invoices/${id}`, { method: "DELETE" });
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to delete invoice",
    };
  }
  revalidatePath("/invoices");
  return {};
}
