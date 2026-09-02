export type SubscriptionStatus =
  | "none"
  | "incomplete"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type Plan = "monthly" | "yearly";

export type BillingStatus = {
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  promoCode: string | null;
  discountPercentOff: number | null;
  plan: Plan | null;
  enforced: boolean;
  hasAccess: boolean;
};
