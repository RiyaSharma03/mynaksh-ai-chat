import { FeedbackBar } from './FeedbackBar';
import { RecommendationCarousel } from '../../recommendations/RecommendationCarousel';
import type { AiMessage } from '../../../types/message';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { SenderLabel } from '../../ui/SenderLabel';
import { MessageTime } from './MessageTime';

export function AiMessageView({
  message,
  ...group
}: { message: AiMessage } & GroupPosition) {
  return (
    <>
      {group.isFirstInGroup && <SenderLabel icon="✨" name="AI Astrologer" />}
      {message.text ? (
        <MessageBubble
          messageId={message.id}
          side="start"
          {...group}
          className="border border-border bg-surface"
        >
          <MessageText text={message.text} className="text-foreground" />
        </MessageBubble>
      ) : null}
      {message.recommendations.length > 0 && (
        <RecommendationCarousel recommendations={message.recommendations} />
      )}
      <FeedbackBar messageId={message.id} />
      {group.isLastInGroup && (
        <MessageTime value={message.createdAt} side="start" />
      )}
    </>
  );
}
