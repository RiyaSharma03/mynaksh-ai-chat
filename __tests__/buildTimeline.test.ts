import type { Message } from '../src/types/message';
import { buildTimeline, type TimelineItem } from '../src/utils/buildTimeline';

const NOW = new Date(2026, 9, 8, 15, 0).getTime();
const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

const user = (id: string, createdAt: number): Message => ({
  id,
  type: 'user',
  text: id,
  createdAt,
  status: 'sent',
});
const system = (id: string, createdAt: number): Message => ({
  id,
  type: 'system',
  text: id,
  createdAt,
});
const human = (id: string, createdAt: number, name: string): Message => ({
  id,
  type: 'human',
  text: id,
  createdAt,
  author: { name },
});

const messageRows = (items: TimelineItem[]) =>
  items.flatMap(item =>
    item.kind === 'message'
      ? [[item.id, item.isFirstInGroup, item.isLastInGroup]]
      : [],
  );

it('adds a date separator before each new day', () => {
  const items = buildTimeline(
    [user('a', NOW - DAY), user('b', NOW - DAY + MIN), user('c', NOW)],
    NOW,
  );
  expect(
    items.map(item => (item.kind === 'date' ? item.label : item.id)),
  ).toEqual(['Yesterday', 'a', 'b', 'Today', 'c']);
});

it('groups consecutive messages from the same sender within 5 minutes', () => {
  const items = buildTimeline(
    [user('a', NOW), user('b', NOW + 2 * MIN), user('c', NOW + 10 * MIN)],
    NOW,
  );
  expect(messageRows(items)).toEqual([
    ['a', true, false],
    ['b', false, true],
    ['c', true, true],
  ]);
});

it('never groups system events, and splits human astrologers by name', () => {
  const items = buildTimeline(
    [
      system('s1', NOW),
      system('s2', NOW + MIN),
      human('h1', NOW + 2 * MIN, 'Vinod'),
      human('h2', NOW + 3 * MIN, 'Meera'),
    ],
    NOW,
  );
  expect(messageRows(items)).toEqual([
    ['s1', true, true],
    ['s2', true, true],
    ['h1', true, true],
    ['h2', true, true],
  ]);
});

it('does not group across midnight', () => {
  const midnight = new Date(2026, 9, 8, 0, 0).getTime();
  const items = buildTimeline(
    [user('a', midnight - MIN), user('b', midnight + MIN)],
    NOW,
  );
  expect(messageRows(items)).toEqual([
    ['a', true, true],
    ['b', true, true],
  ]);
});
