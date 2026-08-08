import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import type { InvoiceDetail } from "@/lib/api/invoices";
import { formatCurrency } from "@/lib/currency";
import { getUserCurrency } from "@/lib/user-currency";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineItemRate } from "./line-item-rate";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let detail: InvoiceDetail;
  try {
    detail = await apiFetch<InvoiceDetail>(`/invoices/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const { invoice, lineItems } = detail;
  const currencyCode = await getUserCurrency();
  const money = (v: number) => formatCurrency(v, currencyCode);
  const isDraft = invoice.status === "draft";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/invoices"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to invoices
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold">{invoice.studio_name}</h1>
          <Badge variant={isDraft ? "outline" : "default"}>
            {invoice.invoice_number ?? "Draft"}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
          {" · "}Due {formatDate(invoice.due_date)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            {isDraft
              ? "Classes on this invoice — adjust a rate if the studio agreed something different"
              : "Classes on this invoice"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span>Class</span>
              <span className="text-right">Hours</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
            </div>
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.event_date)}
                  </p>
                </div>
                <span className="text-right text-muted-foreground">
                  {item.compensation_type === "hourly"
                    ? item.hours.toFixed(2)
                    : "-"}
                </span>
                <div className="min-w-28 text-right">
                  <LineItemRate
                    invoiceId={invoice.id}
                    lineItemId={item.id}
                    rate={item.rate}
                    editable={isDraft}
                    formatted={money(item.rate)}
                  />
                </div>
                <span className="text-right font-medium">
                  {money(item.amount)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t px-6 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{money(invoice.subtotal)}</span>
            </div>
            {invoice.vat_rate != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  VAT ({invoice.vat_rate}%)
                </span>
                <span>{money(invoice.vat_amount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{money(invoice.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isDraft && (
        <p className="text-sm text-muted-foreground">
          This invoice has been generated, so its lines can no longer be
          changed. Generated invoices keep a permanent number and are meant to
          match exactly what was sent.
        </p>
      )}
    </div>
  );
}
