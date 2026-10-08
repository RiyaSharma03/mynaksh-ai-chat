import { View } from 'react-native';
import { SenderLabel } from '../ui/SenderLabel';
import { TypingDots } from '../ui/TypingDots';
import { useAppSelector } from '../../store/hooks';
import { selectTypingSender } from '../../store/slices/conversationSlice';

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
        <SenderLabel icon="✨" name={name} />
      )}
      <View className="self-start rounded-2xl border border-border bg-surface px-4 py-3.5">
        <TypingDots />
      </View>
    </View>
  );
}
