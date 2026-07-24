import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata: Metadata = {
  title: "Terms of Service — FORCOACH",
  description: "The terms that govern your use of FORCOACH.",
};

const LAST_UPDATED = "July 24, 2026";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="mt-10 max-w-none space-y-8 text-sm leading-relaxed text-foreground/90 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            <section>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your
                access to and use of FORCOACH (forcoach.io and the FORCOACH
                web application), operated by Combeau Aya Rose Mourtaday, a
                sole trader (entrepreneur individuel) registered in France
                under SIREN 104962998, registered address 38 Rue du
                Lieutenant Jean Vigneux, 95210 Saint-Gratien, France. By
                creating an account or using FORCOACH, you agree to these
                Terms.
              </p>
            </section>

            <section>
              <h2>1. What FORCOACH is</h2>
              <p>
                FORCOACH is a tool for independent fitness instructors to
                track their class schedule across multiple studios,
                calculate hours and earnings, and generate invoices.
                FORCOACH is currently in early access and features continue
                to be added.
              </p>
            </section>

            <section>
              <h2>2. Your account</h2>
              <ul>
                <li>
                  You must provide accurate information when creating an
                  account and keep your login credentials secure.
                </li>
                <li>
                  You&apos;re responsible for all activity that happens under
                  your account.
                </li>
                <li>
                  You must be old enough to legally enter into these Terms
                  in your jurisdiction.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use FORCOACH for any unlawful purpose or in violation of
                  these Terms.
                </li>
                <li>
                  Attempt to gain unauthorized access to other users&apos;
                  accounts or data.
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of
                  the service.
                </li>
                <li>
                  Reverse engineer or attempt to extract the source code of
                  the service, except where permitted by law.
                </li>
              </ul>
            </section>

            <section>
              <h2>4. Connecting third-party services</h2>
              <p>
                FORCOACH lets you optionally connect a Google Calendar
                account to import your class schedule. When you do, you
                authorize FORCOACH to access that data as described in our{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                . You&apos;re responsible for the Google account you connect
                and for revoking access if you no longer want FORCOACH to
                sync from it.
              </p>
            </section>

            <section>
              <h2>5. Your data</h2>
              <p>
                You own the studio, schedule, and business data you enter
                into or import into FORCOACH. We only use it to provide the
                service to you, as described in our{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2>6. Pricing during early access</h2>
              <p>
                FORCOACH is currently free to use during early access. If we
                introduce paid pricing in the future, we&apos;ll give you
                advance notice before any charges apply, you won&apos;t be
                billed without warning.
              </p>
            </section>

            <section>
              <h2>7. Service availability</h2>
              <p>
                We aim to keep FORCOACH available and reliable, but we
                don&apos;t guarantee the service will be uninterrupted or
                error-free. Features may change as the product evolves,
                especially during this early-access period.
              </p>
            </section>

            <section>
              <h2>8. Termination</h2>
              <p>
                You may stop using FORCOACH and request deletion of your
                account at any time by contacting{" "}
                <a href="mailto:contact@forcoach.io">contact@forcoach.io</a>.
                We may suspend or terminate accounts that violate these
                Terms.
              </p>
            </section>

            <section>
              <h2>9. Disclaimer and limitation of liability</h2>
              <p>
                FORCOACH is provided &ldquo;as is&rdquo; without warranties
                of any kind. Hours, earnings, and invoice calculations are
                based on the data you provide and connect, you&apos;re
                responsible for reviewing them for accuracy before relying on
                them, particularly for tax or financial purposes. To the
                fullest extent permitted by law, FORCOACH is not liable for
                indirect, incidental, or consequential damages arising from
                your use of the service.
              </p>
            </section>

            <section>
              <h2>10. Changes to these Terms</h2>
              <p>
                We may update these Terms as FORCOACH evolves. If we make
                material changes, we&apos;ll update the &ldquo;Last
                updated&rdquo; date above.
              </p>
            </section>

            <section>
              <h2>11. Governing law</h2>
              <p>
                These Terms are governed by French law. Any dispute arising
                from these Terms or your use of FORCOACH that cannot be
                resolved informally will be subject to the exclusive
                jurisdiction of the French courts, without prejudice to any
                mandatory consumer-protection rights you may have under the
                law of your own country of residence if applicable.
              </p>
            </section>

            <section>
              <h2>12. Contact us</h2>
              <p>
                Questions about these Terms? Email us at{" "}
                <a href="mailto:contact@forcoach.io">contact@forcoach.io</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
