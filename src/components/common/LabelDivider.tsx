import { Text, View } from 'react-native';

export function LabelDivider({ label }: { label: string }) {
  return (
    <View
      className="flex-row items-center gap-3 px-6 pb-1 pt-5"
      accessibilityRole="header"
    >
      <View className="h-px flex-1 bg-border" />
      <Text className="text-xs font-medium text-muted">{label}</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
