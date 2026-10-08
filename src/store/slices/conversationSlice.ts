import {
  createEntityAdapter,
  createSelector,
  createSlice,
  isAnyOf,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { conversationApi } from '../../api/conversationApi';
import type { TypingSender } from '../../api/conversationApi';
import type { FeedbackReason } from '../../types/feedback';
import type { RootState } from '..';
import { createAppAsyncThunk } from '../hooks';
import type { Message, UserMessage } from '../../types/message';
import { buildTimeline } from '../../utils/buildTimeline';

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
  /**
   * Who is typing a reply, keyed by the user message being answered. A map,
   * so overlapping replies each clear only their own entry.
   */
  typing: {} as Record<string, TypingSender>,
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
    dispatch(requestReplies({ messageId: id, text: message.text }));
    return result;
  },
);

/**
 * Asks the backend for the answer to a delivered message. Whoever answers
 * (AI or astrologer), each reply enters through messageReceived, the same
 * action a socket push would use.
 */
const requestReplies = createAppAsyncThunk(
  'conversation/replies',
  async (input: { messageId: string; text: string }, { dispatch }) => {
    const replies = await conversationApi.getReplies(input, {
      onTyping: sender =>
        dispatch(typingChanged({ messageId: input.messageId, sender })),
    });
    replies.forEach(reply => dispatch(messageReceived(reply)));
  },
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

/** Saves an AI message's current feedback to the backend (after the UI has updated). */
export const saveFeedback = createAppAsyncThunk(
  'conversation/saveFeedback',
  async (messageId: string, { getState }) => {
    const message = getState().conversation.entities[messageId];
    if (message?.type !== 'ai') return;
    await conversationApi.submitFeedback({
      messageId,
      feedback: message.feedback,
    });
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
    /** Any incoming message, from any sender: the single entry point for replies. */
    messageReceived: messagesAdapter.upsertOne,
    typingChanged(
      state,
      action: PayloadAction<{ messageId: string; sender: TypingSender }>,
    ) {
      state.typing[action.payload.messageId] = action.payload.sender;
    },
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
    /** 👍 / 👎. Tapping the active rating again clears it. Reasons only apply to a dislike. */
    feedbackRated(
      state,
      action: PayloadAction<{ messageId: string; rating: 'like' | 'dislike' }>,
    ) {
      const message = state.entities[action.payload.messageId];
      if (message?.type !== 'ai') return;
      const { feedback } = message;
      feedback.rating =
        feedback.rating === action.payload.rating
          ? null
          : action.payload.rating;
      if (feedback.rating !== 'dislike') feedback.reasons = [];
    },
    feedbackReasonToggled(
      state,
      action: PayloadAction<{ messageId: string; reason: FeedbackReason }>,
    ) {
      const message = state.entities[action.payload.messageId];
      if (message?.type !== 'ai' || message.feedback.rating !== 'dislike')
        return;
      const { reasons } = message.feedback;
      const index = reasons.indexOf(action.payload.reason);
      if (index >= 0) reasons.splice(index, 1);
      else reasons.push(action.payload.reason);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadConversation.pending, state => {
        state.loadStatus = 'loading';
      })
      .addCase(loadConversation.fulfilled, (state, action) => {
        state.loadStatus = 'ready';
        messagesAdapter.setAll(state, action.payload);
      })
      .addCase(loadConversation.rejected, state => {
        state.loadStatus = 'error';
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
      .addMatcher(
        isAnyOf(requestReplies.fulfilled, requestReplies.rejected),
        (state, action) => {
          delete state.typing[action.meta.arg.messageId];
        },
      );
  },
});

export const conversationReducer = conversationSlice.reducer;
const { messageAdded, messageReceived, typingChanged } =
  conversationSlice.actions;

export const {
  messageRemoved,
  messageSelected,
  replyStarted,
  replyCancelled,
  feedbackRated,
  feedbackReasonToggled,
} = conversationSlice.actions;

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectTotal: selectMessageCount,
} = messagesAdapter.getSelectors<RootState>(state => state.conversation);

export const selectLoadStatus = (state: RootState) =>
  state.conversation.loadStatus;

/** Whoever is typing a reply right now, if anyone (the first, if several). */
export const selectTypingSender = (
  state: RootState,
): TypingSender | undefined => Object.values(state.conversation.typing)[0];

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
