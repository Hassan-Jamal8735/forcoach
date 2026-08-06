"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CalendarClock, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { GoogleCalendarOption, GoogleCalendarStatus } from "@/lib/api/google-calendar";
import { CoachMark } from "@/components/onboarding/coach-mark";
import {
  disconnectGoogleCalendar,
  fetchGoogleCalendars,
  getGoogleConnectUrl,
  selectGoogleCalendar,
  syncGoogleCalendar,
} from "./actions";

// The background sync runs every 6 hours; if it's been quiet for a full day,
// that's a strong signal the connection has gone stale (revoked token, etc.)
// rather than just an unlucky gap between runs.
const STALE_AFTER_HOURS = 24;

export function GoogleCalendarCard({
  status,
  studios,
}: {
  status: GoogleCalendarStatus;
  studios: { id: string; name: string }[];
}) {
  const params = useSearchParams();
  const googleFlag = params.get("google");
  const [actionError, setError] = useState<string | undefined>();
  const [actionNotice, setNotice] = useState<string | undefined>();
  const [calendars, setCalendars] = useState<GoogleCalendarOption[] | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [studioByCalendar, setStudioByCalendar] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const needsCalendarSelection =
    (status.connected && !status.calendarId) || pickerOpen;
  const error = actionError ?? (googleFlag === "error"
    ? "Something went wrong connecting Google Calendar. Please try again."
    : undefined);
  const notice = actionNotice ?? (googleFlag === "connected"
    ? "Connected! Choose a calendar below."
    : undefined);

  const [isStale] = useState(
    () =>
      status.connected &&
      status.calendarId != null &&
      status.lastSyncedAt != null &&
      Date.now() - new Date(status.lastSyncedAt).getTime() >
        STALE_AFTER_HOURS * 60 * 60 * 1000,
  );

  useEffect(() => {
    if (needsCalendarSelection && calendars === null) {
      startTransition(async () => {
        const result = await fetchGoogleCalendars();
        if (result.error) setError(result.error);
        else setCalendars(result.calendars ?? []);
      });
    }
  }, [needsCalendarSelection, calendars]);

  function handleConnect() {
    setError(undefined);
    startTransition(async () => {
      const result = await getGoogleConnectUrl();
      if (result.error) setError(result.error);
      else if (result.url) window.location.href = result.url;
    });
  }

  function handleSelect(cal: GoogleCalendarOption) {
    setError(undefined);
    const studioId = studioByCalendar[cal.id];
    startTransition(async () => {
      const result = await selectGoogleCalendar(
        cal.id,
        cal.name,
        studioId && studioId !== "none" ? studioId : undefined,
      );
      if (result.error) setError(result.error);
      else {
        setNotice(`Connected to ${cal.name}.`);
        setPickerOpen(false);
      }
    });
  }

  function handleSync() {
    setError(undefined);
    startTransition(async () => {
      const result = await syncGoogleCalendar();
      if (result.error) setError(result.error);
      else if (result.result) {
        setNotice(
          `Synced: ${result.result.created} new, ${result.result.updated} updated.`,
        );
      }
    });
  }

  function handleDisconnect() {
    setError(undefined);
    startTransition(async () => {
      const result = await disconnectGoogleCalendar();
      if (result.error) setError(result.error);
      else {
        setNotice("Disconnected.");
        setCalendars(null);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="size-4 text-muted-foreground" />
          Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {notice && !error && (
          <Alert>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}
        {isStale && !error && !notice && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              This connection hasn&apos;t synced in over a day — it may have
              been revoked. Click &ldquo;Sync now&rdquo; below, and if that
              fails, disconnect and reconnect Google Calendar.
            </AlertDescription>
          </Alert>
        )}

        {!status.connected && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Sync classes from your Google Calendar automatically.
            </p>
            <CoachMark
              id="calendar-connect-google"
              align="end"
              title="Skip manual entry"
              message="Connect your Google Calendar once, and new classes sync in automatically (with a manual 'Sync now' anytime, plus a background sync every 6 hours)."
            >
              <Button onClick={handleConnect} disabled={isPending}>
                <Link2 className="mr-2 size-4" />
                {isPending ? "Connecting..." : "Connect"}
              </Button>
            </CoachMark>
          </div>
        )}

        {needsCalendarSelection && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Choose which calendar to sync:</p>
              {status.connected && status.calendarId && (
                <Button variant="ghost" size="sm" onClick={() => setPickerOpen(false)}>
                  Cancel
                </Button>
              )}
            </div>
            {isPending && calendars === null ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading calendars...
              </p>
            ) : (
              <div className="space-y-1.5">
                {(calendars ?? []).map((cal) => (
                  <div
                    key={cal.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                  >
                    <span>
                      {cal.name}
                      {cal.primary && (
                        <span className="ml-1.5 text-xs text-muted-foreground">(primary)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <Select
                        value={studioByCalendar[cal.id] ?? "none"}
                        onValueChange={(value) =>
                          setStudioByCalendar((prev) => ({
                            ...prev,
                            [cal.id]: value ?? "none",
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue>
                            {(value: string) =>
                              value === "none"
                                ? "No default studio"
                                : (studios.find((s) => s.id === value)?.name ??
                                  "No default studio")
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No default studio</SelectItem>
                          {studios.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" disabled={isPending} onClick={() => handleSelect(cal)}>
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
                {calendars && calendars.length === 0 && (
                  <p className="text-sm text-muted-foreground">No calendars found.</p>
                )}
              </div>
            )}
          </div>
        )}

        {status.connected && status.calendarId && !pickerOpen && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">{status.calendarName ?? status.calendarId}</p>
              <p className="text-xs text-muted-foreground">
                {status.lastSyncedAt
                  ? `Last synced ${new Date(status.lastSyncedAt).toLocaleString()}`
                  : "Not synced yet"}
                {status.defaultStudioId &&
                  ` · New classes default to ${
                    studios.find((s) => s.id === status.defaultStudioId)?.name ?? "a studio"
                  }`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={isPending} onClick={handleSync}>
                {isPending ? "Syncing..." : "Sync now"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setCalendars(null);
                  setPickerOpen(true);
                }}
              >
                Change calendar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Disconnect
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Google Calendar?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This stops future syncing. Events already imported stay in your calendar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnect}>Disconnect</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
