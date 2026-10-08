import { article } from './definitions/article';
import { consultation } from './definitions/consultation';
import { fallback } from './definitions/fallback';
import { gemstone } from './definitions/gemstone';
import { panchang } from './definitions/panchang';
import { promotion } from './definitions/promotion';
import { remedy } from './definitions/remedy';
import { tarot } from './definitions/tarot';
import type { RecommendationDefinition } from './types';

/**
 * The only list of recommendation types in the app. Adding a type is one
 * definition file and one line here.
 */
const registry: Record<string, RecommendationDefinition> = {
  gemstone,
  tarot,
  consultation,
  article,
  promotion,
  remedy,
  panchang,
};

export function getRecommendationDefinition(
  type: string,
): RecommendationDefinition {
  return Object.hasOwn(registry, type) ? registry[type] : fallback;
}
