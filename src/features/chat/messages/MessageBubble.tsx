import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { cn } from '../../../utils/cn';

export interface GroupPosition {
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

interface MessageBubbleProps extends GroupPosition {
  side: 'start' | 'end';
  className?: string;
}

/**
 * The shared bubble shell: alignment, padding and grouped corners. Corners
 * that touch a neighbouring message in the same group are tighter, so a
 * group reads as one block.
 */
export function MessageBubble({
  side,
  isFirstInGroup,
  isLastInGroup,
  className,
  children,
}: PropsWithChildren<MessageBubbleProps>) {
  const isEnd = side === 'end';
  return (
    <View
      className={cn(
        'max-w-[82%] rounded-2xl px-3.5 py-2.5',
        isEnd ? 'self-end' : 'self-start',
        !isFirstInGroup && (isEnd ? 'rounded-tr-md' : 'rounded-tl-md'),
        !isLastInGroup && (isEnd ? 'rounded-br-md' : 'rounded-bl-md'),
        className,
      )}
    >
      {children}
    </View>
  );
}
