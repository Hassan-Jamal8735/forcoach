import Link from "next/link";
import { apiFetch } from "@/lib/api/server-client";
import type { AdminOverview } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const overview = await apiFetch<AdminOverview>("/admin/overview");

  const STATS = [
    { label: "Total coaches", value: overview.totalUsers },
    { label: "New this week", value: overview.newUsersThisWeek },
    { label: "New this month", value: overview.newUsersThisMonth },
    {
      label: "Unread messages",
      value: overview.unreadSupportCount,
      href: "/admin/support",
    },
  ];

  const TOTALS = [
    { label: "Studios created", value: overview.totalStudios },
    { label: "Classes logged", value: overview.totalClasses },
    { label: "Invoices generated", value: overview.totalInvoices },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-muted-foreground mt-1">
          Overview of everyone using FORCOACH.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const content = (
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-colors hover:bg-muted/50">
                {content}
              </Card>
            </Link>
          ) : (
            <Card key={stat.label}>{content}</Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Activity across all accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {TOTALS.map((t) => (
            <div key={t.label}>
              <p className="text-sm text-muted-foreground">{t.label}</p>
              <p className="mt-1 text-xl font-semibold">{t.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 text-sm">
        <Link href="/admin/users" className="text-accent hover:underline">
          View all coaches &rarr;
        </Link>
        <Link href="/admin/support" className="text-accent hover:underline">
          Support inbox &rarr;
        </Link>
      </div>
    </div>
  );
}
