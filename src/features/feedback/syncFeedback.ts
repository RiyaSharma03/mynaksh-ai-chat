import type { UnknownAction } from '@reduxjs/toolkit';
import { conversationApi } from '../../api';
import { startAppListening } from '../../store/listener';
import {
  feedbackRated,
  feedbackReasonToggled,
} from '../chat/conversationSlice';

type FeedbackAction =
  | ReturnType<typeof feedbackRated>
  | ReturnType<typeof feedbackReasonToggled>;

/**
 * Reads the action creators when an action arrives, not when this module
 * loads, so a Fast Refresh that re-runs modules in a different order can't
 * leave a captured `undefined` behind.
 */
function isFeedbackChange(action: UnknownAction): action is FeedbackAction {
  return feedbackRated.match(action) || feedbackReasonToggled.match(action);
}
const DEBOUNCE_MS = 600;

/**
 * Sends feedback to the server after the UI has already updated (the
 * reducer ran first). Debounced per message: if the same message's feedback
 * changes again within 600 ms, this run steps aside and the newer one sends,
 * so tapping several chips makes one request with the final state.
 * Fire-and-forget: a failed sync doesn't undo what the user chose.
 */
export function registerFeedbackSync() {
  startAppListening({
    matcher: isFeedbackChange,
    effect: async (action, api) => {
      const { messageId } = action.payload;
      const changedAgain = await api.condition(
        next => isFeedbackChange(next) && next.payload.messageId === messageId,
        DEBOUNCE_MS,
      );
      if (changedAgain) return;

      const message = api.getState().conversation.entities[messageId];
      if (message?.type !== 'ai') return;
      await conversationApi
        .submitFeedback({ messageId, feedback: message.feedback })
        .catch(() => {});
    },
  });
}
