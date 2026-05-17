const appTimeZone = "Asia/Kolkata";

function formatDateInAppTimeZone(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: appTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function getTodayDateKey() {
  return formatDateInAppTimeZone(new Date());
}

export function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00+05:30`);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateInAppTimeZone(date);
}

export function getWeekStartDateKey(dateKey = getTodayDateKey()) {
  const date = new Date(`${dateKey}T00:00:00+05:30`);
  const day = date.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return formatDateInAppTimeZone(date);
}

export function getMonthStartDateKey(dateKey = getTodayDateKey()) {
  return `${dateKey.slice(0, 8)}01`;
}

export function getMonthEndDateKey(dateKey = getTodayDateKey()) {
  const year = Number(dateKey.slice(0, 4));
  const month = Number(dateKey.slice(5, 7));
  const endDate = new Date(Date.UTC(year, month, 0));
  return formatDateInAppTimeZone(endDate);
}

export function getMonthDateKeys(dateKey = getTodayDateKey()) {
  const start = getMonthStartDateKey(dateKey);
  const end = getMonthEndDateKey(dateKey);
  const days = countDaysInclusive(start, end);
  return Array.from({ length: days }, (_, index) => addDays(start, index));
}

export function formatDisplayDate(dateKey: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: appTimeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options
  }).format(new Date(`${dateKey}T00:00:00+05:30`));
}

export function countDaysInclusive(startDateKey: string, endDateKey: string) {
  const start = new Date(`${startDateKey}T00:00:00+05:30`).getTime();
  const end = new Date(`${endDateKey}T00:00:00+05:30`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1);
}

export function getCurrentWeekDateKeys(todayDateKey = getTodayDateKey()) {
  const weekStart = getWeekStartDateKey(todayDateKey);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}
