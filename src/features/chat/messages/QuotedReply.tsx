import { Text, View } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { selectMessageById } from '../../../store/slices/conversationSlice';
import { senderName } from '../senderName';

/** The quoted original inside a reply bubble. Selects the original itself by id. */
export function QuotedReply({ id }: { id: string }) {
  const original = useAppSelector(state => selectMessageById(state, id));
  return (
    <View className="mb-1.5 rounded-lg border-l-2 border-white/70 bg-white/15 px-2.5 py-1.5">
      {original ? (
        <>
          <Text className="text-xs font-semibold text-white">
            {senderName(original)}
          </Text>
          <Text className="text-xs text-white/80" numberOfLines={2}>
            {original.text}
          </Text>
        </>
      ) : (
        <Text className="text-xs italic text-white/80">
          Original message was deleted
        </Text>
      )}
    </View>
  );
}
