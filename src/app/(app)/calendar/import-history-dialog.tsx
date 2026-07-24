"use client";

import { useState, useTransition } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ImportActivity } from "@/lib/api/events";
import { fetchImportActivity } from "./actions";

function statusVariant(status: ImportActivity["status"]) {
  if (status === "success") return "secondary" as const;
  if (status === "failed") return "destructive" as const;
  return "outline" as const;
}

export function ImportHistoryDialog() {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<ImportActivity[] | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          startTransition(async () => {
            const result = await fetchImportActivity();
            if (result.error) setError(result.error);
            else setActivity(result.activity ?? []);
          });
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            <History className="mr-2 size-4" />
            Import history
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import history</DialogTitle>
        </DialogHeader>

        {isPending && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!isPending && activity && activity.length === 0 && (
          <p className="text-sm text-muted-foreground">No imports yet.</p>
        )}
        {!isPending && activity && activity.length > 0 && (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {activity.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {a.source === "csv"
                      ? "CSV import"
                      : a.source === "ics"
                        ? "ICS feed sync"
                        : "Google Calendar sync"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.started_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {a.records_created} created · {a.records_skipped} skipped
                  </span>
                  <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
