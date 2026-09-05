"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/nav-items";

export function MobileNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-border bg-sidebar text-sidebar-foreground px-1 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
      {items.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-11 min-w-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 active:bg-sidebar-accent/40",
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
