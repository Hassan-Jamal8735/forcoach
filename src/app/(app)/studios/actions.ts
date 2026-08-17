"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import type {
  Studio,
  StudioInput,
  SuggestedStudioInput,
} from "@/lib/api/studios";

export type StudioActionState = {
  error?: string;
};

function parseInput(formData: FormData): StudioInput {
  const value = (key: string) => {
    const raw = formData.get(key);
    return typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;
  };

  const compensationType =
    (value("compensationType") as StudioInput["compensationType"]) ??
    "hourly";

  // Tiers are serialized as JSON into a hidden field, since a form field
  // can't naturally carry a variable-length list of {min, max, rate} rows.
  const rateTiersRaw = value("rateTiers");
  let rateTiers: StudioInput["rateTiers"];
  if (compensationType === "tiered" && rateTiersRaw) {
    try {
      rateTiers = JSON.parse(rateTiersRaw);
    } catch {
      rateTiers = [];
    }
  }

  return {
    name: value("name") ?? "",
    referenceId: value("referenceId"),
    contactPerson: value("contactPerson"),
    email: value("email"),
    phone: value("phone"),
    address: value("address"),
    notes: value("notes"),
    compensationType,
    compensationValue:
      compensationType === "tiered"
        ? undefined
        : Number(value("compensationValue") ?? 0),
    rateTiers,
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

export async function createStudiosFromSuggestions(
  studios: SuggestedStudioInput[],
): Promise<{ error?: string; created?: number; matched?: number }> {
  try {
    const result = await apiFetch<{ created: number; matched: number }>(
      "/studios/from-suggestions",
      { method: "POST", body: JSON.stringify({ studios }) },
    );
    revalidatePath("/studios");
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/earnings");
    return { created: result.created, matched: result.matched };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to create the studios",
    };
  }
}
