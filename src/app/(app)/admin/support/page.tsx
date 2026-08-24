import { apiFetch } from "@/lib/api/server-client";
import type { SupportThreadSummary } from "@/lib/api/admin";
import { AdminSupportInbox } from "./admin-support-inbox";

export default async function AdminSupportPage() {
  const threads = await apiFetch<SupportThreadSummary[]>(
    "/admin/support/threads",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Support inbox</h1>
        <p className="text-muted-foreground mt-1">
          Messages from coaches, most recent first.
        </p>
      </div>
      <AdminSupportInbox initialThreads={threads} />
    </div>
  );
}
