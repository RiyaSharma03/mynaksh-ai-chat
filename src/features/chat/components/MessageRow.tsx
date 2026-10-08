import { memo } from 'react';
import { View } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { cn } from '../../../utils/cn';
import { selectMessageById } from '../conversationSlice';
import { AiMessageView } from '../messages/AiMessageView';
import { HumanMessageView } from '../messages/HumanMessageView';
import type { GroupPosition } from '../messages/MessageBubble';
import { SystemMessageView } from '../messages/SystemMessageView';
import { UserMessageView } from '../messages/UserMessageView';
import type { Message } from '../types';

type MessageRowProps = { id: string } & GroupPosition;

/**
 * One timeline row. It receives only an id and grouping flags, and selects
 * its own message from the store, so a change to one message re-renders
 * this row alone (memo bails out for every other row).
 */
function MessageRowView({ id, ...group }: MessageRowProps) {
  const message = useAppSelector(state => selectMessageById(state, id));
  if (!message) return null;

  return (
    <View className={cn('px-3', group.isFirstInGroup ? 'mt-3' : 'mt-1.5')}>
      {renderMessage(message, group)}
    </View>
  );
}

export const MessageRow = memo(MessageRowView);

/**
 * Message types are a closed set the app owns, so an exhaustive switch:
 * adding a type without a view fails to compile at `never`.
 */
function renderMessage(message: Message, group: GroupPosition) {
  switch (message.type) {
    case 'user':
      return <UserMessageView message={message} {...group} />;
    case 'ai':
      return <AiMessageView message={message} {...group} />;
    case 'human':
      return <HumanMessageView message={message} {...group} />;
    case 'system':
      return <SystemMessageView message={message} />;
    default: {
      const unhandled: never = message;
      return unhandled;
    }
  }
}
