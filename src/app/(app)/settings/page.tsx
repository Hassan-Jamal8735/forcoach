import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { ChangePasswordForm } from "./change-password-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const timezone = (user?.user_metadata?.timezone as string | undefined) ?? "UTC";
  const currency = (user?.user_metadata?.currency as string | undefined) ?? "EUR";
  const siret = (user?.user_metadata?.siret as string | undefined) ?? "";
  const defaultVatRate =
    user?.user_metadata?.default_vat_rate != null
      ? String(user.user_metadata.default_vat_rate as number)
      : "";
  const hasPassword =
    user?.identities?.some((identity) => identity.provider === "email") ??
    true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Profile, account, calendar connections, and feeds.
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
          />
        </CardContent>
      </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Calendar connections & feeds
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Manage your Google Calendar connection and ICS feeds from the{" "}
          <Link href="/calendar" className="text-accent hover:underline">
            Calendar
          </Link>{" "}
          page.
        </CardContent>
      </Card>
    </div>
  );
}
