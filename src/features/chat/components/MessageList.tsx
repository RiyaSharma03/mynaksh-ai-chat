import { useEffect, useMemo, useRef } from 'react';
import {
  FlashList,
  type FlashListRef,
  type ListRenderItemInfo,
} from '@shopify/flash-list';
import { useAppSelector } from '../../../store/hooks';
import { selectIsAiTyping, selectTimeline } from '../conversationSlice';
import type { TimelineItem } from '../timeline';
import { ChatScrollView } from './ChatScrollView';
import { DateSeparator } from './DateSeparator';
import { MessageRow } from './MessageRow';
import { TypingIndicator } from './TypingIndicator';

const CHAT_POSITION = {
  // Few messages sit at the bottom, like any chat.
  startRenderingFromBottom: true,
  // New messages scroll into view only if the user is already near the bottom,
  // so reading older history is never interrupted.
  autoscrollToBottomThreshold: 0.2,
};

const CONTENT_STYLE = { paddingBottom: 16 };

/** Timeline rows plus the list-only typing row. */
type ListItem = TimelineItem | { kind: 'typing'; key: 'typing' };

const TYPING_ITEM: ListItem = { kind: 'typing', key: 'typing' };

const keyExtractor = (item: ListItem) => item.key;

// Separate recycling pools per row kind, so a date separator is never
// recycled into a message bubble (and an AI row with cards stays with AI rows).
const getItemType = (item: ListItem) =>
  item.kind === 'message' ? item.type : item.kind;

const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => {
  switch (item.kind) {
    case 'date':
      return <DateSeparator label={item.label} />;
    case 'typing':
      return <TypingIndicator />;
    case 'message':
      return (
        <MessageRow
          id={item.id}
          isFirstInGroup={item.isFirstInGroup}
          isLastInGroup={item.isLastInGroup}
        />
      );
  }
};

export function MessageList() {
  const listRef = useRef<FlashListRef<ListItem>>(null);
  const timeline = useAppSelector(selectTimeline);
  const isAiTyping = useAppSelector(selectIsAiTyping);

  // The typing indicator is a row like any other, so it scrolls into view
  // the same way a new message does.
  const items = useMemo<ListItem[]>(
    () => (isAiTyping ? [...timeline, TYPING_ITEM] : timeline),
    [timeline, isAiTyping],
  );

  // Your own new message always scrolls to the bottom, even if you were
  // reading history (incoming messages respect the threshold above).
  const lastTimelineItem = timeline[timeline.length - 1];
  const lastOwnMessageId =
    lastTimelineItem?.kind === 'message' && lastTimelineItem.type === 'user'
      ? lastTimelineItem.id
      : null;
  useEffect(() => {
    if (lastOwnMessageId) listRef.current?.scrollToEnd({ animated: true });
  }, [lastOwnMessageId]);

  return (
    <FlashList
      ref={listRef}
      data={items}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      renderItem={renderItem}
      renderScrollComponent={ChatScrollView}
      initialScrollIndex={items.length - 1}
      maintainVisibleContentPosition={CHAT_POSITION}
      contentContainerStyle={CONTENT_STYLE}
      keyboardShouldPersistTaps="handled"
    />
  );
}
