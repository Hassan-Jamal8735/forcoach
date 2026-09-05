"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import type {
  Event,
  EventInput,
  ImportActivity,
  ImportEventRow,
  ImportEventsResult,
} from "@/lib/api/events";
import type {
  GoogleCalendarOption,
  GoogleCalendarStatus,
  GoogleSyncResult,
} from "@/lib/api/google-calendar";
import type { IcsFeed, IcsSyncResult } from "@/lib/api/ics-feeds";

export type ImportActionState = {
  error?: string;
  result?: ImportEventsResult;
};

export async function importEventsCsv(
  rows: ImportEventRow[],
): Promise<ImportActionState> {
  try {
    const result = await apiFetch<ImportEventsResult>("/events/import", {
      method: "POST",
      body: JSON.stringify({ source: "csv", rows }),
    });
    revalidatePath("/calendar");
    return { result };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to import events",
    };
  }
}

export type EventActionState = {
  error?: string;
};

function parseEventInput(formData: FormData): EventInput {
  const value = (key: string) => {
    const raw = formData.get(key);
    return typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;
  };

  // startTimeISO/endTimeISO are computed client-side (browser-local time,
  // via Date.toISOString()) and sent as already-resolved UTC instants.
  // This function runs inside a "use server" action, i.e. on the Docker
  // container — reconstructing `new Date("YYYY-MM-DDTHH:MM")` here instead
  // would parse the naive string using the CONTAINER's timezone (UTC),
  // silently disagreeing with the coach's actual browser timezone and
  // shifting every saved time by the difference between the two.
  const startTimeISO = value("startTimeISO");
  const endTimeISO = value("endTimeISO");
  const rawRate = value("rateOverride");
  const rawAttendance = value("attendanceCount");
  const rawStudioId = value("studioId");
  const studioId = rawStudioId && rawStudioId !== "none" ? rawStudioId : undefined;

  return {
    title: value("title") ?? "",
    notes: value("notes"),
    startTime: startTimeISO ?? "",
    endTime: endTimeISO ?? "",
    studioId: studioId ?? null,
    status: studioId ? "assigned" : "unassigned",
    // Empty input clears the override and falls back to the studio's rate.
    rateOverride: rawRate ? Number(rawRate) : null,
    attendanceCount: rawAttendance ? Number(rawAttendance) : null,
  };
}

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  try {
    await apiFetch<Event>("/events", {
      method: "POST",
      body: JSON.stringify({ ...parseEventInput(formData), source: "manual" }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to create event" };
  }
  revalidatePath("/calendar");
  return {};
}

export async function updateEvent(
  id: string,
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  try {
    await apiFetch<Event>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(parseEventInput(formData)),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update event" };
  }
  revalidatePath("/calendar");
  return {};
}

// Used by drag-and-drop on the calendar grid — moves a class to a new start
// time, keeping its original duration.
export async function moveEvent(
  id: string,
  startTime: string,
  endTime: string,
): Promise<EventActionState> {
  try {
    await apiFetch<Event>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ startTime, endTime }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to move event" };
  }
  revalidatePath("/calendar");
  return {};
}

export async function deleteEvent(id: string): Promise<EventActionState> {
  try {
    await apiFetch(`/events/${id}`, { method: "DELETE" });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to delete event" };
  }
  revalidatePath("/calendar");
  return {};
}

export async function uploadIcsFile(
  content: string,
  defaultStudioId?: string,
): Promise<{ error?: string; created?: number; updated?: number }> {
  try {
    const result = await apiFetch<{ created: number; updated: number }>(
      "/ics-feeds/upload",
      {
        method: "POST",
        body: JSON.stringify({ content, defaultStudioId }),
      },
    );
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/earnings");
    return { created: result.created, updated: result.updated };
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to import that file",
    };
  }
}

export async function setGoogleDefaultStudio(
  studioId: string | null,
): Promise<{ error?: string }> {
  try {
    await apiFetch("/calendar/google/default-studio", {
      method: "POST",
      body: JSON.stringify({ studioId }),
    });
    revalidatePath("/calendar");
    return {};
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "Failed to set default studio",
    };
  }
}

export async function rematchUnassignedEvents(): Promise<{
  error?: string;
  matched?: number;
  stillUnassigned?: number;
}> {
  try {
    const result = await apiFetch<{ matched: number; stillUnassigned: number }>(
      "/events/rematch-unassigned",
      { method: "POST" },
    );
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/earnings");
    return {
      matched: result.matched,
      stillUnassigned: result.stillUnassigned,
    };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to match studios",
    };
  }
}

