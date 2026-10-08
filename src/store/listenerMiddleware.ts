import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './index';

/**
 * Side effects that react to actions (e.g. syncing feedback to the server)
 * live in listeners, so components dispatch plain actions and never call
 * the network themselves.
 */
export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
