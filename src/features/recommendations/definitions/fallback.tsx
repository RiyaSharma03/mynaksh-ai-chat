import type { RecommendationDefinition } from '../types';

/**
 * Used for any type this app version doesn't know yet, so a new backend
 * experience still renders (title, subtitle, a generic button) instead of
 * crashing or disappearing.
 */
export const fallback: RecommendationDefinition = {
  label: 'For you',
  icon: '✨',
  accent: '#A78BFA',
  ctaLabel: 'Open',
};
