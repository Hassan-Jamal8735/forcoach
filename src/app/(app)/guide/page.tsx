import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type GuideSection = {
  id: string;
  question: string;
  content: React.ReactNode;
};

type GuideGroup = {
  id: string;
  title: string;
  description?: string;
  sections: GuideSection[];
};

/**
 * Help centre content. Grouped so a coach can find the answer to a specific
 * problem ("why is my class missing?") rather than reading a manual top to
 * bottom.
 */
const GROUPS: GuideGroup[] = [
  {
    id: "getting-started",
    title: "Getting started",
    description: "Three steps from signing up to your first invoice.",
    sections: [
      {
        id: "step-1-account",
        question: "1. Create your account",
        content: (
          <div className="space-y-2">
            <p>
              Sign up with your email and a password, or use{" "}
              <strong>Continue with Google</strong>. If you sign up with Google
              you won&apos;t have a password at first — you can set one later
              under <strong>Settings &rarr; Account</strong> if you&apos;d like
              to log in both ways.
            </p>
            <p>
              In <strong>Settings</strong>, set your time zone and currency.
              These affect how your classes and earnings are displayed
              everywhere else, so it&apos;s worth doing first.
            </p>
          </div>
        ),
      },
      {
        id: "step-2-calendar",
        question: "2. Connect your calendar",
        content: (
          <div className="space-y-2">
            <p>
              Go to{" "}
              <Link href="/settings" className="text-accent hover:underline">
                Settings
              </Link>
              , under <strong>Where your classes come from</strong>. You have
              two options:
            </p>
            <ul>
              <li>
                <strong>Google Calendar</strong> — connect once and your classes
                sync automatically, every 6 hours, plus a manual
                &ldquo;Sync now&rdquo; whenever you want.
              </li>
              <li>
                <strong>ICS feed</strong> — if your studio platform (Mindbody,
                bsport, and most others) gives you a calendar link, paste it
                here.
              </li>
            </ul>
            <p>
              You only ever set this up once. After that your classes appear on
              the Calendar page on their own.
            </p>
          </div>
        ),
      },
      {
        id: "step-3-studios",
        question: "3. Set up your studios",
        content: (
          <div className="space-y-2">
            <p>
              Once your classes are in, open{" "}
              <Link href="/studios" className="text-accent hover:underline">
                Studios
              </Link>
              . FORCOACH reads the location on your imported classes and offers
              the places it found, something like{" "}
              <em>&ldquo;We found 2 places in your classes&rdquo;</em>.
            </p>
            <p>
              Check the names, add the rate you&apos;re paid at each one, and
              click create. Your classes are assigned to those studios
              immediately — you don&apos;t have to do it class by class.
            </p>
            <p>
              If nothing is detected (some calendars don&apos;t include a
              location), just use <strong>Add studio</strong> and enter it
              yourself.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Where your classes live, and how to change them.",
    sections: [
      {
        id: "how-classes-arrive",
        question: "How classes get in",
        content: (
          <div className="space-y-2">
            <p>Four ways, all landing in the same place:</p>
            <ul>
              <li>
                <strong>Automatic sync</strong> from a connected Google Calendar
                or ICS feed.
              </li>
              <li>
                <strong>Upload .ics</strong> — a calendar file exported from
                your studio platform. Unlike a live feed this brings in{" "}
                <em>past</em> classes too, so it&apos;s the way to fill in
                history.
              </li>
              <li>
                <strong>Import CSV</strong> — good for bulk history from a
                spreadsheet.
              </li>
              <li>
                <strong>Add event</strong> — one class at a time, for
                one-offs.
              </li>
            </ul>
            <p>
              Once a class is in FORCOACH it stays permanently. Syncing only
              ever adds and updates, it never deletes, so logging out or
              reconnecting won&apos;t lose anything.
            </p>
          </div>
        ),
      },
      {
        id: "finding-feed-link",
        question: "Finding your calendar export link",
        content: (
          <div className="space-y-3">
            <p>
              Each booking platform calls this something slightly different,
              but the idea is the same: it gives you a link ending in{" "}
              <code>.ics</code> that you paste into{" "}
              <Link href="/settings" className="text-accent hover:underline">
                Settings
              </Link>{" "}
              under ICS Feeds.
            </p>
            <div>
              <p className="font-medium text-foreground">Mindbody</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>
                  Open the <strong>Mindbody Business</strong> app — not the
                  regular Mindbody app clients use to book classes.
                </li>
                <li>
                  Log in with your <strong>staff</strong> login. This
                  won&apos;t appear on an owner login, even if you also
                  teach.
                </li>
                <li>
                  Tap <strong>More &rarr; Settings</strong>, scroll to{" "}
                  <strong>Schedule</strong>, and tap{" "}
                  <strong>Export My Schedule</strong>.
                </li>
                <li>
                  Tap <strong>Copy Link</strong>, then paste it into
                  FORCOACH.
                </li>
              </ol>
              <p className="mt-1 text-xs">
                This syncs per studio, so repeat it for each Mindbody studio
                you teach at.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Bsport</p>
              <p>
                Look under your <strong>Settings</strong> or{" "}
                <strong>Calendar</strong> section for an export or sync
                option, and copy the link it gives you.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">
                Other platforms
              </p>
              <p>
                Check <strong>Settings</strong> for wording like{" "}
                <strong>&ldquo;Export calendar&rdquo;</strong>,{" "}
                <strong>&ldquo;Sync calendar&rdquo;</strong>, or{" "}
                <strong>&ldquo;iCal / ICS link&rdquo;</strong>. Not finding
                it? Tell us which platform you use and we&apos;ll help you
                track it down.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "editing-classes",
        question: "Editing and excluding classes",
        content: (
          <div className="space-y-2">
            <p>
              <strong>Edit</strong> on any class lets you change its title,
              time, studio, or set a one-off rate for that class.
            </p>
            <p>
              <strong>Exclude</strong> keeps a class on your calendar but leaves
              it out of earnings and invoices — useful for a class you covered
              unpaid, or one that was cancelled.
            </p>
            <p>
              To change several at once, tick them and use{" "}
              <strong>Assign to studio</strong> or <strong>Delete</strong>.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "earnings",
    title: "Earnings",
    description: "How your rates turn into numbers.",
    sections: [
      {
        id: "how-rates-work",
        question: "How rates work",
        content: (
          <div className="space-y-2">
            <p>Each studio is paid one of two ways:</p>
            <ul>
              <li>
                <strong>Per hour</strong> — the rate is multiplied by the length
                of the class. A 90-minute class at 40 EUR/hour earns 60 EUR.
              </li>
              <li>
                <strong>Per class</strong> — a flat amount however long the
                class runs.
              </li>
            </ul>
            <p>
              Only classes <strong>assigned to a studio</strong> count. Anything
              unassigned or excluded is left out of every total, on purpose, so
              your figures never include something you haven&apos;t confirmed.
            </p>
            <p>
              Your <strong>Dashboard</strong> shows this month at a glance, and{" "}
              <strong>Earnings</strong> lets you switch between this month, this
              year, and all time, broken down per studio.
            </p>
          </div>
        ),
      },
      {
        id: "one-off-rates",
        question: "Charging a different rate for one class",
        content: (
          <p>
            Open the class, use <strong>Edit</strong>, and set{" "}
            <strong>Rate for this class</strong>. It overrides the studio&apos;s
            usual rate for that class only, and feeds both your earnings and any
            invoice it appears on. Leave it blank to go back to the studio rate.
          </p>
        ),
      },
    ],
  },
  {
    id: "invoices",
    title: "Invoices",
    description: "Creating, adjusting, and issuing.",
    sections: [
      {
        id: "create-invoice",
        question: "Creating an invoice",
        content: (
          <div className="space-y-2">
            <p>
              On <strong>Invoices</strong>, click <strong>New invoice</strong>,
              pick a studio and the period you&apos;re billing for. FORCOACH
              pulls in every assigned class in that range as a line item.
            </p>
            <p>
              It starts as a <strong>draft</strong>, which you can edit or
              delete freely. Nothing is final yet.
            </p>
          </div>
        ),
      },
      {
        id: "edit-draft",
        question: "Editing a draft before you send it",
        content: (
          <div className="space-y-2">
            <p>
              Click the invoice to open it. You&apos;ll see every class on it
              with its rate and amount.
            </p>
            <p>
              While it&apos;s a draft you can change the rate on any line, and
              the subtotal, VAT and total update as you go. Handy when a studio
              agreed something different for a particular class.
            </p>
          </div>
        ),
      },
      {
        id: "generate-invoice",
        question: "Generating and downloading",
        content: (
          <div className="space-y-2">
            <p>
              <strong>Generate</strong> gives the invoice a permanent number
              (like <code>FC-2026-001</code>) and locks it. After that the rates
              can&apos;t be changed and it can&apos;t be deleted, because
              it&apos;s a document you&apos;ve likely already sent.
            </p>
            <p>
              Then use <strong>Download PDF</strong> to get the branded invoice,
              and <strong>Archive</strong> to move older ones out of your active
              list.
            </p>
            <p>
              Your SIRET and default VAT rate come from{" "}
              <strong>Settings</strong>, and appear on the PDF if you&apos;ve
              set them.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "faq",
    title: "Common questions",
    sections: [
      {
        id: "faq-missing-class",
        question: "Why is one of my classes missing?",
        content: (
          <div className="space-y-2">
            <p>
              Almost always because it was never in the calendar we synced from.
              Some studio platforms drop a class from their feed once it has
              finished, so if you connect midway through the month, earlier
              classes may simply not be there to import.
            </p>
            <p>To bring them in:</p>
            <ul>
              <li>
                Export your past classes from your studio platform and use{" "}
                <strong>Upload .ics</strong>, which imports past classes.
              </li>
              <li>
                Or <strong>Import CSV</strong>, or add them with{" "}
                <strong>Add event</strong>.
              </li>
            </ul>
            <p>
              If a class is genuinely in your Google Calendar but not here, hit{" "}
              <strong>Sync now</strong>{" "}
              in Settings. And if the sync banner says
              the connection hasn&apos;t run in a while, reconnect it.
            </p>
          </div>
        ),
      },
      {
        id: "faq-unassigned",
        question: "Why isn't my class assigned to a studio?",
        content: (
          <div className="space-y-2">
            <p>
              FORCOACH matches a class to a studio by looking for the studio
              name in the class title or location. It won&apos;t match if the
              class doesn&apos;t mention it, or if it could equally belong to
              two studios — in that case it deliberately leaves it alone rather
              than risk putting it on the wrong invoice.
            </p>
            <p>Any of these will fix it:</p>
            <ul>
              <li>
                Use <strong>Auto-assign</strong> on the Calendar page to run
                matching over everything unassigned.
              </li>
              <li>
                Tick the classes and use <strong>Assign to studio</strong>.
              </li>
              <li>
                Edit the studio and add an <strong>extra matching word</strong>,
                for example the street name if that&apos;s how your classes
                refer to it.
              </li>
              <li>
                Set a <strong>default studio</strong> on your calendar
                connection in Settings, so anything unmatched goes there.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "faq-change-rate",
        question: "How do I change my rate?",
        content: (
          <div className="space-y-2">
            <p>Depends on what you want to change:</p>
            <ul>
              <li>
                <strong>For a studio, from now on</strong> — Studios,{" "}
                <strong>Edit</strong>, change the rate. This affects future
                calculations. Invoices you&apos;ve already generated keep the
                rate they were issued with.
              </li>
              <li>
                <strong>For one class</strong> — edit the class and set{" "}
                <strong>Rate for this class</strong>.
              </li>
              <li>
                <strong>On a draft invoice</strong> — open the invoice and edit
                the rate on that line.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "faq-empty-invoice",
        question: "Why is my invoice empty?",
        content: (
          <p>
            Invoices only include classes that are assigned to that studio and
            fall inside the period you chose. If it comes back empty, check
            those classes aren&apos;t still unassigned — the Calendar page will
            show an <strong>Auto-assign</strong> button whenever some are.
          </p>
        ),
      },
      {
        id: "faq-support",
        question: "Something else?",
        content: (
          <p>
            This guide grows alongside the product. If something isn&apos;t
            covered, get in touch with your FORCOACH contact and we&apos;ll help
            directly — and tell us what you were looking for, so we can add it
            here.
          </p>
        ),
      },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Help Centre</h1>
        <p className="text-muted-foreground mt-1">
          How to set FORCOACH up and get the most out of it.
        </p>
      </div>

      {GROUPS.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle className="text-base">{group.title}</CardTitle>
            {group.description && (
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <Accordion className="w-full">
              {group.sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-left">
                    {section.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-foreground [&_strong]:font-medium">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
