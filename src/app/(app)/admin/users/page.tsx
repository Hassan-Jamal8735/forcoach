import { apiFetch } from "@/lib/api/server-client";
import type { AdminUser } from "@/lib/api/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessControl } from "./access-control";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const SUBSCRIPTION_VARIANT: Record<
  string,
  "secondary" | "outline" | "destructive"
> = {
  active: "secondary",
  trialing: "secondary",
  past_due: "destructive",
  unpaid: "destructive",
  canceled: "outline",
  incomplete: "outline",
  none: "outline",
};

export default async function AdminUsersPage() {
  const users = await apiFetch<AdminUser[]>("/admin/users");
  const sorted = [...users].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Coaches</h1>
        <p className="text-muted-foreground mt-1">
          Every account on FORCOACH, newest first.
        </p>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Coach</th>
                <th className="px-4 py-2 font-medium">Joined</th>
                <th className="px-4 py-2 font-medium">Last seen</th>
                <th className="px-4 py-2 font-medium">Subscription</th>
                <th className="px-4 py-2 font-medium">Access</th>
                <th className="px-4 py-2 font-medium">Studios</th>
                <th className="px-4 py-2 font-medium">Classes</th>
                <th className="px-4 py-2 font-medium">Invoices</th>
                <th className="px-4 py-2 font-medium">Messages</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.fullName ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {dateFmt.format(new Date(u.createdAt))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.lastSignInAt
                      ? dateFmt.format(new Date(u.lastSignInAt))
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={SUBSCRIPTION_VARIANT[u.subscriptionStatus] ?? "outline"}>
                      {u.subscriptionStatus}
                    </Badge>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {u.accessReason}
                    </div>
                    {u.promoCode && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {u.promoCode}
                        {u.discountPercentOff != null &&
                          ` — ${u.discountPercentOff}% off${
                            u.discountDuration === "forever" ? " forever" : ""
                          }`}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <AccessControl
                      key={u.adminOverrideUntil ?? "none"}
                      userId={u.id}
                      adminOverrideUntil={u.adminOverrideUntil}
                    />
                  </td>
                  <td className="px-4 py-3">{u.studioCount}</td>
                  <td className="px-4 py-3">{u.classCount}</td>
                  <td className="px-4 py-3">{u.invoiceCount}</td>
                  <td className="px-4 py-3">
                    {u.unreadSupportCount > 0 ? (
                      <Badge>{u.unreadSupportCount} unread</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No coaches yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
