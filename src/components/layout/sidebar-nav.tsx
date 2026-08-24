"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/nav-items";
import { logout } from "@/app/(auth)/actions";

export function SidebarNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const linkClass = (isActive: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
    );

  // The admin account is a separate experience entirely, not the coach app
  // with an extra link bolted on — so it gets its own nav, not NAV_ITEMS.
  const items = isAdmin ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  return (
    // Pinned to the viewport rather than growing with the page, so the nav and
    // the footer below it stay put on long pages like the Help Centre.
    <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-6">
        <Image
          src="/brand/logo-icon-transparent.png"
          alt="FORCOACH"
          width={32}
          height={32}
        />
        <span className="font-heading text-lg font-semibold tracking-wide">
          FORCOACH{isAdmin && <span className="text-accent"> Admin</span>}
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={linkClass(isActive)}>
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-sidebar-foreground/10 px-3 py-3">
        {!isAdmin && (
          <>
            <Link
              href="/support"
              className={linkClass(pathname.startsWith("/support"))}
            >
              <MessageCircle className="size-4" />
              Support
            </Link>
            <Link
              href="/guide"
              className={linkClass(pathname.startsWith("/guide"))}
            >
              <BookOpen className="size-4" />
              Help Centre
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={() => logout()}
          className={cn(linkClass(false), "w-full cursor-pointer")}
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
      <div className="px-6 py-4 text-xs text-sidebar-foreground/50">
        Manage. Grow. Inspire.
      </div>
    </aside>
  );
}
