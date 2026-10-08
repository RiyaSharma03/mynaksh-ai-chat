import { configureStore } from '@reduxjs/toolkit';
import {
  conversationService,
  type TypingSender,
} from '../src/services/conversationService';
import type { Message } from '../src/types/message';
import {
  conversationReducer,
  deliverMessage,
  loadConversation,
  messageRemoved,
  messageSelected,
  replyStarted,
  selectAllMessages,
  selectReplyTarget,
  selectSelectedMessage,
  selectTypingSender,
  selectLoadStatus,
  sendMessage,
} from '../src/store/slices/conversationSlice';

jest.mock('../src/services/conversationService', () => ({
  conversationService: {
    fetchConversation: jest.fn(),
    sendMessage: jest.fn(),
    getReplies: jest.fn(),
  },
}));
const fetchConversation = conversationService.fetchConversation as jest.Mock;
const sendMessageApi = conversationService.sendMessage as jest.Mock;
const getReplies = conversationService.getReplies as jest.Mock;

const makeStore = () =>
  configureStore({ reducer: { conversation: conversationReducer } });

const message = (id: string, createdAt: number): Message => ({
  id,
  type: 'system',
  text: id,
  createdAt,
});

beforeEach(() => {
  fetchConversation.mockReset();
  sendMessageApi.mockReset();
  getReplies.mockReset();
});

it('loads messages sorted by time', async () => {
  fetchConversation.mockResolvedValue([
    message('late', 2),
    message('early', 1),
  ]);
  const store = makeStore();

  const pending = store.dispatch(loadConversation());
  expect(selectLoadStatus(store.getState())).toBe('loading');
  await pending;

  expect(selectLoadStatus(store.getState())).toBe('ready');
  expect(selectAllMessages(store.getState()).map(m => m.id)).toEqual([
    'early',
    'late',
  ]);
});

it('goes to error, then Retry recovers', async () => {
  fetchConversation.mockRejectedValueOnce(new Error('offline'));
  fetchConversation.mockResolvedValueOnce([message('a', 1)]);
  const store = makeStore();

  await store.dispatch(loadConversation());
  expect(selectLoadStatus(store.getState())).toBe('error');

  await store.dispatch(loadConversation());
  expect(selectLoadStatus(store.getState())).toBe('ready');
});

it('ignores a second load while one is in flight', async () => {
  fetchConversation.mockResolvedValue([]);
  const store = makeStore();

  await Promise.all([
    store.dispatch(loadConversation()),
    store.dispatch(loadConversation()),
  ]);
  expect(fetchConversation).toHaveBeenCalledTimes(1);
});

const userMessages = (store: ReturnType<typeof makeStore>) =>
  selectAllMessages(store.getState()).flatMap(m =>
    m.type === 'user' ? [m] : [],
  );

