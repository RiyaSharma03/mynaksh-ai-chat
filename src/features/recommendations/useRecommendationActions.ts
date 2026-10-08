import { useMemo } from 'react';
import { Alert } from 'react-native';
import type { RecommendationActions } from './types';

/**
 * The capabilities cards get when pressed. New abilities (navigate, start a
 * call, add to cart) are added here once and every definition can use them.
 */
export function useRecommendationActions(): RecommendationActions {
  return useMemo(
    () => ({
      showAlert: (title, message) => Alert.alert(title, message),
    }),
    [],
  );
}
