import { Text, View } from 'react-native';

interface SenderLabelProps {
  icon: string;
  name: string;
  badge?: string;
}

/** Shown above the first message of a group from the AI or an astrologer. */
export function SenderLabel({ icon, name, badge }: SenderLabelProps) {
  return (
    <View className="mb-1 ml-1 flex-row items-center gap-1.5">
      <Text className="text-sm">{icon}</Text>
      <Text className="text-xs font-semibold text-muted">{name}</Text>
      {badge && (
        <View className="rounded bg-primary px-1.5 py-0.5">
          <Text className="text-[10px] font-bold uppercase text-white">
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}
