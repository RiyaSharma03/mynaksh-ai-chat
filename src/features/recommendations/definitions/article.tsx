import { CardDetail } from '../components/CardDetail';
import { readNumber } from '../dataReaders';
import type { RecommendationDefinition } from '../types';

export const article: RecommendationDefinition = {
  label: 'Article',
  icon: '📖',
  accent: '#FBBF24',
  ctaLabel: 'Read article',
  Body: ({ recommendation }) => {
    const minutes = readNumber(recommendation, 'readMinutes');
    return (
      <CardDetail>{minutes ? `${minutes} min read` : undefined}</CardDetail>
    );
  },
};
