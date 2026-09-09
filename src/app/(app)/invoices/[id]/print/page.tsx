import { notFound } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/server-client";
import { createClient } from "@/lib/supabase/server";
import type { InvoiceDetail } from "@/lib/api/invoices";
import { formatCurrency } from "@/lib/currency";
import { getUserCurrency } from "@/lib/user-currency";
import { PrintButton } from "./print-button";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function InvoicePrintPage({
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const coachName = (metadata.full_name as string | undefined) ?? user?.email ?? "";
  const siret = metadata.siret as string | undefined;
  const iban = metadata.iban as string | undefined;
  const bankAccountName = metadata.bank_account_name as string | undefined;
  const bankName = metadata.bank_name as string | undefined;
  const bankAddress = metadata.bank_address as string | undefined;
  const bankPhone = metadata.bank_phone as string | undefined;

  const hasBankDetails = iban || bankAccountName || bankName || bankAddress || bankPhone;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="space-y-8 rounded-lg border p-8 print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-heading text-xl font-semibold">FORCOACH</p>
            <p className="text-xs text-muted-foreground">Coaching invoice</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              {invoice.invoice_number ?? "Draft invoice"}
            </p>
            <p className="text-xs text-muted-foreground">
              Issued {formatDate(invoice.issue_date ?? invoice.created_at)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              From
            </p>
            <p className="mt-1 font-medium">{coachName}</p>
            {user?.email && <p className="text-muted-foreground">{user.email}</p>}
            {siret && <p className="text-muted-foreground">SIRET {siret}</p>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Billed to
            </p>
            <p className="mt-1 font-medium">{invoice.studio_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-y py-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Period
            </p>
            <p className="mt-1">
              {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Due date
            </p>
            <p className="mt-1">{formatDate(invoice.due_date)}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Class</th>
              <th className="pb-2 text-right font-medium">Duration</th>
              <th className="pb-2 text-right font-medium">Rate</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{formatDate(item.event_date)}</td>
                <td className="py-2">{item.title}</td>
                <td className="py-2 text-right text-muted-foreground">
                  {Math.round(item.hours * 60)} min
                </td>
                <td className="py-2 text-right">{money(item.rate)}</td>
                <td className="py-2 text-right font-medium">
                  {money(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-56 space-y-1 text-sm">
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

        {hasBankDetails && (
          <div className="border-t pt-4 text-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Payment details
            </p>
            {bankAccountName && <p className="mt-1">Account holder: {bankAccountName}</p>}
            {bankName && <p>Bank: {bankName}</p>}
            {iban && <p>IBAN: {iban}</p>}
            {bankAddress && <p>Address: {bankAddress}</p>}
            {bankPhone && <p>Phone: {bankPhone}</p>}
          </div>
        )}

        {invoice.notes && (
          <p className="border-t pt-4 text-sm text-muted-foreground">
            {invoice.notes}
          </p>
        )}
      </div>
    </div>
  );
}
