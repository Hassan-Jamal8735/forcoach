import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — FORCOACH",
  description: "How FORCOACH collects, uses, and protects your data.",
};

const LAST_UPDATED = "July 29, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="theme-public flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="mt-10 max-w-none space-y-8 text-sm leading-relaxed text-foreground/90 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            <section>
              <p>
                FORCOACH (&ldquo;FORCOACH&rdquo;, &ldquo;we&rdquo;,
                &ldquo;us&rdquo;) provides a scheduling, earnings, and
                invoicing tool for independent fitness instructors who teach
                across multiple studios. This policy explains what
                information we collect through forcoach.io and the FORCOACH
                web application, how we use it, and the rights you have
                under the EU/French General Data Protection Regulation
                (GDPR) and French data protection law (Loi Informatique et
                Libertés).
              </p>
            </section>

            <section>
              <h2>1. Who operates FORCOACH (data controller)</h2>
              <p>
                FORCOACH is operated by a sole trader (entrepreneur
                individuel) registered in France under SIREN 104962998, which
                acts as the data controller for the personal data described in
                this policy. For any privacy question, to exercise your rights,
                or to request our full registered business details, contact{" "}
                <a href="mailto:contact@forcoach.io">contact@forcoach.io</a>.
              </p>
            </section>

            <section>
              <h2>2. Information we collect</h2>
              <p>We collect information in the following ways:</p>
              <ul>
                <li>
                  <strong>Account information</strong> you provide directly:
                  name, email address, password (stored securely by our
                  authentication provider, never in plain text), time zone,
                  and currency preference.
                </li>
                <li>
                  <strong>Studio and schedule data</strong> you enter
                  yourself: studio names, contact details, compensation
                  rates, and class/session details (title, date, time,
                  location, notes).
                </li>
                <li>
                  <strong>Schedule data you import</strong>, either by
                  uploading a CSV file or by connecting a Google Calendar
                  account (see Section 4 below for how Google data
                  specifically is handled).
                </li>
                <li>
                  <strong>Usage information</strong> collected automatically,
                  such as log data needed to operate and secure the service
                  (e.g. request timestamps, error logs). We do not use
                  third-party advertising trackers or sell any data to
                  advertisers.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. Legal basis for processing (GDPR Article 6)</h2>
              <p>We process your personal data on the following legal bases:</p>
              <ul>
                <li>
                  <strong>Performance of a contract</strong>: to create your
                  account and provide the core FORCOACH service (scheduling,
                  earnings, invoicing) you&apos;ve signed up for.
                </li>
                <li>
                  <strong>Consent</strong>: for optional features you
                  explicitly opt into, such as connecting Google Calendar.
                  You can withdraw this consent at any time by disconnecting
                  the integration.
                </li>
                <li>
                  <strong>Legitimate interest</strong>: to keep the service
                  secure, prevent misuse, and maintain essential operational
                  logs, balanced against your right to privacy.
                </li>
              </ul>
            </section>

            <section>
              <h2>4. Google Calendar data specifically</h2>
              <p>
                If you choose to connect Google Calendar, FORCOACH requests
                read-only access
                (<code>https://www.googleapis.com/auth/calendar.readonly</code>)
                to a calendar you select. We use this access solely to:
              </p>
              <ul>
                <li>
                  List the calendars available in your Google account so you
                  can choose which one to sync from.
                </li>
                <li>
                  Read event details (title, start/end time, location,
                  description) from the calendar you select, in order to
                  create matching class entries inside FORCOACH.
                </li>
              </ul>
              <p>FORCOACH&apos;s use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
              <p>Specifically:</p>
              <ul>
                <li>
                  We <strong>never write to, modify, or delete</strong>{" "}
                  anything in your Google Calendar. Access is read-only.
                </li>
                <li>
                  Google data is used exclusively to display and manage your
                  class schedule inside FORCOACH. We do not use it for
                  advertising, and we do not sell it or share it with any
                  third party.
                </li>
                <li>
                  We do not use Google user data to train generalized AI or
                  machine learning models.
                </li>
                <li>
                  You can disconnect Google Calendar at any time from the
                  Calendar page inside the app, which stops future syncing.
                  You can also fully revoke FORCOACH&apos;s access at any
                  time from your{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Account permissions page
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2>5. How we use your information</h2>
              <ul>
                <li>To provide, operate, and maintain the FORCOACH service.</li>
                <li>
                  To calculate your hours, earnings, and generate invoices
                  based on the schedule and studio data you provide.
                </li>
                <li>
                  To communicate with you about your account, such as
                  password resets or important service notices.
                </li>
                <li>To keep the service secure and prevent misuse.</li>
              </ul>
            </section>

            <section>
              <h2>6. Where your data is stored and international transfers</h2>
              <p>
                Your account and application data is stored with Supabase,
                our database and authentication provider, over encrypted
                connections. Emails (such as password resets) are sent via
                our transactional email provider. These providers act as our
                data processors and only handle data as needed to operate
                FORCOACH.
              </p>
              <p>
                As FORCOACH grows, our hosting infrastructure may change,
                including a potential move to servers we manage directly. If
                any future change involves transferring data outside the
                EU/EEA, we&apos;ll update this policy to name the specific
                safeguard relied on for that transfer, such as the European
                Commission&apos;s Standard Contractual Clauses, before that
                change takes effect.
              </p>
            </section>

            <section>
              <h2>7. Security measures and data protection mechanisms</h2>
              <p>
                We apply the following technical and organizational measures
                to protect your personal data, including sensitive data such
                as your Google Calendar schedule details and financial
                information used to calculate earnings and invoices:
              </p>
              <ul>
                <li>
                  <strong>Encryption in transit</strong>: all traffic between
                  your browser, the FORCOACH application, and our backend is
                  encrypted using HTTPS/TLS. We do not transmit personal data
                  over unencrypted connections.
                </li>
                <li>
                  <strong>Encryption at rest</strong>: your account and
                  application data is stored in Supabase, which encrypts
                  data at rest at the infrastructure level.
                </li>
                <li>
                  <strong>Access controls</strong>: our database enforces
                  row-level security so that each account can only read or
                  write its own data — one coach can never query another
                  coach&apos;s schedule, earnings, or invoices, even in the
                  event of an application bug. Internal access to production
                  data is restricted to what is strictly necessary to
                  operate and support the service.
                </li>
                <li>
                  <strong>Authentication security</strong>: passwords are
                  hashed by our authentication provider and are never stored
                  or logged in plain text. Sessions use short-lived,
                  signed tokens.
                </li>
                <li>
                  <strong>Minimal third-party access</strong>: the Google
                  Calendar integration requests read-only access to a single
                  calendar you choose, and OAuth tokens are stored encrypted
                  and used only for the syncing described in Section 4.
                </li>
                <li>
                  <strong>Data minimization</strong>: we only collect the
                  data described in Section 2 and do not request access
                  beyond what FORCOACH&apos;s features require.
                </li>
              </ul>
              <p>
                If we become aware of a data breach affecting your personal
                data, we will notify affected users and, where required, the
                CNIL, in line with our obligations under the GDPR.
              </p>
            </section>

            <section>
              <h2>8. Data retention and deletion</h2>
              <p>
                We retain your account and schedule data for as long as your
                account is active. If you&apos;d like your account and
                associated data deleted, contact us at{" "}
                <a href="mailto:contact@forcoach.io">contact@forcoach.io</a>{" "}
                and we will delete it, other than records we&apos;re legally
                required to keep.
              </p>
            </section>

            <section>
              <h2>9. Cookies</h2>
              <p>
                FORCOACH uses only the essential cookies needed to keep you
                signed in and to remember basic preferences. We do not use
                third-party advertising or tracking cookies, and because
                these cookies are strictly necessary for the service to
                function, they do not require separate consent under the
                ePrivacy Directive.
              </p>
            </section>

            <section>
              <h2>10. Your rights</h2>
              <p>
                Under the GDPR and French data protection law, you have the
                right to:
              </p>
              <ul>
                <li>
                  <strong>Access</strong> the personal data we hold about
                  you.
                </li>
                <li>
                  <strong>Rectify</strong> inaccurate or incomplete data.
                </li>
                <li>
                  <strong>Erase</strong> your data (&ldquo;right to be
                  forgotten&rdquo;), subject to any legal retention
                  requirements.
                </li>
                <li>
                  <strong>Restrict</strong> or <strong>object to</strong>{" "}
                  certain processing of your data.
                </li>
                <li>
                  <strong>Port</strong> your data to another service in a
                  structured, commonly used format.
                </li>
                <li>
                  <strong>Withdraw consent</strong> at any time, for
                  processing based on consent (such as the Google Calendar
                  connection), without affecting the lawfulness of
                  processing before withdrawal.
                </li>
                <li>
                  <strong>Lodge a complaint</strong> with France&apos;s data
                  protection authority, the{" "}
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNIL (Commission Nationale de l&apos;Informatique et des
                    Libertés)
                  </a>
                  , if you believe your data protection rights have been
                  violated.
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:contact@forcoach.io">contact@forcoach.io</a>.
                We&apos;ll respond within the timeframe required by
                applicable law.
              </p>
            </section>

            <section>
              <h2>11. Children&apos;s privacy</h2>
              <p>
                FORCOACH is intended for use by adults operating a coaching
                business and is not directed at children. We do not
                knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2>12. Changes to this policy</h2>
              <p>
                We may update this policy as FORCOACH evolves. If we make
                material changes, we&apos;ll update the &ldquo;Last
                updated&rdquo; date above and, where appropriate, notify you
                directly.
              </p>
            </section>

            <section>
              <h2>13. Contact us</h2>
              <p>
                Questions about this policy or your data? Email us at{" "}
                <a href="mailto:contact@forcoach.io">contact@forcoach.io</a>.
              </p>
            </section>
          </div>

          <p className="mt-12 text-sm text-muted-foreground">
            See also our{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
