import { Pressable, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  replyCancelled,
  selectReplyTarget,
} from '../../../store/slices/conversationSlice';
import { senderName } from '../senderName';

/** "Replying to …" bar above the composer. Reads the reply target from the store. */
export function ReplyPreview() {
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectReplyTarget);
  if (!target) return null;

  return (
    <View className="flex-row items-center gap-3 border-t border-border bg-surface px-4 py-2">
      <View className="flex-1 border-l-2 border-primary pl-2.5">
        <Text className="text-xs font-semibold text-primary">
          Replying to {senderName(target)}
        </Text>
        <Text className="text-xs text-muted" numberOfLines={1}>
          {target.text}
        </Text>
      </View>
      <Pressable
        onPress={() => dispatch(replyCancelled())}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Cancel reply"
      >
        <Text className="text-base text-muted">✕</Text>
      </Pressable>
    </View>
  );
}
