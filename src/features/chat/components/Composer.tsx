import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useTheme } from '../../../theme/useTheme';
import { cn } from '../../../utils/cn';
import { sendMessage } from '../../../store/slices/conversationSlice';
import { ReplyPreview } from './ReplyPreview';

/**
 * Message input. The draft is local state: nothing else needs it, and
 * keeping it out of Redux avoids a store update on every keystroke.
 */
export function Composer() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [text, setText] = useState('');
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const replyToId = useAppSelector(state => state.conversation.replyToId);

  // Starting a reply focuses the input, so you can type straight away.
  useEffect(() => {
    if (replyToId) inputRef.current?.focus();
  }, [replyToId]);
  const trimmed = text.trim();

  const send = () => {
    if (!trimmed) return;
    dispatch(sendMessage(trimmed));
    setText('');
  };

  return (
    <>
      <ReplyPreview />
      <View
        className="flex-row items-end gap-2 border-t border-border bg-surface px-3 pt-2"
        style={{ paddingBottom: bottom + 8 }}
      >
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder="Ask about your stars…"
          placeholderTextColor={colors.muted}
          multiline
          className="max-h-28 flex-1 rounded-3xl bg-raised px-4 pb-2.5 pt-2.5 text-[15px] text-foreground"
          accessibilityLabel="Message"
        />
        <Pressable
          onPress={send}
          disabled={!trimmed}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          className={cn(
            'h-10 w-10 items-center justify-center rounded-full bg-primary active:opacity-80',
            !trimmed && 'opacity-40',
          )}
        >
          <Text className="text-lg font-bold text-white">↑</Text>
        </Pressable>
      </View>
    </>
  );
}
