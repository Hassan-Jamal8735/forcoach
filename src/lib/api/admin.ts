export type AdminOverview = {
  totalUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalStudios: number;
  totalClasses: number;
  totalInvoices: number;
  unreadSupportCount: number;
  signupTrend: { date: string; count: number }[];
};

export type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  studioCount: number;
  classCount: number;
  invoiceCount: number;
  unreadSupportCount: number;
};

export type SupportThreadSummary = {
  userId: string;
  email: string;
  fullName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};
