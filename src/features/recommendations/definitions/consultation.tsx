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
  // Starts a real handoff: the message goes through the normal send flow,
  // and the backend connects an astrologer.
  onPress: (_recommendation, { sendMessage }) =>
    sendMessage("I'd like to talk to an astrologer."),
};
