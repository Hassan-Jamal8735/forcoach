export type CurrencyCode = "EUR" | "USD";

export const SUPPORTED_CURRENCIES: {
  code: CurrencyCode;
  label: string;
  symbol: string;
}[] = [
  { code: "EUR", label: "EUR (€)", symbol: "€" },
  { code: "USD", label: "USD ($)", symbol: "$" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "EUR";

export function toCurrencyCode(value: unknown): CurrencyCode {
  return value === "USD" ? "USD" : DEFAULT_CURRENCY;
}

export function currencySymbol(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code)?.symbol ?? "€";
}

// One locale everywhere on purpose. The app previously mixed en-US on the
// dashboard with fr-FR on invoices, so the same amount rendered two different
// ways depending on the page.
export function formatCurrency(value: number, code: CurrencyCode): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
  }).format(value);
}
