import type { Message } from '../types/message';

export type MessageAction = 'reply' | 'copy' | 'retry' | 'delete';

/**
 * Which long-press actions a message offers. A pure function, so the rules
 * live in one tested place instead of inside the sheet's JSX.
 */
export function getMessageActions(message: Message): MessageAction[] {
  if (message.type === 'system') return [];
  if (message.type === 'user' && message.status === 'failed') {
    return ['retry', 'copy', 'delete'];
  }
  return ['reply', 'copy', 'delete'];
}
