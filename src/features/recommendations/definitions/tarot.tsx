import { CardDetail } from '../components/CardDetail';
import { readNumber } from '../dataReaders';
import type { RecommendationDefinition } from '../types';

export const tarot: RecommendationDefinition = {
  label: 'Tarot',
  icon: '🔮',
  accent: '#C084FC',
  ctaLabel: 'Start reading',
  Body: ({ recommendation }) => {
    const cards = readNumber(recommendation, 'cards');
    return (
      <CardDetail>{cards ? `${cards}-card spread` : undefined}</CardDetail>
    );
  },
  onPress: (recommendation, { showAlert }) =>
    showAlert(
      `🔮 ${recommendation.title}`,
      'Shuffling your cards… Your reading will begin shortly.',
    ),
};
