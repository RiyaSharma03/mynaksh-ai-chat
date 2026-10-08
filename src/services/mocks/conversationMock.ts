import type { ConversationService } from '../conversationService';
import { normalizeMessages } from '../utils/normalizeMessages';
import { pickAiReply } from './data/aiReplies';
import { ASTROLOGER, astrologerReplies } from './data/astrologerReplies';
import { initialMessages } from './data/initialMessages';
import {
  AI_THINKING_MS,
  HUMAN_TYPING_MS,
  mockClient,
  mockScenario,
} from './mockClient';

/** Mentioning any of these hands the chat over to a human astrologer. */
const HANDOFF_PATTERN = /astrologer|human|expert|real person/i;

/**
 * The mock backend: same methods and style as apiConversationService, with
 * mockClient in place of apiClient. Every response goes through
 * normalizeMessages, like the real API's.
 */
export const mockConversationService: ConversationService = {
  async fetchConversation() {
    if (mockScenario.load === 'error') {
      mockScenario.load = 'normal';
      return mockClient.fail('Unable to load conversation.');
    }
    const messages = mockScenario.load === 'empty' ? [] : initialMessages;
    return normalizeMessages(await mockClient.respond(messages));
  },

  // Text containing "fail" fails, to demo the retry flow.
  async sendMessage({ text }) {
    if (/fail/i.test(text)) return mockClient.fail('Failed to send.');
    return mockClient.respond({ createdAt: Date.now() });
  },

  // An astrologer answers if asked for; otherwise the AI does.
  async getReplies({ messageId, text }, { onTyping }) {
    if (HANDOFF_PATTERN.test(text)) {
      onTyping({ type: 'human', name: ASTROLOGER.name });
      return normalizeMessages(
        await mockClient.respond(astrologerReplies(messageId), HUMAN_TYPING_MS),
      );
    }
    onTyping({ type: 'ai' });
    const reply = {
      ...pickAiReply(text),
      id: `ai-${messageId}`,
      type: 'ai',
      createdAt: new Date().toISOString(),
    };
    return normalizeMessages(await mockClient.respond([reply], AI_THINKING_MS));
  },

  async submitFeedback() {
    await mockClient.respond(undefined, 300);
  },
};
