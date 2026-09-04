import Link from "next/link";
import { apiFetch } from "@/lib/api/server-client";
import type { Event } from "@/lib/api/events";
import type { Studio } from "@/lib/api/studios";
import { Button } from "@/components/ui/button";
import { RematchButton } from "./rematch-button";
import { EventFormDialog } from "./event-form-dialog";
import { CalendarView } from "./calendar-view";

export default async function CalendarPage() {
  const [events, studios] = await Promise.all([
    apiFetch<Event[]>("/events"),
    apiFetch<Studio[]>("/studios"),
  ]);

  const studioOptions = studios.map((s) => ({
    id: s.id,
    name: s.name,
    compensation_type: s.compensation_type,
  }));
  const unassignedCount = events.filter(
    (e) => e.status === "unassigned",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Your classes. Connect a calendar, upload a file, or bring in
            history from{" "}
            <Link href="/settings" className="text-accent hover:underline">
              Settings
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <EventFormDialog
            studios={studioOptions}
            trigger={<Button>Add class</Button>}
          />
        </div>
      </div>

      <RematchButton unassignedCount={unassignedCount} />

      <CalendarView events={events} studios={studios} />
    </div>
  );
}
