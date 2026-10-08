import { apiConversationService } from '../api/conversationApi';
import { USE_MOCK_API } from '../config/env';
import { mockConversationService } from '../mocks/handlers/conversationHandlers';
import type { Feedback } from '../types/feedback';
import type { Message } from '../types/message';

/**
 * What the app needs from a backend. The mock and the real API both
 * implement it, so the rest of the app can't tell which one it is using.
 */
export interface ConversationService {
  fetchConversation(): Promise<Message[]>;
  sendMessage(input: SendMessageInput): Promise<{ createdAt: number }>;
  /**
   * The answer to a delivered message. The backend decides who answers (the
   * AI, or an astrologer after a handoff), so it can be several messages from
   * any sender. `onTyping` reports who is typing meanwhile.
   */
  getReplies(input: ReplyInput, events: ReplyEvents): Promise<Message[]>;
  /** Stores the latest feedback on an AI message, replacing any earlier one. */
  submitFeedback(input: {
    messageId: string;
    feedback: Feedback;
  }): Promise<void>;
}

export interface SendMessageInput {
  /** Client-generated id, so a retried send can be de-duplicated by a server. */
  id: string;
  text: string;
  replyToId?: string;
}

export interface ReplyInput {
  messageId: string;
  text: string;
}

/** Who is typing, so the indicator can name them before the reply arrives. */
export type TypingSender = { type: 'ai' } | { type: 'human'; name: string };

export interface ReplyEvents {
  onTyping(sender: TypingSender): void;
}

/** The single switch between the mock and the real backend. */
export const conversationService: ConversationService = USE_MOCK_API
  ? mockConversationService
  : apiConversationService;
