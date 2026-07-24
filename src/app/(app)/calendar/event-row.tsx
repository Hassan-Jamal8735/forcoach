"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Event } from "@/lib/api/events";
import { EventFormDialog } from "./event-form-dialog";
import { DeleteEventButton } from "./delete-event-button";
import { ExcludeEventButton } from "./exclude-event-button";

const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});
const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export function formatEventRange(event: Event, withDate = true) {
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const time = `${timeFmt.format(start)} – ${timeFmt.format(end)}`;
  return withDate ? `${dateFmt.format(start)} · ${time}` : time;
}

export function EventRow({
  event,
  studioById,
  studioOptions,
  showDate = true,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  event: Event;
  studioById: Map<string, string>;
  studioOptions: { id: string; name: string }[];
  showDate?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (checked: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-4 py-3",
        event.status === "excluded" && "opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        {selectable && (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onToggleSelect?.(checked === true)}
            aria-label={`Select ${event.title}`}
            className="mt-1"
          />
        )}
        <div>
          <p className="text-sm font-medium">{event.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatEventRange(event, showDate)}
          </p>
          {event.notes && (
            <p className="text-xs text-muted-foreground mt-0.5">{event.notes}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {event.status === "excluded" ? (
          <Badge variant="destructive">Excluded</Badge>
        ) : event.studio_id && studioById.has(event.studio_id) ? (
          <Badge variant="secondary">{studioById.get(event.studio_id)}</Badge>
        ) : (
          <Badge variant="outline">Unassigned</Badge>
        )}
        <Badge variant="ghost" className="text-muted-foreground">
          {event.source === "csv"
            ? "CSV"
            : event.source === "google_calendar"
              ? "Google"
              : event.source === "ics"
                ? "ICS"
                : "Manual"}
        </Badge>
        <ExcludeEventButton event={event} />
        <EventFormDialog
          event={event}
          studios={studioOptions}
          trigger={
            <Button variant="outline" size="sm">
              Edit
            </Button>
          }
        />
        <DeleteEventButton id={event.id} title={event.title} />
      </div>
    </div>
  );
}
