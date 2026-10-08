import { configureStore } from '@reduxjs/toolkit';
import { conversationApi } from '../../api';
import type { Message } from './types';
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
  selectIsAiTyping,
  selectLoadStatus,
  sendMessage,
} from './conversationSlice';

jest.mock('../../api', () => ({
  conversationApi: {
    fetchConversation: jest.fn(),
    sendMessage: jest.fn(),
    getAiReply: jest.fn(),
  },
}));
const fetchConversation = conversationApi.fetchConversation as jest.Mock;
const sendMessageApi = conversationApi.sendMessage as jest.Mock;
const getAiReply = conversationApi.getAiReply as jest.Mock;

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
  getAiReply.mockReset();
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
  it('adds the message optimistically, marks it sent, then adds the AI reply', async () => {
    let finishSend: (value: { createdAt: number }) => void = () => {};
    sendMessageApi.mockReturnValue(
      new Promise(resolve => (finishSend = resolve)),
    );
    let finishReply: (reply: Message) => void = () => {};
    getAiReply.mockReturnValue(new Promise(resolve => (finishReply = resolve)));
    const store = makeStore();

    const sending = store.dispatch(sendMessage('Hello'));
    expect(userMessages(store)).toMatchObject([
      { text: 'Hello', status: 'sending' },
    ]);

    finishSend({ createdAt: Date.now() });
    await sending;
    expect(userMessages(store)[0].status).toBe('sent');
    expect(selectIsAiTyping(store.getState())).toBe(true);

    finishReply({
      id: 'reply',
      type: 'ai',
      text: 'Hi',
      createdAt: Date.now() + 1000,
      recommendations: [],
      feedback: { rating: null, reasons: [] },
    });
    await new Promise<void>(resolve => setTimeout(resolve, 0));
    expect(selectIsAiTyping(store.getState())).toBe(false);
    expect(selectAllMessages(store.getState()).map(m => m.type)).toEqual([
      'user',
      'ai',
    ]);
  });

  it('marks a failed send, and Retry re-sends the same message', async () => {
    sendMessageApi.mockRejectedValueOnce(new Error('offline'));
    sendMessageApi.mockResolvedValueOnce({ createdAt: Date.now() });
    getAiReply.mockReturnValue(new Promise(() => {}));
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
