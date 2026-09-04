"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  addDays,
  addMonths,
  dateKey,
  monthGridDays,
  startOfWeek,
} from "@/lib/date";
import type { Event } from "@/lib/api/events";
import type { Studio } from "@/lib/api/studios";
import { TimeGrid } from "./time-grid";

type ViewMode = "month" | "week" | "day";

const VIEWS: { value: ViewMode; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function CalendarView({
  events,
  studios,
}: {
  events: Event[];
  studios: Studio[];
}) {
  const [view, setView] = useState<ViewMode>("day");
  const [anchor, setAnchor] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [studioFilter, setStudioFilter] = useState("all");

  const studioById = new Map(studios.map((s) => [s.id, s.name]));
  const studioOptions = studios.map((s) => ({
    id: s.id,
    name: s.name,
    compensation_type: s.compensation_type,
  }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (q && !e.title.toLowerCase().includes(q) && !e.notes?.toLowerCase().includes(q)) {
        return false;
      }
      if (studioFilter === "unassigned" && e.studio_id) return false;
      if (
        studioFilter !== "all" &&
        studioFilter !== "unassigned" &&
        e.studio_id !== studioFilter
      )
        return false;
      return true;
    });
  }, [events, search, studioFilter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      ),
    [filtered],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of sorted) {
      const key = dateKey(new Date(e.start_time));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [sorted]);

  function navigate(step: 1 | -1) {
    if (view === "month") setAnchor((d) => addMonths(d, step));
    else if (view === "week") setAnchor((d) => addDays(d, step * 7));
    else if (view === "day") setAnchor((d) => addDays(d, step));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setView(v.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === v.value
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAnchor(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}>
            <ChevronRight className="size-4" />
          </Button>
          <span className="ml-1 text-sm font-medium">
            {view === "month" &&
              anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            {view === "week" &&
              `Week of ${startOfWeek(anchor).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            {view === "day" &&
              anchor.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 pl-8"
            />
          </div>
          <Select
            value={studioFilter}
            onValueChange={(value) => setStudioFilter(value ?? "all")}
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) =>
                  value === "all"
                    ? "All studios"
                    : value === "unassigned"
                      ? "Unassigned"
                      : (studioById.get(value) ?? "All studios")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All studios</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {studios.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === "day" && (
        <TimeGrid
          days={[anchor]}
          eventsByDay={eventsByDay}
          studioOptions={studioOptions}
          dayHeaderFormat={(day) =>
            day.toLocaleDateString("en-US", { weekday: "long", day: "numeric" })
          }
        />
      )}

      {view === "week" && (
        <TimeGrid
          days={Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(anchor), i))}
          eventsByDay={eventsByDay}
          studioOptions={studioOptions}
        />
      )}

      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className="px-1 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {monthGridDays(anchor).map((day) => {
            const dayEvents = eventsByDay.get(dateKey(day)) ?? [];
            const inMonth = day.getMonth() === anchor.getMonth();
            const isToday = dateKey(day) === dateKey(new Date());
            const visible = dayEvents.slice(0, 3);
            const overflow = dayEvents.length - visible.length;
            return (
              <button
                key={dateKey(day)}
                type="button"
                onClick={() => {
                  setAnchor(day);
                  setView("day");
                }}
                className={cn(
                  "min-h-24 rounded-md border p-1.5 text-left transition-colors hover:bg-muted",
                  !inMonth && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded-full text-xs",
                    isToday && "bg-primary text-primary-foreground",
                  )}
                >
                  {day.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {visible.map((event) => (
                    <p
                      key={event.id}
                      className={cn(
                        "truncate rounded bg-secondary px-1 py-0.5 text-[11px] text-secondary-foreground",
                        event.status === "excluded" && "opacity-50",
                      )}
                    >
                      {event.title}
                    </p>
                  ))}
                  {overflow > 0 && (
                    <p className="px-1 text-[11px] text-muted-foreground">
                      +{overflow} more
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
