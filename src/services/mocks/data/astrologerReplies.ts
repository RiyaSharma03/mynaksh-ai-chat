import type { WireMessage } from '../../utils/normalizeMessages';

export const ASTROLOGER = { name: 'Acharya Vinod' };

/** A human astrologer joins the chat and answers. */
export function astrologerReplies(messageId: string): WireMessage[] {
  const now = Date.now();
  return [
    {
      id: `joined-${messageId}`,
      type: 'system',
      text: `${ASTROLOGER.name} has joined the conversation.`,
      createdAt: new Date(now - 1000).toISOString(),
    },
    {
      id: `human-${messageId}`,
      type: 'human',
      author: ASTROLOGER,
      text: 'Namaste! I have gone through your chart. Saturn is testing your patience right now, but it rewards steady effort. What would you like to focus on first?',
      createdAt: new Date(now).toISOString(),
    },
  ];
}
