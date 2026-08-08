"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { uploadIcsFile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Rough guard so a mis-picked file doesn't get posted as a giant string.
const MAX_BYTES = 5 * 1024 * 1024;

export function IcsUploadDialog({
  studios,
}: {
  studios: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<string | undefined>();
  const [content, setContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [studioId, setStudioId] = useState("none");
  const [isPending, startTransition] = useTransition();

  function reset() {
    setError(undefined);
    setResult(undefined);
    setContent(null);
    setFileName(null);
    setEventCount(null);
    setStudioId("none");
  }

  async function handleFile(file: File) {
    setError(undefined);
    setResult(undefined);

    if (file.size > MAX_BYTES) {
      setError("That file is larger than 5 MB. Please export a smaller range.");
      return;
    }

    const text = await file.text();
    if (!text.includes("BEGIN:VCALENDAR")) {
      setError("That doesn't look like a calendar (.ics) file.");
      return;
    }

    // Cheap client-side count purely for the preview; the server does the real
    // parsing, so this only needs to be roughly right.
    const matches = text.match(/BEGIN:VEVENT/g);
    setContent(text);
    setFileName(file.name);
    setEventCount(matches ? matches.length : 0);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="mr-1.5 size-4" />
            Upload .ics
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a calendar file</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your classes from Mindbody, bsport, or any calendar app as
            a <code>.ics</code> file and upload it here. Unlike a live feed, this
            imports past classes too, so it&apos;s the way to bring in history
            for invoicing.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <Alert>
              <AlertDescription>{result}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="icsFile">Calendar file</Label>
            <Input
              id="icsFile"
              type="file"
              accept=".ics,text/calendar"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            {fileName && eventCount !== null && (
              <p className="text-xs text-muted-foreground">
                {fileName} — {eventCount} class
                {eventCount === 1 ? "" : "es"} found
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icsStudio">Assign all to studio (optional)</Label>
            <Select value={studioId} onValueChange={(v) => setStudioId(v ?? "none")}>
              <SelectTrigger id="icsStudio" className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value === "none"
                      ? "Leave unassigned"
                      : (studios.find((s) => s.id === value)?.name ??
                        "Leave unassigned")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Leave unassigned</SelectItem>
                {studios.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Only classes assigned to a studio count toward earnings and
              invoices. You can also assign them later in bulk.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!content || isPending}
              onClick={() => {
                if (!content) return;
                setError(undefined);
                startTransition(async () => {
                  const res = await uploadIcsFile(
                    content,
                    studioId === "none" ? undefined : studioId,
                  );
                  if (res.error) {
                    setError(res.error);
                  } else {
                    setResult(
                      `Imported ${res.created ?? 0} new class${
                        res.created === 1 ? "" : "es"
                      }, updated ${res.updated ?? 0}.`,
                    );
                    setContent(null);
                    setFileName(null);
                    setEventCount(null);
                  }
                });
              }}
            >
              {isPending ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
