import type { Message } from '../features/chat/types';

/**
 * The shape the backend sends, before normalization. Everything beyond
 * id/type is optional because a server response can't be trusted to be complete.
 */
export interface WireRecommendation {
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
}

export interface WireMessage {
  id?: string;
  type?: string;
  text?: string;
  createdAt?: string;
  replyToId?: string;
  author?: { name?: string };
  recommendations?: WireRecommendation[];
}

/**
 * What the app needs from a backend. Both the mock and the HTTP adapter
 * implement it, and both return normalized messages, so callers can't tell them apart.
 */
export interface ConversationApi {
  fetchConversation(): Promise<Message[]>;
  sendMessage(input: SendMessageInput): Promise<{ createdAt: number }>;
  /**
   * The answer to a delivered user message. The backend decides who answers
   * (the AI, or a human astrologer after a handoff), so it can be several
   * messages from any sender. `onTyping` reports who is typing meanwhile.
   */
  getReplies(input: ReplyInput, events: ReplyEvents): Promise<Message[]>;
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

export interface SendMessageInput {
  /** Client-generated id, so a retried send can be de-duplicated by the server. */
  id: string;
  text: string;
  replyToId?: string;
}
