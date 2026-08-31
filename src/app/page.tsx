import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Building2,
  FileText,
  ArrowRight,
  X,
  Check,
  TrendingUp,
  Dumbbell,
  Zap,
  Wind,
  HelpCircle,
  MessageCircle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { DashboardMock } from "@/components/marketing/dashboard-mock";
import { EarningsMock } from "@/components/marketing/earnings-mock";
import { StudiosMock } from "@/components/marketing/studios-mock";
import { Reveal } from "@/components/marketing/reveal";
import { HeroBackground } from "@/components/marketing/hero-background";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Unified calendar",
    description:
      "Connect your Google Calendar or upload a CSV, and see every class from every studio in one place.",
  },
  {
    icon: Clock,
    title: "Automatic hours tracking",
    description:
      "Every class you teach is timed and totaled automatically: daily, weekly, monthly, and per studio.",
  },
  {
    icon: Building2,
    title: "Multi-studio compensation",
    description:
      "Set an hourly or per-class rate for each studio you work with, and your earnings calculate themselves.",
  },
  {
    icon: FileText,
    title: "One-click invoices",
    description:
      "Generate a branded, professional invoice for any studio and billing period, ready to send.",
  },
];

const WITHOUT = [
  "A different app or spreadsheet for every studio you teach at",
  "Manually adding up hours from memory or scattered calendars",
  "Guessing your monthly income until you sit down and calculate it",
  "Building each invoice from scratch, studio by studio",
];

const WITH = [
  "One account, every studio, one unified schedule",
  "Hours tracked and totaled automatically as classes happen",
  "Real-time earnings, broken down by studio and month",
  "A branded invoice generated in one click, ready to send",
];

const STEPS = [
  {
    number: "01",
    icon: Building2,
    title: "Add your studios",
    description: "Enter the studios you coach at and how each one pays you.",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Import your schedule",
    description: "Connect Google Calendar or upload a CSV of your classes.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Track earnings automatically",
    description: "Hours and income update themselves as your schedule changes.",
  },
  {
    number: "04",
    icon: FileText,
    title: "Generate invoices",
    description: "Pick a studio and date range, and download a ready invoice.",
  },
];

const PRICING_INCLUDED = [
  { icon: Building2, text: "Unlimited studios and classes" },
  { icon: CalendarDays, text: "Automatic calendar sync (Google Calendar or CSV)" },
  { icon: TrendingUp, text: "Earnings tracking, per studio and overall" },
  { icon: FileText, text: "Unlimited branded invoices" },
];

const PRICING_TRUST = [
  { icon: ShieldCheck, text: "Payments secured by Stripe" },
  { icon: CreditCard, text: "Cancel anytime, no lock-in" },
  { icon: Check, text: "No setup fees, no hidden costs" },
];

const AUDIENCE = [
  {
    tag: "Pilates",
    icon: Dumbbell,
    description: "Reformer, mat, and tower classes across multiple studios.",
  },
  {
    tag: "Lagree",
    icon: Zap,
    description: "High-intensity megaformer sessions, tracked studio by studio.",
  },
  {
    tag: "Yoga",
    icon: Wind,
    description: "Vinyasa, hatha, or hot yoga, every class, every location.",
  },
];

const FAQ = [
  {
    icon: Building2,
    question: "Do I need a separate account for each studio?",
    answer:
      "No. One FORCOACH account holds all of your studios, each with its own compensation rate, in one place.",
  },
  {
    icon: Clock,
    question: "What if two studios pay me differently?",
    answer:
      "Each studio has its own rate, hourly or per-class, so your earnings calculate correctly no matter how each one pays you.",
  },
  {
    icon: CalendarDays,
    question: "Can I import my existing schedule?",
    answer:
      "Yes. You'll be able to connect Google Calendar directly or upload a CSV export of your classes.",
  },
  {
    icon: Check,
    question: "Is my data private?",
    answer:
      "Yes. Your schedules, studios, and earnings are only ever visible to you.",
  },
  {
    icon: Building2,
    question: "Is this for personal trainers with their own clients?",
    answer:
      "No. FORCOACH is built specifically for instructors teaching group classes across multiple studios (Pilates, Lagree, yoga, and similar). If you run one-on-one personal training with your own client base, a dedicated PT platform will serve you better.",
  },
  {
    icon: HelpCircle,
    question: "What does it cost?",
    answer:
      "€9/month during early access, one plan with everything included. Payment is handled securely through Stripe, and you can cancel anytime.",
  },
];

