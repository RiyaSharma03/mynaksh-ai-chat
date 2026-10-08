import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface StateViewProps {
  title: string;
  description?: string;
  loading?: boolean;
  action?: { label: string; onPress: () => void };
}

/** Full-screen placeholder for loading, empty and error states. */
export function StateView({
  title,
  description,
  loading,
  action,
}: StateViewProps) {
  const { colors } = useTheme();
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      {loading && <ActivityIndicator color={colors.primary} />}
      <Text className="text-center text-base font-semibold text-foreground">
        {title}
      </Text>
      {description && (
        <Text className="text-center text-sm text-muted">{description}</Text>
      )}
      {action && (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          className="mt-2 rounded-full bg-primary px-6 py-2.5 active:opacity-80"
        >
          <Text className="font-semibold text-white">{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}
