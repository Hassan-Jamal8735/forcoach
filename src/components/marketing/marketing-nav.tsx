"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Absolute (/#...) rather than bare (#...) so these still work from /privacy
// and /terms — a bare fragment just sets the hash on the current page, which
// has no such section to scroll to.
const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

const PAGE_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md transition-shadow duration-300",
        scrolled
          ? "border-border shadow-sm"
          : "border-transparent shadow-none",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/brand/logo-icon-charcoal.png"
            alt=""
            width={40}
            height={40}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            FORCOACH
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
          {PAGE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-1 transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/login">Log in</Link>}
          />
          <Button
            nativeButton={false}
            render={<Link href="/register">Get Started</Link>}
            className="transition-transform duration-200 hover:-translate-y-0.5"
          />
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md text-foreground sm:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border transition-[max-height] duration-300 ease-out sm:hidden",
          menuOpen ? "max-h-60" : "max-h-0 border-t-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          {PAGE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 px-2">
            <Button
              variant="ghost"
              nativeButton={false}
              className="flex-1"
              render={<Link href="/login">Log in</Link>}
            />
            <Button
              nativeButton={false}
              className="flex-1"
              render={<Link href="/register">Get Started</Link>}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
