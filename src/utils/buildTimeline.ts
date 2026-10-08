import { formatDayLabel, startOfDay } from './date';
import type { Message, MessageType } from '../types/message';

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
