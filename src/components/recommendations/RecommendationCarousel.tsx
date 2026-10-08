import { memo } from 'react';
import {
  Alert,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from 'react-native';
import { getRecommendationDefinition } from '../../constants/recommendationTypes';
import { useAppDispatch } from '../../store/hooks';
import { sendMessage } from '../../store/slices/conversationSlice';
import type {
  Recommendation,
  RecommendationActions,
} from '../../types/recommendation';

const CARD_WIDTH = 208;

/**
 * The shared card shell: layout, press feedback, accessibility and the
 * button are written once here. The definition only supplies identity
 * (icon, label, accent, button text), an optional Body and a press handler.
 */
function RecommendationCardView({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const dispatch = useAppDispatch();
  const definition = getRecommendationDefinition(recommendation.type);

  // What a definition's onPress is allowed to do.
  const actions: RecommendationActions = {
    showAlert: (title, message) => Alert.alert(title, message),
    sendMessage: text => dispatch(sendMessage(text)),
  };
  const { accent, Body } = definition;

  const onPress = () =>
    definition.onPress
      ? definition.onPress(recommendation, actions)
      : actions.showAlert(
          `${definition.icon} ${recommendation.title}`,
          recommendation.subtitle,
        );

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${definition.label}: ${recommendation.title}. ${definition.ctaLabel}`}
      className="h-44 justify-between rounded-2xl border border-border bg-surface p-3.5 active:opacity-80"
      style={{ width: CARD_WIDTH }}
    >
      <View className="gap-1.5">
        <View className="flex-row items-center gap-2">
          <View
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent}26` }}
          >
            <Text className="text-base">{definition.icon}</Text>
          </View>
          <Text
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: accent }}
          >
            {definition.label}
          </Text>
        </View>
        <Text
          className="text-[15px] font-semibold leading-5 text-foreground"
          numberOfLines={2}
        >
          {recommendation.title}
        </Text>
        {recommendation.subtitle && (
          <Text className="text-xs text-muted" numberOfLines={1}>
            {recommendation.subtitle}
          </Text>
        )}
        {Body && <Body recommendation={recommendation} />}
      </View>
      <Text className="text-[13px] font-semibold" style={{ color: accent }}>
        {definition.ctaLabel} →
      </Text>
    </Pressable>
  );
}

const RecommendationCard = memo(RecommendationCardView);

const GAP = 10;
const CONTENT_STYLE = { paddingHorizontal: 12, gap: GAP };

const keyExtractor = (item: Recommendation) => item.id;
const renderItem = ({ item }: ListRenderItemInfo<Recommendation>) => (
  <RecommendationCard recommendation={item} />
);

/** Horizontal, snap-scrolling cards under an AI message. */
export function RecommendationCarousel({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <FlatList
      horizontal
      data={recommendations}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + GAP}
      decelerationRate="fast"
      contentContainerStyle={CONTENT_STYLE}
      className="-mx-3 mt-2"
    />
  );
}
