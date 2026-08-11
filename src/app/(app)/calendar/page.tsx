import Link from "next/link";
import { apiFetch } from "@/lib/api/server-client";
import type { Event } from "@/lib/api/events";
import type { Studio } from "@/lib/api/studios";
import { Button } from "@/components/ui/button";
import { CsvImportDialog } from "./csv-import-dialog";
import { IcsUploadDialog } from "./ics-upload-dialog";
import { RematchButton } from "./rematch-button";
import { ImportHistoryDialog } from "./import-history-dialog";
import { EventFormDialog } from "./event-form-dialog";
import { CalendarView } from "./calendar-view";

export default async function CalendarPage() {
  const [events, studios] = await Promise.all([
    apiFetch<Event[]>("/events"),
    apiFetch<Studio[]>("/studios"),
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
            Your classes. Connect a calendar in{" "}
            <Link href="/settings" className="text-accent hover:underline">
              Settings
            </Link>{" "}
            to have them appear here automatically.
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

      <CalendarView events={events} studios={studios} />
    </div>
  );
}
