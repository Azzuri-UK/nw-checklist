export const TZ = 'Europe/London';

export function todayKey(date: Date = new Date(), tz = TZ): string {
  const y = new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric' }).format(date);
  const m = new Intl.DateTimeFormat('en-GB', { timeZone: tz, month: '2-digit' }).format(date);
  const d = new Intl.DateTimeFormat('en-GB', { timeZone: tz, day: '2-digit' }).format(date);
  return `${y}-${m}-${d}`;
}
