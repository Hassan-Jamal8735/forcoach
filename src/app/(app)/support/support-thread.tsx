"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportMessage } from "@/lib/api/support";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchMessages, markThreadRead, sendMessage } from "./actions";

const POLL_MS = 10_000;

const timeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function SupportThread({
  initialMessages,
}: {
  initialMessages: SupportMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void markThreadRead();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchMessages().then((result) => {
        if (result.messages) setMessages(result.messages);
      });
      void markThreadRead();
    }, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setError(undefined);
    startTransition(async () => {
      const result = await sendMessage(body);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDraft("");
      const refreshed = await fetchMessages();
      if (refreshed.messages) setMessages(refreshed.messages);
    });
  }

  return (
    <div className="flex h-[60vh] flex-col rounded-lg border">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet — send one below and we&apos;ll get back to you.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex flex-col",
                m.sender === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  m.sender === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.body}
              </div>
              <span className="mt-1 text-xs text-muted-foreground">
                {m.sender === "admin" ? "FORCOACH" : "You"} ·{" "}
                {timeFmt.format(new Date(m.created_at))}
              </span>
            </div>
          ))
        )}
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
          placeholder="Type a message..."
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
    </div>
  );
}
