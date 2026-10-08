import type { Message } from '../features/chat/types';
import type { Feedback } from '../features/feedback/types';
import { conversationMock } from './mock/conversationMock';

/**
 * The contract between the app and its backend. Redux thunks call only
 * `conversationApi`; nothing else in the app knows the data is mocked.
 */
export interface ConversationApi {
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

interface SendMessageInput {
  /** Client-generated id, so a retried send can be de-duplicated by a server. */
  id: string;
  text: string;
  replyToId?: string;
}

interface ReplyInput {
  messageId: string;
  text: string;
}

/** Who is typing, so the indicator can name them before the reply arrives. */
export type TypingSender = { type: 'ai' } | { type: 'human'; name: string };

interface ReplyEvents {
  onTyping(sender: TypingSender): void;
}

/**
 * The single swap point: a real backend is another object implementing
 * ConversationApi (e.g. fetch calls returning normalizeMessages(json)).
 */
export const conversationApi: ConversationApi = conversationMock;
