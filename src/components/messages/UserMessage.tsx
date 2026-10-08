import { Pressable, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deliverMessage,
  selectMessageById,
} from '../../store/slices/conversationSlice';
import type { UserMessage as UserMessageType } from '../../types/message';
import { formatTime } from '../../utils/date';
import { previewText, senderName } from '../../utils/senderName';
import { MessageBubble, type GroupPosition } from './MessageBubble';

/** A message the user sent: bubble on the right, optional quote, delivery status. */
export function UserMessage({
  message,
  ...group
}: { message: UserMessageType } & GroupPosition) {
  // A failed or sending message always shows its status, even mid-group.
  const showStatus = group.isLastInGroup || message.status !== 'sent';
  return (
    <>
      <MessageBubble
        messageId={message.id}
        text={message.text}
        tone="user"
        dimmed={message.status === 'sending'}
        {...group}
      >
        {message.replyToId && <QuotedReply id={message.replyToId} />}
      </MessageBubble>
      {showStatus && <DeliveryStatus message={message} />}
    </>
  );
}

/** The original message, quoted inside a reply. */
function QuotedReply({ id }: { id: string }) {
  const original = useAppSelector(state => selectMessageById(state, id));
  return (
    <View className="mb-1.5 rounded-lg border-l-2 border-white/70 bg-white/15 px-2.5 py-1.5">
      {original ? (
        <>
          <Text className="text-xs font-semibold text-white">
            {senderName(original)}
          </Text>
          <Text className="text-xs text-white/80" numberOfLines={2}>
            {previewText(original)}
          </Text>
        </>
      ) : (
        <Text className="text-xs italic text-white/80">
          Original message was deleted
        </Text>
      )}
    </View>
  );
}

/** Sending… / 3:08 PM · Sent / Failed to send · Retry */
function DeliveryStatus({ message }: { message: UserMessageType }) {
  const dispatch = useAppDispatch();

  if (message.status === 'failed') {
    return (
      <Pressable
        onPress={() => dispatch(deliverMessage(message.id))}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Failed to send. Retry"
        className="mx-1 mt-1 self-end"
      >
        <Text className="text-[11px] text-danger">
          Failed to send · <Text className="font-bold">Retry</Text>
        </Text>
      </Pressable>
    );
  }

  return (
    <Text className="mx-1 mt-1 self-end text-[11px] text-muted">
      {message.status === 'sending'
        ? 'Sending…'
        : `${formatTime(message.createdAt)} · Sent`}
    </Text>
  );
}
