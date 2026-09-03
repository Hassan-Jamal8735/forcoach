export type AdminOverview = {
  totalUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalStudios: number;
  totalClasses: number;
  totalInvoices: number;
  unreadSupportCount: number;
  activeSubscriptions: number;
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
  subscriptionStatus: string;
  promoCode: string | null;
  discountPercentOff: number | null;
  discountDuration: string | null;
  adminOverrideUntil: string | null;
  accessReason: string;
};

export type PromoCode = {
  id: string;
  code: string;
  active: boolean;
  percentOff: number | null;
  amountOff: number | null;
  currency: string | null;
  duration: "once" | "repeating" | "forever" | null;
  durationInMonths: number | null;
  timesRedeemed: number;
  maxRedemptions: number | null;
  createdAt: string;
};

export type YearlyDiscount = {
  percentOff: number | null;
};

export type SupportThreadSummary = {
  userId: string;
  email: string;
  fullName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};
