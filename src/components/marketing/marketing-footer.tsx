import Link from "next/link";
import Image from "next/image";

// lucide-react dropped brand/logo icons (trademark reasons), so these two
// are simple inline SVGs rather than a lucide import.
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/forcoachapp?stkn=dnp3N2s3cGdyeWpx",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://www.linkedin.com/company/forcoach/",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
];

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
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
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
