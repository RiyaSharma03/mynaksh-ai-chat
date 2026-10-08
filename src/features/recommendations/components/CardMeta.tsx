import { Text } from 'react-native';

/** One muted line of type-specific detail. Renders nothing when empty. */
export function CardMeta({ children }: { children?: string }) {
  if (!children) return null;
  return <Text className="text-xs text-muted">{children}</Text>;
}
