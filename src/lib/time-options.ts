export type TimeOption = { value: string; label: string };

// Every 5 minutes, "HH:MM" (24h, matches native input value format) paired
// with a 12-hour display label — used to replace native <input type="time">,
// whose picker UI differs wildly across browsers (no wheel/spinner at all on
// Safari desktop, unlike Windows or mobile).
export const TIME_OPTIONS: TimeOption[] = Array.from({ length: 24 * 12 }, (_, i) => {
  const hour24 = Math.floor(i / 12);
  const minute = (i % 12) * 5;
  const value = `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const period = hour24 < 12 ? "AM" : "PM";
  const label = `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  return { value, label };
});
