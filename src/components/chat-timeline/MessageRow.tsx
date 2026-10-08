import { memo, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { selectMessageById } from '../../store/slices/conversationSlice';
import { cn } from '../../utils/cn';
import { IncomingMessage } from '../messages/IncomingMessage';
import type { GroupPosition } from '../messages/MessageBubble';
import { UserMessage } from '../messages/UserMessage';

/**
 * One timeline row. It receives only an id and grouping flags and selects
 * its own message, so a change to one message re-renders this row alone.
 */
function MessageRowView({ id, ...group }: { id: string } & GroupPosition) {
  const message = useAppSelector(state => selectMessageById(state, id));
  if (!message) return null;

  // Typed, so a message type missing from the switch fails to compile.
  let content: ReactNode;
  switch (message.type) {
    case 'user':
      content = <UserMessage message={message} {...group} />;
      break;
    case 'ai':
    case 'human':
      content = <IncomingMessage message={message} {...group} />;
      break;
    case 'system':
      content = (
        <View className="self-center rounded-full bg-raised px-3 py-1.5">
          <Text className="text-center text-xs text-muted">{message.text}</Text>
        </View>
      );
      break;
  }

  return (
    <View className={cn('px-3', group.isFirstInGroup ? 'mt-3' : 'mt-1.5')}>
      {content}
    </View>
  );
}

export const MessageRow = memo(MessageRowView);
