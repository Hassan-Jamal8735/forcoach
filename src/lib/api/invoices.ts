export type InvoiceStatus = "draft" | "generated" | "archived";

export type Invoice = {
  id: string;
  user_id: string;
  studio_id: string | null;
  studio_name: string;
  period_start: string;
  period_end: string;
  invoice_number: string | null;
  issue_date: string | null;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  vat_rate: number | null;
  vat_amount: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InvoiceLineItem = {
  id: string;
  invoice_id: string;
  user_id: string;
  event_id: string | null;
  title: string;
  event_date: string;
  hours: number;
  rate: number;
  compensation_type: "hourly" | "per_class";
  amount: number;
  created_at: string;
};

export type InvoiceDetail = {
  invoice: Invoice;
  lineItems: InvoiceLineItem[];
};

export type CreateInvoiceInput = {
  studioId: string;
  periodStart: string;
  periodEnd: string;
  dueDate?: string;
  vatRate?: number;
};
