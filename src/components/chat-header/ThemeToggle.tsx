import { IconButton } from '../common/IconButton';
import { useTheme } from '../../theme/useTheme';

export function ThemeToggle() {
  const { scheme, toggle } = useTheme();
  const isDark = scheme === 'dark';
  return (
    <IconButton
      icon={isDark ? '☀️' : '🌙'}
      onPress={toggle}
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    />
  );
}
