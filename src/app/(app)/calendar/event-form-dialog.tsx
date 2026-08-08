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

export function EventFormDialog({
  event,
  studios,
  trigger,
}: {
  event?: Event;
  studios: { id: string; name: string }[];
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

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
                defaultValue={dateInputValue(event?.start_time)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time *</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                required
                defaultValue={timeInputValue(event?.start_time)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                defaultValue={dateInputValue(event?.end_time)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End time *</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                required
                defaultValue={timeInputValue(event?.end_time)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="studioId">Studio</Label>
            <Select name="studioId" defaultValue={event?.studio_id ?? "none"}>
              <SelectTrigger id="studioId">
                <SelectValue placeholder="No studio" />
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
              Overrides the studio&apos;s rate for this class only. If the
              studio is paid hourly this is the hourly rate; if it&apos;s paid
              per class, this is the amount for the class.
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
