import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  FileText,
  Settings,
  Coins,
  MessageCircle,
  Users,
  Tag,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Order and set match the UI/UX Product Specification, section 7
// (Dashboard, Calendar, Studios, Earnings, Invoices, Settings).
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Studios", href: "/studios", icon: Building2 },
  { label: "Earnings", href: "/earnings", icon: Coins },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

// The admin account (contact@forcoach.io) sees this instead of NAV_ITEMS —
// a separate experience, not the coach app with an extra link bolted on.
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Coaches", href: "/admin/users", icon: Users },
  { label: "Support inbox", href: "/admin/support", icon: MessageCircle },
  { label: "Promo codes", href: "/admin/billing", icon: Tag },
];
