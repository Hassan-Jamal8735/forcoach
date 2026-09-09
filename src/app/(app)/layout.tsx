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
    <div className="flex min-h-screen print:block">
      <div className="print:hidden">
        <SidebarNav isAdmin={isAdmin} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col print:block">
        <div className="print:hidden">
          <TopBar displayName={displayName} isAdmin={isAdmin} />
        </div>
        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-6 print:p-0">
          {children}
        </main>
      </div>
      <div className="print:hidden">
        <MobileNav isAdmin={isAdmin} />
      </div>
      <div className="print:hidden">
        <Toaster />
      </div>
    </div>
  );
}
