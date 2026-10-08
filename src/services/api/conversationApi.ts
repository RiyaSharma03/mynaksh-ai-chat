import type { ConversationService } from '../conversationService';
import { apiClient } from './client';
import {
  normalizeMessages,
  type WireMessage,
} from '../utils/normalizeMessages';

/**
 * The real backend, ready for when one exists (not used while USE_MOCK_API
 * is true). Every response goes through normalizeMessages, like the mock's.
 */
export const apiConversationService: ConversationService = {
  async fetchConversation() {
    return normalizeMessages(
      await apiClient.get<WireMessage[]>('/conversation/messages'),
    );
  },

  async sendMessage(input) {
    const { createdAt } = await apiClient.post<{ createdAt: string }>(
      '/conversation/messages',
      input,
    );
    return { createdAt: Date.parse(createdAt) };
  },

  // Over plain HTTP we only know the reply once it arrives, so assume the AI
  // is typing. A socket would let the server announce a human astrologer.
  async getReplies({ messageId }, { onTyping }) {
    onTyping({ type: 'ai' });
    return normalizeMessages(
      await apiClient.post<WireMessage[]>(
        `/conversation/messages/${messageId}/replies`,
      ),
    );
  },

  async submitFeedback({ messageId, feedback }) {
    await apiClient.put(
      `/conversation/messages/${messageId}/feedback`,
      feedback,
    );
  },
};
