import type { ReactNode } from 'react';
import { Keyboard, Pressable, Text } from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { messageSelected } from '../../store/slices/conversationSlice';
import { cn } from '../../utils/cn';

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

interface MessageBubbleProps extends GroupPosition {
  messageId: string;
  text: string;
  tone: keyof typeof TONES;
  dimmed?: boolean;
  /** Shown above the text, e.g. a quoted reply. */
  children?: ReactNode;
}

/**
 * The chat bubble: alignment, colours, grouped corners and long-press.
 * Corners touching a neighbour in the same group are tighter, so a group
 * reads as one block. Long-press selects the message; the action sheet opens.
 */
export function MessageBubble({
  messageId,
  text,
  tone,
  dimmed,
  isFirstInGroup,
  isLastInGroup,
  children,
}: MessageBubbleProps) {
  const dispatch = useAppDispatch();
  const isMine = tone === 'user';

  const onLongPress = () => {
    Keyboard.dismiss();
    dispatch(messageSelected(messageId));
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
        {text}
      </Text>
    </Pressable>
  );
}
