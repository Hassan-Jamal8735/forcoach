"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { runGlobalSearch } from "./search-actions";
import type { SearchResultItem, SearchResults } from "@/lib/api/search";

const EMPTY: SearchResults = { studios: [], events: [], invoices: [] };
const DEBOUNCE_MS = 250;

const SECTIONS: { key: keyof SearchResults; label: string }[] = [
  { key: "studios", label: "Studios" },
  { key: "events", label: "Events" },
  { key: "invoices", label: "Invoices" },
];

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open || !query.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        setResults(await runGlobalSearch(query));
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, open]);

  function go(item: SearchResultItem) {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    router.push(item.href);
  }

  const displayed = query.trim() ? results : EMPTY;
  const hasResults =
    displayed.studios.length > 0 ||
    displayed.events.length > 0 ||
    displayed.invoices.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/10 md:flex"
      >
        <Search className="size-4" />
        <span>Search...</span>
        <kbd className="ml-4 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
          &#8984;K
        </kbd>
      </button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setQuery("");
            setResults(EMPTY);
          }
        }}
      >
        <DialogContent className="top-24 translate-y-0 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Search studios, events, invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-80 overflow-y-auto">
            {query.trim() && !isPending && !hasResults && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}
            {SECTIONS.map(({ key, label }) => {
              const items = displayed[key];
              if (items.length === 0) return null;
              return (
                <div key={key} className="py-2">
                  <p className="px-1 pb-1 text-xs font-medium text-muted-foreground">
                    {label}
                  </p>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go(item)}
                      className="flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent/10"
                    >
                      <span className="font-medium">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {item.subtitle}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
