import { Text, View } from 'react-native';
import { readString } from '../data';
import type { RecommendationDefinition } from '../types';

export const consultation: RecommendationDefinition = {
  label: 'Consultation',
  icon: '👨‍🏫',
  accent: '#34D399',
  ctaLabel: 'Talk now',
  Body: ({ recommendation }) => (
    <View className="flex-row items-center gap-1.5">
      <View className="h-2 w-2 rounded-full bg-success" />
      <Text className="text-xs text-muted">
        Online
        {readString(recommendation, 'pricePerMin')
          ? ` · ${readString(recommendation, 'pricePerMin')}`
          : ''}
      </Text>
    </View>
  ),
  onPress: (recommendation, { showAlert }) =>
    showAlert(
      recommendation.title,
      'Connecting you with an available astrologer…',
    ),
};
