import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopBar } from "@/components/layout/top-bar";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/admin";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    "";
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="flex min-h-screen">
      <SidebarNav isAdmin={isAdmin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar displayName={displayName} isAdmin={isAdmin} />
        <main className="flex-1 px-4 py-6 pb-20 md:px-8 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav isAdmin={isAdmin} />
      <Toaster />
    </div>
  );
}
