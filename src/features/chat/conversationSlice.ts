import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { conversationApi } from '../../api';
import type { RootState } from '../../store';
import { createAppAsyncThunk } from '../../store/hooks';
import { buildTimeline } from './timeline';
import type { Message, UserMessage } from './types';

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
  /** AI replies in flight; > 0 shows the typing indicator. */
  pendingAiReplies: 0,
  /** The long-pressed message whose action sheet is open. */
  selectedMessageId: null as string | null,
  /** The message the composer is replying to. */
  replyToId: null as string | null,
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

/**
 * Delivers a user message that is already in the store. Used for the first
 * attempt and for Retry, so there is one code path. Its lifecycle drives
 * the message status: pending -> sending, fulfilled -> sent, rejected -> failed.
 */
export const deliverMessage = createAppAsyncThunk(
  'conversation/deliver',
  async (id: string, { getState, dispatch }) => {
    const message = getState().conversation.entities[id];
    if (message?.type !== 'user') throw new Error('Message no longer exists');

    const result = await conversationApi.sendMessage({
      id,
      text: message.text,
      replyToId: message.replyToId,
    });
    dispatch(requestAiReply({ messageId: id, text: message.text }));
    return result;
  },
);

export const requestAiReply = createAppAsyncThunk(
  'conversation/aiReply',
  (input: { messageId: string; text: string }) =>
    conversationApi.getAiReply(input),
);

/**
 * Optimistic send: the message appears immediately with a client id
 * (status 'sending'), then delivery runs. The id never changes, so the
 * row never remounts when the server confirms.
 */
export const sendMessage = createAppAsyncThunk(
  'conversation/send',
  async (text: string, { dispatch, getState }) => {
    const message: UserMessage = {
      id: nanoid(),
      type: 'user',
      text,
      createdAt: Date.now(),
      status: 'sending',
      replyToId: getState().conversation.replyToId ?? undefined,
    };
    dispatch(messageAdded(message));
    dispatch(replyCancelled());
    await dispatch(deliverMessage(message.id));
  },
);

/** Sets a user message's status, if it still exists (it may be deleted mid-send). */
function setStatus(
  state: typeof initialState,
  id: string,
  status: UserMessage['status'],
) {
  const message = state.entities[id];
  if (message?.type === 'user') message.status = status;
}

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    messageAdded: messagesAdapter.addOne,
    /**
     * Delete. The entity adapter removes it from ids + entities; FlashList's
     * maintainVisibleContentPosition keeps the viewport where it was.
     */
    messageRemoved(state, action: PayloadAction<string>) {
      messagesAdapter.removeOne(state, action.payload);
      if (state.replyToId === action.payload) state.replyToId = null;
      if (state.selectedMessageId === action.payload)
        state.selectedMessageId = null;
    },
    messageSelected(state, action: PayloadAction<string | null>) {
      state.selectedMessageId = action.payload;
    },
    replyStarted(state, action: PayloadAction<string>) {
      state.replyToId = action.payload;
    },
    replyCancelled(state) {
      state.replyToId = null;
    },
  },
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
      })
      .addCase(deliverMessage.pending, (state, action) => {
        setStatus(state, action.meta.arg, 'sending');
      })
      .addCase(deliverMessage.fulfilled, (state, action) => {
        // Keep the client createdAt, so the message doesn't jump position.
        setStatus(state, action.meta.arg, 'sent');
      })
      .addCase(deliverMessage.rejected, (state, action) => {
        setStatus(state, action.meta.arg, 'failed');
      })
      .addCase(requestAiReply.pending, state => {
        state.pendingAiReplies += 1;
      })
      .addCase(requestAiReply.fulfilled, (state, action) => {
        state.pendingAiReplies -= 1;
        messagesAdapter.addOne(state, action.payload);
      })
      .addCase(requestAiReply.rejected, state => {
        state.pendingAiReplies -= 1;
      });
  },
});

export const conversationReducer = conversationSlice.reducer;
export const {
  messageAdded,
  messageRemoved,
  messageSelected,
  replyStarted,
  replyCancelled,
} = conversationSlice.actions;

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectIds: selectMessageIds,
  selectTotal: selectMessageCount,
} = messagesAdapter.getSelectors<RootState>(state => state.conversation);

export const selectLoadStatus = (state: RootState) =>
  state.conversation.loadStatus;

export const selectIsAiTyping = (state: RootState) =>
  state.conversation.pendingAiReplies > 0;

export const selectSelectedMessage = (state: RootState) => {
  const id = state.conversation.selectedMessageId;
  return id ? state.conversation.entities[id] : undefined;
};

export const selectReplyTarget = (state: RootState) => {
  const id = state.conversation.replyToId;
  return id ? state.conversation.entities[id] : undefined;
};

/** List rows (date separators + grouping). Memoized: recomputed only when messages change. */
export const selectTimeline = createSelector([selectAllMessages], messages =>
  buildTimeline(messages),
);
