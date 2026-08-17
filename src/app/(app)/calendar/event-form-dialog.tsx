"use client";

import { useState, useTransition } from "react";
import { createEvent, updateEvent } from "./actions";
import type { Event } from "@/lib/api/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function dateInputValue(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function timeInputValue(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const DURATION_PRESETS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "1 h" },
  { value: "90", label: "1 h 30" },
  { value: "120", label: "2 h" },
  { value: "custom", label: "Custom" },
] as const;

function minutesBetween(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60_000;
  return Number.isFinite(diff) && diff > 0 ? diff : null;
}

// Adds minutes to a "YYYY-MM-DD" + "HH:MM" pair, returning the same shape.
function addMinutes(date: string, time: string, minutes: number) {
  const start = new Date(`${date}T${time}`);
  const end = new Date(start.getTime() + minutes * 60_000);
  return {
    date: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`,
    time: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
  };
}

export function EventFormDialog({
  event,
  studios,
  trigger,
}: {
  event?: Event;
  studios: { id: string; name: string; compensation_type?: string }[];
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [studioId, setStudioId] = useState(event?.studio_id ?? "none");
  const selectedStudio = studios.find((s) => s.id === studioId);
  const isTiered = selectedStudio?.compensation_type === "tiered";

  const initialMinutes = minutesBetween(event?.start_time, event?.end_time);
  const initialPreset = !event
    ? "60" // new classes default to 1h, the common case
    : DURATION_PRESETS.some(
          (p) => p.value !== "custom" && Number(p.value) === initialMinutes,
        )
      ? String(initialMinutes)
      : "custom";

  const [startDate, setStartDate] = useState(
    dateInputValue(event?.start_time) ?? "",
  );
  const [startTime, setStartTime] = useState(
    timeInputValue(event?.start_time) ?? "",
  );
  const [duration, setDuration] = useState(initialPreset);
  const [endDate, setEndDate] = useState(
    dateInputValue(event?.end_time) ?? "",
  );
  const [endTime, setEndTime] = useState(
    timeInputValue(event?.end_time) ?? "",
  );

  // Keep the computed end in sync while a preset (not "custom") is active.
  function applyDuration(nextDuration: string, date = startDate, time = startTime) {
    setDuration(nextDuration);
    if (nextDuration !== "custom" && date && time) {
      const computed = addMinutes(date, time, Number(nextDuration));
      setEndDate(computed.date);
      setEndTime(computed.time);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setError(undefined);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Add event"}</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = event
                ? await updateEvent(event.id, {}, formData)
                : await createEvent({}, formData);
              if (result.error) {
                setError(result.error);
              } else {
                setOpen(false);
              }
            });
          }}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required defaultValue={event?.title} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  applyDuration(duration, e.target.value, startTime);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time *</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                required
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  applyDuration(duration, startDate, e.target.value);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration *</Label>
            <Select value={duration} onValueChange={(v) => applyDuration(v ?? "custom")}>
              <SelectTrigger id="duration">
                <SelectValue>
                  {(value: string) =>
                    DURATION_PRESETS.find((p) => p.value === value)?.label ??
                    "Custom"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DURATION_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {duration === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">End date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}
          <input type="hidden" name="endDate" value={endDate} />
          <input type="hidden" name="endTime" value={endTime} />
          <div className="space-y-2">
            <Label htmlFor="studioId">Studio</Label>
            <Select
              name="studioId"
              value={studioId}
              onValueChange={(v) => setStudioId(v ?? "none")}
            >
              <SelectTrigger id="studioId">
                <SelectValue placeholder="No studio">
                  {(value: string) =>
                    value === "none"
                      ? "No studio"
                      : (studios.find((s) => s.id === value)?.name ??
                        "No studio")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No studio</SelectItem>
                {studios.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isTiered && (
            <div className="space-y-2">
              <Label htmlFor="attendanceCount">Attendance</Label>
              <Input
                id="attendanceCount"
                name="attendanceCount"
                type="number"
                min="0"
                step="1"
                defaultValue={event?.attendance_count ?? undefined}
                placeholder="How many people attended"
              />
              <p className="text-xs text-muted-foreground">
                This studio pays by how many people showed up. Enter the
                count to get the right rate — leave blank if you don&apos;t
                know it yet.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="rateOverride">Rate for this class (optional)</Label>
            <Input
              id="rateOverride"
              name="rateOverride"
              type="number"
              min="0"
              step="0.01"
              defaultValue={event?.rate_override ?? undefined}
              placeholder="Leave blank to use the studio rate"
            />
            <p className="text-xs text-muted-foreground">
              Overrides the studio&apos;s rate for this class only.{" "}
              {isTiered
                ? "If set, this replaces the attendance-based rate for this class."
                : "If the studio is paid hourly this is the hourly rate; if it's paid per class, this is the amount for the class."}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={event?.notes ?? undefined} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : event ? "Save changes" : "Add event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
