import { CardMeta } from '../components/CardMeta';
import { readNumber } from '../data';
import type { RecommendationDefinition } from '../types';

export const article: RecommendationDefinition = {
  label: 'Article',
  icon: '📖',
  accent: '#FBBF24',
  ctaLabel: 'Read article',
  Body: ({ recommendation }) => {
    const minutes = readNumber(recommendation, 'readMinutes');
    return <CardMeta>{minutes ? `${minutes} min read` : undefined}</CardMeta>;
  },
};
