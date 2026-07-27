"use client";

import { useState, useTransition } from "react";
import { generateInvoice, archiveInvoice, deleteInvoice } from "./actions";
import type { Invoice } from "@/lib/api/invoices";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {invoice.status !== "draft" && (
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<a href={`/api/invoices/${invoice.id}/pdf`} download />}
        >
          Download PDF
        </Button>
      )}

      {invoice.status === "draft" && (
        <>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="sm" disabled={isPending}>
                  Generate
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Generate this invoice?</AlertDialogTitle>
                <AlertDialogDescription>
                  This assigns a permanent invoice number and locks the
                  invoice — it can no longer be edited or deleted afterward.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    startTransition(async () => {
                      const result = await generateInvoice(invoice.id);
                      if (result.error) setError(result.error);
                    });
                  }}
                >
                  Generate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" size="sm" className="text-destructive">
                  Delete
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    startTransition(async () => {
                      const result = await deleteInvoice(invoice.id);
                      if (result.error) setError(result.error);
                    });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {invoice.status === "generated" && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="outline" size="sm" disabled={isPending}>
                Archive
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive this invoice?</AlertDialogTitle>
              <AlertDialogDescription>
                Archived invoices stay on record but are moved out of the
                active list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={(e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    const result = await archiveInvoice(invoice.id);
                    if (result.error) setError(result.error);
                  });
                }}
              >
                Archive
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {error && <p className="text-xs text-destructive w-full">{error}</p>}
    </div>
  );
}
