import { Text, View } from 'react-native';
import type { SystemMessage } from '../../../types/message';

export function SystemMessageView({ message }: { message: SystemMessage }) {
  return (
    <View className="self-center rounded-full bg-raised px-3 py-1.5">
      <Text className="text-center text-xs text-muted">{message.text}</Text>
    </View>
  );
}
