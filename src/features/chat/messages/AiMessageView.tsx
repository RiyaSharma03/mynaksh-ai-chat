import { FeedbackBar } from '../../feedback/components/FeedbackBar';
import { RecommendationCarousel } from '../../recommendations/components/RecommendationCarousel';
import type { AiMessage } from '../types';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { SenderLabel } from './SenderLabel';
import { MessageTime } from './MessageTime';

export function AiMessageView({
  message,
  ...group
}: { message: AiMessage } & GroupPosition) {
  return (
    <>
      {group.isFirstInGroup && <SenderLabel icon="✨" name="AI Astrologer" />}
      <MessageBubble
        messageId={message.id}
        side="start"
        {...group}
        className="border border-border bg-surface"
      >
        <MessageText text={message.text} className="text-foreground" />
      </MessageBubble>
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
