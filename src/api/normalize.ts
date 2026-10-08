import type { Message } from '../features/chat/types';
import type { Recommendation } from '../features/recommendations/types';
import type { WireMessage, WireRecommendation } from './types';

/**
 * The one place untrusted server data becomes our typed model.
 * Fills defaults and drops anything we can't render, so UI code never
 * has to null-check server fields.
 */
export function normalizeMessages(wire: WireMessage[]): Message[] {
  return wire.flatMap(item => {
    const message = normalizeMessage(item);
    return message ? [message] : [];
  });
}

function normalizeMessage(wire: WireMessage): Message | null {
  if (!wire.id || !wire.text) return null;

  const base = {
    id: wire.id,
    text: wire.text,
    createdAt: wire.createdAt ? Date.parse(wire.createdAt) : Date.now(),
    replyToId: wire.replyToId,
  };

  switch (wire.type) {
    case 'user':
      return { ...base, type: 'user', status: 'sent' };
    case 'ai':
      return {
        ...base,
        type: 'ai',
        recommendations: (wire.recommendations ?? []).flatMap(normalizeRecommendation),
        feedback: { rating: null, reasons: [] },
      };
    case 'human':
      return { ...base, type: 'human', author: { name: wire.author?.name ?? 'Astrologer' } };
    case 'system':
      return { ...base, type: 'system' };
    default:
      // An unknown message type from a newer backend: skip it rather than crash.
      return null;
  }
}

function normalizeRecommendation(wire: WireRecommendation): Recommendation[] {
  if (!wire.id || !wire.type || !wire.title) return [];
  return [
    { id: wire.id, type: wire.type, title: wire.title, subtitle: wire.subtitle, data: wire.data },
  ];
}
