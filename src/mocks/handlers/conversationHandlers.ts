import { normalizeMessages } from '../../utils/normalizeMessages';
import type { ConversationService } from '../../services/conversationService';
import { pickAiReply } from '../data/aiReplies';
import { initialMessages } from '../data/initialMessages';

const LATENCY_MS = 800;
const AI_THINKING_MS = 1500;
const HUMAN_TYPING_MS = 3000;

const HANDOFF_PATTERN = /astrologer|human|expert|real person/i;
const ASTROLOGER = { name: 'Acharya Vinod' };

/** Demo switch for the loading, empty and error states (set from the header menu). */
export const mockScenario = {
  /** 'error' fails the next load only, so Retry recovers. */
  load: 'normal' as 'normal' | 'empty' | 'error',
};

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * An in-memory stand-in for the backend: same contract, fake latency.
 * Data goes through normalizeMessages, as a real server response would.
 */
export const mockConversationService: ConversationService = {
  async fetchConversation() {
    await delay(LATENCY_MS);
    if (mockScenario.load === 'error') {
      mockScenario.load = 'normal';
      throw new Error('Unable to load conversation.');
    }
    if (mockScenario.load === 'empty') return [];
    return normalizeMessages(initialMessages);
  },

  /** Text containing "fail" fails, to demo the retry flow. */
  async sendMessage({ text }) {
    await delay(LATENCY_MS);
    if (/fail/i.test(text)) throw new Error('Failed to send.');
    return { createdAt: Date.now() };
  },

  /**
   * Mentioning an astrologer (or a human, an expert) hands the chat over to
   * Acharya Vinod: a system event, his typing indicator, then his reply.
   * Everything else gets an AI reply.
   */
  async getReplies({ messageId, text }, { onTyping }) {
    if (HANDOFF_PATTERN.test(text)) {
      onTyping({ type: 'human', name: ASTROLOGER.name });
      await delay(HUMAN_TYPING_MS);
      const now = Date.now();
      return normalizeMessages([
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
      ]);
    }

    onTyping({ type: 'ai' });
    await delay(AI_THINKING_MS);
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
