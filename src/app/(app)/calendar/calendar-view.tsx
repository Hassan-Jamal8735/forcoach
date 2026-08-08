"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { EventRow, formatEventRange } from "./event-row";
import { BulkDeleteButton } from "./bulk-delete-button";
import { BulkAssignButton } from "./bulk-assign-button";

const PAGE_SIZE = 20;

type ViewMode = "list" | "month" | "week" | "day";

const VIEWS: { value: ViewMode; label: string }[] = [
  { value: "list", label: "List" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

export function CalendarView({
  events,
  studios,
}: {
  events: Event[];
  studios: Studio[];
}) {
  const [view, setView] = useState<ViewMode>("list");
  const [anchor, setAnchor] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [studioFilter, setStudioFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const studioById = new Map(studios.map((s) => [s.id, s.name]));
  const studioOptions = studios.map((s) => ({ id: s.id, name: s.name }));

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

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function navigate(step: 1 | -1) {
    if (view === "month") setAnchor((d) => addMonths(d, step));
    else if (view === "week") setAnchor((d) => addDays(d, step * 7));
    else if (view === "day") setAnchor((d) => addDays(d, step));
  }

  function toggleSelect(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((e) => selectedIds.has(e.id));

  function toggleSelectAllOnPage(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const e of paginated) {
        if (checked) next.add(e.id);
        else next.delete(e.id);
      }
      return next;
    });
  }

  const emptyState = (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-normal text-muted-foreground">
          No events found
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {events.length === 0
          ? "Import a CSV of your classes, connect Google Calendar above, or add one manually to get started."
          : "Try a different search or studio filter."}
      </CardContent>
    </Card>
  );

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

        {view !== "list" && (
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
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-48 pl-8"
            />
          </div>
          <Select
            value={studioFilter}
            onValueChange={(value) => {
              setStudioFilter(value ?? "all");
              setPage(1);
            }}
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

      {view === "list" &&
        (sorted.length === 0 ? (
          emptyState
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={allOnPageSelected}
                  onCheckedChange={(checked) => toggleSelectAllOnPage(checked === true)}
                  aria-label="Select all on this page"
                />
                Select all on this page
              </label>
              {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Clear
                  </Button>
                  <BulkAssignButton
                    ids={Array.from(selectedIds)}
                    studios={studios.map((s) => ({ id: s.id, name: s.name }))}
                    onDone={() => setSelectedIds(new Set())}
                  />
                  <BulkDeleteButton
                    ids={Array.from(selectedIds)}
                    onDone={() => setSelectedIds(new Set())}
                  />
                </div>
              )}
            </div>

            <Card>
              <CardContent className="divide-y p-0">
                {paginated.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    studioById={studioById}
                    studioOptions={studioOptions}
                    selectable
                    selected={selectedIds.has(event.id)}
                    onToggleSelect={(checked) => toggleSelect(event.id, checked)}
                  />
                ))}
              </CardContent>
            </Card>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} · {sorted.length} events
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

      {view === "day" &&
        (() => {
          const dayEvents = eventsByDay.get(dateKey(anchor)) ?? [];
          return dayEvents.length === 0 ? (
            emptyState
          ) : (
            <Card>
              <CardContent className="divide-y p-0">
                {dayEvents.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    studioById={studioById}
                    studioOptions={studioOptions}
                    showDate={false}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })()}

      {view === "week" && (
        <div className="grid gap-3 lg:grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(anchor), i)).map(
            (day) => {
              const dayEvents = eventsByDay.get(dateKey(day)) ?? [];
              return (
                <Card key={dateKey(day)} className="min-w-0">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      {day.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 p-3 pt-0">
                    {dayEvents.length === 0 ? (
                      <p className="text-xs text-muted-foreground">—</p>
                    ) : (
                      dayEvents.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => {
                            setAnchor(new Date(event.start_time));
                            setView("day");
                          }}
                          className={cn(
                            "w-full rounded-md border px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted",
                            event.status === "excluded" && "opacity-50",
                          )}
                        >
                          <p className="truncate font-medium">{event.title}</p>
                          <p className="text-muted-foreground">
                            {formatEventRange(event, false)}
                          </p>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>
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
