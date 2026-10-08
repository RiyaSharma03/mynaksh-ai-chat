import type { Feedback } from './feedback';
import type { Recommendation } from './recommendation';

/**
 * A message is a union keyed on `type`, so each kind carries only its own
 * fields: TypeScript won't let you read `recommendations` on a user message,
 * and a `switch (message.type)` that misses a case fails to compile.
 */
interface MessageBase {
  id: string;
  text: string;
  /** Epoch ms. A number (not a Date) so it stays serializable in Redux. */
  createdAt: number;
  replyToId?: string;
}

export type DeliveryStatus = 'sending' | 'sent' | 'failed';

export interface UserMessage extends MessageBase {
  type: 'user';
  status: DeliveryStatus;
}

export interface AiMessage extends MessageBase {
  type: 'ai';
  recommendations: Recommendation[];
  feedback: Feedback;
}

export interface HumanMessage extends MessageBase {
  type: 'human';
  author: { name: string };
}

export interface SystemMessage extends MessageBase {
  type: 'system';
}

export type Message = UserMessage | AiMessage | HumanMessage | SystemMessage;
export type MessageType = Message['type'];
