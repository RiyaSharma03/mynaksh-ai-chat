import { env } from '../../config/env';
import type { ConversationApi, WireMessage } from '../types';
import { normalizeMessages } from '../normalize';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

/** The real backend. Responses go through the same normalizer as the mock. */
export const httpConversationApi: ConversationApi = {
  async fetchConversation() {
    return normalizeMessages(
      await request<WireMessage[]>('/conversation/messages'),
    );
  },

  async sendMessage(input) {
    const { createdAt } = await request<{ createdAt: string }>(
      '/conversation/messages',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    );
    return { createdAt: Date.parse(createdAt) };
  },

  async getAiReply({ messageId }) {
    const wire = await request<WireMessage>(
      `/conversation/messages/${messageId}/reply`,
      {
        method: 'POST',
      },
    );
    const [reply] = normalizeMessages([wire]);
    if (!reply) throw new Error('Malformed AI reply');
    return reply;
  },
};
