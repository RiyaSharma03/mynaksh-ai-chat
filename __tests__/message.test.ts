import { getMessageActions } from '../src/utils/message';
import type { Message } from '../src/types/message';

const base = { id: '1', text: 'Hi', createdAt: 0 };

it('offers reply, copy and delete on AI, astrologer and sent user messages', () => {
  const messages: Message[] = [
    {
      ...base,
      type: 'ai',
      recommendations: [],
      feedback: { rating: null, reasons: [] },
    },
    { ...base, type: 'human', author: { name: 'Vinod' } },
    { ...base, type: 'user', status: 'sent' },
  ];
  for (const message of messages) {
    expect(getMessageActions(message)).toEqual(['reply', 'copy', 'delete']);
  }
});

it('offers retry instead of reply on a failed message', () => {
  expect(
    getMessageActions({ ...base, type: 'user', status: 'failed' }),
  ).toEqual(['retry', 'copy', 'delete']);
});

it('offers nothing on system events', () => {
  expect(getMessageActions({ ...base, type: 'system' })).toEqual([]);
});

it('offers no copy on a cards-only AI message', () => {
  expect(
    getMessageActions({
      ...base,
      text: '',
      type: 'ai',
      recommendations: [{ id: '1', type: 'tarot', title: 'Tarot' }],
      feedback: { rating: null, reasons: [] },
    }),
  ).toEqual(['reply', 'delete']);
});
