import Link from "next/link";
import { apiFetch } from "@/lib/api/server-client";
import type { AdminOverview } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dayLabelFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

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
  const maxTotal = Math.max(1, ...TOTALS.map((t) => t.value));

  const trend = overview.signupTrend;
  const maxSignups = Math.max(1, ...trend.map((p) => p.count));
  const chartWidth = 600;
  const chartHeight = 100;
  const step = trend.length > 1 ? chartWidth / (trend.length - 1) : 0;
  const linePoints = trend
    .map(
      (p, i) =>
        `${i * step},${chartHeight - (p.count / maxSignups) * chartHeight}`,
    )
    .join(" ");
  const areaPoints = `${linePoints} ${chartWidth},${chartHeight} 0,${chartHeight}`;
  const totalTrendSignups = trend.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-muted-foreground mt-1">
          Everyone using FORCOACH, at a glance.
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

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              New signups — last 30 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalTrendSignups === 0 ? (
              <p className="text-sm text-muted-foreground">
                No new signups in this window yet.
              </p>
            ) : (
              <>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="h-32 w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="signup-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon fill="url(#signup-area)" points={areaPoints} />
                  <polyline
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePoints}
                  />
                </svg>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  {trend
                    .filter(
                      (_, i, arr) =>
                        i % Math.max(1, Math.ceil(arr.length / 6)) === 0,
                    )
                    .map((p) => (
                      <span key={p.date}>
                        {dayLabelFmt.format(new Date(p.date))}
                      </span>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Activity across all accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {TOTALS.map((t) => (
              <div key={t.label} className="space-y-1">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">{t.label}</span>
                  <span className="font-medium">{t.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(t.value / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

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
