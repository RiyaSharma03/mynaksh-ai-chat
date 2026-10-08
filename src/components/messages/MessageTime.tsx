import { Text } from 'react-native';
import { formatTime } from '../../utils/date';
import { cn } from '../../utils/cn';

/** Shown under the last message of a group. */
export function MessageTime({
  value,
  side,
}: {
  value: number;
  side: 'start' | 'end';
}) {
  return (
    <Text
      className={cn(
        'mx-1 mt-1 text-[11px] text-muted',
        side === 'end' ? 'self-end' : 'self-start',
      )}
    >
      {formatTime(value)}
    </Text>
  );
}
