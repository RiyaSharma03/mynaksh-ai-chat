import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { cn } from '../../../utils/cn';
import {
  feedbackRated,
  feedbackReasonToggled,
  selectMessageById,
} from '../../../store/slices/conversationSlice';
import { FEEDBACK_REASONS, type FeedbackReason } from '../types';

const REASONS = Object.entries(FEEDBACK_REASONS) as Array<
  [FeedbackReason, string]
>;

/**
 * 👍 / 👎 under an AI message; 👎 expands reason chips. Selects its own
 * message's feedback, so a tap re-renders this message only.
 */
export function FeedbackBar({ messageId }: { messageId: string }) {
  const dispatch = useAppDispatch();
  const feedback = useAppSelector(state => {
    const message = selectMessageById(state, messageId);
    return message?.type === 'ai' ? message.feedback : undefined;
  });
  if (!feedback) return null;

  const rate = (rating: 'like' | 'dislike') =>
    dispatch(feedbackRated({ messageId, rating }));

  return (
    <View className="mt-2 gap-2">
      <View className="flex-row items-center gap-2">
        <RatingButton
          icon="👍"
          label="Like"
          active={feedback.rating === 'like'}
          onPress={() => rate('like')}
        />
        <RatingButton
          icon="👎"
          label="Dislike"
          active={feedback.rating === 'dislike'}
          onPress={() => rate('dislike')}
        />
        {feedback.rating === 'like' && (
          <Animated.View entering={FadeIn}>
            <Text className="text-xs text-muted">Thanks for the feedback!</Text>
          </Animated.View>
        )}
      </View>

      {feedback.rating === 'dislike' && (
        // Layout animation on the UI thread: chips fade in and the row below slides down.
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          layout={LinearTransition}
        >
          <Text className="mb-1.5 text-xs text-muted">What went wrong?</Text>
          <View className="flex-row flex-wrap gap-2">
            {REASONS.map(([reason, label]) => {
              const selected = feedback.reasons.includes(reason);
              return (
                <Pressable
                  key={reason}
                  onPress={() =>
                    dispatch(feedbackReasonToggled({ messageId, reason }))
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={cn(
                    'rounded-full border px-3 py-1.5',
                    selected
                      ? 'border-primary bg-primary'
                      : 'border-border bg-surface',
                  )}
                >
                  <Text
                    className={cn(
                      'text-xs',
                      selected ? 'font-semibold text-white' : 'text-foreground',
                    )}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

interface RatingButtonProps {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}

function RatingButton({ icon, label, active, onPress }: RatingButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      className={cn(
        'rounded-full border px-2.5 py-1',
        active ? 'border-primary bg-primary' : 'border-border bg-surface',
      )}
    >
      <Text className="text-sm">{icon}</Text>
    </Pressable>
  );
}
