import { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenMessage } from '../components/common/ScreenMessage';
import { Composer } from '../components/composer/Composer';
import { MessageActionSheet } from '../components/message-actions/MessageActionSheet';
import { MessageList } from '../components/chat-timeline/MessageList';
import {
  loadConversation,
  selectLoadStatus,
  selectMessageCount,
} from '../store/slices/conversationSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function ConversationScreen() {
  const dispatch = useAppDispatch();
  const { bottom } = useSafeAreaInsets();
  const loadStatus = useAppSelector(selectLoadStatus);
  const messageCount = useAppSelector(selectMessageCount);

  useEffect(() => {
    dispatch(loadConversation());
  }, [dispatch]);

  if (loadStatus === 'idle' || loadStatus === 'loading') {
    return <ScreenMessage loading title="Loading conversation..." />;
  }

  if (loadStatus === 'error') {
    return (
      <ScreenMessage
        title="Unable to load conversation."
        description="Check your connection and try again."
        action={{ label: 'Retry', onPress: () => dispatch(loadConversation()) }}
      />
    );
  }

  return (
    <View className="flex-1">
      {messageCount === 0 ? (
        <ScreenMessage
          title="Start your conversation."
          description="Ask about your career, love life, health or anything on your mind."
        />
      ) : (
        <MessageList />
      )}
      {/* Rides on top of the keyboard. When open, the safe-area padding
          slides behind the keyboard instead of leaving a gap. */}
      <KeyboardStickyView offset={{ closed: 0, opened: bottom }}>
        <Composer />
      </KeyboardStickyView>
      <MessageActionSheet />
    </View>
  );
}
