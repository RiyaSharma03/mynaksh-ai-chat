import { CardMeta } from '../components/CardMeta';
import { readNumber } from '../data';
import type { RecommendationDefinition } from '../types';

export const tarot: RecommendationDefinition = {
  label: 'Tarot',
  icon: '🔮',
  accent: '#C084FC',
  ctaLabel: 'Start reading',
  Body: ({ recommendation }) => {
    const cards = readNumber(recommendation, 'cards');
    return <CardMeta>{cards ? `${cards}-card spread` : undefined}</CardMeta>;
  },
  onPress: (recommendation, { showAlert }) =>
    showAlert(
      `🔮 ${recommendation.title}`,
      'Shuffling your cards… Your reading will begin shortly.',
    ),
};
