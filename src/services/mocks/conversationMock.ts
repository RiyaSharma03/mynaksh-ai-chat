import type { ConversationService } from '../conversationService';
import { normalizeMessages } from '../utils/normalizeMessages';
import { initialMessages } from './initialMessages';
import { ASTROLOGER, astrologerReplies, pickAiReply } from './replies';

/** Demo switch for the loading, empty and error states (set from the header menu). */
export const mockScenario = {
  /** 'error' fails the next load only, so Retry recovers. */
  load: 'normal' as 'normal' | 'empty' | 'error',
};

/** Pretends to be the network. */
const delay = (ms = 800) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/** The fake backend: same methods as the real API, with data from this folder. */
export const mockConversationService: ConversationService = {
  async fetchConversation() {
    await delay();
    if (mockScenario.load === 'error') {
      mockScenario.load = 'normal';
      throw new Error('Unable to load conversation.');
    }
    if (mockScenario.load === 'empty') return [];
    return normalizeMessages(initialMessages);
  },

  // Text containing "fail" fails, to demo the retry flow.
  async sendMessage({ text }) {
    await delay();
    if (/fail/i.test(text)) throw new Error('Failed to send.');
    return { createdAt: Date.now() };
  },

  // Asking for an astrologer gets a human; anything else gets the AI.
  async getReplies({ messageId, text }, { onTyping }) {
    if (/astrologer|human|expert/i.test(text)) {
      onTyping({ type: 'human', name: ASTROLOGER.name });
      await delay(3000);
      return normalizeMessages(astrologerReplies(messageId));
    }

    onTyping({ type: 'ai' });
    await delay(1500);
    return normalizeMessages([
      {
        ...pickAiReply(text),
        id: `ai-${messageId}`,
        type: 'ai',
        createdAt: new Date().toISOString(),
      },
    ]);
  },

  async submitFeedback() {
    await delay(300);
  },
};
