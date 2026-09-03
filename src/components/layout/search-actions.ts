"use server";

import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { SearchResults } from "@/lib/api/search";

const EMPTY: SearchResults = { studios: [], events: [], invoices: [] };

export async function runGlobalSearch(query: string): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return EMPTY;
  try {
    return await apiFetch<SearchResults>(`/search?q=${encodeURIComponent(q)}`);
  } catch (err) {
    if (err instanceof ApiError) return EMPTY;
    throw err;
  }
}
