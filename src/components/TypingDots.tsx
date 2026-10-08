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
import { useTheme } from '../theme/useTheme';

/** One dot: fades and lifts, offset by its index so the three form a wave. */
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

/** Three bouncing dots, animated on the UI thread with Reanimated. */
export function TypingDots() {
  return (
    <View className="flex-row gap-1.5">
      {[0, 1, 2].map(index => (
        <Dot key={index} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: 4 },
});
