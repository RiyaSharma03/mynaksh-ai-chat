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

/** One-line text for previews and quotes. A cards-only AI message has no text. */
export function previewText(message: Message): string {
  if (message.text) return message.text;
  if (message.type === 'ai') {
    const count = message.recommendations.length;
    return `${count} recommendation${count === 1 ? '' : 's'}`;
  }
  return '';
}
