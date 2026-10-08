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
  /** The AI's answer to a delivered user message. */
  getAiReply(input: { messageId: string; text: string }): Promise<Message>;
}

export interface SendMessageInput {
  /** Client-generated id, so a retried send can be de-duplicated by the server. */
  id: string;
  text: string;
  replyToId?: string;
}
