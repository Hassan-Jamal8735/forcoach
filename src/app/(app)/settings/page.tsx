import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { apiFetch } from "@/lib/api/server-client";
import type { Studio } from "@/lib/api/studios";
import type { GoogleCalendarStatus } from "@/lib/api/google-calendar";
import type { IcsFeed } from "@/lib/api/ics-feeds";
import type { BillingStatus } from "@/lib/api/billing";
import { GoogleCalendarCard } from "@/app/(app)/calendar/google-calendar-card";
import { IcsFeedsCard } from "@/app/(app)/calendar/ics-feeds-card";
import { IcsUploadDialog } from "@/app/(app)/calendar/ics-upload-dialog";
import { CsvImportDialog } from "@/app/(app)/calendar/csv-import-dialog";
import { ImportHistoryDialog } from "@/app/(app)/calendar/import-history-dialog";
import { ADMIN_EMAIL } from "@/lib/admin";
import { ProfileForm } from "./profile-form";
import { ChangePasswordForm } from "./change-password-form";
import { SubscriptionCard } from "./subscription-card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const timezone = (user?.user_metadata?.timezone as string | undefined) ?? "UTC";
  const currency = (user?.user_metadata?.currency as string | undefined) ?? "EUR";
  const siret = (user?.user_metadata?.siret as string | undefined) ?? "";
  const iban = (user?.user_metadata?.iban as string | undefined) ?? "";
  const defaultVatRate =
    user?.user_metadata?.default_vat_rate != null
      ? String(user.user_metadata.default_vat_rate as number)
      : "";
  const hasPassword =
    user?.identities?.some((identity) => identity.provider === "email") ??
    true;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const [studios, googleStatus, icsFeeds, billing] = await Promise.all([
    isAdmin ? Promise.resolve<Studio[]>([]) : apiFetch<Studio[]>("/studios"),
    isAdmin
      ? Promise.resolve<GoogleCalendarStatus>({ connected: false })
      : apiFetch<GoogleCalendarStatus>("/calendar/google/status"),
    isAdmin ? Promise.resolve<IcsFeed[]>([]) : apiFetch<IcsFeed[]>("/ics-feeds"),
    isAdmin ? Promise.resolve(null) : apiFetch<BillingStatus>("/billing/status"),
  ]);
  const studioOptions = studios.map((st) => ({ id: st.id, name: st.name }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Profile, account, and where your classes come from.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            email={user?.email ?? ""}
            fullName={fullName}
            timezone={timezone}
            currency={currency}
            siret={siret}
            defaultVatRate={defaultVatRate}
            iban={iban}
          />
        </CardContent>
      </Card>
      {!isAdmin && billing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionCard billing={billing} />
          </CardContent>
        </Card>
      )}
      {!isAdmin && (
        <>
          <div className="space-y-2">
            <div>
              <h2 className="text-base font-medium">
                Where your classes come from
              </h2>
              <p className="text-sm text-muted-foreground">
                Connect a calendar once and your classes sync in
                automatically. You only need to set this up once.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <GoogleCalendarCard status={googleStatus} studios={studioOptions} />
              <IcsFeedsCard feeds={icsFeeds} studios={studioOptions} />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <h2 className="text-base font-medium">Bring in past classes</h2>
              <p className="text-sm text-muted-foreground">
                A live connection above only syncs going forward. Use these
                for history — a one-off calendar export, a spreadsheet, or
                to check what a past sync actually did.
              </p>
            </div>
            <Card>
              <CardContent className="flex flex-wrap items-center gap-2 pt-6">
                <IcsUploadDialog studios={studioOptions} />
                <CsvImportDialog studios={studioOptions} />
                <ImportHistoryDialog />
              </CardContent>
            </Card>
          </div>
        </>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasPassword && (
            <p className="text-sm text-muted-foreground mb-4">
              You signed up with Google, so there&apos;s no password yet. Set
              one below if you&apos;d also like to log in with your email and
              password.
            </p>
          )}
          <ChangePasswordForm label={hasPassword ? "Update password" : "Set password"} />
        </CardContent>
      </Card>
    </div>
  );
}
