import type { Message, MessageType } from '../types/message';

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

/**
 * What the list renders: rows, not messages. Date separators and grouping
 * are decided here, in a pure function, instead of inside JSX, so the rules
 * are unit-tested and rows receive only primitive props.
 */
export type TimelineItem =
  | { kind: 'date'; key: string; label: string }
  | {
      kind: 'message';
      key: string;
      id: string;
      type: MessageType;
      isFirstInGroup: boolean;
      isLastInGroup: boolean;
    };

const GROUP_WINDOW_MS = 5 * 60 * 1000;

const senderOf = (message: Message) =>
  message.type === 'human' ? `human:${message.author.name}` : message.type;

/** Consecutive messages group when: same sender, same day, within 5 minutes. System events never group. */
function isSameGroup(previous: Message, next: Message): boolean {
  return (
    previous.type !== 'system' &&
    senderOf(previous) === senderOf(next) &&
    startOfDay(previous.createdAt) === startOfDay(next.createdAt) &&
    next.createdAt - previous.createdAt <= GROUP_WINDOW_MS
  );
}

/** `messages` must be sorted oldest first (the entity adapter guarantees it). */
export function buildTimeline(
  messages: Message[],
  now = Date.now(),
): TimelineItem[] {
  const items: TimelineItem[] = [];

  messages.forEach((message, index) => {
    const previous = messages[index - 1];
    const next = messages[index + 1];
    const day = startOfDay(message.createdAt);

    if (!previous || startOfDay(previous.createdAt) !== day) {
      items.push({
        kind: 'date',
        key: `date-${day}`,
        label: formatDayLabel(message.createdAt, now),
      });
    }

    items.push({
      kind: 'message',
      key: message.id,
      id: message.id,
      type: message.type,
      isFirstInGroup: !previous || !isSameGroup(previous, message),
      isLastInGroup: !next || !isSameGroup(message, next),
    });
  });

  return items;
}
