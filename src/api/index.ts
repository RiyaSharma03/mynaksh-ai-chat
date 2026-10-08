import { env } from '../config/env';
import { httpConversationApi } from './http/httpConversationApi';
import { mockConversationApi } from './mock/mockConversationApi';
import type { ConversationApi } from './types';

/**
 * The app always calls `conversationApi`. Which backend answers is decided
 * once, here, from API_MODE in .env.
 */
export const conversationApi: ConversationApi =
  env.apiMode === 'http' ? httpConversationApi : mockConversationApi;
