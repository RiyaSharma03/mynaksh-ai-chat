const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** "Today", "Yesterday", or a short date like "6 Oct 2026". */
export function formatDayLabel(timestamp: number, now = Date.now()): string {
  // Rounded, so a daylight-saving day (23 or 25 hours) still counts as one day.
  const daysAgo = Math.round(
    (startOfDay(now) - startOfDay(timestamp)) / DAY_MS,
  );
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return new Date(timestamp).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "3:08 PM" (follows the device locale). */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
