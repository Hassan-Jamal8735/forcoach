"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportMessage } from "@/lib/api/support";
import type { SupportThreadSummary } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchThreadMessages,
  fetchThreads,
  markThreadReadByAdmin,
  replyToThread,
} from "../actions";

const POLL_MS = 10_000;

const timeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function AdminSupportInbox({
  initialThreads,
}: {
  initialThreads: SupportThreadSummary[];
}) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedUserId, setSelectedUserId] = useState(
    initialThreads[0]?.userId,
  );
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load the selected thread's messages whenever the selection changes.
  useEffect(() => {
    if (!selectedUserId) return;
    void fetchThreadMessages(selectedUserId).then((result) => {
      if (result.messages) setMessages(result.messages);
    });
    void markThreadReadByAdmin(selectedUserId);
  }, [selectedUserId]);

  // Poll the thread list, and the open thread's messages, on an interval.
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchThreads().then((result) => {
        if (result.threads) setThreads(result.threads);
      });
      if (selectedUserId) {
        void fetchThreadMessages(selectedUserId).then((result) => {
          if (result.messages) setMessages(result.messages);
        });
      }
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function handleSend() {
    const body = draft.trim();
    if (!body || !selectedUserId) return;
    setError(undefined);
    startTransition(async () => {
      const result = await replyToThread(selectedUserId, body);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDraft("");
      const [refreshedMessages, refreshedThreads] = await Promise.all([
        fetchThreadMessages(selectedUserId),
        fetchThreads(),
      ]);
      if (refreshedMessages.messages) setMessages(refreshedMessages.messages);
      if (refreshedThreads.threads) setThreads(refreshedThreads.threads);
    });
  }

  const selectedThread = threads.find((t) => t.userId === selectedUserId);

  return (
    <div className="grid h-[65vh] grid-cols-1 gap-4 md:grid-cols-[280px_1fr]">
      <div className="overflow-y-auto rounded-lg border">
        {threads.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No messages yet.
          </p>
        ) : (
          threads.map((t) => (
            <button
              key={t.userId}
              type="button"
              onClick={() => setSelectedUserId(t.userId)}
              className={cn(
                "flex w-full flex-col gap-0.5 border-b px-3 py-2.5 text-left text-sm last:border-0 hover:bg-muted/50",
                t.userId === selectedUserId && "bg-muted",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">
                  {t.fullName ?? t.email}
                </span>
                {t.unreadCount > 0 && <Badge>{t.unreadCount}</Badge>}
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {t.lastMessage}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="flex flex-col rounded-lg border">
        {!selectedThread ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="border-b px-4 py-2.5 text-sm font-medium">
              {selectedThread.fullName ?? selectedThread.email}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {selectedThread.email}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col",
                    m.sender === "admin" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                      m.sender === "admin"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {m.body}
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {m.sender === "admin" ? "You" : "Coach"} ·{" "}
                    {timeFmt.format(new Date(m.created_at))}
                  </span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {error && (
              <Alert variant="destructive" className="mx-3 mb-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-end gap-2 border-t p-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Reply..."
                className="min-h-10 flex-1 resize-none"
                rows={1}
              />
              <Button
                type="button"
                size="icon"
                disabled={isPending || !draft.trim()}
                onClick={handleSend}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
