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
import { useAppSelector } from '../../store/hooks';
import { selectTypingSender } from '../../store/slices/conversationSlice';
import { useTheme } from '../../theme/useTheme';
import { AppLogo } from '../ui/AppLogo';
import { SenderLabel } from '../ui/SenderLabel';

/** "… is typing" row, labelled with whoever is answering: the AI or an astrologer. */
export function TypingIndicator() {
  const sender = useAppSelector(selectTypingSender);
  const isHuman = sender?.type === 'human';
  const name = isHuman ? sender.name : 'AI Astrologer';

  return (
    <View className="mt-3 px-3" accessibilityLabel={`${name} is typing`}>
      {isHuman ? (
        <SenderLabel icon="👨‍🏫" name={name} badge="Astrologer" />
      ) : (
        <SenderLabel icon={<AppLogo size={18} />} name={name} />
      )}
      <View className="self-start rounded-2xl border border-border bg-surface px-4 py-3.5">
        <View className="flex-row gap-1.5">
          {[0, 1, 2].map(index => (
            <Dot key={index} index={index} />
          ))}
        </View>
      </View>
    </View>
  );
}

/** One bouncing dot (UI thread, Reanimated); offset by index so three form a wave. */
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

const styles = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: 4 },
});
