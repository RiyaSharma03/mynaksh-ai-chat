import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { vars } from 'nativewind';
import { themes, type ColorScheme } from './theme';
import { useTheme } from './useTheme';

// Precomputed once: the CSS variables behind every colour class, per scheme.
const themeVars = Object.fromEntries(
  Object.entries(themes).map(([scheme, colors]) => [
    scheme,
    vars(
      Object.fromEntries(
        Object.entries(colors).map(([name, value]) => [
          `--color-${name}`,
          value,
        ]),
      ),
    ),
  ]),
) as Record<ColorScheme, ReturnType<typeof vars>>;

/**
 * Sets the colour variables for the whole tree. Switching scheme swaps the
 * variables here, and every `bg-surface` / `text-muted` below updates.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const { scheme } = useTheme();
  return (
    <View className="flex-1" style={themeVars[scheme]}>
      {children}
    </View>
  );
}
