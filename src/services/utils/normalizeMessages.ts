import type { Message } from '../../types/message';
import type { Recommendation } from '../../types/recommendation';

/**
 * The shape the server sends, before normalization. Everything beyond id and
 * type is optional, because a server response can't be trusted to be complete.
 */
interface WireRecommendation {
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
}

export interface WireMessage {
  id?: string;
  type?: string;
  text?: string;
  createdAt?: string;
  replyToId?: string;
  author?: { name?: string };
  recommendations?: WireRecommendation[];
}

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
  if (!wire.id) return null;
  // Only an AI message may skip text (a cards-only turn); it is checked below.
  if (!wire.text && wire.type !== 'ai') return null;

  const base = {
    id: wire.id,
    text: wire.text ?? '',
    createdAt: wire.createdAt ? Date.parse(wire.createdAt) : Date.now(),
    replyToId: wire.replyToId,
  };

  switch (wire.type) {
    case 'user':
      return { ...base, type: 'user', status: 'sent' };
    case 'ai': {
      const recommendations = (wire.recommendations ?? []).flatMap(
        normalizeRecommendation,
      );
      // Cards without text is a valid answer; no text and no cards is not.
      if (!base.text && recommendations.length === 0) return null;
      return {
        ...base,
        type: 'ai',
        recommendations,
        feedback: { rating: null, reasons: [] },
      };
    }
    case 'human':
      return {
        ...base,
        type: 'human',
        author: { name: wire.author?.name ?? 'Astrologer' },
      };
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
    {
      id: wire.id,
      type: wire.type,
      title: wire.title,
      subtitle: wire.subtitle,
      data: wire.data,
    },
  ];
}
