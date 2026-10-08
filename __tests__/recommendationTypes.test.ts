import { getRecommendationDefinition } from '../src/constants/recommendationTypes';

const FALLBACK_LABEL = 'For you';

it.each([
  'gemstone',
  'tarot',
  'consultation',
  'article',
  'promotion',
  'remedy',
  'panchang',
])('has its own definition for %s', type => {
  expect(getRecommendationDefinition(type).label).not.toBe(FALLBACK_LABEL);
});

it('falls back for types this app version does not know', () => {
  expect(getRecommendationDefinition('live_puja').label).toBe(FALLBACK_LABEL);
});

it('does not treat object prototype keys as types', () => {
  expect(getRecommendationDefinition('toString').label).toBe(FALLBACK_LABEL);
});
