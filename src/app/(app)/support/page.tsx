import { apiFetch } from "@/lib/api/server-client";
import type { SupportMessage } from "@/lib/api/support";
import { SupportThread } from "./support-thread";

export default async function SupportPage() {
  const messages = await apiFetch<SupportMessage[]>("/support/messages");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="text-muted-foreground mt-1">
          Message us directly — we usually reply within a day.
        </p>
      </div>
      <SupportThread initialMessages={messages} />
    </div>
  );
}
