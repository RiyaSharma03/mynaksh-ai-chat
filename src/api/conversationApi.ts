import type { Message } from '../features/chat/types';
import { mockConversation } from './mock/conversation';
import { normalizeMessages } from './normalize';

/**
 * The only backend surface in the app. Everything is mocked with latency;
 * swapping in a real backend means changing this file only.
 */

const LATENCY_MS = 800;

/** Switches for demoing loading, empty and error states without a server. */
export const mockScenario = {
  load: 'normal' as 'normal' | 'empty' | 'error',
  failSends: false,
};

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export async function fetchConversation(): Promise<Message[]> {
  await delay(LATENCY_MS);
  if (mockScenario.load === 'error') throw new Error('Unable to load conversation.');
  if (mockScenario.load === 'empty') return [];
  return normalizeMessages(mockConversation);
}

/** Delivers a user message. Text containing "fail" fails, to demo the retry flow. */
export async function sendMessage(text: string): Promise<{ createdAt: number }> {
  await delay(LATENCY_MS);
  if (mockScenario.failSends || /fail/i.test(text)) throw new Error('Failed to send.');
  return { createdAt: Date.now() };
}
