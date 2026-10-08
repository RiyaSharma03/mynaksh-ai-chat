import { conversationService } from '../src/services/conversationService';
import { makeStore } from '../src/store';
import {
  feedbackRated,
  feedbackReasonToggled,
  loadConversation,
  saveFeedback,
  selectMessageById,
} from '../src/store/slices/conversationSlice';

jest.mock('../src/services/conversationService', () => ({
  conversationService: {
    fetchConversation: jest.fn(),
    sendMessage: jest.fn(),
    getReplies: jest.fn(),
    submitFeedback: jest.fn(),
  },
}));
const api = conversationService as jest.Mocked<typeof conversationService>;

async function storeWithAiMessage() {
  api.fetchConversation.mockResolvedValue([
    {
      id: 'ai',
      type: 'ai',
      text: 'Saturn…',
      createdAt: 1,
      recommendations: [],
      feedback: { rating: null, reasons: [] },
    },
  ]);
  api.submitFeedback.mockResolvedValue();
  const store = makeStore();
  await store.dispatch(loadConversation());
  const feedback = () => {
    const message = selectMessageById(store.getState(), 'ai');
    return message?.type === 'ai' ? message.feedback : undefined;
  };
  return { store, feedback };
}

beforeEach(() => jest.clearAllMocks());

it('likes, and tapping like again clears it', async () => {
  const { store, feedback } = await storeWithAiMessage();
  store.dispatch(feedbackRated({ messageId: 'ai', rating: 'like' }));
  expect(feedback()?.rating).toBe('like');
  store.dispatch(feedbackRated({ messageId: 'ai', rating: 'like' }));
  expect(feedback()?.rating).toBeNull();
});

it('toggles reasons on a dislike, and clears them when switching to like', async () => {
  const { store, feedback } = await storeWithAiMessage();
  store.dispatch(feedbackRated({ messageId: 'ai', rating: 'dislike' }));
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'too_long' }),
  );
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'inaccurate' }),
  );
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'too_long' }),
  );
  expect(feedback()).toEqual({ rating: 'dislike', reasons: ['inaccurate'] });

  store.dispatch(feedbackRated({ messageId: 'ai', rating: 'like' }));
  expect(feedback()).toEqual({ rating: 'like', reasons: [] });
});

it('ignores reasons unless the message is disliked', async () => {
  const { store, feedback } = await storeWithAiMessage();
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'too_long' }),
  );
  expect(feedback()?.reasons).toEqual([]);
});

it('saves the current feedback to the backend', async () => {
  const { store } = await storeWithAiMessage();
  store.dispatch(feedbackRated({ messageId: 'ai', rating: 'dislike' }));
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'too_generic' }),
  );

  await store.dispatch(saveFeedback('ai'));

  expect(api.submitFeedback).toHaveBeenCalledWith({
    messageId: 'ai',
    feedback: { rating: 'dislike', reasons: ['too_generic'] },
  });
});
