import { createClient } from "@/lib/supabase/server";

/**
 * The coach's time zone from their Supabase profile, for formatting class
 * dates and times in server components. The server runs in UTC, so without
 * this a 14:00 class in Paris would render as 13:00 (or 12:00 in summer).
 */
export async function getUserTimeZone(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return toTimeZone(user?.user_metadata?.timezone);
}

export function toTimeZone(value: unknown): string {
  if (typeof value === "string" && value) {
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone: value });
      return value;
    } catch {
      // not a valid IANA zone; fall through
    }
  }
  return "Europe/Paris";
}

/** "14:00-15:00": the class start plus its snapshotted duration. */
export function formatTimeRange(start: string, hours: number, timeZone: string) {
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + Math.round(hours * 60) * 60_000);
  return `${time.format(startDate)}-${time.format(endDate)}`;
}
