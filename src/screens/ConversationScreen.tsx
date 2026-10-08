import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { StateView } from '../components/StateView';
import {
  loadConversation,
  selectLoadStatus,
  selectMessageCount,
} from '../features/chat/conversationSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function ConversationScreen() {
  const dispatch = useAppDispatch();
  const loadStatus = useAppSelector(selectLoadStatus);
  const messageCount = useAppSelector(selectMessageCount);

  useEffect(() => {
    dispatch(loadConversation());
  }, [dispatch]);

  if (loadStatus === 'idle' || loadStatus === 'loading') {
    return <StateView loading title="Loading conversation..." />;
  }

  if (loadStatus === 'error') {
    return (
      <StateView
        title="Unable to load conversation."
        description="Check your connection and try again."
        action={{ label: 'Retry', onPress: () => dispatch(loadConversation()) }}
      />
    );
  }

  if (messageCount === 0) {
    return (
      <StateView
        title="Start your conversation."
        description="Ask about your career, love life, health or anything on your mind."
      />
    );
  }

  // Temporary until the timeline lands in step 4.
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-muted">{messageCount} messages loaded</Text>
    </View>
  );
}
