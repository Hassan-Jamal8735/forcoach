import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { createClient } from "@/lib/supabase/server";
import { DeleteForm } from "./delete-form";

export const metadata: Metadata = {
  title: "Delete your account | FORCOACH",
  description: "How to delete your FORCOACH account and the data that is removed.",
};

export default async function DeleteAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="theme-public flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">Delete your FORCOACH account</h1>
            <p className="mt-3 text-muted-foreground">
              You can permanently delete your FORCOACH account at any time, from the app, from this page, or by
              contacting us.
            </p>
          </div>

          {deleted ? (
            <div className="rounded-xl border p-6">
              <p className="font-medium">Your account has been deleted.</p>
              <p className="mt-1 text-muted-foreground">All of your data has been removed. Thank you for using FORCOACH.</p>
            </div>
          ) : user ? (
            <DeleteForm email={user.email ?? ""} />
          ) : (
            <div className="rounded-xl border p-6">
              <p>
                <Link href="/login?redirectTo=%2Fdelete-account" className="font-medium text-accent underline">
                  Log in
                </Link>{" "}
                to delete your account from this page.
              </p>
            </div>
          )}

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-semibold">Other ways to delete your account</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>In the FORCOACH app: open Settings, then tap Delete account.</li>
              <li>
                By email: write to{" "}
                <a href="mailto:contact@forcoach.io?subject=Delete%20my%20account" className="underline">
                  contact@forcoach.io
                </a>{" "}
                from the email address of your account. We delete it within 30 days.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-semibold">What is deleted</h2>
            <p className="text-muted-foreground">
              Deleting your account permanently removes your profile, studios, classes, earnings, invoices, calendar
              connections and support messages. Any active subscription is cancelled. This cannot be undone.
            </p>
            <p className="text-muted-foreground">
              Payment records held by our payment provider (Stripe) may be kept where the law requires it, for example for
              accounting and tax purposes.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
