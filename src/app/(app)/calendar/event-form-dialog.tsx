"use client";

import { useState, useTransition } from "react";
import { createEvent, deleteEvent, updateEvent } from "./actions";
import type { Event } from "@/lib/api/events";
import { toast } from "@/lib/toast";
import { TIME_OPTIONS } from "@/lib/time-options";
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
  { value: "50", label: "50 min" },
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
// Returns null instead of "NaN:NaN" if the inputs don't form a valid date —
// a mid-typing native time value (e.g. while the browser's time widget is
// still being filled in) can otherwise poison the computed end fields and
// trip the browser's own "invalid value" validation on submit.
function addMinutes(
  date: string,
  time: string,
  minutes: number,
): { date: string; time: string } | null {
  const start = new Date(`${date}T${time}`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + minutes * 60_000);
  return {
    date: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`,
    time: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
  };
}

const REPEAT_OPTIONS = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
] as const;

// Adds `n` of the given unit to a "YYYY-MM-DD" date string.
function shiftDate(date: string, unit: "daily" | "weekly" | "monthly", n: number) {
  const d = new Date(`${date}T00:00`);
  if (unit === "daily") d.setDate(d.getDate() + n);
  else if (unit === "weekly") d.setDate(d.getDate() + n * 7);
  else d.setMonth(d.getMonth() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function EventFormDialog({
  event,
  studios,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialDate,
  initialTime,
}: {
  event?: Event;
  studios: { id: string; name: string; compensation_type?: string }[];
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialDate?: string;
  initialTime?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const [error, setError] = useState<string | undefined>();
  const [repeat, setRepeat] = useState<(typeof REPEAT_OPTIONS)[number]["value"]>("none");
  const [repeatCount, setRepeatCount] = useState("4");
  const [isPending, startTransition] = useTransition();
  const [studioId, setStudioId] = useState(event?.studio_id ?? "none");
  const selectedStudio = studios.find((s) => s.id === studioId);
  const isTiered = selectedStudio?.compensation_type === "tiered";

  const initialMinutes = minutesBetween(event?.start_time, event?.end_time);
  const initialPreset = !event
    ? "50" // new classes default to 50min, the common case
    : DURATION_PRESETS.some(
          (p) => p.value !== "custom" && Number(p.value) === initialMinutes,
        )
      ? String(initialMinutes)
      : "custom";

  const [startDate, setStartDate] = useState(
    dateInputValue(event?.start_time) ?? initialDate ?? "",
  );
  const [startTime, setStartTime] = useState(
    timeInputValue(event?.start_time) ?? initialTime ?? "",
  );
  const [duration, setDuration] = useState(initialPreset);
  const initialEnd =
    !event && initialDate && initialTime
      ? addMinutes(initialDate, initialTime, Number(initialPreset))
      : null;
  const [endDate, setEndDate] = useState(
    dateInputValue(event?.end_time) ?? initialEnd?.date ?? "",
  );
  const [endTime, setEndTime] = useState(
    timeInputValue(event?.end_time) ?? initialEnd?.time ?? "",
  );

  // Keep the computed end in sync while a preset (not "custom") is active.
  function applyDuration(nextDuration: string, date = startDate, time = startTime) {
    setDuration(nextDuration);
    if (nextDuration !== "custom" && date && time) {
      const computed = addMinutes(date, time, Number(nextDuration));
      if (computed) {
        setEndDate(computed.date);
        setEndTime(computed.time);
      }
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
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Add event"}</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(async () => {
              if (event) {
                const result = await updateEvent(event.id, {}, formData);
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setOpen(false);
                return;
              }

              // Recurring: create the first occurrence, then repeat with
              // start/end shifted by the chosen unit, up to repeatCount times.
              const occurrences = repeat === "none" ? 1 : Math.max(1, Number(repeatCount) || 1);
              for (let i = 0; i < occurrences; i++) {
                const unit = repeat as "daily" | "weekly" | "monthly";
                const sDate = i === 0 ? startDate : shiftDate(startDate, unit, i);
                const eDate = i === 0 ? endDate : shiftDate(endDate, unit, i);
                const occurrence = new FormData();
                for (const [key, value] of formData.entries()) {
                  if (key === "startDate") occurrence.set(key, sDate);
                  else if (key === "endDate") occurrence.set(key, eDate);
                  else occurrence.set(key, value);
                }
                const result = await createEvent({}, occurrence);
                if (result.error) {
                  setError(
                    i === 0
                      ? result.error
                      : `Created ${i} of ${occurrences} — then failed: ${result.error}`,
                  );
                  return;
                }
              }
              setOpen(false);
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
                // Safari/WebKit is known to sometimes only fire `input`, not
                // `change`, when a date is picked via its native calendar
                // widget — duplicate the handler so either event commits it.
                onInput={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  setStartDate(value);
                  applyDuration(duration, value, startTime);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time *</Label>
              <Select
                value={startTime}
                onValueChange={(v) => {
                  if (!v) return;
                  setStartTime(v);
                  applyDuration(duration, startDate, v);
                }}
              >
                <SelectTrigger id="startTime" className="w-full">
                  <SelectValue>
                    {(value: string) =>
                      TIME_OPTIONS.find((t) => t.value === value)?.label ??
                      "Select a time"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="startTime" value={startTime} />
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
          {!event && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repeat">Repeat</Label>
                <Select value={repeat} onValueChange={(v) => setRepeat((v as typeof repeat) ?? "none")}>
                  <SelectTrigger id="repeat" className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        REPEAT_OPTIONS.find((r) => r.value === value)?.label ??
                        "Does not repeat"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {REPEAT_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {repeat !== "none" && (
                <div className="space-y-2">
                  <Label htmlFor="repeatCount"># of classes</Label>
                  <Input
                    id="repeatCount"
                    type="number"
                    min="1"
                    max="52"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
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
                  onInput={(e) => setEndDate((e.target as HTMLInputElement).value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End time *</Label>
                <Select value={endTime} onValueChange={(v) => v && setEndTime(v)}>
                  <SelectTrigger id="endTime" className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        TIME_OPTIONS.find((t) => t.value === value)?.label ??
                        "Select a time"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <div className="flex items-center justify-between gap-2">
            {event ? (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-destructive"
                    >
                      Delete
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this class?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isPending}
                      onClick={(e) => {
                        e.preventDefault();
                        startTransition(async () => {
                          const result = await deleteEvent(event.id);
                          if (result.error) {
                            setError(result.error);
                            toast(result.error, "destructive");
                          } else {
                            setOpen(false);
                            toast("Class deleted");
                          }
                        });
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : event ? "Save changes" : "Add event"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
