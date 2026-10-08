import type { ReactNode } from 'react';
import { Keyboard, Pressable, Text } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppDispatch } from '../../store/hooks';
import {
  deliverMessage,
  messageRemoved,
  replyStarted,
} from '../../store/slices/conversationSlice';
import type { Message } from '../../types/message';
import { cn } from '../../utils/cn';
import {
  getMessageActions,
  type MessageAction,
  previewText,
  senderName,
} from '../../utils/message';
import { showOptions } from '../../utils/showOptions';

export interface GroupPosition {
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

const TONES = {
  user: { bubble: 'bg-primary', text: 'text-white' },
  ai: { bubble: 'border border-border bg-surface', text: 'text-foreground' },
  astrologer: {
    bubble: 'border border-primary bg-raised',
    text: 'text-foreground',
  },
};

const ACTION_LABELS: Record<MessageAction, string> = {
  reply: 'Reply',
  copy: 'Copy',
  retry: 'Retry',
  delete: 'Delete',
};

interface MessageBubbleProps extends GroupPosition {
  message: Message;
  tone: keyof typeof TONES;
  dimmed?: boolean;
  /** Shown above the text, e.g. a quoted reply. */
  children?: ReactNode;
}

/**
 * The chat bubble: alignment, colours, grouped corners and long-press.
 * Corners touching a neighbour in the same group are tighter, so a group
 * reads as one block. Long-press opens Reply / Copy / Delete.
 */
export function MessageBubble({
  message,
  tone,
  dimmed,
  isFirstInGroup,
  isLastInGroup,
  children,
}: MessageBubbleProps) {
  const dispatch = useAppDispatch();
  const isMine = tone === 'user';

  const runAction: Record<MessageAction, () => void> = {
    reply: () => dispatch(replyStarted(message.id)),
    copy: () => Clipboard.setString(message.text),
    retry: () => dispatch(deliverMessage(message.id)),
    delete: () => dispatch(messageRemoved(message.id)),
  };

  const onLongPress = () => {
    Keyboard.dismiss();
    showOptions(
      senderName(message),
      previewText(message),
      getMessageActions(message).map(action => ({
        label: ACTION_LABELS[action],
        destructive: action === 'delete',
        onPress: runAction[action],
      })),
    );
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={300}
      accessibilityHint="Long press for reply, copy and delete"
      className={cn(
        'max-w-[82%] rounded-2xl px-3.5 py-2.5 active:opacity-80',
        TONES[tone].bubble,
        isMine ? 'self-end' : 'self-start',
        !isFirstInGroup && (isMine ? 'rounded-tr-md' : 'rounded-tl-md'),
        !isLastInGroup && (isMine ? 'rounded-br-md' : 'rounded-bl-md'),
        dimmed && 'opacity-70',
      )}
    >
      {children}
      <Text className={cn('text-[15px] leading-[21px]', TONES[tone].text)}>
        {message.text}
      </Text>
    </Pressable>
  );
}
