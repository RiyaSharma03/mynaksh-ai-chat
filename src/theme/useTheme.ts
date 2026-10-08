import { useColorScheme } from 'nativewind';
import { colorSchemes } from './colorSchemes';

/**
 * The active colour scheme and its raw colour values, for the few APIs that
 * need a value instead of a class (navigation theme, StatusBar, placeholder colours).
 * State lives in NativeWind: it follows the system setting until toggled.
 */
export function useTheme() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'dark';
  return { scheme, colors: colorSchemes[scheme], toggle: toggleColorScheme };
}
