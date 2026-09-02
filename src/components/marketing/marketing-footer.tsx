import Link from "next/link";
import Image from "next/image";

const PRODUCT_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

const ACCOUNT_LINKS = [
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Get Started" },
];

const LEGAL_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-border bg-secondary/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="group flex items-center gap-2">
              <Image
                src="/brand/logo-icon-charcoal.png"
                alt="FORCOACH"
                width={26}
                height={26}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-heading text-base font-semibold">
                FORCOACH
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The operating system for instructors teaching across multiple
              studios. Manage. Grow. Inspire.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-heading text-xs font-semibold tracking-wide text-foreground/70 uppercase">
              Product
            </div>
            {PRODUCT_LINKS.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-heading text-xs font-semibold tracking-wide text-foreground/70 uppercase">
              Account
            </div>
            {ACCOUNT_LINKS.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} FORCOACH. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
