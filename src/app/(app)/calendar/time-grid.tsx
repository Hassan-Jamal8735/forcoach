"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { dateKey } from "@/lib/date";
import type { Event } from "@/lib/api/events";
import { EventFormDialog } from "./event-form-dialog";

function overlapsAny(event: Event, dayEvents: Event[]): boolean {
  const start = new Date(event.start_time).getTime();
  const end = new Date(event.end_time).getTime();
  return dayEvents.some((other) => {
    if (other.id === event.id) return false;
    const otherStart = new Date(other.start_time).getTime();
    const otherEnd = new Date(other.end_time).getTime();
    return start < otherEnd && otherStart < end;
  });
}

const HOUR_HEIGHT = 56; // px per hour
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 21; // 9 PM

const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function hourLabel(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(d);
}

/**
 * A real time-based grid (hourly rows, events positioned at their actual
 * time) shared by Day (1 column) and Week (7 columns) — replaces the
 * earlier list-style Day view and card-per-day Week view.
 */
export function TimeGrid({
  days,
  eventsByDay,
  studioOptions,
  dayHeaderFormat,
}: {
  days: Date[];
  eventsByDay: Map<string, Event[]>;
  studioOptions: { id: string; name: string; compensation_type?: string }[];
  dayHeaderFormat?: (day: Date) => React.ReactNode;
}) {
  // Widen the range if any event falls outside the default 8am-9pm window,
  // rather than clipping it out of view.
  const allEvents = days.flatMap((d) => eventsByDay.get(dateKey(d)) ?? []);
  const startHour = Math.min(
    DEFAULT_START_HOUR,
    ...allEvents.map((e) => new Date(e.start_time).getHours()),
  );
  const endHour = Math.max(
    DEFAULT_END_HOUR,
    ...allEvents.map((e) => {
      const end = new Date(e.end_time);
      return end.getMinutes() > 0 ? end.getHours() + 1 : end.getHours();
    }),
  );
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  );
  const gridHeight = (endHour - startHour) * HOUR_HEIGHT;

  function topFor(date: Date) {
    const minutesFromStart =
      (date.getHours() - startHour) * 60 + date.getMinutes();
    return (minutesFromStart / 60) * HOUR_HEIGHT;
  }

  return (
    <div className="flex min-w-0 rounded-lg border">
      <div className="w-14 shrink-0 border-r">
        <div className="h-10 border-b" />
        <div className="relative" style={{ height: gridHeight }}>
          {hours.slice(0, -1).map((hour, i) => (
            <div
              key={hour}
              className="absolute right-2 -translate-y-1/2 text-[11px] text-muted-foreground"
              style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT }}
            >
              {hourLabel(hour)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 overflow-x-auto">
        {days.map((day) => {
          const key = dateKey(day);
          const dayEvents = eventsByDay.get(key) ?? [];
          const isToday = key === dateKey(new Date());
          return (
            <div
              key={key}
              className="min-w-32 flex-1 border-r last:border-r-0"
            >
              <div
                className={cn(
                  "flex h-10 items-center justify-center border-b text-xs font-medium",
                  isToday && "bg-accent/10 text-accent",
                )}
              >
                {dayHeaderFormat
                  ? dayHeaderFormat(day)
                  : day.toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                    })}
              </div>
              <div className="relative" style={{ height: gridHeight }}>
                {hours.slice(0, -1).map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t border-border/60"
                    style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT }}
                  />
                ))}
                {dayEvents.map((event) => {
                  const start = new Date(event.start_time);
                  const end = new Date(event.end_time);
                  const top = topFor(start);
                  const height = Math.max(
                    20,
                    ((end.getTime() - start.getTime()) / 60000 / 60) *
                      HOUR_HEIGHT,
                  );
                  const overlapping = overlapsAny(event, dayEvents);
                  return (
                    <EventFormDialog
                      key={event.id}
                      event={event}
                      studios={studioOptions}
                      trigger={
                        <button
                          type="button"
                          className={cn(
                            "absolute inset-x-1 overflow-hidden rounded-md border px-2 py-1 text-left text-xs transition-colors",
                            overlapping
                              ? "border-destructive/50 bg-destructive/10 hover:bg-destructive/20"
                              : "border-accent/30 bg-accent/10 hover:bg-accent/20",
                            event.status === "excluded" && "opacity-50",
                          )}
                          style={{ top, height }}
                        >
                          <p className="flex items-center gap-1 truncate font-medium text-foreground">
                            {overlapping && (
                              <AlertTriangle className="size-3 shrink-0 text-destructive" />
                            )}
                            {event.title}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {timeFmt.format(start)} – {timeFmt.format(end)}
                            {overlapping && " · overlaps another class"}
                          </p>
                        </button>
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
