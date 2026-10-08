/**
 * Design tokens: the single source for colours, one palette per colour scheme.
 *
 * Both palettes have the same keys. Tailwind maps each key to a CSS variable
 * (bg-surface -> var(--color-surface)), and ThemeProvider fills the variables
 * from the active palette, so components never need `dark:` classes.
 *
 * Plain data only: tailwind.config.js loads this file in Node.
 */
const dark = {
  background: '#0F0B1E',
  surface: '#1A1530',
  raised: '#251E42',
  border: '#332A57',
  primary: '#8B5CF6',
  foreground: '#F4F1FF',
  muted: '#A59CC6',
  success: '#34D399',
  danger: '#F87171',
};

export type ThemeColors = typeof dark;
export type ColorScheme = 'light' | 'dark';

const light: ThemeColors = {
  background: '#F7F5FF',
  surface: '#FFFFFF',
  raised: '#EFEBFB',
  border: '#E2DCF5',
  primary: '#7C3AED',
  foreground: '#1B1530',
  muted: '#6B6390',
  success: '#059669',
  danger: '#DC2626',
};

export const themes: Record<ColorScheme, ThemeColors> = { light, dark };
