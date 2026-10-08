import { Pressable, Text } from 'react-native';
import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { scheme, toggle } = useTheme();
  return (
    <Pressable
      onPress={toggle}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${
        scheme === 'dark' ? 'light' : 'dark'
      } mode`}
    >
      <Text className="text-lg">{scheme === 'dark' ? '☀️' : '🌙'}</Text>
    </Pressable>
  );
}
