import type { PropsWithChildren } from 'react';
import { Keyboard, Pressable } from 'react-native';
import { useAppDispatch } from '../../../store/hooks';
import { cn } from '../../../utils/cn';
import { messageSelected } from '../conversationSlice';

export interface GroupPosition {
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

interface MessageBubbleProps extends GroupPosition {
  messageId: string;
  side: 'start' | 'end';
  className?: string;
}

/**
 * The shared bubble shell: alignment, padding, grouped corners and
 * long-press. Corners that touch a neighbouring message in the same group
 * are tighter, so a group reads as one block. Long-press selects the message
 * in the store; the action sheet (mounted once, on the screen) reacts to it.
 */
export function MessageBubble({
  messageId,
  side,
  isFirstInGroup,
  isLastInGroup,
  className,
  children,
}: PropsWithChildren<MessageBubbleProps>) {
  const dispatch = useAppDispatch();
  const isEnd = side === 'end';

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
        isEnd ? 'self-end' : 'self-start',
        !isFirstInGroup && (isEnd ? 'rounded-tr-md' : 'rounded-tl-md'),
        !isLastInGroup && (isEnd ? 'rounded-br-md' : 'rounded-bl-md'),
        className,
      )}
    >
      {children}
    </Pressable>
  );
}
