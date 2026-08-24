import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cosmetic gate — the backend's AdminGuard is what actually enforces this
  // on every /admin/* request. This just avoids showing a broken page to a
  // non-admin who guesses the URL.
  if (user?.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
