import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type GuideSection = {
  id: string;
  question: string;
  status?: "available" | "soon";
  content: React.ReactNode;
};

const SECTIONS: GuideSection[] = [
  {
    id: "getting-started",
    question: "Getting started",
    status: "available",
    content: (
      <div className="space-y-2">
        <p>
          FORCOACH centralizes your coaching schedule, tracks your hours and
          earnings across every studio you work with, and generates
          professional invoices — no spreadsheets required.
        </p>
        <p>
          Start by adding the studios you coach at (with their pay rate),
          then import your classes from Calendar. Your hours, earnings, and
          invoices all calculate automatically from that same data — no
          re-entering anything.
        </p>
      </div>
    ),
  },
  {
    id: "studios",
    question: "Managing studios",
    status: "available",
    content: (
      <div className="space-y-2">
        <p>
          Go to <strong>Studios</strong> and click <strong>Add studio</strong>{" "}
          to create one. Each studio needs a name and a compensation rate —
          either an <strong>hourly rate</strong> or a{" "}
          <strong>per-class rate</strong>, whichever matches how that studio
          pays you.
        </p>
        <p>
          Optional fields (contact person, email, phone, address, reference
          ID, notes) help you keep everything in one place, but only the name
          and rate are required.
        </p>
        <p>
          If you stop coaching somewhere but want to keep its history, set
          its status to <strong>Inactive</strong> instead of deleting it —
          inactive studios are hidden from new scheduling but keep all their
          past records. Use <strong>Edit</strong> or <strong>Delete</strong>{" "}
          on any studio card to make changes.
        </p>
      </div>
    ),
  },
  {
    id: "profile",
    question: "Your profile and account",
    status: "available",
    content: (
      <div className="space-y-2">
        <p>
          Under <strong>Settings</strong>, you can update your full name,
          time zone, and currency preference (currency is EUR-only for now),
          as well as your <strong>SIRET</strong> and{" "}
          <strong>default VAT rate</strong> — both optional, and used to
          pre-fill new invoices and appear on the generated PDF.
        </p>
        <p>
          Under the <strong>Account</strong> section on the same page, you
          can change your password at any time without needing to log out
          first. If you signed up with Google, you can set a password here
          too, so you can log in either way.
        </p>
      </div>
    ),
  },
  {
    id: "calendar",
    question: "Calendar & schedule imports",
    status: "available",
    content: (
      <div className="space-y-2">
        <p>
          Go to <strong>Calendar</strong> to bring in your classes: connect
          your <strong>Google Calendar</strong> for automatic syncing (every 6
          hours, plus a manual &ldquo;Sync now&rdquo; anytime), add an{" "}
          <strong>ICS feed</strong> link if your studio provides one (e.g.
          Bsport, Mindbody), or use <strong>Import CSV</strong> for a one-off
          upload — you&apos;ll see a preview before anything is added either
          way.
        </p>
        <p>
          Switch between <strong>List</strong>, <strong>Month</strong>,{" "}
          <strong>Week</strong>, and <strong>Day</strong> views, and filter by
          studio or search by title. Each event can be assigned to a studio,
          edited, excluded from earnings, or deleted.
        </p>
      </div>
    ),
  },
  {
    id: "earnings",
    question: "Dashboard & earnings",
    status: "available",
    content: (
      <div className="space-y-2">
        <p>
          Your <strong>Dashboard</strong> and <strong>Earnings</strong> pages
          calculate hours and earnings automatically from your assigned
          classes — hourly rate × hours, or a flat per-class rate — broken
          down by studio, with a monthly income chart and a{" "}
          <strong>This month / This year / All time</strong> range toggle.
        </p>
        <p>
          Only classes assigned to a studio count toward your totals.
          Unassigned or excluded classes never affect earnings — assign or
          exclude them from the <strong>Calendar</strong> page.
        </p>
      </div>
    ),
  },
  {
    id: "invoices",
    question: "Invoices",
    status: "available",
    content: (
      <div className="space-y-2">
        <p>
          Go to <strong>Invoices → New invoice</strong>, pick a studio and
          billing period, and FORCOACH pulls in every assigned class in that
          range as a line item, with VAT applied if you&apos;ve set a rate.
        </p>
        <p>
          A new invoice starts as a <strong>Draft</strong> — editable and
          deletable. Click <strong>Generate</strong> to lock it in with a
          permanent sequential number (e.g. <code>FC-2026-001</code>); from
          there it&apos;s immutable, and you can <strong>Download PDF</strong>{" "}
          or <strong>Archive</strong> it.
        </p>
      </div>
    ),
  },
  {
    id: "support",
    question: "Need more help?",
    content: (
      <p>
        This guide will keep growing alongside the product. If something
        isn&apos;t covered here, reach out to your FORCOACH contact and
        we&apos;ll help directly.
      </p>
    ),
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">User Guide</h1>
        <p className="text-muted-foreground mt-1">
          Everything you need to know to get the most out of FORCOACH.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Frequently asked questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion className="w-full">
            {SECTIONS.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    {section.question}
                    {section.status === "soon" && (
                      <Badge variant="outline" className="font-normal">
                        Coming soon
                      </Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
