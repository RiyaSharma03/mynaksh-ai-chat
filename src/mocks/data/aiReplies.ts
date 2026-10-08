import type { WireMessage } from '../../utils/normalizeMessages';

type Reply = Pick<WireMessage, 'text' | 'recommendations'>;

/**
 * Canned AI answers picked by keyword, so the demo feels responsive.
 * The default reply includes `live_puja`, a type the app does not know,
 * to show the fallback card.
 */
const REPLIES: Array<{ keywords: RegExp; reply: Reply }> = [
  {
    keywords: /love|relationship|marriage|partner/i,
    reply: {
      text: 'Venus is moving through your 7th house, a warm phase for relationships. Honest conversations will go further than usual this month.',
      recommendations: [
        {
          id: '1',
          type: 'tarot',
          title: 'Love Tarot Reading',
          data: { cards: 3 },
        },
        {
          id: '2',
          type: 'gemstone',
          title: 'Diamond',
          subtitle: 'Strengthens Venus',
          data: { price: '₹12,999' },
        },
        {
          id: '3',
          type: 'consultation',
          title: 'Relationship Expert',
          data: { pricePerMin: '₹30/min' },
        },
      ],
    },
  },
  {
    keywords: /health|stress|sleep|energy/i,
    reply: {
      text: 'Your 6th house shows the Moon under some pressure, so rest and routine matter more than usual right now.',
      recommendations: [
        {
          id: '1',
          type: 'remedy',
          title: 'Monday Moon Remedy',
          subtitle: 'Offer water to the Moon at night',
        },
        {
          id: '2',
          type: 'article',
          title: 'Planets and Your Wellbeing',
          data: { readMinutes: 4 },
        },
      ],
    },
  },
  {
    keywords: /money|finance|wealth|business/i,
    reply: {
      text: 'Jupiter favours your 2nd house of wealth this quarter. It is a good time for long-term planning, less so for quick bets.',
      recommendations: [
        {
          id: '1',
          type: 'gemstone',
          title: 'Yellow Sapphire',
          subtitle: 'Recommended for Jupiter',
          data: { price: '₹6,499' },
        },
        {
          id: '2',
          type: 'panchang',
          title: 'Auspicious Days This Month',
          subtitle: 'Best dates for investments',
        },
        {
          id: '3',
          type: 'promotion',
          title: 'Wealth Report at 30% off',
          data: { code: 'JUPITER30' },
        },
      ],
    },
  },
];

const DEFAULT_REPLY: Reply = {
  text: 'Thank you for sharing. Your chart suggests this is a time to slow down and reflect before your next big decision.',
  recommendations: [
    {
      id: '1',
      type: 'live_puja',
      title: 'Join a Live Puja',
      subtitle: 'Starting in 20 minutes',
    },
    {
      id: '2',
      type: 'consultation',
      title: 'Talk to an Astrologer',
      data: { pricePerMin: '₹25/min' },
    },
  ],
};

export function pickAiReply(userText: string): Reply {
  return (
    REPLIES.find(({ keywords }) => keywords.test(userText))?.reply ??
    DEFAULT_REPLY
  );
}
