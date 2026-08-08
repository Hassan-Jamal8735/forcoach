"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { Studio, StudioInput } from "@/lib/api/studios";

export type StudioActionState = {
  error?: string;
};

function parseInput(formData: FormData): StudioInput {
  const value = (key: string) => {
    const raw = formData.get(key);
    return typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;
  };

  return {
    name: value("name") ?? "",
    referenceId: value("referenceId"),
    contactPerson: value("contactPerson"),
    email: value("email"),
    phone: value("phone"),
    address: value("address"),
    notes: value("notes"),
    compensationType:
      (value("compensationType") as StudioInput["compensationType"]) ??
      "hourly",
    compensationValue: Number(value("compensationValue") ?? 0),
    status: (value("status") as StudioInput["status"]) ?? "active",
    // Comma-separated in the form; stored as an array.
    matchKeywords: (value("matchKeywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  };
}

export async function createStudio(
  _prevState: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  try {
    await apiFetch<Studio>("/studios", {
      method: "POST",
      body: JSON.stringify(parseInput(formData)),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create studio" };
  }
  revalidatePath("/studios");
  return {};
}

export async function updateStudio(
  id: string,
  _prevState: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  try {
    await apiFetch<Studio>(`/studios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(parseInput(formData)),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update studio" };
  }
  revalidatePath("/studios");
  return {};
}

export async function deleteStudio(id: string): Promise<StudioActionState> {
  try {
    await apiFetch(`/studios/${id}`, { method: "DELETE" });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to delete studio" };
  }
  revalidatePath("/studios");
  return {};
}
