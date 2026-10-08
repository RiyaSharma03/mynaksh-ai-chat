import { configureStore } from '@reduxjs/toolkit';
import { conversationReducer } from './slices/conversationSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      conversation: conversationReducer,
    },
  });

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
