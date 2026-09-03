import Link from "next/link";
import { apiFetch } from "@/lib/api/server-client";
import type { Event } from "@/lib/api/events";
import type { Studio } from "@/lib/api/studios";
import type { EarningsSummary, EarningsTimeseries } from "@/lib/api/earnings";
import type { BillingStatus } from "@/lib/api/billing";
import type { GoogleCalendarStatus } from "@/lib/api/google-calendar";
import type { IcsFeed } from "@/lib/api/ics-feeds";
import type { Invoice } from "@/lib/api/invoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { getUserCurrency } from "@/lib/user-currency";
import { OnboardingChecklist } from "./onboarding-checklist";


function monthLabel(bucket: string) {
  const [year, month] = bucket.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
  });
}

export default async function DashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [studios, events, summary, timeseries, billing, googleStatus, icsFeeds, invoices] =
    await Promise.all([
      apiFetch<Studio[]>("/studios"),
      apiFetch<Event[]>("/events"),
      apiFetch<EarningsSummary>(
        `/earnings/summary?from=${monthStart.toISOString()}&to=${now.toISOString()}`,
      ),
      apiFetch<EarningsTimeseries>(
        `/earnings/timeseries?from=${twelveMonthsAgo.toISOString()}&to=${now.toISOString()}&granularity=month`,
      ),
      apiFetch<BillingStatus>("/billing/status"),
      apiFetch<GoogleCalendarStatus>("/calendar/google/status"),
      apiFetch<IcsFeed[]>("/ics-feeds"),
      apiFetch<Invoice[]>("/invoices"),
    ]);

  const onboardingSteps = [
    {
      label: "Connect a calendar",
      done: googleStatus.connected || icsFeeds.length > 0,
      href: "/settings",
      cta: "Connect",
    },
    {
      label: "Add a studio",
      done: studios.length > 0,
      href: "/studios",
      cta: "Add studio",
    },
    {
      label: "Create your first invoice",
      done: invoices.length > 0,
      href: "/invoices",
      cta: "Create invoice",
    },
  ];

  const trialDaysLeft =
    billing.status === "trialing" && billing.currentPeriodEnd
      ? Math.max(
          0,
          Math.ceil(
            (new Date(billing.currentPeriodEnd).getTime() - now.getTime()) /
              (24 * 60 * 60 * 1000),
          ),
        )
      : null;

  const currencyCode = await getUserCurrency();
  const money = (v: number) => formatCurrency(v, currencyCode);

  const activeStudios = studios.filter((s) => s.status === "active").length;
  const upcomingClasses = events.filter(
    (e) => new Date(e.start_time) >= now && e.status !== "excluded",
  ).length;

  const maxEarnings = Math.max(1, ...timeseries.points.map((p) => p.earnings));
  const chartWidth = 320;
  const chartHeight = 60;
  const step =
    timeseries.points.length > 1
      ? chartWidth / (timeseries.points.length - 1)
      : 0;
  const linePoints = timeseries.points
    .map(
      (p, i) =>
        `${i * step},${chartHeight - (p.earnings / maxEarnings) * chartHeight}`,
    )
    .join(" ");

  const totalStudioEarnings = summary.studioBreakdown.reduce(
    (sum, s) => sum + s.earnings,
    0,
  );

  const KPI_CARDS = [
    { label: "Total Hours (this month)", value: summary.totalHours.toFixed(1) },
    {
      label: "Total Earnings (this month)",
      value: money(summary.totalEarnings),
    },
    { label: "Active Studios", value: String(activeStudios) },
    { label: "Upcoming Classes", value: String(upcomingClasses) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your coaching business at a glance.
        </p>
      </div>

      <OnboardingChecklist steps={onboardingSteps} />

      {trialDaysLeft != null && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
            <span>
              {trialDaysLeft === 0
                ? "Your free trial ends today."
                : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in your free trial.`}{" "}
              Your card will be charged automatically when it ends.
            </span>
            <Link
              href="/settings"
              className="text-sm font-medium text-accent hover:underline"
            >
              Manage subscription
            </Link>
          </CardContent>
        </Card>
      )}

      {billing.status === "past_due" && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
            <span>
              Your last payment failed. Update your payment method to keep
              your subscription active.
            </span>
            <Link
              href="/settings"
              className="text-sm font-medium text-destructive hover:underline"
            >
              Fix payment
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-semibold">
                {card.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {summary.pendingCount > 0 && (
        <Card className="border-accent/30">
          <CardContent className="flex items-center justify-between py-4 text-sm">
            <span>
              {summary.pendingCount} class{summary.pendingCount === 1 ? "" : "es"}{" "}
              this month {summary.pendingCount === 1 ? "isn't" : "aren't"}{" "}
              assigned to a studio yet, so {summary.pendingCount === 1 ? "it" : "they"}{" "}
              won&apos;t count toward earnings until assigned.
            </span>
            <Badge variant="outline">Needs attention</Badge>
          </CardContent>
        </Card>
      )}

      {summary.pendingAttendanceCount > 0 && (
        <Card className="border-accent/30">
          <CardContent className="flex items-center justify-between py-4 text-sm">
            <span>
              {summary.pendingAttendanceCount} class
              {summary.pendingAttendanceCount === 1 ? "" : "es"} this month{" "}
              {summary.pendingAttendanceCount === 1 ? "needs" : "need"} an
              attendance count before {summary.pendingAttendanceCount === 1
                ? "it counts"
                : "they count"}{" "}
              toward earnings.
            </span>
            <Badge variant="outline">Needs attention</Badge>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Income over time, last 12 months
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeseries.points.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No earnings yet, assign some classes to a studio to see this
                fill in.
              </p>
            ) : (
              <>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="h-24 w-full"
                  preserveAspectRatio="none"
                >
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
                  {timeseries.points
                    .filter((_, i) => i % 2 === 0)
                    .map((p) => (
                      <span key={p.bucket}>{monthLabel(p.bucket)}</span>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              By studio (this month)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.studioBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assigned classes this month yet.
              </p>
            ) : (
              summary.studioBreakdown.map((s) => (
                <div key={s.studioId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground/80">{s.studioName}</span>
                    <span className="text-muted-foreground">
                      {money(s.earnings)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${totalStudioEarnings > 0 ? (s.earnings / totalStudioEarnings) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
