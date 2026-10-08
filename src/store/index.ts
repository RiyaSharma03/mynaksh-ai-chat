import { configureStore } from '@reduxjs/toolkit';
import { conversationReducer } from './slices/conversationSlice';
import { registerFeedbackSync } from './listeners/feedbackSync';
import { listenerMiddleware } from './listenerMiddleware';

// Clear first: Fast Refresh re-runs this module, and listeners must not stack up.
listenerMiddleware.clearListeners();
registerFeedbackSync();

export const makeStore = () =>
  configureStore({
    reducer: {
      conversation: conversationReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
