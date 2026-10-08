import { configureStore } from '@reduxjs/toolkit';
import { conversationReducer } from '../features/chat/conversationSlice';
import { registerFeedbackSync } from '../features/feedback/syncFeedback';
import { listenerMiddleware } from './listener';

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

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
