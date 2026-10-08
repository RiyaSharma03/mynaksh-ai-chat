import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useAppSelector } from '../../../store/hooks';
import { selectTimeline } from '../conversationSlice';
import type { TimelineItem } from '../timeline';
import { DateSeparator } from './DateSeparator';
import { MessageRow } from './MessageRow';

const CHAT_POSITION = {
  // Few messages sit at the bottom, like any chat.
  startRenderingFromBottom: true,
  // New messages scroll into view only if the user is already near the bottom,
  // so reading older history is never interrupted.
  autoscrollToBottomThreshold: 0.2,
};

const CONTENT_STYLE = { paddingBottom: 16 };

const keyExtractor = (item: TimelineItem) => item.key;

// Separate recycling pools per row kind, so a date separator is never
// recycled into a message bubble (and an AI row with cards stays with AI rows).
const getItemType = (item: TimelineItem) =>
  item.kind === 'date' ? 'date' : item.type;

const renderItem = ({ item }: ListRenderItemInfo<TimelineItem>) =>
  item.kind === 'date' ? (
    <DateSeparator label={item.label} />
  ) : (
    <MessageRow
      id={item.id}
      isFirstInGroup={item.isFirstInGroup}
      isLastInGroup={item.isLastInGroup}
    />
  );

export function MessageList() {
  const items = useAppSelector(selectTimeline);
  return (
    <FlashList
      data={items}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      renderItem={renderItem}
      initialScrollIndex={items.length - 1}
      maintainVisibleContentPosition={CHAT_POSITION}
      contentContainerStyle={CONTENT_STYLE}
    />
  );
}
