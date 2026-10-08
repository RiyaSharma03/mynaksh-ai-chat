import { fallback } from '../src/components/recommendations/definitions/fallback';
import { getRecommendationDefinition } from '../src/components/recommendations/recommendationRegistry';

it.each([
  'gemstone',
  'tarot',
  'consultation',
  'article',
  'promotion',
  'remedy',
  'panchang',
])('has a dedicated definition for %s', type => {
  expect(getRecommendationDefinition(type)).not.toBe(fallback);
});

it('falls back for types this app version does not know', () => {
  expect(getRecommendationDefinition('live_puja')).toBe(fallback);
});

it('does not treat object prototype keys as types', () => {
  expect(getRecommendationDefinition('toString')).toBe(fallback);
  expect(getRecommendationDefinition('__proto__')).toBe(fallback);
});
