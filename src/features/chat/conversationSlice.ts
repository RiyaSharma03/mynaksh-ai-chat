import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { conversationApi } from '../../api';
import type { RootState } from '../../store';
import { createAppAsyncThunk } from '../../store/hooks';
import type { Message } from './types';

/**
 * Messages are normalized (ids + entities) by RTK's entity adapter and kept
 * sorted by time. Updating one message replaces only that entity, so only
 * that row re-renders.
 */
const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.createdAt - b.createdAt,
});

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

const initialState = messagesAdapter.getInitialState({
  loadStatus: 'idle' as LoadStatus,
  loadError: null as string | null,
});

export const loadConversation = createAppAsyncThunk(
  'conversation/load',
  () => conversationApi.fetchConversation(),
  {
    // Ignore a second load (e.g. a double-tapped Retry) while one is in flight.
    condition: (_, { getState }) =>
      getState().conversation.loadStatus !== 'loading',
  },
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadConversation.pending, state => {
        state.loadStatus = 'loading';
        state.loadError = null;
      })
      .addCase(loadConversation.fulfilled, (state, action) => {
        state.loadStatus = 'ready';
        messagesAdapter.setAll(state, action.payload);
      })
      .addCase(loadConversation.rejected, (state, action) => {
        state.loadStatus = 'error';
        state.loadError =
          action.error.message ?? 'Unable to load conversation.';
      });
  },
});

export const conversationReducer = conversationSlice.reducer;

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectIds: selectMessageIds,
  selectTotal: selectMessageCount,
} = messagesAdapter.getSelectors<RootState>(state => state.conversation);

export const selectLoadStatus = (state: RootState) =>
  state.conversation.loadStatus;
