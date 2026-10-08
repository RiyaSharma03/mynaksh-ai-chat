import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme/useTheme';
import { SenderLabel } from '../messages/SenderLabel';

/** Three bouncing dots, animated on the UI thread with Reanimated. */
function Dot({ index }: { index: number }) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 150,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(progress);
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + progress.value * 0.6,
    transform: [{ translateY: -3 * progress.value }],
  }));

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: colors.muted }, animatedStyle]}
    />
  );
}

export function TypingIndicator() {
  return (
    <View className="mt-3 px-3" accessibilityLabel="AI Astrologer is typing">
      <SenderLabel icon="✨" name="AI Astrologer" />
      <View className="flex-row gap-1.5 self-start rounded-2xl border border-border bg-surface px-4 py-3.5">
        {[0, 1, 2].map(index => (
          <Dot key={index} index={index} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: 4 },
});