export default function Home() {
  return (
    <div className="theme-public flex min-h-screen flex-col bg-background">
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <HeroBackground />
          <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24">
            <Reveal>
              <Badge variant="secondary" className="mb-6">
                One schedule. One invoice. Every studio.
              </Badge>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                The operating system for instructors teaching across multiple studios
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Track your classes across every studio, calculate your earnings
                automatically, and generate professional invoices. Focus on
                coaching, not paperwork.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="group"
                  render={
                    <Link href="/register">
                      Get started — €9/month
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Early access pricing. Secure payment via Stripe, cancel
                  anytime.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Dashboard mock */}
        <section className="px-4 pb-20 sm:px-6">
          <Reveal delay={150}>
            <DashboardMock />
          </Reveal>
        </section>

        {/* Without / With comparison */}
        <section className="border-y border-border bg-secondary/40 px-4 py-16 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold">
              You didn&apos;t become a coach to do spreadsheets
            </h2>
            <p className="mt-3 text-muted-foreground">
              Coaching across multiple studios shouldn&apos;t mean juggling
              multiple systems.
            </p>
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6 transition-shadow duration-300 hover:shadow-md">
              <div className="font-heading text-sm font-semibold text-muted-foreground">
                Without FORCOACH
              </div>
              <ul className="mt-4 space-y-3">
                {WITHOUT.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-accent/30 bg-background p-6 transition-shadow duration-300 hover:shadow-md">
              <div className="font-heading text-sm font-semibold text-accent">
                With FORCOACH
              </div>
              <ul className="mt-4 space-y-3">
                {WITH.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold">
              Everything your coaching business needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              One place for your schedule, your hours, your earnings, and
              your invoices.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 80}>
                <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
                  <CardHeader>
                    <feature.icon className="size-5 text-accent transition-transform duration-300 group-hover:scale-110" />
                    <CardTitle className="mt-2 text-base">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Studio management detail row */}
        <section className="border-y border-border bg-secondary/40 px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-heading text-3xl font-semibold">
                Manage every studio in one place
              </h2>
              <p className="mt-4 text-muted-foreground">
                Add each studio you coach at with its own contact details and
                pay rate. Mixing hourly studios and per-class studios is
                normal. FORCOACH handles both without extra setup.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  Hourly or per-class rates, set individually
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  Mark a studio inactive without losing its history
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  Contact info, notes, and reference IDs all in one card
                </li>
              </ul>
            </Reveal>
            <Reveal delay={150}>
              <StudiosMock />
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From first studio to first invoice in four steps.
            </p>
          </Reveal>
          <div className="relative mx-auto mt-14 max-w-5xl">
            <div
              aria-hidden
              className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block"
            />
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <Reveal key={step.number} delay={i * 100} className="group relative">
                  <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-card text-accent transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/50 group-hover:shadow-md">
                    <step.icon className="size-5" />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-foreground">
                      {step.number.replace("0", "")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings detail row */}
        <section className="border-y border-border bg-secondary/40 px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold">
              See your numbers, not just your schedule
            </h2>
            <p className="mt-3 text-muted-foreground">
              A real financial snapshot of your coaching business, updated
              automatically as you teach.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-12">
            <EarningsMock />
          </Reveal>
        </section>

        {/* Audience */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold">
              Built for coaches like you
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {AUDIENCE.map((item, i) => (
              <Reveal key={item.tag} delay={i * 80}>
                <div className="group flex items-start gap-4 rounded-xl border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold">
                      {item.tag}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="relative overflow-hidden border-y border-border bg-secondary/40 px-4 py-20 sm:px-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklch, var(--accent) 12%, transparent) 0%, transparent 100%)",
            }}
          />
          <Reveal className="relative mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mx-auto mb-4 w-fit">
              Pricing
            </Badge>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
              One plan. Everything included.
            </h2>
            <p className="mt-3 text-muted-foreground">
              No tiers to compare, no features locked behind a higher plan.
              Just what a coach across multiple studios actually needs.
            </p>
          </Reveal>

          <div className="relative mx-auto mt-14 grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <Reveal className="order-2 lg:order-1">
              <p className="text-sm font-medium text-accent">
                Less than the cost of covering one class
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold">
                Built to pay for itself with your first invoice
              </h3>
              <p className="mt-3 text-muted-foreground">
                FORCOACH replaces spreadsheets, scattered calendars, and
                manual invoicing across every studio you teach at, for one
                flat monthly price.
              </p>
              <div className="mt-8 space-y-4">
                {PRICING_TRUST.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <item.icon className="size-4" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100} className="order-1 lg:order-2">
              <Card className="relative overflow-hidden border-accent/30 shadow-xl">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40"
                />
                <CardHeader className="pt-8 text-center">
                  <Badge variant="secondary" className="mx-auto mb-3 w-fit">
                    Early access price
                  </Badge>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="font-heading text-6xl font-semibold tracking-tight">
                      €9
                    </span>
                    <span className="text-lg text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
                    Locked in for early users, even as the price rises for
                    new sign-ups later.
                  </p>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-3.5 border-t border-border pt-6">
                    {PRICING_INCLUDED.map((item) => (
                      <li key={item.text} className="flex items-center gap-3 text-sm">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <item.icon className="size-3.5" />
                        </div>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    nativeButton={false}
                    className="group mt-7 w-full"
                    render={
                      <Link href="/register">
                        Get started
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    }
                  />
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Secure checkout via Stripe. Cancel anytime.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-y border-border bg-secondary/40 px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className="text-center font-heading text-3xl font-semibold">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              Everything coaches usually ask before getting started.
            </p>
            <Accordion className="mt-10 w-full">
              {FAQ.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="group rounded-lg px-3 text-left transition-colors hover:bg-background hover:text-accent">
                    <span className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0 text-accent/70 transition-colors group-hover:text-accent" />
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pl-10 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
              <MessageCircle className="size-4 shrink-0 text-accent" />
              Still have questions? Reach out after signing up and we&apos;ll
              walk you through it.
            </div>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="bg-primary px-4 py-20 text-primary-foreground sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold">
              Ready to stop doing the math yourself?
            </h2>
            <p className="mt-3 text-primary-foreground/70">
              Set up your studios in a few minutes and let FORCOACH handle
              the rest.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                variant="secondary"
                nativeButton={false}
                className="group"
                render={
                  <Link href="/register">
                    Get started — €9/month
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                }
              />
            </div>
          </Reveal>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
