import { apiFetch } from "@/lib/api/server-client";
import { createClient } from "@/lib/supabase/server";
import type { Invoice } from "@/lib/api/invoices";
import type { Studio } from "@/lib/api/studios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateInvoiceDialog } from "./create-invoice-dialog";
import { InvoiceActions } from "./invoice-actions";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusVariant(status: Invoice["status"]) {
  if (status === "generated") return "default" as const;
  if (status === "archived") return "secondary" as const;
  return "outline" as const;
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            {invoice.studio_name}
            <Badge variant={statusVariant(invoice.status)}>
              {invoice.status === "draft"
                ? "Draft"
                : invoice.status === "generated"
                  ? "Generated"
                  : "Archived"}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {invoice.invoice_number ?? "No number yet"} ·{" "}
            {formatDate(invoice.period_start)} -{" "}
            {formatDate(invoice.period_end)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">
            {formatCurrency(invoice.total)}
          </p>
          <p className="text-xs text-muted-foreground">
            Due {formatDate(invoice.due_date)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceActions invoice={invoice} />
      </CardContent>
    </Card>
  );
}

export default async function InvoicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const defaultVatRate =
    user?.user_metadata?.default_vat_rate != null
      ? String(user.user_metadata.default_vat_rate as number)
      : "";

  const [invoices, studios] = await Promise.all([
    apiFetch<Invoice[]>("/invoices"),
    apiFetch<Studio[]>("/studios"),
  ]);

  const active = invoices.filter((inv) => inv.status !== "archived");
  const archived = invoices.filter((inv) => inv.status === "archived");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Generate and review invoices per studio and billing period.
          </p>
        </div>
        <CreateInvoiceDialog
          studios={studios.filter((s) => s.status === "active")}
          defaultVatRate={defaultVatRate}
          trigger={<Button>New invoice</Button>}
        />
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              No invoices yet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Create your first invoice once you have assigned classes for a
            studio and billing period.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {active.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Archived
          </h2>
          {archived.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
}
