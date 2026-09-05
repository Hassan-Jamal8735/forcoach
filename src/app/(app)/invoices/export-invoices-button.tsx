"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function downloadZip(year: string) {
  const res = await fetch(`/api/invoices/export?year=${year}`);
  if (!res.ok) {
    let message = "Failed to export invoices.";
    try {
      const body = await res.json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // not JSON either; keep the generic message
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoices-${year}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ExportInvoicesButton({ years }: { years: number[] }) {
  const [year, setYear] = useState(String(years[0] ?? new Date().getFullYear()));
  const [isExporting, setIsExporting] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Select value={year} onValueChange={(v) => v && setYear(v)}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        disabled={isExporting}
        onClick={() => {
          setIsExporting(true);
          downloadZip(year)
            .then(() => toast(`Exported ${year} invoices`))
            .catch((err) => {
              const message =
                err instanceof Error ? err.message : "Failed to export invoices.";
              toast(message, "destructive");
            })
            .finally(() => setIsExporting(false));
        }}
      >
        <Download className="mr-1.5 size-4" />
        {isExporting ? "Exporting..." : "Export"}
      </Button>
    </div>
  );
}
