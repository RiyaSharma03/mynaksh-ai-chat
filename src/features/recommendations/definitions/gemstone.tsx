import { CardMeta } from '../components/CardMeta';
import { readString } from '../data';
import type { RecommendationDefinition } from '../types';

export const gemstone: RecommendationDefinition = {
  label: 'Gemstone',
  icon: '💎',
  accent: '#5DA9FF',
  ctaLabel: 'View gemstone',
  Body: ({ recommendation }) => (
    <CardMeta>{readString(recommendation, 'price')}</CardMeta>
  ),
};
