import Link from "next/link";
import { apiFetch } from "@/lib/api/server-client";
import type { EarningsSummary, EarningsTimeseries } from "@/lib/api/earnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

type RangeKey = "month" | "year" | "all";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
  { key: "all", label: "All time" },
];

function rangeBounds(range: RangeKey) {
  const now = new Date();
  if (range === "month") {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  }
  if (range === "year") {
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }
  return { from: new Date(2020, 0, 1), to: now };
}

function bucketLabel(bucket: string, granularity: "day" | "week" | "month") {
  if (granularity === "month") {
    const [year, month] = bucket.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  }
  return new Date(bucket).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range: RangeKey =
    rawRange === "year" || rawRange === "all" ? rawRange : "month";

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const { from, to } = rangeBounds(range);
  const granularity = range === "month" ? "day" : "month";

  const [monthSummary, yearSummary, rangeSummary, timeseries] =
    await Promise.all([
      apiFetch<EarningsSummary>(
        `/earnings/summary?from=${monthStart.toISOString()}&to=${now.toISOString()}`,
      ),
      apiFetch<EarningsSummary>(
        `/earnings/summary?from=${yearStart.toISOString()}&to=${now.toISOString()}`,
      ),
      apiFetch<EarningsSummary>(
        `/earnings/summary?from=${from.toISOString()}&to=${to.toISOString()}`,
      ),
      apiFetch<EarningsTimeseries>(
        `/earnings/timeseries?from=${from.toISOString()}&to=${to.toISOString()}&granularity=${granularity}`,
      ),
    ]);

  const STATS = [
    { label: "Monthly income", value: currency.format(monthSummary.totalEarnings) },
    { label: "Yearly income", value: currency.format(yearSummary.totalEarnings) },
    { label: "Best studio", value: yearSummary.bestStudio ?? "—" },
    {
      label: "Avg. class rate",
      value: currency.format(yearSummary.avgClassRate),
    },
  ];

  const maxEarnings = Math.max(1, ...timeseries.points.map((p) => p.earnings));
  const chartWidth = 600;
  const chartHeight = 100;
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
  const areaPoints = `${linePoints} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  const totalBreakdown = rangeSummary.studioBreakdown.reduce(
    (sum, s) => sum + s.earnings,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Earnings</h1>
        <p className="text-muted-foreground mt-1">
          Daily, weekly, monthly, and total earnings, broken down per studio.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-heading font-semibold">
                {s.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex rounded-lg border p-0.5 w-fit">
        {RANGES.map((r) => (
          <Link
            key={r.key}
            href={`/earnings?range=${r.key}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              range === r.key
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {r.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Income over time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeseries.points.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No earnings in this range yet.
              </p>
            ) : (
              <>
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="h-32 w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="earnings-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon fill="url(#earnings-area)" points={areaPoints} />
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
                    .filter(
                      (_, i, arr) => i % Math.max(1, Math.ceil(arr.length / 8)) === 0,
                    )
                    .map((p) => (
                      <span key={p.bucket}>
                        {bucketLabel(p.bucket, timeseries.granularity)}
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
              Income by studio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rangeSummary.studioBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assigned classes in this range yet.
              </p>
            ) : (
              rangeSummary.studioBreakdown.map((s) => (
                <div key={s.studioId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground/80">{s.studioName}</span>
                    <span className="text-muted-foreground">
                      {currency.format(s.earnings)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${totalBreakdown > 0 ? (s.earnings / totalBreakdown) * 100 : 0}%`,
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
