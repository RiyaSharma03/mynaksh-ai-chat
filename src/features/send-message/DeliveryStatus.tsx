import { Pressable, Text } from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { formatTime } from '../../utils/date';
import { deliverMessage } from '../../store/slices/conversationSlice';
import type { UserMessage } from '../../types/message';

/** Sending… / 3:08 PM · Sent / Failed to send · Retry */
export function DeliveryStatus({ message }: { message: UserMessage }) {
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