describe('sending', () => {
  /** getReplies that reports `sender` as typing, then waits for `finish`. */
  const deferredReplies = (sender: TypingSender) => {
    let finish: (replies: Message[]) => void = () => {};
    getReplies.mockImplementation((_input, { onTyping }) => {
      onTyping(sender);
      return new Promise(resolve => (finish = resolve));
    });
    return (replies: Message[]) => finish(replies);
  };
  const flush = () => new Promise<void>(resolve => setTimeout(resolve, 0));

  it('adds the message optimistically, marks it sent, then adds the AI reply', async () => {
    let finishSend: (value: { createdAt: number }) => void = () => {};
    sendMessageApi.mockReturnValue(
      new Promise(resolve => (finishSend = resolve)),
    );
    const finishReplies = deferredReplies({ type: 'ai' });
    const store = makeStore();

    const sending = store.dispatch(sendMessage('Hello'));
    expect(userMessages(store)).toMatchObject([
      { text: 'Hello', status: 'sending' },
    ]);

    finishSend({ createdAt: Date.now() });
    await sending;
    expect(userMessages(store)[0].status).toBe('sent');
    expect(selectTypingSender(store.getState())).toEqual({ type: 'ai' });

    finishReplies([
      {
        id: 'reply',
        type: 'ai',
        text: 'Hi',
        createdAt: Date.now() + 1000,
        recommendations: [],
        feedback: { rating: null, reasons: [] },
      },
    ]);
    await flush();
    expect(selectTypingSender(store.getState())).toBeUndefined();
    expect(selectAllMessages(store.getState()).map(m => m.type)).toEqual([
      'user',
      'ai',
    ]);
  });

  it('hands off to an astrologer: names them while typing, then adds their messages', async () => {
    sendMessageApi.mockResolvedValue({ createdAt: Date.now() });
    const finishReplies = deferredReplies({ type: 'human', name: 'Vinod' });
    const store = makeStore();

    await store.dispatch(sendMessage('Can I talk to an astrologer?'));
    expect(selectTypingSender(store.getState())).toEqual({
      type: 'human',
      name: 'Vinod',
    });

    const later = Date.now() + 1000;
    finishReplies([
      message('joined', later),
      {
        id: 'h',
        type: 'human',
        text: 'Namaste',
        createdAt: later + 1,
        author: { name: 'Vinod' },
      },
    ]);
    await flush();
    expect(selectTypingSender(store.getState())).toBeUndefined();
    expect(selectAllMessages(store.getState()).map(m => m.type)).toEqual([
      'user',
      'system',
      'human',
    ]);
  });

  it('marks a failed send, and Retry re-sends the same message', async () => {
    sendMessageApi.mockRejectedValueOnce(new Error('offline'));
    sendMessageApi.mockResolvedValueOnce({ createdAt: Date.now() });
    getReplies.mockReturnValue(new Promise(() => {}));
    const store = makeStore();

    await store.dispatch(sendMessage('Hello'));
    const [failed] = userMessages(store);
    expect(failed.status).toBe('failed');

    await store.dispatch(deliverMessage(failed.id));
    expect(userMessages(store)).toMatchObject([
      { id: failed.id, status: 'sent' },
    ]);
    expect(sendMessageApi).toHaveBeenCalledTimes(2);
  });
});

describe('actions', () => {
  const loadedStore = async () => {
    fetchConversation.mockResolvedValue([message('a', 1), message('b', 2)]);
    const store = makeStore();
    await store.dispatch(loadConversation());
    return store;
  };

  it('delete removes the message and clears a reply or selection pointing at it', async () => {
    const store = await loadedStore();
    store.dispatch(replyStarted('a'));
    store.dispatch(messageSelected('a'));

    store.dispatch(messageRemoved('a'));

    expect(selectAllMessages(store.getState()).map(m => m.id)).toEqual(['b']);
    expect(selectReplyTarget(store.getState())).toBeUndefined();
    expect(selectSelectedMessage(store.getState())).toBeUndefined();
  });

  it('a sent reply carries replyToId, and the reply bar clears', async () => {
    const store = await loadedStore();
    sendMessageApi.mockReturnValue(new Promise(() => {}));
    store.dispatch(replyStarted('b'));

    store.dispatch(sendMessage('Thanks!'));

    expect(userMessages(store)).toMatchObject([
      { text: 'Thanks!', replyToId: 'b' },
    ]);
    expect(selectReplyTarget(store.getState())).toBeUndefined();
  });

  it('a message deleted while sending is not brought back', async () => {
    const store = makeStore();
    let fail: (error: Error) => void = () => {};
    sendMessageApi.mockReturnValue(new Promise((_, reject) => (fail = reject)));

    const sending = store.dispatch(sendMessage('Oops'));
    store.dispatch(messageRemoved(userMessages(store)[0].id));
    fail(new Error('offline'));
    await sending;

    expect(selectAllMessages(store.getState())).toEqual([]);
  });
});
