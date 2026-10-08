import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Chip } from '../../../components/Chip';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  feedbackRated,
  feedbackReasonToggled,
  selectMessageById,
} from '../../../store/slices/conversationSlice';
import { FEEDBACK_REASONS, type FeedbackReason } from '../../../types/feedback';

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
        <Chip
          label="👍"
          accessibilityLabel="Like"
          selected={feedback.rating === 'like'}
          onPress={() => rate('like')}
        />
        <Chip
          label="👎"
          accessibilityLabel="Dislike"
          selected={feedback.rating === 'dislike'}
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
            {REASONS.map(([reason, label]) => (
              <Chip
                key={reason}
                label={label}
                selected={feedback.reasons.includes(reason)}
                onPress={() =>
                  dispatch(feedbackReasonToggled({ messageId, reason }))
                }
              />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
