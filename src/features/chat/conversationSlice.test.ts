import { configureStore } from '@reduxjs/toolkit';
import { conversationApi } from '../../api';
import type { Message } from './types';
import {
  conversationReducer,
  loadConversation,
  selectAllMessages,
  selectLoadStatus,
} from './conversationSlice';

jest.mock('../../api', () => ({
  conversationApi: { fetchConversation: jest.fn(), sendMessage: jest.fn() },
}));
const fetchConversation = conversationApi.fetchConversation as jest.Mock;

const makeStore = () =>
  configureStore({ reducer: { conversation: conversationReducer } });

const message = (id: string, createdAt: number): Message => ({
  id,
  type: 'system',
  text: id,
  createdAt,
});

beforeEach(() => fetchConversation.mockReset());

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
