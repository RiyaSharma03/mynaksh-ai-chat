import type { Message } from '../types/message';

/** Display name of a message's sender, for reply previews and quotes. */
export function senderName(message: Message): string {
  switch (message.type) {
    case 'user':
      return 'You';
    case 'ai':
      return 'AI Astrologer';
    case 'human':
      return message.author.name;
    case 'system':
      return 'System';
  }
}
