/**
 * Design tokens: the single source for colours, spacing and type.
 * Components never hard-code these values.
 */
export const colors = {
  background: '#0F0B1E',
  surface: '#1A1530',
  surfaceRaised: '#251E42',
  border: '#332A57',
  primary: '#8B5CF6',
  text: '#F4F1FF',
  textMuted: '#A59CC6',
  success: '#34D399',
  danger: '#F87171',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const radius = { sm: 8, md: 12, lg: 18, pill: 999 } as const;

export const typography = {
  caption: { fontSize: 12, lineHeight: 16 },
  body: { fontSize: 15, lineHeight: 21 },
  title: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
} as const;
