import type { WireMessage } from '../../../utils/normalizeMessages';

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();
const DAY = 24 * 60;

/**
 * Yesterday's history (to show date separators), then the assignment's payload.
 * The history has no "session started" event of its own, so the payload's
 * one isn't shown twice.
 * Schema extensions: createdAt on every message, author on human messages,
 * and `data` / extra types on recommendations.
 */
export const initialMessages: WireMessage[] = [
  {
    id: 'h2',
    type: 'user',
    text: 'What does my Moon sign say about me?',
    createdAt: minutesAgo(DAY + 29),
  },
  {
    id: 'h3',
    type: 'ai',
    text: 'Your Moon is in Cancer, which points to a caring, intuitive nature. You feel things deeply and value emotional security.',
    createdAt: minutesAgo(DAY + 28),
  },
  {
    id: 'h4',
    type: 'ai',
    text: 'Mondays are especially good for you. Here is something to try.',
    createdAt: minutesAgo(DAY + 27),
    recommendations: [
      {
        id: '1',
        type: 'remedy',
        title: 'Monday Moon Remedy',
        subtitle: 'Offer milk to a Shiva lingam',
      },
      {
        id: '2',
        type: 'panchang',
        title: "Today's Panchang",
        subtitle: 'Shukla Paksha, Dwitiya',
      },
    ],
  },

  // ── The assignment's payload ──
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    createdAt: minutesAgo(12),
  },
  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    createdAt: minutesAgo(11),
  },
  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    createdAt: minutesAgo(10),
    recommendations: [
      {
        id: '1',
        type: 'gemstone',
        title: 'Blue Sapphire',
        subtitle: 'Recommended for Saturn',
        data: { price: '₹4,999' },
      },
      {
        id: '2',
        type: 'tarot',
        title: 'Career Tarot Reading',
        data: { cards: 3 },
      },
      {
        id: '3',
        type: 'consultation',
        title: 'Talk to an Astrologer',
        data: { pricePerMin: '₹25/min' },
      },
      {
        id: '4',
        type: 'article',
        title: 'Understanding Saturn Mahadasha',
        data: { readMinutes: 5 },
      },
      {
        id: '5',
        type: 'promotion',
        title: '20% off your first consultation',
        data: { code: 'SATURN20' },
      },
    ],
  },
  {
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    createdAt: minutesAgo(8),
    author: { name: 'Acharya Vinod' },
  },
];
