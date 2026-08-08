import { createClient } from "@/lib/supabase/server";
import { toCurrencyCode, type CurrencyCode } from "@/lib/currency";

/**
 * The coach's chosen display currency, read from their Supabase profile.
 *
 * This is presentation only. Amounts are stored as plain numbers and are not
 * converted between currencies, so switching this relabels existing figures
 * rather than re-valuing them.
 */
export async function getUserCurrency(): Promise<CurrencyCode> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return toCurrencyCode(user?.user_metadata?.currency);
}
