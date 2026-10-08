import { normalizeMessages } from '../src/utils/normalizeMessages';
import { initialMessages } from '../src/services/mocks/data/initialMessages';

describe('normalizeMessages', () => {
  it('turns the mock payload into typed messages with defaults', () => {
    const messages = normalizeMessages(initialMessages);
    expect(messages).toHaveLength(initialMessages.length);

    const ai = messages.find(m => m.id === '3');
    expect(ai?.type).toBe('ai');
    if (ai?.type !== 'ai') return;
    expect(ai.recommendations.map(r => r.type)).toEqual([
      'gemstone',
      'tarot',
      'consultation',
      'article',
      'promotion',
    ]);
    expect(ai.feedback).toEqual({ rating: null, reasons: [] });

    const user = messages.find(m => m.id === '2');
    expect(user?.type === 'user' && user.status).toBe('sent');
  });

  it('defaults createdAt and the human author name', () => {
    const [message] = normalizeMessages([
      { id: 'x', type: 'human', text: 'Hi' },
    ]);
    expect(message.type === 'human' && message.author.name).toBe('Astrologer');
    expect(typeof message.createdAt).toBe('number');
  });

  it('skips unknown message types and malformed items', () => {
    const messages = normalizeMessages([
      { id: 'a', type: 'video_call', text: 'From a newer backend' },
      { type: 'user', text: 'No id' },
      { id: 'b', type: 'user', text: 'Valid' },
    ]);
    expect(messages.map(m => m.id)).toEqual(['b']);
  });

  it('keeps unknown recommendation types but drops incomplete ones', () => {
    const [message] = normalizeMessages([
      {
        id: 'a',
        type: 'ai',
        text: 'Hi',
        recommendations: [
          { id: '1', type: 'live_puja', title: 'Live Puja' },
          { id: '2', type: 'tarot' },
        ],
      },
    ]);
    expect(
      message.type === 'ai' && message.recommendations.map(r => r.type),
    ).toEqual(['live_puja']);
  });
});

describe('messages without text', () => {
  it('keeps a cards-only AI message', () => {
    const messages = normalizeMessages([
      {
        id: 'a',
        type: 'ai',
        recommendations: [{ id: '1', type: 'tarot', title: 'Tarot' }],
      },
    ]);
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('');
  });

  it('drops an AI message with neither text nor cards', () => {
    expect(
      normalizeMessages([{ id: 'a', type: 'ai', recommendations: [] }]),
    ).toEqual([]);
  });

  it('drops other messages without text', () => {
    expect(normalizeMessages([{ id: 'a', type: 'user' }])).toEqual([]);
  });
});
