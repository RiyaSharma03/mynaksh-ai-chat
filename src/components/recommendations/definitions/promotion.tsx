import { Text, View } from 'react-native';
import { readString } from '../dataReaders';
import type { RecommendationDefinition } from '../types';

export const promotion: RecommendationDefinition = {
  label: 'Offer',
  icon: '🎁',
  accent: '#F472B6',
  ctaLabel: 'Claim offer',
  Body: ({ recommendation }) => {
    const code = readString(recommendation, 'code');
    if (!code) return null;
    return (
      <View className="self-start rounded-md border border-dashed border-muted px-2 py-0.5">
        <Text className="text-xs font-bold tracking-widest text-foreground">
          {code}
        </Text>
      </View>
    );
  },
  onPress: (recommendation, { showAlert }) => {
    const code = readString(recommendation, 'code');
    showAlert(
      '🎁 Offer applied',
      code ? `Code ${code} will be applied at checkout.` : recommendation.title,
    );
  },
};
