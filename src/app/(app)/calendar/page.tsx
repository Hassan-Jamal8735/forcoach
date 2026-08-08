import { apiFetch } from "@/lib/api/server-client";
import type { Event } from "@/lib/api/events";
import type { Studio } from "@/lib/api/studios";
import type { GoogleCalendarStatus } from "@/lib/api/google-calendar";
import type { IcsFeed } from "@/lib/api/ics-feeds";
import { Button } from "@/components/ui/button";
import { CsvImportDialog } from "./csv-import-dialog";
import { IcsUploadDialog } from "./ics-upload-dialog";
import { RematchButton } from "./rematch-button";
import { ImportHistoryDialog } from "./import-history-dialog";
import { EventFormDialog } from "./event-form-dialog";
import { CalendarView } from "./calendar-view";
import { GoogleCalendarCard } from "./google-calendar-card";
import { IcsFeedsCard } from "./ics-feeds-card";

export default async function CalendarPage() {
  const [events, studios, googleStatus, icsFeeds] = await Promise.all([
    apiFetch<Event[]>("/events"),
    apiFetch<Studio[]>("/studios"),
    apiFetch<GoogleCalendarStatus>("/calendar/google/status"),
    apiFetch<IcsFeed[]>("/ics-feeds"),
  ]);

  const studioOptions = studios.map((s) => ({ id: s.id, name: s.name }));
  const unassignedCount = events.filter(
    (e) => e.status === "unassigned",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Events imported from CSV, Google Calendar, ICS feeds, or added
            manually.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ImportHistoryDialog />
          <IcsUploadDialog studios={studioOptions} />
          <CsvImportDialog studios={studioOptions} />
          <EventFormDialog
            studios={studioOptions}
            trigger={<Button>Add event</Button>}
          />
        </div>
      </div>

      <RematchButton unassignedCount={unassignedCount} />

      <div className="grid gap-4 lg:grid-cols-2">
        <GoogleCalendarCard status={googleStatus} studios={studioOptions} />
        <IcsFeedsCard feeds={icsFeeds} studios={studioOptions} />
      </div>

      <CalendarView events={events} studios={studios} />
    </div>
  );
}
