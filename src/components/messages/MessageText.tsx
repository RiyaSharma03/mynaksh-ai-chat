import { Text } from 'react-native';
import { cn } from '../../utils/cn';

export function MessageText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <Text className={cn('text-[15px] leading-[21px]', className)}>{text}</Text>
  );
}
