"use client";

import { useState, useTransition } from "react";
import { Rss, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { IcsFeed } from "@/lib/api/ics-feeds";
import { createIcsFeed, deleteIcsFeed, syncIcsFeed } from "./actions";
import { FindFeedLinkDialog } from "./find-feed-link-dialog";

export function IcsFeedsCard({
  feeds,
  studios,
}: {
  feeds: IcsFeed[];
  studios: { id: string; name: string }[];
}) {
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();
  const [addOpen, setAddOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [studioId, setStudioId] = useState("none");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    setError(undefined);
    startTransition(async () => {
      const result = await createIcsFeed(
        url,
        name,
        studioId !== "none" ? studioId : undefined,
      );
      if (result.error) setError(result.error);
      else {
        setNotice(
          `Added: ${result.result?.created ?? 0} events imported.`,
        );
        setUrl("");
        setName("");
        setStudioId("none");
        setAddOpen(false);
      }
    });
  }

  function handleSync(id: string) {
    setError(undefined);
    startTransition(async () => {
      const result = await syncIcsFeed(id);
      if (result.error) setError(result.error);
      else
        setNotice(
          `Synced: ${result.result?.created ?? 0} new, ${result.result?.updated ?? 0} updated.`,
        );
    });
  }

  function handleDelete(id: string) {
    setError(undefined);
    startTransition(async () => {
      const result = await deleteIcsFeed(id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Rss className="size-4 text-muted-foreground" />
          ICS Feeds
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddOpen((v) => !v)}
        >
          <Plus className="mr-1.5 size-4" />
          Add feed
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {notice && !error && (
          <Alert>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}

        {addOpen && (
          <div className="space-y-3 rounded-md border p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ics-name">Label</Label>
                <Input
                  id="ics-name"
                  placeholder="e.g. Bsport - Out Sports Club"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ics-studio">Default studio (optional)</Label>
                <Select value={studioId} onValueChange={(v) => setStudioId(v ?? "none")}>
                  <SelectTrigger id="ics-studio" className="w-full">
                    <SelectValue>
                      {(value: string) =>
                        value === "none"
                          ? "No default studio"
                          : (studios.find((s) => s.id === value)?.name ??
                            "No default studio")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default studio</SelectItem>
                    {studios.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="ics-url">Feed URL (.ics link)</Label>
                <FindFeedLinkDialog />
              </div>
              <Input
                id="ics-url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending || !url || !name}
                onClick={handleAdd}
              >
                {isPending ? "Adding..." : "Add and sync"}
              </Button>
            </div>
          </div>
        )}

        {feeds.length === 0 && !addOpen ? (
          <p className="text-sm text-muted-foreground">
            No ICS feeds connected. Add one to sync classes from Bsport,
            Mindbody, or any other calendar feed link.
          </p>
        ) : (
          <div className="space-y-2">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{feed.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {feed.last_synced_at
                      ? `Last synced ${new Date(feed.last_synced_at).toLocaleString()}`
                      : "Not synced yet"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleSync(feed.id)}
                  >
                    Sync now
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {feed.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This stops future syncing from this feed. Events
                          already imported stay in your calendar.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(feed.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
