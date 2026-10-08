import type { ConversationApi } from '../types';
import { normalizeMessages } from '../normalize';
import { pickAiReply } from './aiReplies';
import { mockConversation } from './conversation';

const LATENCY_MS = 800;
const AI_THINKING_MS = 1500;

/** Switches for demoing loading, empty and error states without a server. */
export const mockScenario = {
  /** 'error' fails the next load only, so Retry recovers. */
  load: 'normal' as 'normal' | 'empty' | 'error',
  failSends: false,
};

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const mockConversationApi: ConversationApi = {
  async fetchConversation() {
    await delay(LATENCY_MS);
    if (mockScenario.load === 'error') {
      mockScenario.load = 'normal';
      throw new Error('Unable to load conversation.');
    }
    if (mockScenario.load === 'empty') return [];
    return normalizeMessages(mockConversation);
  },

  /** Text containing "fail" fails, to demo the retry flow. */
  async sendMessage({ text }) {
    await delay(LATENCY_MS);
    if (mockScenario.failSends || /fail/i.test(text))
      throw new Error('Failed to send.');
    return { createdAt: Date.now() };
  },

  async getAiReply({ messageId, text }) {
    await delay(AI_THINKING_MS);
    const [reply] = normalizeMessages([
      {
        ...pickAiReply(text),
        id: `ai-${messageId}`,
        type: 'ai',
        createdAt: new Date().toISOString(),
      },
    ]);
    return reply;
  },
};
