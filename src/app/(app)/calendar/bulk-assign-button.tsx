"use client";

import { useState, useTransition } from "react";
import { bulkAssignEvents } from "./actions";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UNASSIGN = "__unassign__";

export function BulkAssignButton({
  ids,
  studios,
  onDone,
}: {
  ids: string[];
  studios: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [studioId, setStudioId] = useState<string>("");

  function apply(value: string) {
    setError(null);
    startTransition(async () => {
      const result = await bulkAssignEvents(
        ids,
        value === UNASSIGN ? null : value,
      );
      if (result.error) {
        setError(result.error);
        toast(result.error, "destructive");
      } else {
        setStudioId("");
        onDone();
        toast(
          value === UNASSIGN
            ? `Cleared studio on ${ids.length} event${ids.length === 1 ? "" : "s"}`
            : `Assigned ${ids.length} event${ids.length === 1 ? "" : "s"}`,
        );
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={studioId}
        onValueChange={(value) => {
          if (!value) return;
          setStudioId(value);
          apply(value);
        }}
      >
        <SelectTrigger size="sm" className="h-8 min-w-44 text-xs">
          <SelectValue placeholder={`Assign ${ids.length} to studio...`}>
            {(value: string) =>
              value === UNASSIGN
                ? "Clear studio"
                : (studios.find((s) => s.id === value)?.name ??
                  `Assign ${ids.length} to studio...`)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {studios.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
          <SelectItem value={UNASSIGN}>Clear studio</SelectItem>
        </SelectContent>
      </Select>
      {isPending && (
        <span className="text-xs text-muted-foreground">Assigning...</span>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