export async function bulkAssignEvents(
  ids: string[],
  studioId: string | null,
): Promise<{ error?: string; updated?: number; keptExcluded?: number }> {
  try {
    const result = await apiFetch<{ updated: number; keptExcluded: number }>(
      "/events/bulk-assign",
      { method: "POST", body: JSON.stringify({ ids, studioId }) },
    );
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/earnings");
    return { updated: result.updated, keptExcluded: result.keptExcluded };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to assign studio",
    };
  }
}

export async function bulkDeleteEvents(
  ids: string[],
): Promise<{ error?: string; deleted?: number }> {
  try {
    const result = await apiFetch<{ deleted: number }>("/events/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
    revalidatePath("/calendar");
    return { deleted: result.deleted };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to delete events",
    };
  }
}

export async function fetchImportActivity(): Promise<{
  error?: string;
  activity?: ImportActivity[];
}> {
  try {
    const activity = await apiFetch<ImportActivity[]>("/events/import-activity");
    return { activity };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load import history",
    };
  }
}

export async function fetchGoogleStatus(): Promise<{
  error?: string;
  status?: GoogleCalendarStatus;
}> {
  try {
    const status = await apiFetch<GoogleCalendarStatus>("/calendar/google/status");
    return { status };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load Google Calendar status",
    };
  }
}

export async function getGoogleConnectUrl(): Promise<{
  error?: string;
  url?: string;
}> {
  try {
    const result = await apiFetch<{ url: string }>("/auth/google/connect");
    return { url: result.url };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to start Google Calendar connection",
    };
  }
}

export async function fetchGoogleCalendars(): Promise<{
  error?: string;
  calendars?: GoogleCalendarOption[];
}> {
  try {
    const calendars = await apiFetch<GoogleCalendarOption[]>("/calendar/google/calendars");
    return { calendars };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load calendars",
    };
  }
}

export async function selectGoogleCalendar(
  calendarId: string,
  calendarName: string,
  defaultStudioId?: string,
): Promise<{ error?: string; result?: GoogleSyncResult }> {
  try {
    const result = await apiFetch<GoogleSyncResult>("/calendar/google/select-calendar", {
      method: "POST",
      body: JSON.stringify({ calendarId, calendarName, defaultStudioId }),
    });
    revalidatePath("/calendar");
    return { result };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to select calendar",
    };
  }
}

export async function syncGoogleCalendar(): Promise<{
  error?: string;
  result?: GoogleSyncResult;
}> {
  try {
    const result = await apiFetch<GoogleSyncResult>("/calendar/google/sync", {
      method: "POST",
    });
    revalidatePath("/calendar");
    return { result };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to sync Google Calendar",
    };
  }
}

export async function disconnectGoogleCalendar(): Promise<{ error?: string }> {
  try {
    await apiFetch("/calendar/google/disconnect", { method: "DELETE" });
    revalidatePath("/calendar");
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to disconnect Google Calendar",
    };
  }
  return {};
}

export async function setEventExcluded(
  id: string,
  excluded: boolean,
  fallbackStudioId: string | null,
): Promise<EventActionState> {
  try {
    await apiFetch<Event>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: excluded
          ? "excluded"
          : fallbackStudioId
            ? "assigned"
            : "unassigned",
      }),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update event" };
  }
  revalidatePath("/calendar");
  return {};
}

export async function fetchIcsFeeds(): Promise<{
  error?: string;
  feeds?: IcsFeed[];
}> {
  try {
    const feeds = await apiFetch<IcsFeed[]>("/ics-feeds");
    return { feeds };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to load ICS feeds",
    };
  }
}

export async function createIcsFeed(
  url: string,
  name: string,
  defaultStudioId?: string,
): Promise<{ error?: string; result?: IcsSyncResult }> {
  try {
    const result = await apiFetch<IcsSyncResult>("/ics-feeds", {
      method: "POST",
      body: JSON.stringify({ url, name, defaultStudioId }),
    });
    revalidatePath("/calendar");
    return { result };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to add feed",
    };
  }
}

export async function syncIcsFeed(
  id: string,
): Promise<{ error?: string; result?: IcsSyncResult }> {
  try {
    const result = await apiFetch<IcsSyncResult>(`/ics-feeds/${id}/sync`, {
      method: "POST",
    });
    revalidatePath("/calendar");
    return { result };
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to sync feed",
    };
  }
}

export async function deleteIcsFeed(id: string): Promise<{ error?: string }> {
  try {
    await apiFetch(`/ics-feeds/${id}`, { method: "DELETE" });
    revalidatePath("/calendar");
  } catch (err) {
    return {
      error: err instanceof ApiError ? err.message : "Failed to delete feed",
    };
  }
  return {};
}
