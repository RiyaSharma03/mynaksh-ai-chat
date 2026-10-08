import { Text, View } from 'react-native';
import { CardDetail } from '../components/common/CardDetail';
import type {
  Recommendation,
  RecommendationDefinition,
} from '../types/recommendation';

/** Reads an optional field from a recommendation's free-form `data`. */
const readString = (rec: Recommendation, key: string) =>
  typeof rec.data?.[key] === 'string' ? (rec.data[key] as string) : undefined;

const readNumber = (rec: Recommendation, key: string) =>
  typeof rec.data?.[key] === 'number' ? (rec.data[key] as number) : undefined;

/**
 * Every recommendation type the app knows. The card renders any entry, so
 * adding a type means adding one entry here: no other code changes.
 */
const RECOMMENDATION_TYPES: Record<string, RecommendationDefinition> = {
  gemstone: {
    label: 'Gemstone',
    icon: '💎',
    accent: '#5DA9FF',
    ctaLabel: 'View gemstone',
    Body: ({ recommendation }) => (
      <CardDetail>{readString(recommendation, 'price')}</CardDetail>
    ),
  },

  tarot: {
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
      showAlert(`🔮 ${recommendation.title}`, 'Shuffling your cards…'),
  },

  consultation: {
    label: 'Consultation',
    icon: '👨‍🏫',
    accent: '#34D399',
    ctaLabel: 'Talk now',
    Body: ({ recommendation }) => {
      const price = readString(recommendation, 'pricePerMin');
      return (
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full bg-success" />
          <Text className="text-xs text-muted">
            {price ? `Online · ${price}` : 'Online'}
          </Text>
        </View>
      );
    },
    // Sends a real message, so the backend hands the chat to an astrologer.
    onPress: (_recommendation, { sendMessage }) =>
      sendMessage("I'd like to talk to an astrologer."),
  },

  article: {
    label: 'Article',
    icon: '📖',
    accent: '#FBBF24',
    ctaLabel: 'Read article',
    Body: ({ recommendation }) => {
      const minutes = readNumber(recommendation, 'readMinutes');
      return (
        <CardDetail>{minutes ? `${minutes} min read` : undefined}</CardDetail>
      );
    },
  },

  promotion: {
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
      showAlert('🎁 Offer applied', code && `Use code ${code} at checkout.`);
    },
  },

  remedy: {
    label: 'Remedy',
    icon: '🪔',
    accent: '#FB923C',
    ctaLabel: 'View remedy',
  },

  panchang: {
    label: 'Panchang',
    icon: '📅',
    accent: '#2DD4BF',
    ctaLabel: 'Open panchang',
  },
};

/** For types this app version doesn't know yet: shown instead of crashing. */
const FALLBACK: RecommendationDefinition = {
  label: 'For you',
  icon: '✨',
  accent: '#A78BFA',
  ctaLabel: 'Open',
};

export function getRecommendationDefinition(
  type: string,
): RecommendationDefinition {
  return Object.hasOwn(RECOMMENDATION_TYPES, type)
    ? RECOMMENDATION_TYPES[type]
    : FALLBACK;
}
