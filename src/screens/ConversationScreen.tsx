import { useEffect } from 'react';
import { StateView } from '../components/StateView';
import { MessageList } from '../features/chat/components/MessageList';
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

  return <MessageList />;
}
