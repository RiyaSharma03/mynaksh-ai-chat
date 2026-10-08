import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface ChipProps {
  label: ReactNode;
  selected?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

/** Pill-shaped toggle button: highlighted when selected. */
export function Chip({
  label,
  selected = false,
  onPress,
  accessibilityLabel,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      className={cn(
        'rounded-full border px-3 py-1.5 active:opacity-80',
        selected ? 'border-primary bg-primary' : 'border-border bg-surface',
      )}
    >
      <Text
        className={cn(
          'text-xs',
          selected ? 'font-semibold text-white' : 'text-foreground',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
