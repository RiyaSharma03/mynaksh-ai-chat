import { FlatList, type ListRenderItemInfo } from 'react-native';
import type { Recommendation } from '../types';
import { CARD_WIDTH, RecommendationCard } from './RecommendationCard';

const GAP = 10;
const CONTENT_STYLE = { paddingHorizontal: 12, gap: GAP };

const keyExtractor = (item: Recommendation) => item.id;
const renderItem = ({ item }: ListRenderItemInfo<Recommendation>) => (
  <RecommendationCard recommendation={item} />
);

/** Horizontal, snap-scrolling cards under an AI message. */
export function RecommendationRail({
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
