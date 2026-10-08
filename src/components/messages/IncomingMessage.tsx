import { Text } from 'react-native';
import type { AiMessage, HumanMessage } from '../../types/message';
import { formatTime } from '../../utils/timeline';
import { RecommendationCarousel } from '../recommendations/RecommendationCarousel';
import { AppLogo } from '../ui/AppLogo';
import { SenderLabel } from '../ui/SenderLabel';
import { FeedbackBar } from './FeedbackBar';
import { MessageBubble, type GroupPosition } from './MessageBubble';

/**
 * A message from the AI or a human astrologer: bubble on the left.
 * AI messages add recommendation cards and feedback; an astrologer gets a badge.
 */
export function IncomingMessage({
  message,
  ...group
}: { message: AiMessage | HumanMessage } & GroupPosition) {
  const isAi = message.type === 'ai';
  return (
    <>
      {group.isFirstInGroup &&
        (isAi ? (
          <SenderLabel icon={<AppLogo size={18} />} name="AI Astrologer" />
        ) : (
          <SenderLabel
            icon="👨‍🏫"
            name={message.author.name}
            badge="Astrologer"
          />
        ))}

      {/* An AI message can be cards only, with no text. */}
      {message.text ? (
        <MessageBubble
          messageId={message.id}
          text={message.text}
          tone={isAi ? 'ai' : 'astrologer'}
          {...group}
        />
      ) : null}

      {isAi && message.recommendations.length > 0 && (
        <RecommendationCarousel recommendations={message.recommendations} />
      )}
      {isAi && <FeedbackBar messageId={message.id} />}

      {group.isLastInGroup && (
        <Text className="mx-1 mt-1 self-start text-[11px] text-muted">
          {formatTime(message.createdAt)}
        </Text>
      )}
    </>
  );
}
