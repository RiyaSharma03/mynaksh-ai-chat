import { conversationApi } from '../../api';
import { makeStore } from '../../store';
import {
  feedbackRated,
  feedbackReasonToggled,
  loadConversation,
  selectMessageById,
} from '../chat/conversationSlice';

jest.mock('../../api', () => ({
  conversationApi: {
    fetchConversation: jest.fn(),
    sendMessage: jest.fn(),
    getReplies: jest.fn(),
    submitFeedback: jest.fn(),
  },
}));
const api = conversationApi as jest.Mocked<typeof conversationApi>;

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

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

it('syncs to the server once, with the final state, after rapid changes', async () => {
  const { store } = await storeWithAiMessage();
  store.dispatch(feedbackRated({ messageId: 'ai', rating: 'dislike' }));
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'too_generic' }),
  );
  store.dispatch(
    feedbackReasonToggled({ messageId: 'ai', reason: 'didnt_help' }),
  );
  expect(api.submitFeedback).not.toHaveBeenCalled();

  await wait(700);
  expect(api.submitFeedback).toHaveBeenCalledTimes(1);
  expect(api.submitFeedback).toHaveBeenCalledWith({
    messageId: 'ai',
    feedback: { rating: 'dislike', reasons: ['too_generic', 'didnt_help'] },
  });
});
