import { Pressable, Text } from 'react-native';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
}

/** A tappable icon (emoji or symbol), e.g. in the navigation header. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="active:opacity-60"
    >
      <Text className="text-lg font-bold text-foreground">{icon}</Text>
    </Pressable>
  );
}
