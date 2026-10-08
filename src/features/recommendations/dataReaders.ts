import type { Recommendation } from './types';

/**
 * Safe readers for the free-form `data` payload. A missing or wrongly typed
 * field reads as undefined, so a card just omits that line.
 */
export function readString(recommendation: Recommendation, key: string) {
  const value = recommendation.data?.[key];
  return typeof value === 'string' ? value : undefined;
}

export function readNumber(recommendation: Recommendation, key: string) {
  const value = recommendation.data?.[key];
  return typeof value === 'number' ? value : undefined;
}
