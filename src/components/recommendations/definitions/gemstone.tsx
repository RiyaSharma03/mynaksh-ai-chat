import { CardDetail } from '../CardDetail';
import { readString } from '../dataReaders';
import type { RecommendationDefinition } from '../types';

export const gemstone: RecommendationDefinition = {
  label: 'Gemstone',
  icon: '💎',
  accent: '#5DA9FF',
  ctaLabel: 'View gemstone',
  Body: ({ recommendation }) => (
    <CardDetail>{readString(recommendation, 'price')}</CardDetail>
  ),
};
